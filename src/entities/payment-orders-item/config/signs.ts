import { StepItem } from '@ebp/vue-ui-lib';
import { ApprovingListApi } from '@/shared/ui/approving-list';
import { ActionCode } from '@/shared/api';
import { DocumentStatus } from '@/shared/config';

const SIGN_STEPS: StepItem[] = [
  { label: 'Согласование ответственным исполнителем', type: 'unactive' },
  { label: 'Подписание глав. бухгалтером (иным уполномоченным лицом)', type: 'unactive' },
  { label: 'Подписание руководителем (иным уполномоченным лицом)', type: 'unactive' },
];

export const SignTabItemsMap: Map<string, StepItem> = new Map<string, StepItem>([
  [ActionCode.PREPARED_TO_HEADACCSIGN, SIGN_STEPS[0]],
  [ActionCode.HEADACCSIGN_TO_CHIEFSIGN, SIGN_STEPS[1]],
  [ActionCode.CHIEFSIGN_TO_SIGNED, SIGN_STEPS[2]],
]);

const enum SIGN_STATUSES {
  WAITING = 'Ожидание',
  CONFORMED = 'Согласован',
  SIGNED = 'Подписано',
  TO_CONFORM = 'На согласовании',
  APPROVED = 'Подписан',
  TO_APPROVE = 'На подписании',
}

export const SignStatusesMap: Map<string, ApprovingListApi.Status> = new Map([
  [SIGN_STATUSES.WAITING, { text: SIGN_STATUSES.WAITING, color: 'grey' }],
  [SIGN_STATUSES.CONFORMED, { text: SIGN_STATUSES.CONFORMED, color: 'green' }],
  [SIGN_STATUSES.SIGNED, { text: SIGN_STATUSES.SIGNED, color: 'green' }],
  [SIGN_STATUSES.APPROVED, { text: SIGN_STATUSES.APPROVED, color: 'green' }],
  [SIGN_STATUSES.TO_APPROVE, { text: SIGN_STATUSES.TO_APPROVE, color: 'orange' }],
  [SIGN_STATUSES.TO_CONFORM, { text: SIGN_STATUSES.TO_CONFORM, color: 'orange' }],
]);

/**
 * Фактически мапа для каждого шага отражает необходимые условия для отображения того или иного статуса согласования
 */
export type StepConfigMap = Map<SIGN_STATUSES, {
  isAgreement: Array<boolean | null>,
  status?: DocumentStatus,
}>

// конфиги содержат условия для проверки под каждый статус (в доке отражено в строке Статус согласования)
// читать можно сверху вниз - статусы идут по порядку, в котором они должны осуществляться по движению статусов документов
const firstStepConfig: StepConfigMap = new Map([
  [SIGN_STATUSES.WAITING, { isAgreement: [false, null] }],
  [SIGN_STATUSES.TO_CONFORM, { isAgreement: [false, null], status: DocumentStatus.PREPARED }],
  [SIGN_STATUSES.CONFORMED, { isAgreement: [true] }],
]);
const secondStepConfig: StepConfigMap = new Map([
  [SIGN_STATUSES.WAITING, { isAgreement: [false, null] }],
  [SIGN_STATUSES.TO_APPROVE, { isAgreement: [false, null], status: DocumentStatus.HEAD_ACC_SIGNING }],
  [SIGN_STATUSES.SIGNED, { isAgreement: [true] }],
]);
const thirdStepConfig: StepConfigMap = new Map([
  [SIGN_STATUSES.WAITING, { isAgreement: [false, null] }],
  [SIGN_STATUSES.TO_APPROVE, { isAgreement: [false, null], status: DocumentStatus.CHIEF_SIGNING }],
  [SIGN_STATUSES.SIGNED, { isAgreement: [true] }],
]);

/**
 * Конфигурация шагов в маршруте согласования
 *
 * - actionCode - код статуса, по которому будет отрисован шаг
 * - stageNumber - нужно отслеживать тип данных (на разных МФЕ по разному)
 */
export const STEPS_CONFIG = [
  {
    actionCode: ActionCode.PREPARED_TO_HEADACCSIGN,
    statusConfig: firstStepConfig,
    hasPhone: false,
  },
  {
    actionCode: ActionCode.HEADACCSIGN_TO_CHIEFSIGN,
    statusConfig: secondStepConfig,
    hasPhone: false,
  },
  {
    actionCode: ActionCode.CHIEFSIGN_TO_SIGNED,
    statusConfig: thirdStepConfig,
    hasPhone: false,
  },
];
