<script setup lang="ts">
  import { DocumentLinks, DocumentLinksTypes } from '@ebp/core';
  import { FlexCol } from '@ebp/vue-ui-lib';
  import { storeToRefs } from 'pinia';
  import { DocumentLinksResponse, usePaymentItemStore } from '@/entities/payment-orders-item';
  import { getLinks } from '@/shared/api/info-api';
  import { notifyDefaultError } from '@/shared/lib';
  import { documentLinksOptions } from '@/shared/config';

  const store = usePaymentItemStore();

  const { data } = storeToRefs(store);

  const getDocumentLinks: DocumentLinksTypes.GetDocumentLinksData = async () => getLinks<DocumentLinksResponse>(
    data.value?.exKey as string,
    data.value?.objectCode as string,
  )
    .then((resp) => {
      const { sourceLinks, targetLinks } = resp;
      const sourceItems: DocumentLinksTypes.Item[] = sourceLinks.map((sL) => ({
        active: sL.active,
        exKey: sL.targetExKey,
        description: sL.description,
        number: sL.targetNumber,
        objectCode: sL.targetObjectCode,
        actionTs: '',
        actionTz: null,
        rawData: null,
      }));

      const targetItems: DocumentLinksTypes.Item[] = targetLinks.map((tL) => ({
        active: tL.active,
        exKey: tL.sourceExKey,
        description: tL.description,
        number: tL.sourceNumber,
        objectCode: tL.sourceObjectCode,
        actionTs: '',
        actionTz: null,
        rawData: null,
      }));

      return {
        items: [...sourceItems, ...targetItems],
        totalElements: resp.totalCount,
      };
    })
    .catch((e) => {
      notifyDefaultError(e);
      return {
        items: [],
        totalElements: 0,
      };
    });
</script>

<template>
  <FlexCol
    class="mt-3"
    fullHeight
  >
    <DocumentLinks
      v-if="data"
      :getData="getDocumentLinks"
      :options="documentLinksOptions"
    />
  </FlexCol>
</template>

<style lang="scss" scoped>
</style>
