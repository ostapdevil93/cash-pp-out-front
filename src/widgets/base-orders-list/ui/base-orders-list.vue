<script setup lang="ts">
  import {
    Card,
    FlexRow,
    FlexCol,
    Table as DataTable,
    ButtonsMenu,
    Button,
    PageWrapper,
    Tooltip,
    ActiveFilters,
  } from '@ebp/vue-ui-lib';
  import { computed, onBeforeMount, ref, defineAsyncComponent, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import { generateUid, useUrlParams } from '@ebp/utils';
  import { openPrintFormModal, showServerNotification } from '@ebp/core';
  import { execute, getXmlFile, search, sendSVAP, sentToSent } from '@/shared/api/info-api';
  import { Pagable } from '@/shared/api/types';
  import { notifyDefaultError } from '@/shared/lib';
  import {
    getPaymentOrdersTableColumns,
    PaymentOrdersDocumentForTable,
    PaymentOrdersTableItem,
    PaymentOrderKey,
    getPaymentOrdersRequestFilters,
    AppCommonVocabulary,
  } from '@/entities/payment-orders-item';
  import { OrderFilter, URL_CONFIG, useOrderFilter } from '@/features/filter';
  import { _routeNames, DocumentStatus } from '@/shared/config';
  import { PRINT_FORM_TRIGGER } from '@/shared/config/print-form.config';
  import { ActionCode } from '@/shared/api/types/actions';

  const orderFilterStore = useOrderFilter();
  const { filter, tagsList } = storeToRefs(orderFilterStore);
  const {
    setFilter,
    getDefaultFilter,
    onRemoveFilterTag,
    getFilterPreparedToRequest,
  } = orderFilterStore;

  const router = useRouter();

  useUrlParams({
    pagination: orderFilterStore.pagination._pagination,
    filter,
    setFilter,
    defaultFilter: getDefaultFilter(),
    setPagination: orderFilterStore.pagination.setPagination,
    getUrlConfig: URL_CONFIG,
  });

  const BaseListImportDrawer = defineAsyncComponent(() => import('@/shared/components/import-drawer/ui/import-drawer.vue'));

  const data = ref<PaymentOrdersDocumentForTable[] >([]);
  const isLoading = ref(false);
  const isImportDrawerOpen = ref(false);
  const totalElements = ref<number>(0);
  const selected = ref<PaymentOrdersDocumentForTable[]>([]);
  const highLighted = ref<string>();
  const id = generateUid();

  const getDataTable = async () => {
    isLoading.value = true;
    try {
      const res = await search<Pagable<PaymentOrdersTableItem>>(
        orderFilterStore.pagination.getPaginationParams(),
        [
          ...getFilterPreparedToRequest(),
          ...getPaymentOrdersRequestFilters(),
        ],
      );
      data.value = [...res.content.map((item) => ({
        ...item,
        ...item.document,
        [PaymentOrderKey.createdTs]: item?.systemData?.createdTs ?? null,
      }) as PaymentOrdersDocumentForTable)];
      totalElements.value = res.totalElements;
    } catch (e) {
      notifyDefaultError(e);
    } finally {
      isLoading.value = false;
    }
  };

  const columns = computed(() => getPaymentOrdersTableColumns(router, [
    {
      label: 'Просмотреть',
      onClick: (val: PaymentOrdersTableItem) => {
        router.push({ name: _routeNames.ORDERS_FORM, params: { exKey: val.exKey } });
      },
      typePermission: 'view',
    },
  ]));

  const isSelectedDocumentsForSendToApprove = computed(() => {
    let flag = true;
    selected.value.forEach((item) => {
      if (item.status !== DocumentStatus.PREPARED) flag = false;
    });
    return flag;
  });

  const actionsButtons = computed(() => [
    {
      label: 'Проверить',
      tooltip: 'Проверить документ',
      disabled: !(
        selected.value.length === 1
        && (
          selected.value[0].status === DocumentStatus.DRAFT
          || selected.value[0].status === DocumentStatus.IMPORTED
        )
      ),
      onClick: async () => {
        try {
          const response = await execute<PaymentOrdersTableItem>(selected.value[0].exKey as string, ActionCode.CHECK);
          await getDataTable();
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
      },
    },
    {
      label: 'На утверждение',
      tooltip: 'На утверждение',
      disabled: !isSelectedDocumentsForSendToApprove.value,
      onClick: () => {
        selected.value.forEach(async (item) => {
          try {
            const response = await execute<PaymentOrdersTableItem>(item.exKey as string, ActionCode.PREPARED_TO_HEADACCSIGN);
            await getDataTable();
            showServerNotification(response);
          } catch (e) {
            notifyDefaultError(e);
          }
        });
      },
    },
    {
      label: 'Печать',
      disabled: selected.value.length !== 1,
      onClick: async () => {
        const val = selected.value[0];
        if (!val) {
          return;
        }
        await openPrintFormModal({
          printFormList: val.printFormList || [],
          trigger: PRINT_FORM_TRIGGER.DOC_CS_0005,
          documentExKey: val.exKey || '',
          item: data.value,
        });
      },
    },
    /// Временное решение Экспорта
    {
      label: 'Экспорт',
      tooltip: 'Экспорт',
      disabled: !(
        selected.value.length === 1
        && (
          selected.value[0].status === DocumentStatus.SENT_BANK
          || selected.value[0].status === DocumentStatus.SIGNED
        )
      ),
      onClick: async () => {
        try {
          const selectedItem = selected.value[0];
          if (!selectedItem?.systemData?.printFormList?.length) {
            console.error('printFormList отсутствует или пуст');
            throw new Error('printFormList отсутствует или пуст');
          }
          const exKey = selectedItem.exKey as string;
          const printFormList = selectedItem.systemData?.printFormList;
          const xmlName = printFormList?.[0]?.filestoreAttachmentXmlName;
          const xmlKey = printFormList?.[0]?.exFilestoreAttachmentXmlKey;

          if (!xmlName || !xmlKey) {
            console.error('exFilestoreAttachmentXmlKey и filestoreAttachmentXmlName обязательны');
            throw new Error('exFilestoreAttachmentXmlKey и filestoreAttachmentXmlName обязательны');
          }

          await getXmlFile(
            exKey,
            xmlKey,
            xmlName,
          );
          const response = await sentToSent(exKey); /// Временное решение для Экспорта
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
      },
    },
    {
      label: 'Подписать',
      tooltip: 'Подписать',
      disabled: !(
        selected.value.length === 1
        && selected.value[0].status === DocumentStatus.TO_APPROVE
      ),
      onClick: async () => {
        try {
          const response = await execute<PaymentOrdersTableItem>(
            selected.value[0].exKey as string,
            ActionCode.HEADACCSIGN_TO_CHIEFSIGN,
          );
          await getDataTable();
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
      },
    },
    {
      label: 'Переформировать записи учета',
      tooltip: 'Переформировать записи учета',
      disabled: !(selected.value.length === 1 && selected.value[0].status === DocumentStatus.EXECUTED),
      onClick: async () => {
        try {
          const response = await sendSVAP<PaymentOrdersTableItem>(selected.value[0].exKey as string);
          await getDataTable();
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
      },
    },
  ]);

  const changeRowsSelected = (rows: Record<string, any>[]): void => {
    selected.value = rows as PaymentOrdersDocumentForTable[];
  };

  const closeImportDrawer = () => {
    isImportDrawerOpen.value = false;
    getDataTable();
  };

  onBeforeMount(() => {
    getDataTable();
  });

  watch([() => orderFilterStore.filter, () => orderFilterStore.pagination], () => {
    getDataTable();
  }, { deep: true });
</script>

<template>
  <PageWrapper>
    <FlexRow class="payment-orders__top-buttons" justify="sb">
      <ButtonsMenu
        :actions="actionsButtons"
        :disabled="!selected.length"
        size="small"
        variant="outlined"
      >
        {{ AppCommonVocabulary.chosen }}: {{ selected.length }}
      </ButtonsMenu>
      <FlexRow gap="4">
        <Tooltip :content="AppCommonVocabulary.showFilter" placement="bottom-start" theme="button">
          <Button
            icon="IconFilter"
            size="small"
            variant="outlined"
            @click="orderFilterStore.isOpen = true"
          />
        </Tooltip>
        <Button
          size="small"
          @click="isImportDrawerOpen = true"
        >
          Импорт
        </Button>
      </FlexRow>
    </FlexRow>
    <Card fullHeight>
      <FlexCol fullHeight gap="3">
        <ActiveFilters
          :items="tagsList"
          zIndex="MODAL_HINTS"
          @click:close="value => onRemoveFilterTag(value)"
        />
        <FlexCol :id="id" fullHeight>
          <DataTable
            class="payment-orders__table"
            :columns="columns"
            :data="data"
            :fillContainerHeightId="id"
            headerPaddings="24px 5px"
            :highlightedRows="highLighted ? [highLighted] : undefined"
            :index="PaymentOrderKey.exKey"
            :isLoading="isLoading"
            paddings="24px 5px"
            :pagination="{
              page: orderFilterStore.pagination._pagination.page,
              pageSize: orderFilterStore.pagination._pagination.size,
              pageSizeVariants: [10, 20, 30, 40, 50],
              totalElements,
            }"
            selectable="multiple"
            :sort="orderFilterStore.pagination._pagination.sort"
            :sortEnabled="true"
            @onPageChange="orderFilterStore.pagination.setPage"
            @onPageSizeChange="orderFilterStore.pagination.setSize"
            @onRowSelectionChange="changeRowsSelected"
            @onSortChange="orderFilterStore.pagination.setSort"
          />
        </FlexCol>
      </FlexCol>
    </Card>
    <OrderFilter
      v-if="orderFilterStore.isOpen"
      @onClose="orderFilterStore.isOpen = false"
    />
    <BaseListImportDrawer
      v-if="isImportDrawerOpen"
      @onClose="closeImportDrawer"
    />
  </PageWrapper>
</template>

<style lang="scss" scoped>
.payment-orders {
  &__top-buttons {
    margin-bottom: 1rem;
  }
}
.payment-orders,
.payment-orders__related-docs {
  &__table {
    &.table-wrapper {
      :deep(.tabulator) {
        .tabulator-row {
          .tabulator-cell {

            max-height: 43px !important;
          }
          &.tabulator-highlighted {
            background-color: var(--primary-colors-substrate);
          }
        }
      }
    }
  }
}
</style>
