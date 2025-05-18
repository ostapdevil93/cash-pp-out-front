<script setup lang="ts">
  import { BtnGroupType, Button, ButtonsMenu, CardActions, FlexRow, Tooltip, SelIcon, Text } from '@ebp/vue-ui-lib';
  import { computed } from 'vue';
  import { SystemDrawerData, SystemInfoDrawer, openPrintFormModal } from '@ebp/core';
  import { formatDateInTimeZone, useToggle } from '@ebp/utils';
  import { AutoMonitoringResults } from '@ebp/auto-monitoring-results';
  import { storeToRefs } from 'pinia';
  import { PRINT_FORM_TRIGGER } from '@/shared/config/print-form.config';
  import { Action, BASE_URLS } from '@/shared/api';
  import { ACTIONS_IN_APPROVAL_LIST } from '@/shared/api/info-api';
  import { useCardActions } from '../composables/use-actions';
  import ActionsExecuting from './actions-executing.vue';
  import { ActionsExecutingModel } from '../model/actions-executing.model';

  const props = withDefaults(defineProps<{ actions: any[], store: any }>(), {
    actions: () => [],
    store: () => null,
  });

  const {
    data, autoControlResult, systemData, isAutoControlModalOpen, isLoading, isEditMode,
    isInCreateMode, hasFormErrors,
  } = storeToRefs(props.store);

  const { model, dotsBtnItems, primaryBtn } = useCardActions(props.actions, props.store);

  const isPrintButtonAvailable = computed(() => {
    const currentStatus = data.value?.currentStatus;
    return currentStatus && !['AUTHORIZATION', 'RECALL', 'TOFK_RECEIVED'].includes(currentStatus);
  });

  /** Блок ошибок в заголовке карточки */
  const hasLabelErrors = computed(() => {
    if (autoControlResult.value) {
      const hasSecondLevel = [1, 2].includes(autoControlResult.value.autoControlTotalLevel);
      const needToShowDialog = autoControlResult.value.autoControlTotalLevel !== 99;
      return hasSecondLevel || needToShowDialog;
    }
    return false;
  });

  /** Иконка блокировано */
  const isLocked = computed(() => !!data.value?.isBlocked);

  /** Системная информация */
  const systemDrawer = useToggle(false);
  const _systemDrawerData = computed<SystemDrawerData | null>(() => (data.value && systemData.value ? ({
    createdTs: systemData.value.createdTs,
    createdBy: (systemData.value.createdBy as any)?.isSystem ? 'Системное действие' : systemData.value.createdBy,
    exKey: data.value.exKey,
    updatedTs: systemData.value.updatedTs,
  }) : null));

  /** Действия в левом блоке хэдера карточки */
  const _leftActions = computed(() => {
    const items: BtnGroupType[] = [];

    if (isPrintButtonAvailable.value) {
      items.push({
        icon: 'IconPrinter',
        description: 'Печать документа',
        callback: async () => {
          await openPrintFormModal({
            printFormList: props.store.printFormList || [],
            trigger: PRINT_FORM_TRIGGER.DOC_CS_0005,
            documentExKey: data.value?.exKey || '',
            item: data.value,
          });
        },
      });
    }

    items.push({
      icon: 'IconDocumentCode',
      description: 'Системная информация',
      callback: systemDrawer.onOpen,
    });

    return items;
  });

  const autoControlsDescription = computed(() => {
    const date = formatDateInTimeZone(props.store.autoControlResult?.actionTs, { view: 'dateTime' });
    if (props.store.autoControlResult?.statusBegin !== props.store.autoControlResult?.statusEnd) {
      return `Ошибки выявлены при попытке обновления документа от ${date}`;
    }
    return `Выявлены ошибки при попытке согласования\\подписания документа от ${date}`;
  });

  const onClickSubmit = () => {
    if (autoControlResult.value) {
      model.value?.setOnClick(autoControlResult.value as unknown as Action)();
    }
    isAutoControlModalOpen.value = false;
  };

  const isLockedDescription = computed(() => (`Документ заблокирован. Выполняется ${data.value?.blockedReason} пользователем ${data.value?.isBlocked}.`));
</script>

<template>
  <CardActions :hasError="hasLabelErrors || isLocked" :subActionsItems="_leftActions">
    <template #errors>
      <div v-if="isLocked" class="lock-icon">
        <Tooltip :content="isLockedDescription">
          <SelIcon
            color="var(--primary-colors-secondary-2)"
            name="IconLock"
            size="medium"
          />
        </Tooltip>
      </div>
      <button
        v-if="hasLabelErrors"
        :style="{ cursor: 'pointer' }"
        type="button"
        @click="isAutoControlModalOpen = true"
      >
        <FlexRow align="c" gap="2">
          <SelIcon color="var(--accent-colors-red)" name="IconDanger" size="medium" />
          <Text>Проверка данных не пройдена</Text>
        </FlexRow>
      </button>
    </template>

    <template #rightColumnActions>
      <template v-if="isEditMode">
        <Button
          :disabled="isLoading || hasFormErrors"
          size="small"
          @click="store.saveValue()"
        >
          {{ isInCreateMode ? 'Создать' : 'Сохранить' }}
        </Button>
      </template>

      <Button
        v-if="primaryBtn"
        :disabled="isLoading"
        size="small"
        @click="primaryBtn.onClick"
      >
        {{ primaryBtn.label }}
      </Button>

      <Button
        v-if="dotsBtnItems.length === 1"
        size="small"
        @click="dotsBtnItems[0].onClick"
      >
        {{ dotsBtnItems[0].label }}
      </Button>
      <ButtonsMenu
        v-else-if="dotsBtnItems.length > 1"
        :actions="dotsBtnItems"
        size="small"
      />
    </template>
  </CardActions>

  <Teleport to="body">
    <AutoMonitoringResults
      v-if="isAutoControlModalOpen"
      :autoControlsResultList="store.autoControlResult?.autoControlsResultList || []"
      :description="autoControlsDescription"
      @onClickSubmit="onClickSubmit"
      @onClose="() => isAutoControlModalOpen = false"
    />
  </Teleport>

  <SystemInfoDrawer
    v-if="_systemDrawerData && systemDrawer.isOpen.value"
    :data="_systemDrawerData"
    @onClose="systemDrawer.onClose"
  />

  <ActionsExecuting
    v-if="model"
    :actionToStageMap="ACTIONS_IN_APPROVAL_LIST"
    :approvalList="store.data.approvalList || []"
    :baseUrl="BASE_URLS.CBS"
    :currentStatus="store.data.currentStatus"
    :model="model as ActionsExecutingModel"
    :saveApprovalListCb="store.saveApprovalList"
  />
</template>

<style scoped lang="scss">
.lock-icon {
  display: flex;
  position: relative;
  padding-right: 24px;
  margin-right: 24px;
  border-right: 1px solid var(--primary-colors-lines);
}

.pointer{
  cursor: pointer;
}
</style>
