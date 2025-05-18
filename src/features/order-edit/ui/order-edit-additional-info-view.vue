<script setup lang="ts">
  import {
    Input,
    VGrid,
    Text,
    FlexRow,
    DatePicker,
  } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import { PaymentOrdersVocabulary, usePaymentItemStore } from '@/entities/payment-orders-item';

  const paymentOrderItemStore = usePaymentItemStore();

  const { document, additionalInformation, orfkMark } = storeToRefs(paymentOrderItemStore);
</script>

<template>
  <FlexRow
    v-if="document && additionalInformation && orfkMark"
    direction="col"
    gap="5"
  >
    <VGrid colGap="4" cols="3" rowGap="5">
      <Input
        v-model="additionalInformation.primaryDocKey"
        :label="PaymentOrdersVocabulary.primaryDocKey"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="additionalInformation.primaryRowKey"
        :label="PaymentOrdersVocabulary.primaryRowKey"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="additionalInformation.purposeCode"
        :label="PaymentOrdersVocabulary.purposeCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="additionalInformation.kbk"
        :label="PaymentOrdersVocabulary.kbk"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="additionalInformation.fundsTypeCode"
        :label="PaymentOrdersVocabulary.fundsTypeCode"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="additionalInformation.oks"
        :label="PaymentOrdersVocabulary.oks"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.edType"
        :label="PaymentOrdersVocabulary.edType"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.edId"
        :label="PaymentOrdersVocabulary.edId"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <FlexRow class="status" gap="1">
        <div class="dot" :style="'background-color: ' + document.bankLight.color" />
        <Text>
          {{ document.bankLight.info }}
        </Text>
      </FlexRow>
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      Отметки ОрФК
    </Text>
    <VGrid cols="4" gap="4">
      <DatePicker
        v-model="orfkMark.bankDate"
        :label="PaymentOrdersVocabulary.bankDate"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
  </FlexRow>
</template>

<style lang="scss" scoped>
.status {
  align-items: center;
  padding-top: 22px;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}
</style>
