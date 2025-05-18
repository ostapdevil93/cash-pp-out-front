<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { FlexRow } from '@ebp/vue-ui-lib';
  import { usePaymentItemStore } from '@/entities/payment-orders-item';
  import { ApprovingList } from '@/shared/ui/approving-list';
  import { BASE_URLS } from '@/shared/api';
  import { DOC_OBJECT_CODE_EBP } from '@/shared/api/info-api';

  const store = usePaymentItemStore();
  const { isEditMode, approvalList } = storeToRefs(store);
</script>

<template>
  <FlexRow direction="col" gap="5">
    <ApprovingList
      :docTypeCode="DOC_OBJECT_CODE_EBP"
      :isEdit="isEditMode"
      :items="approvalList"
      :signApi="BASE_URLS.CBS"
      statusType="withDot"
    />
  </FlexRow>
</template>
