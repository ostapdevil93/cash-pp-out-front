<script setup lang="ts">
  import { FlexRow, UploadCard, VGrid } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import { usePaymentItemStore } from '@/entities/payment-orders-item';

  const store = usePaymentItemStore();
  const { document, isEditMode } = storeToRefs(store);
</script>

<template>
  <FlexRow v-if="document" direction="col" gap="5">
    <VGrid v-if="document.attachmentList" cols="2">
      <div v-for="attachment in document.attachmentList" :key="attachment.exFilestoreServiceAttachmentKey || 0">
        <UploadCard
          :editable="isEditMode"
          :fileId="attachment.exFilestoreServiceAttachmentKey || '0'"
          :fileName="attachment.fileName || '0'"
        />
      </div>
    </VGrid>
  </FlexRow>
</template>
