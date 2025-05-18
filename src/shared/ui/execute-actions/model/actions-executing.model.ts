import { AxiosError } from '@ebp/mfe-utils';
import { CoreApi, showDefaultError, showServerNotification } from '@ebp/core';
import { AutoControlApi } from '@ebp/auto-monitoring-results';
import { useToggle } from '@ebp/utils';
import { ref } from 'vue';
import { ModalsPayloadData } from '@ebp/sign';
import { Action, ActionExecuteResponse, getSignInfoQueryNew } from '@/shared/api';
import { AUTO_CONTROLS_ERROR_CODE } from '@/shared/config/utils.ts';
import { actionMutation, DOC_OBJECT_CODE } from '@/shared/api/info-api';
import { ConfirmationModalSubmitPayload, openConfirmModal } from '../ui/confirmation-modal/open-confirm-modal.ts';

type PurposeActions = {
  /** Действие, по которому должен открываться маршрут согласования */
  openApprovalRoute: string,
  /** Действия, по которым должно открываться МО подписания */
  sign: string[],
}

type ActionsExecutingOptions = {
  exKey: string,
  /** Перечень доступных действий */
  actions: Action[],
  /**
   * Кб на перезапрос после обновления статусов
   *
   * @param newExKey - новый exKey документа после перевода по статусам при наличии
   */
  refetch: (newExKey?: string) => void,
  /** Кастомная пост обработка действий */
  executePostProcessing?: (action: Action, res: ActionExecuteResponse) => void,
  /** Кб на заполнение и открытие автоконтролей */
  autoControlsCb?: (autoControlResult: AutoControlApi.Result) => void,
  /** Предназначение действий */
  purposeActions: PurposeActions,
}

export const isApprovalRouteModal = useToggle(false);

/*
эти рефы выносятся глобальными, а не участвуют в модели, потому что после отработки действий идет перезапрос данных карточки
и модель создается заново
 */
// export const _signModal = ref(false);
export const signModal = useToggle();
export const _exProcessKey = ref<string | null>(null);
export const _signData = ref<ModalsPayloadData[]>([]);

export class ActionsExecutingModel {
  exKey: string;
  actions: ActionsExecutingOptions['actions'];
  purposeActions: ActionsExecutingOptions['purposeActions'];

  refetch: ActionsExecutingOptions['refetch'];
  private executePostProcessing?: ActionsExecutingOptions['executePostProcessing'];
  private autoControlsCb?: ActionsExecutingOptions['autoControlsCb'];

  constructor(options: ActionsExecutingOptions) {
    this.actions = options.actions;
    this.exKey = options.exKey;
    this.refetch = options.refetch;
    this.executePostProcessing = options.executePostProcessing;
    this.autoControlsCb = options.autoControlsCb;
    this.purposeActions = options.purposeActions;
  }

  async executeSign() {
    getSignInfoQueryNew({ exKeys: [this.exKey], objectCode: DOC_OBJECT_CODE })
      .then((res) => {
        const signModalData: ModalsPayloadData[] = res.data
          .map((item) => ({
            exKey: item.exKey || '',
            objectCode: DOC_OBJECT_CODE,
            printForm: item.printForm,
            attachments: item.attachments || [],
          }));
        _signData.value = signModalData;
        signModal.onOpen();
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        showServerNotification(err.response?.data);
      });
  }

  /**
   * Выполнение действия
   *
   * Алгоритм:
   * 1. Если действие в блоке управления не касается подписания
   * - Выполняем его
   *
   * 2. Если действие RSKP_TO_CONFORM_START:
   * - Открываем сайд-панель с маршрутом согласования
   * - Если есть опция skipConformStartCheck: true - пропускаем открытие маршрута согласования
   *
   * 3. Если в ответе на выполнение действия приходят действия на подписание:
   * - Открываем МО подписания и осуществляем подписание
   * - Действия, которые пришли в ответе - не выполняем (они выполняются автоматически после подписания)
   *
   * 4. Если действие IMPROVE_TO_DRAFT - возврат документа на редактирование:
   * - Выполняем действие
   * - Сразу переходим в режим редактирования
   *
   * 5. После выполнения каждого действия делаем перезапрос данных по карточке
   *
   * @param action - само действие
   * @param payload - полезная нагрузка в запрос при необходимости (из МО подтверждения)
   * @param options - доп опции для выполнения действий
   * @param options.skipOpenApprovalList - пропустить открытие маршрута согласования
   */
  async executeAction(
    action: Action,
    payload?: ConfirmationModalSubmitPayload,
    options?: {skipOpenApprovalList?: boolean},
  ) {
    // url в мутации создаем с нуля, т.к. actionUrl с бэка приходит некорректный
    const executeActionMutation = actionMutation({
      exKey: this.exKey,
      actionCode: action.actionCode,
    });

    // открытие маршрута согласования
    if (this.purposeActions.openApprovalRoute === action.actionCode && !options?.skipOpenApprovalList) {
      isApprovalRouteModal.onOpen();
      return;
    }

    // eslint-disable-next-line consistent-return
    return executeActionMutation({ successComment: payload?.comment || null })
      .then(async (res) => {
        showServerNotification(res);
        _exProcessKey.value = res.details.exProcessKey || null;

        // нужно ли осуществлять подписание на этом действии
        const needToSign = this.purposeActions.sign.includes(action.actionCode);
        if (needToSign) await this.executeSign();

        // осуществляем постобработку по действиям (чтобы задавать разные действия для карточки и реестра)
        this.executePostProcessing?.(action, res);

        // в процессе перевод статусов может быть заменен exKey документа, обновляем его каждый раз
        this.exKey = res.data.exKey || '';
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        signModal.onClose();

        if (err.response?.status === AUTO_CONTROLS_ERROR_CODE && err.response.data.autoControlResult) {
          this?.autoControlsCb?.(err.response.data.autoControlResult);
        } else if (err.response?.data.details) {
          showServerNotification(err.response.data);
        } else {
          showDefaultError();
        }
      })
      .finally(() => {
        this.refetch(this.exKey);
      });
  }

  /**
   * Формирование функции, которая отработает на клик для действия
   *
   * - Если требуется подтверждение - открываем МО перевода статуса, в сабмит передаем действие
   * - Если не требуется подтверждение - выполняем действие
   * @param action - само действие
   */
  setOnClick(action: Action): () => void {
    if (action.confirmation) {
      return () => {
        openConfirmModal({
          onSubmit: (payload: ConfirmationModalSubmitPayload) => this.executeAction(action, payload),
          isRequiredComment: action.requiredComment,
        });
      };
    }
    return () => this.executeAction(action);
  }
}
