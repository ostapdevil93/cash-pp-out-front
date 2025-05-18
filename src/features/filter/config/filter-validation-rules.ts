import { FilterValidationRules, OrderFilterKey } from '../types';

const FIELD_LENGTH = {
  [OrderFilterKey.docNumber]: 15,
  [OrderFilterKey.recipientPersonalAccount]: 11,
  [OrderFilterKey.recipientBankAccount]: 20,
  [OrderFilterKey.payerBankAccount]: 20,
};

export const _filterValidationRules: FilterValidationRules = {
  [OrderFilterKey.docNumber]: {
    mask: '####################',
    validator: (val: string | null) => (val && val?.length >= FIELD_LENGTH[OrderFilterKey.docNumber]) || !val,
  },
  [OrderFilterKey.recipientPersonalAccount]: {
    validator: (val: string | null) => (val && val?.length >= FIELD_LENGTH[OrderFilterKey.recipientPersonalAccount]) || !val,
  },
  [OrderFilterKey.recipientBankAccount]: {
    validator: (val: string | null) => (val && val?.length >= FIELD_LENGTH[OrderFilterKey.recipientBankAccount]) || !val,
  },
  [OrderFilterKey.payerBankAccount]: {
    validator: (val: string | null) => (val && val?.length >= FIELD_LENGTH[OrderFilterKey.payerBankAccount]) || !val,
  },
};
