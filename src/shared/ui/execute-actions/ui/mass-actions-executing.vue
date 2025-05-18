<script setup lang="ts">
  import { SignModal } from '@ebp/sign';
  import { defineAsyncComponent, onBeforeUnmount, ref, watch } from 'vue';
  import { ProcessStatus } from '@ebp/process-status';
  import { CoreApi, handleServerError } from '@ebp/core';
  import { AxiosError } from 'axios';
  import { Author, ApprovalItem, Action, ActionCode, ActionCodeLabels } from '@/shared/api/index.ts';
  import { DOC_OBJECT_CODE } from '@/shared/api/info-api/info-api.ts';
  import { _executionsKeys, MassActionsExecutingModel, _signData, signModal, isApprovalRouteModal } from '../model/mass-actions-executing.model.ts';
  import { useMassSignStatus } from '../model/use-mass-sign-status.ts';
  import { ActionToStageMap } from './approval-route/use-approval-route';

  const props = defineProps<{
    model: MassActionsExecutingModel,
    baseUrl: string,
    /** Соответствие стадий для маршрута согласования */
    actionToStageMap: ActionToStageMap,
    approvalList?: ApprovalItem[],
    currentStatus?: string | null,
    responsibleEmployee?: Author | null,
    saveApprovalListCb:(data:{newApprovalList: ApprovalItem[], exKeys?: string[] | undefined}) => Promise<void | boolean>
  }>();

  const emit = defineEmits<{(e: 'onCloseApprovalRoute'): void }>();

  const ApprovalRoute = defineAsyncComponent(() => import('./approval-route/approval-route.vue'));

  const isFinishSignTriggered = ref(false);

  function getSignModalAttachFormatter(params:any) {
    return `${params.api}/${params.exKey}/attachment/${params.fileStoreId}`;
  }

  function onCloseApprovalRoute(): void {
    isApprovalRouteModal.onClose();
    emit('onCloseApprovalRoute');
  }

  /** сохранение approvalList */
  async function saveApprovalList(data:{newApprovalList: ApprovalItem[], exKeys?: string[] | undefined}) {
    try {
      return props.saveApprovalListCb(data);
    } catch (e: unknown) {
      handleServerError(e as AxiosError<CoreApi.ErrorResponse>, {});
      return false;
    }
  }

  async function executeConform(data:{newApprovalList: ApprovalItem[], exKeys?: string[] | undefined}) {
    const result = await saveApprovalList(data);
    if (!result) return null;

    const action = {
      actionCode: ActionCode.HEADACCSIGN_TO_CHIEFSIGN,
      label: ActionCodeLabels[ActionCode.HEADACCSIGN_TO_CHIEFSIGN],
      actionUrl: '',
      confirmation: false,
      requiredComment: false,
      registry: false,
      priority: true,
    };

    return props.model.executeAction(action as Action, { skipOpenApprovalList: true })
      .finally(onCloseApprovalRoute);
  }

  function removeExKey(exKey: string) {
    props.model.removeExKey(exKey);
  }

  const { cancelSign, finishSign, processStatusModal, getProcessStatus } = useMassSignStatus({
    onClose: () => {
      signModal.onClose();
      _signData.value = [];
    },
  });

  function onCloseProcessStatus() {
    processStatusModal.onClose();
    props.model.refetch();
    signModal.onClose();
    _signData.value = [];
    onCloseApprovalRoute();
  }

  // обработка статуса процесса
  function onCancelSign() {
    if (isFinishSignTriggered.value) {
      signModal.onClose();
      return;
    }

    cancelSign({
      executionKeys: _executionsKeys.value,
    });
  }
  function onFinishSign() {
    isFinishSignTriggered.value = true;

    finishSign({
      executionKeys: _executionsKeys.value,
    });
  }
  function onGetProcessStatus() {
    return getProcessStatus({
      executionKeys: _executionsKeys.value,
    });
  }

  watch(signModal.isOpen, () => {
    isFinishSignTriggered.value = false;
  });

  onBeforeUnmount(() => {
    _executionsKeys.value = [];
    _signData.value = [];
    signModal.onClose();
    onCloseApprovalRoute();
  });
</script>

<template>
  <ApprovalRoute
    v-if="model && isApprovalRouteModal.isOpen.value"
    :actionToStageMap="actionToStageMap"
    :approvalList="approvalList || []"
    :currentStatus="currentStatus"
    :exKeyNumberMap="model.exKeyNumberMap"
    :exKeys="model.exKeys"
    :isOpen="isApprovalRouteModal.isOpen.value"
    :responsibleEmployee="responsibleEmployee"
    @onClose="onCloseApprovalRoute"
    @onConform="executeConform"
    @onRemoveExKey="removeExKey"
    @onSaveApprovalList="saveApprovalList"
  />
  <Teleport to="body">
    <ProcessStatus
      v-if="processStatusModal.isOpen.value"
      :api="onGetProcessStatus"
      @onClose="onCloseProcessStatus"
    />
    <SignModal
      v-if="_signData.length > 0 && signModal.isOpen.value"
      v-model:open="signModal.isOpen.value"
      :api="baseUrl"
      :attachFormatter="getSignModalAttachFormatter"
      :data="_signData"
      :objectCode="DOC_OBJECT_CODE"
      @close="onCancelSign"
      @success="onFinishSign"
    />
  </Teleport>
</template>
