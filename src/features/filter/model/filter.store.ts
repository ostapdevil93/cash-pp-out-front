import { UnwrapRef, computed, ref } from 'vue';
import { ActiveFilterFieldType, getFilterItemsByConfig, getClearedFilter, Sorter } from '@ebp/vue-ui-lib';
import { defineStore } from 'pinia';
import { usePagination } from '@ebp/utils';
import { _filterValidationRules, filterConfig } from '../config';
import { InfoFilterErrors, OrderFilterKey, FilterType, FilterValidationRules } from '../types';

export const getDefaultFilter = (): FilterType => ({
  [OrderFilterKey.docNumber]: null,
  [OrderFilterKey.docDateFrom]: null,
  [OrderFilterKey.docDateTo]: null,
  [OrderFilterKey.createdTsFrom]: null,
  [OrderFilterKey.createdTsTo]: null,
  [OrderFilterKey.amount]: null,
  [OrderFilterKey.docType]: null,
  [OrderFilterKey.primaryDocCode]: null,
  [OrderFilterKey.code]: null,
  [OrderFilterKey.typeOfOperation]: null,
  [OrderFilterKey.recipientInn]: null,
  [OrderFilterKey.recipientKpp]: null,
  [OrderFilterKey.recipientPersonalAccount]: null,
  [OrderFilterKey.recipientName]: null,
  [OrderFilterKey.recipientBankAccount]: null,
  [OrderFilterKey.recipientBankName]: null,
  [OrderFilterKey.payerInn]: null,
  [OrderFilterKey.payerKpp]: null,
  [OrderFilterKey.payerPersonalAccount]: null,
  [OrderFilterKey.payerName]: null,
  [OrderFilterKey.payerBankAccount]: null,
  [OrderFilterKey.payerBankName]: null,
  [OrderFilterKey.status]: null,
});

const getDefaultSort = (): Sorter[] => [{ column: OrderFilterKey.createdTs, dir: 'asc' }];

export const useOrderFilter = defineStore('orderFilter', () => {
  const isOpen = ref(false);
  const filter = ref<FilterType>(getDefaultFilter());
  const pagination = usePagination({ sort: getDefaultSort() });
  const currentFilter = computed<FilterType>(() => ({ ...filter.value }));
  const tagsList = computed(() => getFilterItemsByConfig(currentFilter, filterConfig));
  const currentFilterErrors = computed(() => {
    const errors: InfoFilterErrors = {};
    Object.keys(_filterValidationRules).forEach((key: string) => {
      const typedKey = key as keyof FilterValidationRules;
      const currentValue = currentFilter.value[typedKey] as string;
      const currentRule = _filterValidationRules[typedKey];
      if (currentRule?.validator) {
        errors[typedKey] = !currentRule.validator(currentValue);
      }
    });
    return errors;
  });
  const hasFormErrors = computed(() => Object.values(currentFilterErrors.value).includes(true));

  const getFilterPreparedToRequest = (): any[] => Object.entries(currentFilter.value)
    .filter(([_, value]) => value && typeof value === 'object' && value?.length > 0)
    .map(([key, value]) => {
      const config = filterConfig.filter((e) => e.key === key)[0];
      if (config.type === 'MULTIPLE_SELECT' && typeof value === 'object' && value) {
        return {
          fieldName: key,
          value: value.map((e) => e.value),
          searchType: 'IN',
        };
      }
      if (config.type === 'DATE' && key === OrderFilterKey.docDateFrom && value) {
        return ({
          fieldName: 'docDate',
          value,
          searchType: 'GREATER_OR_EQUALS',
        });
      }
      if (config.type === 'DATE' && key === OrderFilterKey.docDateTo && value) {
        return ({
          fieldName: 'docDate',
          value,
          searchType: 'LESS_OR_EQUALS',
        });
      }
      if (config.type === 'DATE' && key === OrderFilterKey.createdTsFrom && value) {
        return ({
          fieldName: 'createdTs',
          value,
          searchType: 'GREATER_OR_EQUALS',
        });
      }
      if (config.type === 'DATE' && key === OrderFilterKey.createdTsTo && value) {
        return ({
          fieldName: 'createdTs',
          value,
          searchType: 'LESS_OR_EQUALS',
        });
      }
      return ({
        fieldName: key,
        value,
        searchType: 'EQUALS',
      });
    }).filter((e) => !!e);

  const updateFilter = () => {
    filter.value = { ...currentFilter.value };
  };

  const resetFilter = () => {
    filter.value = getDefaultFilter();
    pagination.setPagination({ page: 0, size: 20, sort: getDefaultSort() });
  };

  const setFilter = (newFilter: Partial<FilterType>) => {
    filter.value = newFilter as UnwrapRef<FilterType>;
  };

  const onRemoveFilterTag = async (tag: ActiveFilterFieldType): Promise<void> => {
    if (tag.key === OrderFilterKey.status && tag.type === 'MULTIPLE_SELECT') {
      const typedValue = currentFilter.value[tag.key];
      filter.value[tag.key] = typedValue?.filter(
        (e) => e.value !== tag.valueKey,
      ) || null;
    }

    filter.value = getClearedFilter<FilterType>(tag, filter.value, { ...getDefaultFilter() });
  };

  return {
    isOpen,
    filter,
    currentFilter,
    currentFilterErrors,
    getDefaultFilter,
    onRemoveFilterTag,
    updateFilter,
    resetFilter,
    tagsList,
    pagination,
    hasFormErrors,
    setFilter,
    getFilterPreparedToRequest,
  };
});
