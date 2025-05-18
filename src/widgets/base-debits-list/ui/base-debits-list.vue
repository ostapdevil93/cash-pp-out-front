<script setup lang="ts">
  import { Button, ButtonsMenu, Card, FlexCol, FlexRow, PageWrapper, Sorter, Table as DataTable } from '@ebp/vue-ui-lib';
  import { computed, defineAsyncComponent, onBeforeMount, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { generateUid, usePagination, useUrlParams, isArraysHasIntersections } from '@ebp/utils';
  import { openPrintFormModal, showServerNotification } from '@ebp/core';
  import { execute, search, sendSVAP } from '@/shared/api/info-api';
  import { ActionCode } from '@/shared/api/types/actions';
  import { Pagable } from '@/shared/api/types';
  import { notifyDefaultError } from '@/shared/lib';
  import {
    AppCommonVocabulary,
    getDebitsRequestFilters,
    getDebitsTableColumns,
    PaymentOrderKey,
    PaymentOrdersDocumentForTable,
    PaymentOrdersTableItem,
  } from '@/entities/payment-orders-item';
  import { _routeNames, DocumentStatus } from '@/shared/config';
  import { PRINT_FORM_TRIGGER } from '@/shared/config/print-form.config';

  const router = useRouter();

  const getDefaultSort = (): Sorter[] => [{ column: PaymentOrderKey.docNumber, dir: 'desc' }];

  const BaseListImportDrawer = defineAsyncComponent(() => import('@/shared/components/import-drawer/ui/import-drawer.vue'));

  const data = ref<PaymentOrdersDocumentForTable[] >([]);
  const isLoading = ref(false);
  const isImportDrawerOpen = ref(false);
  const totalElements = ref<number>(0);
  const selected = ref<PaymentOrdersDocumentForTable[]>([]);
  const highLighted = ref<string>();
  const id = generateUid();
  const pagination = usePagination({ sort: getDefaultSort(), size: 10 });

  useUrlParams({
    pagination: pagination._pagination,
    setPagination: pagination.setPagination,
  });

  const columns = computed(() => getDebitsTableColumns(router, [
    {
      label: 'Просмотреть',
      onClick: (val: PaymentOrdersTableItem) => {
        router.push({ name: _routeNames.DEBITS_FORM, params: { exKey: val.exKey, isReadonly: 'true' } });
      },
      typePermission: 'view',
    },
  ]));

  const isSelectedDocumentsForSendSVAP = computed(() => {
    let flag = true;
    selected.value.forEach((item) => {
      if (!(item.status === DocumentStatus.EXECUTED || item.status === DocumentStatus.CONFIRMED)) flag = false;
    });
    return flag;
  });

  const hasNoRequiredAction = (requiredActions: string[]) => (
    selected.value.some((item) => !isArraysHasIntersections(
      item?.actions?.map((x) => x.actionCode) || [],
      requiredActions,
    )));

  const getDataTable = async () => {
    isLoading.value = true;
    try {
      const res = await search<Pagable<PaymentOrdersTableItem>>(
        pagination.getPaginationParams(),
        getDebitsRequestFilters(),
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

  const actionsButtons = computed(() => [
    {
      label: 'Редактировать',
      tooltip: 'Редактировать документ',
      disabled: !(selected.value.length === 1) || hasNoRequiredAction([ActionCode.EDIT]),
      onClick: async () => {
        try {
          const response = await execute<PaymentOrdersTableItem>(selected.value[0].exKey as string, ActionCode.EDIT);
          await getDataTable();
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
      },
    },
    {
      label: 'Удалить',
      tooltip: 'Удалить документ',
      disabled: !(selected.value.length === 1) || hasNoRequiredAction([ActionCode.DELETE]),
      onClick: async () => {
        try {
          const response = await execute<PaymentOrdersTableItem>(selected.value[0].exKey as string, ActionCode.DELETE);
          await getDataTable();
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
      },
    },
    {
      label: 'Проверить',
      tooltip: 'Проверить документ',
      disabled: !(selected.value.length === 1)
        || (hasNoRequiredAction([ActionCode.IMPORTED_AWAITING_CONFIRM, ActionCode.AWAITING_CONFIRM])),
      onClick: async () => {
        try {
          const actionCode = selected.value[0].status === 'IMPORTED' ? ActionCode.IMPORTED_AWAITING_CONFIRM : ActionCode.AWAITING_CONFIRM;

          const response = await execute<PaymentOrdersTableItem>(selected.value[0].exKey as string, actionCode);
          await getDataTable();
          showServerNotification(response);
        } catch (e) {
          notifyDefaultError(e);
        }
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
    {
      label: 'Переформировать записи учета',
      tooltip: 'Переформировать записи учета',
      disabled: !isSelectedDocumentsForSendSVAP.value,
      onClick: () => {
        selected.value.forEach(async (item) => {
          try {
            const response = await sendSVAP<PaymentOrdersTableItem>(item.exKey as string);
            showServerNotification(response);
          } catch (e) {
            notifyDefaultError(e);
          }
        });
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

  watch(pagination._pagination, () => {
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
        <Button
          size="small"
          @click="isImportDrawerOpen = true"
        >
          Импорт
        </Button>
      </FlexRow>
    </FlexRow>
    <Card fullHeight>
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
            page: pagination._pagination.page,
            pageSize: pagination._pagination.size,
            totalElements,
          }"
          selectable="multiple"
          :sort="pagination._pagination.sort"
          :sortEnabled="true"
          @onPageChange="pagination.setPage"
          @onPageSizeChange="pagination.setSize"
          @onRowSelectionChange="changeRowsSelected"
          @onSortChange="pagination.setSort"
        />
      </FlexCol>
    </Card>
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
