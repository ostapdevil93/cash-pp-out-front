import { getMaxLengthRule, rulesCreator, ValidationApi } from '@/shared/lib/validation/validation.ts';
import { PaymentOrderKey } from '../types';

export const fieldNamesToValidate = [
  PaymentOrderKey.typeOfPayment,
  PaymentOrderKey.paymentPriority,
];

export const fieldRecipientToValidate = [
  PaymentOrderKey.recipientInn,
  PaymentOrderKey.recipientKpp,
];

export const fieldPaymentInfoToValidate = [
  PaymentOrderKey.paymentPriority,
  PaymentOrderKey.paymentPurpose,
];

const MAX_LENGTH: Partial<Record<PaymentOrderKey, number>> = {
  [PaymentOrderKey.typeOfPayment]: 1,
  [PaymentOrderKey.paymentPriority]: 2,
  [PaymentOrderKey.paymentPurpose]: 350,
};

const FIELD_LENGTH: Partial<Record<PaymentOrderKey, number>> = {
  [PaymentOrderKey.recipientInn]: 12,
  [PaymentOrderKey.recipientKpp]: 9,
};

export const validationRule = (key: PaymentOrderKey, type?: string) => {
  const rules: ValidationApi.ValidationRule[] = [];
  if (key === PaymentOrderKey.recipientInn) {
    return {
      maxLength: FIELD_LENGTH[key] as number,
      validator: (val: string | number | null) => (val && ((val as string)?.length === 10 || (val as string)?.length === 12)) || !val,
      rules: [
        rulesCreator.lengthInPossibleValues([10, 12]),
        ...rules,
      ],
    };
  }
  if (key === PaymentOrderKey.paymentPurpose) {
    return {
      maxLength: MAX_LENGTH[key] as number,
      validator: (val: string | number | null) => val && (val as string)?.length <= (MAX_LENGTH[key] as number),
      rules: [
        rulesCreator.nonNull(),
        ...rules,
      ],
    };
  }
  if (key === PaymentOrderKey.paymentPriority && type === PaymentOrderKey.document) {
    return {
      maxLength: MAX_LENGTH[key] as number,
      validator: (val: string | number | null) => val && (val as string)?.length === (MAX_LENGTH[key] as number),
      rules: [
        rulesCreator.lengthInPossibleValues([MAX_LENGTH[key] as number]),
        ...rules,
      ],
    };
  }
  if (key === PaymentOrderKey.paymentPriority && type === PaymentOrderKey.paymentInfo) {
    return {
      maxLength: 1,
      validator: (val: string | number | null) => val && (val as string)?.length === 1,
      rules: [
        rulesCreator.nonNull(),
        ...rules,
      ],
    };
  }
  if (FIELD_LENGTH[key]) {
    return {
      mask: '#'.repeat(FIELD_LENGTH[key] as number),
      maxLength: FIELD_LENGTH[key] as number,
      validator: (val: string | number | null) => (val && (val as string)?.length === FIELD_LENGTH[key]) || !val,
      rules: [
        rulesCreator.stringLength(FIELD_LENGTH[key] as number),
        ...rules,
      ],
    };
  }
  return {
    maxLength: MAX_LENGTH[key] as number,
    validator: (val: string | number | null) => (val && (val as string)?.length <= (MAX_LENGTH[key] as number)) || !val,
    rules: [
      getMaxLengthRule(MAX_LENGTH[key] as number),
      ...rules,
    ],
  };
};
