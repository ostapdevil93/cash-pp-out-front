<script setup lang="ts">
  import { Input, FlexRow, VGrid } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import {
    PaymentOrdersVocabulary,
    PaymentOrderFormVocabulary,
    usePaymentItemStore,
  } from '@/entities/payment-orders-item';

  const paymentOrderItemStore = usePaymentItemStore();

  const { taxPayments } = storeToRefs(paymentOrderItemStore);
</script>

<template>
  <FlexRow v-if="taxPayments" direction="col" gap="5">
    <VGrid colGap="4" cols="4" rowGap="5">
      <Input
        v-model="taxPayments.payerStatus"
        :label="PaymentOrdersVocabulary.payerStatus"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.kbk"
        :label="PaymentOrderFormVocabulary.kbk"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.oktmoCode"
        :label="PaymentOrderFormVocabulary.oktmoCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.paymentPurpose"
        :label="PaymentOrderFormVocabulary.paymentPurpose"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.taxPeriod"
        :label="PaymentOrdersVocabulary.taxPeriod"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.taxDocNumber"
        :label="PaymentOrdersVocabulary.taxDocNumber"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.taxDocDate"
        :label="PaymentOrdersVocabulary.taxDocDate"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.payoutCode"
        :label="PaymentOrdersVocabulary.payoutCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.reserveField"
        class="double-cell-left"
        :label="PaymentOrdersVocabulary.reserveField"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.taxPurposeOfPayment"
        class="double-cell-right"
        :label="PaymentOrderFormVocabulary.taxPurposeOfPayment"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
  </FlexRow>
</template>

<style lang="scss" scoped>
.double-cell-left {
  grid-column: 1 / 3;
}
.double-cell-right {
  grid-column: 3 / 5;
}
</style>
