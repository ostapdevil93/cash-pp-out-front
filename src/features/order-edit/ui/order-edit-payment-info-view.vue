<script setup lang="ts">
  import { Input, FlexRow, VGrid, Text, Textarea, DatePicker } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import { PaymentOrdersVocabulary, usePaymentItemStore } from '@/entities/payment-orders-item';

  const paymentOrderItemStore = usePaymentItemStore();

  const { document, paymentInfo } = storeToRefs(paymentOrderItemStore);
</script>

<template>
  <FlexRow v-if="document && paymentInfo" direction="col" gap="5">
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.paymentInfo }}
    </Text>
    <VGrid cols="4" gap="4">
      <Input
        v-model="paymentInfo.typeOfOperation"
        :label="PaymentOrdersVocabulary.typeOfOperation"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="paymentInfo.paymentPriority"
        :label="PaymentOrdersVocabulary.paymentPriority"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="paymentInfo.code"
        :label="PaymentOrdersVocabulary.code"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="paymentInfo.paymentSource"
        :label="PaymentOrdersVocabulary.paymentSource"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <VGrid cols="5" gap="4">
      <DatePicker
        v-model="paymentInfo.receiptDate"
        :label="PaymentOrdersVocabulary.receiptDate"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <DatePicker
        v-model="paymentInfo.putInFileDate"
        :label="PaymentOrdersVocabulary.putInFileDate"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <DatePicker
        v-model="paymentInfo.writtenOffDate"
        :label="PaymentOrdersVocabulary.writtenOffDate"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <DatePicker
        v-model="paymentInfo.paymentTerm"
        :label="PaymentOrdersVocabulary.paymentTerm"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.typeOfPayment"
        :label="PaymentOrdersVocabulary.typeOfPayment"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Textarea
      v-model="paymentInfo.paymentPurpose"
      :label="PaymentOrdersVocabulary.paymentPurpose"
      :readonly="true"
      size="small"
    />
  </FlexRow>
</template>

<style lang="scss" scoped>
</style>
