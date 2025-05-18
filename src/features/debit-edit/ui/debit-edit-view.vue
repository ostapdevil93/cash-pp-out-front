<script setup lang="ts">
  import { PageWrapper, PageHeader, Card, TabBar } from '@ebp/vue-ui-lib';
  import { computed, onBeforeMount, ref, defineAsyncComponent } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { PaymentOrderKey, PaymentOrdersVocabulary, usePaymentItemStore } from '@/entities/payment-orders-item';
  import { STATUS_COLOR, STATUS_NAME } from '@/shared/config';
  import { ControlButtons } from '@/shared/ui/execute-actions';

  const MainInfoView = defineAsyncComponent(() => import('@/features/debit-edit/ui/debit-edit-main-info-view.vue'));
  const EventLogView = defineAsyncComponent(() => import('@/features/common-views/ui/event-log-view.vue'));
  const LinksView = defineAsyncComponent(() => import('@/features/common-views/ui/links-view.vue'));
  const SignsView = defineAsyncComponent(() => import('@/features/common-views/ui/signs-view.vue'));

  const route = useRoute();
  const router = useRouter();

  const debitItemStore = usePaymentItemStore();

  const { data, document, shownTabs } = storeToRefs(debitItemStore);
  const { fetchValue } = debitItemStore;

  const activeTab = ref<
    'main' |
    'eventLog' |
    'links' |
    'signs'
  >('main');

  const currentComponent = computed(() => ({
    main: MainInfoView,
    eventLog: EventLogView,
    links: LinksView,
    signs: SignsView,
  }));

  const status = computed(() => (data.value?.currentStatus
    ? { title: STATUS_NAME[data.value.currentStatus], color: STATUS_COLOR[data.value.currentStatus] }
    : undefined));

  const subTitleItems = computed(() => {
    const result = [];
    if (document.value?.docNumber) {
      result.push({
        title: PaymentOrdersVocabulary[PaymentOrderKey.docNumber] as string,
        value: document.value.docNumber,
      });
    }
    if (document.value?.docDate) {
      result.push({
        title: PaymentOrdersVocabulary[PaymentOrderKey.docDate] as string,
        value: document.value.docDate,
        type: 'date',
      });
    }
    return result;
  });

  onBeforeMount(() => {
    fetchValue(route.params.exKey as string);
  });
</script>

<template>
  <PageWrapper v-if="data">
    <template #header>
      <PageHeader
        :status="status"
        :subTitleItems="subTitleItems"
        title="Безакцептное списание по картам"
        @click:back="router.back()"
      />
    </template>
    <Card fullHeight hasCardActions>
      <template #header>
        <ControlButtons :store="debitItemStore" />
      </template>
      <template #navigation>
        <TabBar
          v-model="activeTab"
          :items="shownTabs"
          type="sub"
        />
      </template>
      <component :is="currentComponent[activeTab]" />
    </Card>
  </PageWrapper>
</template>

<style lang="scss" scoped>
</style>
