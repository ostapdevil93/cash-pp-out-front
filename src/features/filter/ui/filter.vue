<script setup lang="ts">
  import {
    Accordion,
    Input,
    VDrawer,
    Button,
    FlexRow,
    ActiveFilters,
    VGrid,
    Text,
    MultiSelect,
    InformersBadge,
    MoneyInput,
    BoundInputs,
    DatePicker,
  } from '@ebp/vue-ui-lib';
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { STATUS_COLOR } from '@/shared/config';
  import { AppCommonVocabulary } from '@/entities/payment-orders-item';
  import { AppFilterVocabulary } from '../vocabulary';
  import { useOrderFilter } from '../model';
  import { _filterValidationRules } from '../config';
  import { getFilterStatusesOptions } from '../utils';

  type Emits = (e: 'onClose', isOpen: boolean) => void
  const emit = defineEmits<Emits>();

  const isChosenFilterOpen = ref<boolean>(false);
  const orderFilterStore = useOrderFilter();
  const statusOptions = getFilterStatusesOptions();

  const { tagsList, currentFilter, currentFilterErrors, hasFormErrors } = storeToRefs(orderFilterStore);
  const { resetFilter, updateFilter, onRemoveFilterTag } = orderFilterStore;

  const primaryDocCodeOptions = [
    {
      label: 'Расшифровка',
      value: 'DOC_CS_0001',
    },
    {
      label: 'Объявление',
      value: 'DOC_CS_0009',
    },
    {
      label: 'Заявка',
      value: 'DOC_CS_0015',
    },
  ];

  const applyFilter = (close: () => void) => {
    updateFilter();
    close();
  };
</script>

