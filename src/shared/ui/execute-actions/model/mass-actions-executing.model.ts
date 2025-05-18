import { ModalsPayloadData } from '@ebp/sign';
import { AxiosError } from '@ebp/mfe-utils';
import { CoreApi, showDefaultError, showServerNotification } from '@ebp/core';
import { AutoControlApi } from '@ebp/auto-monitoring-results';
import { ref } from 'vue';
import { useToggle } from '@ebp/utils';
import { Action, ActionExecuteResponse, ExecutionKey, getSignInfoQueryNew } from '@/shared/api';
import { massActionMutation } from '@/shared/api/info-api';

type PurposeActions = {
  /** Действие, по которому должен открываться маршрут согласования */
  openApprovalRoute: string,
  /** Действия, по которым должно открываться МО подписания */
  sign: string[],
}

type MassActionsExecutingOptions = {
  exKeys: string[],
  /** мапа чтобы при вызове массового маршрута согласования отображать в нем номер */
  exKeyNumberMap?: Map<string, string>,
  objectCode: string,
  /** Кб на перезапрос после обновления статусов */
  refetch: (clearSelectedRows?: boolean)=> void,
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
export const signModal = useToggle();
export const _executionsKeys = ref<ExecutionKey[]>([]);
export const _signData = ref<ModalsPayloadData[]>([]);

export class MassActionsExecutingModel {
  exKeys: string[];
  exKeyNumberMap: Map<string, string> = new Map();
  objectCode: string;
  purposeActions: MassActionsExecutingOptions['purposeActions'];

  refetch: MassActionsExecutingOptions['refetch'];

  constructor(options: MassActionsExecutingOptions) {
    this.exKeys = options.exKeys;
    this.exKeyNumberMap = options.exKeyNumberMap || new Map();
    this.objectCode = options.objectCode;
    this.refetch = options.refetch;
    this.purposeActions = options.purposeActions;
  }

  /** Удаляет exKey из массива exKeys */
  removeExKey(key: string) {
    this.exKeys = this.exKeys.filter((exKey) => exKey !== key);
  }

  async executeSign() {
    getSignInfoQueryNew({ exKeys: this.exKeys, objectCode: this.objectCode })
      .then((res) => {
        const signModalData: ModalsPayloadData[] = res.data
          .map((item) => ({
            exKey: item.exKey || '',
            objectCode: this.objectCode || '',
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
     * Выполнение массовых действий
     *
     * Алгоритм:
     * 1. Если действие в блоке управления не касается подписания/согласования
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
     * @param action - само действие
     * @param options - доп опции для выполнения действий
     * @param options.skipOpenApprovalList - пропустить открытие маршрута согласования
     */
  async executeAction(
    action: Action,
    options?: {skipOpenApprovalList?: boolean},
  ) {
    // url в мутации создаем с нуля, т.к. actionUrl с бэка приходит некорректный
    const executeActionMutation = massActionMutation({
      actionCode: action.actionCode,
    });
    // открытие маршрута согласования
    if (this.purposeActions.openApprovalRoute === action.actionCode && !options?.skipOpenApprovalList) {
      isApprovalRouteModal.onOpen();
      return;
    }

    const massActionMutationParams = this.exKeys.map((exKey) => ({
      exKey,
    }));

    // eslint-disable-next-line consistent-return
    return executeActionMutation(massActionMutationParams)
      .then(async (res) => {
        if (Array.isArray(res)) {
          res.forEach((item) => {
            showServerNotification(item);
            if (item.data.exKey && item.details.exProcessKey) {
              _executionsKeys.value.push({ exKey: item.data.exKey, exProcessKey: item.details.exProcessKey });
            }
          });
        }
        // нужно ли осуществлять подписание на этом действии
        const needToSign = this.purposeActions.sign.includes(action.actionCode);
        if (needToSign) await this.executeSign();
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        signModal.onClose();
        if (err.response?.data.details) {
          showServerNotification(err.response.data);
        } else {
          showDefaultError();
        }
      });
  }
}
