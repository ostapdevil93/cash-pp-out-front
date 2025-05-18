<script setup lang="ts">
  import { Input, MoneyInput, DatePicker, FlexRow, Text, VGrid, Textarea } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import {
    PaymentOrdersVocabulary,
    PaymentOrderFormVocabulary,
    PaymentOrderKey,
    validationRule,
    usePaymentItemStore,
  } from '@/entities/payment-orders-item';

  const debitItemStore = usePaymentItemStore();

  const {
    document,
    payer,
    payerBankDetails,
    recipient,
    recipientBankDetails,
    paymentInfo,
    taxPayments,
    isEditMode,
    currentErrors,
    currentRecipientErrors,
    currentPaymentInfoErrors,
  } = storeToRefs(debitItemStore);
</script>

<template>
  <FlexRow
    v-if="document && payer && payerBankDetails && recipient && recipientBankDetails && paymentInfo && taxPayments"
    direction="col"
    gap="5"
  >
    <VGrid colGap="4" cols="4" rowGap="5">
      <Input
        v-model="document.docNumber"
        :label="PaymentOrdersVocabulary.docNumber"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <DatePicker
        v-model="document.docDate"
        :label="PaymentOrdersVocabulary.docDate"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.edType"
        :label="PaymentOrderFormVocabulary.edType"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.docType"
        :label="PaymentOrdersVocabulary.docType"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <MoneyInput
        v-model="document.amount"
        :label="PaymentOrdersVocabulary.amount"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.amountInText"
        class="united-cells-2-5"
        :label="PaymentOrdersVocabulary.amountInText"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <VGrid cols="3" gap="4">
      <Input
        v-model="document.typeOfPayment"
        :hasError="currentErrors.typeOfPayment"
        :label="PaymentOrdersVocabulary.typeOfPayment"
        :maxLength="validationRule(PaymentOrderKey.typeOfPayment).maxLength"
        :readonly="!isEditMode"
        :rules="validationRule(PaymentOrderKey.typeOfPayment).rules"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="document.paymentPriority"
        :hasError="currentErrors.paymentPriority"
        :label="PaymentOrderFormVocabulary.paymentPriority"
        :maxLength="validationRule(PaymentOrderKey.paymentPriority, PaymentOrderKey.document).maxLength"
        :readonly="!isEditMode"
        :rules="validationRule(PaymentOrderKey.paymentPriority, PaymentOrderKey.document).rules"
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
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.payer }}
    </Text>
    <VGrid cols="4" gap="4">
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
        v-model="payer.payerName"
        class="united-cells-3-5"
        :label="PaymentOrderFormVocabulary.payerName"
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
        class="united-cells-1-4"
        :label="PaymentOrdersVocabulary.payerBankName"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.recipient }}
    </Text>
    <VGrid cols="4" gap="4">
      <Input
        v-model="recipient.recipientInn"
        :hasError="currentRecipientErrors.recipientInn"
        :label="PaymentOrderFormVocabulary.recipientInn"
        :mask="validationRule(PaymentOrderKey.recipientInn).mask"
        :maxLength="validationRule(PaymentOrderKey.recipientInn).maxLength"
        :readonly="!isEditMode"
        :rules="validationRule(PaymentOrderKey.recipientInn).rules"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientKpp"
        :hasError="currentRecipientErrors.recipientKpp"
        :label="PaymentOrderFormVocabulary.recipientKpp"
        :mask="validationRule(PaymentOrderKey.recipientKpp).mask"
        :maxLength="validationRule(PaymentOrderKey.recipientKpp).maxLength"
        :readonly="!isEditMode"
        :rules="validationRule(PaymentOrderKey.recipientKpp).rules"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="recipient.recipientName"
        class="united-cells-3-5"
        :label="PaymentOrderFormVocabulary.recipientName"
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
        class="united-cells-1-4"
        :label="PaymentOrdersVocabulary.recipientBankName"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.paymentInfo }}
    </Text>
    <VGrid colGap="4" cols="4" rowGap="5">
      <Input
        v-model="paymentInfo.typeOfOperation"
        :label="PaymentOrdersVocabulary.typeOfOperation"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="paymentInfo.paymentPriority"
        :hasError="currentPaymentInfoErrors.paymentPriority"
        :label="PaymentOrdersVocabulary.paymentPriority"
        :maxLength="validationRule(PaymentOrderKey.paymentPriority, PaymentOrderKey.paymentInfo).maxLength"
        :readonly="!isEditMode"
        :rules="validationRule(PaymentOrderKey.paymentPriority, PaymentOrderKey.paymentInfo).rules"
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
        :readonly="!isEditMode"
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
      <Textarea
        v-model="paymentInfo.paymentPurpose"
        class="united-cells-1-5"
        :hasError="currentPaymentInfoErrors.paymentPurpose"
        :label="PaymentOrdersVocabulary.paymentPurpose"
        :maxLength="validationRule(PaymentOrderKey.paymentPurpose).maxLength"
        :readonly="!isEditMode"
        :rules="validationRule(PaymentOrderKey.paymentPurpose).rules"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
    <Text color="var(--primary-colors-primary)" font-weight="500" variant="subtitle2">
      {{ PaymentOrdersVocabulary.taxPayments }}
    </Text>
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
        class="united-cells-1-3"
        :label="PaymentOrdersVocabulary.reserveField"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
      <Input
        v-model="taxPayments.taxPurposeOfPayment"
        class="united-cells-3-5"
        :label="PaymentOrderFormVocabulary.taxPurposeOfPayment"
        :readonly="true"
        :showClearButton="false"
        size="small"
      />
    </VGrid>
  </FlexRow>
</template>

<style lang="scss" scoped>
.united-cells-2-5 {
  grid-column: 2 / 5;
}
.united-cells-1-3 {
  grid-column: 1 / 3;
}
.united-cells-3-5 {
  grid-column: 3 / 5;
}
.united-cells-1-4 {
  grid-column: 1 / 4;
}
.united-cells-1-5 {
  grid-column: 1 / 5;
}
</style>