<template>
  <VDrawer
    :badge="tagsList.length > 0 ? String(tagsList.length) : undefined"
    :header="AppCommonVocabulary.filterTitle"
    open
    @close="emit('onClose', false)"
  >
    <template #header>
      <Accordion
        v-model="isChosenFilterOpen"
        class="filter__accordion"
        data-testid="accordion"
        size="small"
      >
        <template #header>
          <Text variant="subtitle4">
            {{ AppCommonVocabulary.chosenFilters }}
          </Text>
        </template>
        <template #content>
          <FlexRow gap="1" wrap>
            <ActiveFilters
              :items="tagsList"
              zIndex="MODAL_HINTS"
              @click:close="value => onRemoveFilterTag(value)"
            />
          </FlexRow>
        </template>
      </Accordion>
    </template>
    <VGrid class="filter" cols="1" gap="4">
      <MultiSelect
        v-model="currentFilter.status"
        :closeOnSelect="false"
        closeOnScroll
        :label="AppFilterVocabulary.status"
        :options="statusOptions"
        :placeholder="AppCommonVocabulary.notEntered"
        returnObject
        :showClearButton="false"
        size="small"
      >
        <template #optionTpl="{ option: { label, value } }">
          <FlexRow v-if="value" align="c" gap="2">
            <InformersBadge
              size="small"
              :status="STATUS_COLOR[value] || 'grey'"
            />
            {{ label }}
          </FlexRow>
        </template>
      </MultiSelect>
      <MultiSelect
        v-model="currentFilter.primaryDocCode"
        :closeOnSelect="false"
        closeOnScroll
        :label="AppFilterVocabulary.primaryDocCode"
        :options="primaryDocCodeOptions"
        :placeholder="AppCommonVocabulary.notEntered"
        returnObject
        :showClearButton="false"
        size="small"
      />
      <MultiSelect
        v-model="currentFilter.typeOfOperation"
        :closeOnSelect="false"
        closeOnScroll
        :label="AppFilterVocabulary.typeOfOperation"
        :options="[]"
        :placeholder="AppCommonVocabulary.notEntered"
        returnObject
        :showClearButton="false"
        size="small"
      />
      <MultiSelect
        v-model="currentFilter.code"
        :closeOnSelect="false"
        closeOnScroll
        :label="AppFilterVocabulary.code"
        :options="[]"
        :placeholder="AppCommonVocabulary.notEntered"
        returnObject
        :showClearButton="false"
        size="small"
      />
      <BoundInputs
        :label="AppCommonVocabulary.dataPeriod"
        :showClearButton="false"
      >
        <template #left>
          <DatePicker
            v-model="currentFilter.docDateFrom"
            :hasError="currentFilterErrors.docDateFrom"
            includeMaxDate
            placeholder="Не выбрано"
            :showClearButton="false"
            size="small"
          />
        </template>
        <template #right>
          <DatePicker
            v-model="currentFilter.docDateTo"
            :hasError="currentFilterErrors.docDateTo"
            includeMinDate
            placeholder="Не выбрано"
            :showClearButton="false"
            size="small"
          />
        </template>
      </BoundInputs>
      <BoundInputs
        :label="AppFilterVocabulary.createdTs"
        :showClearButton="false"
      >
        <template #left>
          <DatePicker
            v-model="currentFilter.createdTsFrom"
            :hasError="currentFilterErrors.createdTsFrom"
            includeMaxDate
            placeholder="Не выбрано"
            :showClearButton="false"
            size="small"
          />
        </template>
        <template #right>
          <DatePicker
            v-model="currentFilter.createdTsTo"
            :hasError="currentFilterErrors.createdTsTo"
            includeMinDate
            placeholder="Не выбрано"
            :showClearButton="false"
            size="small"
          />
        </template>
      </BoundInputs>
      <Input
        v-model="currentFilter.docNumber"
        :hasError="currentFilterErrors.docNumber"
        :label="AppFilterVocabulary.docNumber"
        :mask="_filterValidationRules.docNumber?.mask"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <MoneyInput
        v-model="currentFilter.amount"
        :hasError="currentFilterErrors.amount"
        :label="AppFilterVocabulary.amount"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.payerInn"
        :hasError="currentFilterErrors.payerInn"
        :label="AppFilterVocabulary.payerInn"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.payerKpp"
        :hasError="currentFilterErrors.payerKpp"
        :label="AppFilterVocabulary.payerKpp"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.payerPersonalAccount"
        :hasError="currentFilterErrors.payerPersonalAccount"
        :label="AppFilterVocabulary.payerPersonalAccount"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.payerName"
        :hasError="currentFilterErrors.payerName"
        :label="AppFilterVocabulary.payerName"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.payerBankAccount"
        :hasError="currentFilterErrors.payerBankAccount"
        :label="AppFilterVocabulary.payerBankAccount"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.payerBankName"
        :hasError="currentFilterErrors.payerBankName"
        :label="AppFilterVocabulary.payerBankName"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.recipientInn"
        :hasError="currentFilterErrors.recipientInn"
        :label="AppFilterVocabulary.recipientInn"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.recipientKpp"
        :hasError="currentFilterErrors.recipientKpp"
        :label="AppFilterVocabulary.recipientKpp"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.recipientPersonalAccount"
        :hasError="currentFilterErrors.recipientPersonalAccount"
        :label="AppFilterVocabulary.recipientPersonalAccount"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.recipientName"
        :hasError="currentFilterErrors.recipientName"
        :label="AppFilterVocabulary.recipientName"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.recipientBankAccount"
        :hasError="currentFilterErrors.recipientBankAccount"
        :label="AppFilterVocabulary.recipientBankAccount"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
      <Input
        v-model="currentFilter.recipientBankName"
        :hasError="currentFilterErrors.recipientBankName"
        :label="AppFilterVocabulary.recipientBankName"
        :placeholder="AppCommonVocabulary.notEntered"
        size="small"
      />
    </VGrid>
    <template #footer="{ close }">
      <FlexRow fullWidth justify="sb">
        <Button
          data-testid="button-clear"
          size="small"
          variant="outlined"
          @click="resetFilter"
        >
          {{ AppCommonVocabulary.clear }}
        </Button>
        <Button
          data-testid="button-submit"
          :disabled="hasFormErrors"
          size="small"
          @click="applyFilter(close)"
        >
          {{ AppCommonVocabulary.submit }}
        </Button>
      </FlexRow>
    </template>
  </VDrawer>
</template>

<style scoped lang="scss">
  @import 'node_modules/@ebp/vue-ui-lib/dist/styles/mixins/scroll';

  .filter {

    :deep(.input-wrapped){
      .control--error.control--readonly {
        border-color: var(--accent-colors-red);
      }
    }

    :deep(.inputs-group__top-buttons .input-label) {
      color: var(--primary-colors-primary);
    }

    &__date {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &-label {
        width: 100%;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        height: 16px;
      }
    }

    :deep(.input-wrapped .control input) {
      width: 100%;
    }

    &__name {
      cursor: pointer;

      &.input-wrapped {
        :deep(.control--readonly){
          cursor: pointer;
          background-color: var(--primary-colors-white);

          input {
            cursor: pointer;
          }
        }
      }
    }
    &__fixed {
      &.input-wrapped {
        :deep(.control--readonly) {
          input {
            &::placeholder {
              color: var(--input-default-placeholder);
              opacity: 1;
            }

            /* Chrome, Safari, Opera */
            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus,
            &:-webkit-autofill:active {
              background-color: transparent !important;
            }
          }
        }
      }
    }
  }
</style>
