import { CommonFilterTypes } from '@ebp/core';
import { PaymentOrderKey } from '../types';

export const getDebitsRequestFilters = () => {
  const filters: CommonFilterTypes.FieldFilterItem[] = [
    {
      fieldName: PaymentOrderKey.docSource,
      value: 'Банк',
      searchType: 'EQUALS',
    },
  ];
  return filters;
};
