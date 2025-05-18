<script setup lang="ts">
  import { FlexCol, StepItem, Stepper } from '@ebp/vue-ui-lib';
  import { computed, onBeforeMount, ref, watch } from 'vue';
  import { deepEqual } from '@ebp/utils';
  import ApprovingRouteStep from './approving-list-step.vue';
  import { ApprovingListApi } from '../model/types.ts';
  import { useApprovingRoute } from '../model/use-approving-route.ts';
  import { DataTestIds } from '../config/consts.ts';

  const props = defineProps<{
    /** Элементы маршрута согласования */
    items: ApprovingListApi.RouteItem[],
    /** Код типа документа, по которому нужно получить перечень утверждающих в выпадающие списки */
    docTypeCode: string,
    signApi: string,
    isEdit: boolean,
    statusType?: 'tag' | 'withDot'
  }>();

  const emits = defineEmits<{(e: 'update:items', newItems: ApprovingListApi.RouteItem[]): void }>();

  const { getApprovalsList, approvingRouteItems, setItems, changeApprovingRoute } = useApprovingRoute();

  onBeforeMount(() => {
    getApprovalsList(props.docTypeCode);
    setItems(props.items);
  });

  const _accordion = ref<boolean[]>([]);

  watch(() => props.items, () => {
    _accordion.value = new Array(props.items.length).fill(true);
  }, { immediate: true });

  const _steps = ref<StepItem[]>([]);

  function getStepStatus(item: ApprovingListApi.RouteItem): ApprovingListApi.RouteItem['step'] {
    let type: StepItem['type'] = 'unactive';
    if (item.stagesApprovalList.every((x) => x.staffApprovalList.length > 0
      && x.staffApprovalList.every((staff) => staff.isAgreement === null || staff.isAgreement === false))) {
      type = 'active';
    } else if (item.stagesApprovalList.every((x) => x.staffApprovalList.length > 0
      && x.staffApprovalList.every((staff) => staff.isAgreement === true))) {
      type = 'success';
    }
    return { ...item.step, type };
  }

  // определение статуса шага маршрута согласования (с верной иконкой в заголовке шага)
  watch(() => props.items, () => {
    _steps.value = props.items.flatMap((x) => getStepStatus(x) ?? []);
  }, { immediate: true });

  const _dynamicSlotsNames = computed(() => props.items.flatMap((x, idx) => (x
    ? {
      name: `accordion-content-${idx + 1}`,
      idx,
      hasStep: !!x.step,
    }
    : [])));

  /**
   * Кол-во элементов будет соответствовать кол-ву stagesApprovalList на степе
   * @param slotIdx
   */
  function getCurrentSlotItems(slotIdx: number) {
    const filteredStepItems: ApprovingListApi.StageItem[] = props.items
      .filter((x) => x.stepIdx === slotIdx)
      .filter((x) => x.stagesApprovalList.length > 0)
      .flatMap((x) => x.stagesApprovalList);
    return filteredStepItems;
  }

  const _needToSyncPropsAndState = computed(() => !deepEqual(approvingRouteItems.value, props.items));
  // синхронизация пропсов и внутреннего стейта
  watch(() => props.items, () => {
    if (_needToSyncPropsAndState.value) {
      setItems(props.items);
    }
  });
  watch(approvingRouteItems, () => {
    if (_needToSyncPropsAndState.value) {
      emits('update:items', approvingRouteItems.value);
    }
  }, { deep: true });

</script>

<template>
  <div>
    <Stepper
      v-if="_accordion.length > 0"
      :accordionValues="_accordion"
      :data-testid="DataTestIds.approvingRoute"
      :isStepsClickable="false"
      isVertical
      :stepItems="_steps"
    >
      <template v-for="{ name, idx, hasStep } in _dynamicSlotsNames" #[name]>
        <FlexCol v-if="hasStep" :key="name" gap="6">
          <ApprovingRouteStep
            v-for="(item, itemIdx) in getCurrentSlotItems(idx)"
            :key="`${name}#${itemIdx}`"
            :isEdit="isEdit"
            :item="item"
            :signApi="signApi"
            :statusType="statusType"
            @onChange="changeApprovingRoute"
          />
        </FlexCol>
      </template>
    </Stepper>
  </div>
</template>
