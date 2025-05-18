<script setup lang="ts">
  import { PageWrapper, PageHeader, Card, TabBar } from '@ebp/vue-ui-lib';
  import { computed, onBeforeMount, ref, defineAsyncComponent } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { PaymentOrderKey, PaymentOrdersVocabulary, usePaymentItemStore } from '@/entities/payment-orders-item';
  import { STATUS_COLOR, STATUS_NAME } from '@/shared/config';
  import { ControlButtons } from '@/shared/ui/execute-actions';

  const MainInfoView = defineAsyncComponent(() => import('@/features/order-edit/ui/order-edit-main-info-view.vue'));
  const PaymentInfoView = defineAsyncComponent(() => import('@/features/order-edit/ui/order-edit-payment-info-view.vue'));
  const TaxInfoView = defineAsyncComponent(() => import('@/features/order-edit/ui/order-edit-tax-info-view.vue'));
  const AdditionalInfoView = defineAsyncComponent(() => import('@/features/order-edit/ui/order-edit-additional-info-view.vue'));
  const EventLogView = defineAsyncComponent(() => import('@/features/common-views/ui/event-log-view.vue'));
  const LinksView = defineAsyncComponent(() => import('@/features/common-views/ui/links-view.vue'));
  const IncludesView = defineAsyncComponent(() => import('@/features/common-views/ui/includes-view.vue'));
  const SignsView = defineAsyncComponent(() => import('@/features/common-views/ui/signs-view.vue'));

  const route = useRoute();
  const router = useRouter();

  const paymentOrderItemStore = usePaymentItemStore();

  const { data, document } = storeToRefs(paymentOrderItemStore);
  const { fetchValue } = paymentOrderItemStore;

  const activeTab = ref<
    'main' |
    'payment' |
    'tax' |
    'additional' |
    'eventLog' |
    'links' |
    'includes' |
    'signs'
  >('main');

  const tabs = [
    {
      label: 'Основная информация',
      value: 'main',
    },
    {
      label: 'Информация о платеже',
      value: 'payment',
    },
    {
      label: 'Налоговые платежи',
      value: 'tax',
    },
    {
      label: 'Дополнительная информация',
      value: 'additional',
    },
    {
      label: 'Журнал событий',
      value: 'eventLog',
    },
    {
      label: 'Связи по документу',
      value: 'links',
    },
    {
      label: 'Вложения',
      value: 'includes',
    },
    {
      label: 'Подписи',
      value: 'signs',
    },
  ];

  const currentComponent = computed(() => ({
    main: MainInfoView,
    payment: PaymentInfoView,
    tax: TaxInfoView,
    additional: AdditionalInfoView,
    eventLog: EventLogView,
    links: LinksView,
    includes: IncludesView,
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
        title="Платежное поручение (Исходящее)"
        @click:back="router.back()"
      />
    </template>
    <Card fullHeight hasCardActions>
      <template #header>
        <ControlButtons :store="paymentOrderItemStore" />
      </template>
      <template #navigation>
        <TabBar
          v-model="activeTab"
          :items="tabs"
          type="sub"
        />
      </template>
      <component :is="currentComponent[activeTab]" />
    </Card>
  </PageWrapper>
</template>

<style lang="scss" scoped>
</style>
