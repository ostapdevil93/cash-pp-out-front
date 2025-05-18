<script setup lang="ts">
  import { Input, MoneyInput, FlexRow, Text, VGrid } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import {
    PaymentOrdersVocabulary,
    PaymentOrderFormVocabulary,
    usePaymentItemStore,
  } from '@/entities/payment-orders-item';

  const paymentOrderItemStore = usePaymentItemStore();

  const {
    document,
    payer,
    payerBankDetails,
    recipient,
    recipientBankDetails,
  } = storeToRefs(paymentOrderItemStore);
</script>

<template>
  <FlexRow
    v-if="document && payer && payerBankDetails && recipient && recipientBankDetails"
    direction="col"
    gap="5"
  >
    <VGrid cols="4" gap="4">
      <MoneyInput
        v-model="document.amount"
        :label="PaymentOrdersVocabulary.amount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.payer }}
    </Text>
    <VGrid colGap="4" cols="4" rowGap="5">
      <Input
        v-model="payer.payerInn"
        :label="PaymentOrderFormVocabulary.payerInn"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerKpp"
        :label="PaymentOrderFormVocabulary.payerKpp"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerPersonalAccount"
        :label="PaymentOrderFormVocabulary.payerPersonalAccount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerRegistryCode"
        :label="PaymentOrderFormVocabulary.payerRegistryCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerName"
        class="united-cells-4"
        :label="PaymentOrderFormVocabulary.payerName"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerCardNumber"
        :label="PaymentOrderFormVocabulary.payerCardNumber"
        mask="#### #### #### ####"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerBudgetCode"
        :label="PaymentOrderFormVocabulary.payerBudgetCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerOktmoPpo"
        :label="PaymentOrderFormVocabulary.payerOktmoPpo"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payer.payerServiceTofkCode"
        :label="PaymentOrderFormVocabulary.payerServiceTofkCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.payerBankDetails }}
    </Text>
    <VGrid colGap="4" cols="3" rowGap="5">
      <Input
        v-model="payerBankDetails.payerBankAccount"
        :label="PaymentOrderFormVocabulary.payerBankAccount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payerBankDetails.payerBik"
        :label="PaymentOrderFormVocabulary.payerBik"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payerBankDetails.payerCorBankAccount"
        :label="PaymentOrderFormVocabulary.payerCorBankAccount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="payerBankDetails.payerBankName"
        class="united-cells-3"
        :label="PaymentOrdersVocabulary.payerBankName"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.recipient }}
    </Text>
    <VGrid colGap="4" cols="4" rowGap="5">
      <Input
        v-model="recipient.recipientInn"
        :label="PaymentOrderFormVocabulary.recipientInn"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientKpp"
        :label="PaymentOrderFormVocabulary.recipientKpp"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientPersonalAccount"
        :label="PaymentOrderFormVocabulary.recipientPersonalAccount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientRegistryCode"
        :label="PaymentOrderFormVocabulary.recipientRegistryCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientName"
        class="united-cells-4"
        :label="PaymentOrderFormVocabulary.recipientName"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <VGrid cols="3" gap="4">
      <Input
        v-model="recipient.recipientBudgetCode"
        :label="PaymentOrderFormVocabulary.recipientBudgetCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientOktmoPpo"
        :label="PaymentOrderFormVocabulary.recipientOktmoPpo"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientServiceTofkCode"
        :label="PaymentOrderFormVocabulary.recipientServiceTofkCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.recipientBankDetails }}
    </Text>
    <VGrid colGap="4" cols="3" rowGap="5">
      <Input
        v-model="recipientBankDetails.recipientBankAccount"
        :label="PaymentOrderFormVocabulary.recipientBankAccount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipientBankDetails.recipientBik"
        :label="PaymentOrderFormVocabulary.recipientBik"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipientBankDetails.recipientCorBankAccount"
        :label="PaymentOrderFormVocabulary.recipientCorBankAccount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipientBankDetails.recipientBankName"
        class="united-cells-3"
        :label="PaymentOrdersVocabulary.recipientBankName"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
  </FlexRow>
</template>

<style lang="scss" scoped>
.united-cells-3 {
  grid-column: 1 / 4;
}
.united-cells-4 {
  grid-column: 1 / 5;
}
</style>
