export interface Action<TCode = string, TType = string> {
  actionCode: TCode,
  label: TType,
  actionUrl: string,
  isConfirmation?: boolean,
  isRequiredComment?: boolean,
  isRegistry?: boolean,
  isPriority?: boolean,
  confirmation?: boolean,
  requiredComment?: boolean,
  registry?: boolean,
  priority?: boolean,
}

export enum ActionCode {
  IMPORT = 'cs-poo-importing-doc',
  CHECK = 'cs-poo-draft-to-prepared',
  PREPARED_TO_HEADACCSIGN = 'cs-poo-prepared-to-headaccsign',
  HEADACCSIGN_TO_CHIEFSIGN = 'cs-poo-headaccsign-to-chiefsign',
  HEADACCSIGN_TO_CHIEFSIGN_START = 'cs-poo-headaccsign-to-chiefsign-start',
  CHIEFSIGN_TO_SIGNED = 'cs-poo-chiefsign-to-signed',
  CHIEFSIGN_TO_SIGNED_START = 'cs-poo-chiefsign-to-signed-start',
  SEND_TO_BANK = 'cs-poo-signed-to-sentbank',
  EXECUTE_BANK = 'cs-poo-sentbank-to-executed',
  REJECTED_BANK = 'cs-poo-sentbank-to-rejectedbank',
  AWAITING_CONFIRM = 'cs-poo-draft-to-awaitingconfirm',
  CANCEL = 'cs-poo-draft-to-canceled',
  EDIT = 'cs-poo-canceled-to-draft',
  DELETE = 'cs-poo-draft-to-deleted',
  CONFIRM = 'cs-poo-awaitingconfirm-to-confirmed',
  EXECUTE = 'cs-poo-confirmed-to-executed',
  IMPORTED_AWAITING_CONFIRM = 'cs-poo-imported-to-awaitingconfirm',
}

export enum ActionType {
  TOWAIT = 'ui.action.towait',
  TODRAFT = 'ui.action.todraft',
  DELETE = 'ui.action.delete',
  TOSVAP = 'ui.action.tosvap',
}

export const ActionTypeLabels: Record<ActionType, string> = {
  [ActionType.TOWAIT]: 'Проверить',
  [ActionType.TODRAFT]: 'Редактировать',
  [ActionType.DELETE]: 'Удалить',
  [ActionType.TOSVAP]: 'Переформировать записи учета',
};

export const ActionCodeLabels: Record<ActionCode, string> = {
  [ActionCode.IMPORT]: 'Импорт',
  [ActionCode.CHECK]: 'Проверить',
  [ActionCode.IMPORTED_AWAITING_CONFIRM]: 'Проверить',
  [ActionCode.PREPARED_TO_HEADACCSIGN]: 'Направить на согласование',
  [ActionCode.HEADACCSIGN_TO_CHIEFSIGN]: 'Подписать',
  [ActionCode.HEADACCSIGN_TO_CHIEFSIGN_START]: 'Подписать',
  [ActionCode.CHIEFSIGN_TO_SIGNED]: 'Утвердить',
  [ActionCode.CHIEFSIGN_TO_SIGNED_START]: 'Утвердить',
  [ActionCode.SEND_TO_BANK]: 'Отправить в банк',
  [ActionCode.EXECUTE_BANK]: 'Исполнить',
  [ActionCode.REJECTED_BANK]: 'Отклонить',
  [ActionCode.AWAITING_CONFIRM]: 'Проверить',
  [ActionCode.CANCEL]: 'Отменить',
  [ActionCode.EDIT]: 'Редактировать',
  [ActionCode.DELETE]: 'Удалить',
  [ActionCode.CONFIRM]: 'Подтвердить',
  [ActionCode.EXECUTE]: 'Исполнить',
};

export const mapActionTypeToLabel = (action: Action<ActionCode, ActionType>): string => ActionTypeLabels[action.label]
  || ActionCodeLabels[action.actionCode]
  || 'Неизвестное действие';

export type ActionableTableItem = {
  exKey: string,
  actions: Action<ActionCode, ActionType>[],
};
