import { CommonFilterTypes } from '@ebp/core';
import { PaymentOrderKey } from '../types';

export const getPaymentOrdersRequestFilters = (recipientCardNumber?: string) => {
  const filters: CommonFilterTypes.FieldFilterItem[] = [
    {
      fieldName: PaymentOrderKey.docSource,
      value: 'ЕБП',
      searchType: 'EQUALS',
    },
  ];
  if (recipientCardNumber) {
    filters.push({
      fieldName: PaymentOrderKey.recipientCardNumber,
      value: recipientCardNumber,
      searchType: 'EQUALS',
    });
  }
  return filters;
};
