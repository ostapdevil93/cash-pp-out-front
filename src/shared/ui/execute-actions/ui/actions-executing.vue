<script setup lang="ts">
  import { findByField } from '@ebp/utils';
  import { SignModal } from '@ebp/sign';
  import { defineAsyncComponent, onBeforeUnmount, unref, ref, watch } from 'vue';
  import { ProcessStatus } from '@ebp/process-status';
  import { CoreApi, handleServerError } from '@ebp/core';
  import { AxiosError } from 'axios';
  import { Author, ApprovalItem, Action } from '@/shared/api/index.ts';
  import { _exProcessKey, ActionsExecutingModel, isApprovalRouteModal, _signData, signModal } from '../model/actions-executing.model.ts';
  import ConfirmationModal from './confirmation-modal/confirmation-modal.vue';
  import { ActionToStageMap } from './approval-route/use-approval-route.ts';
  import { useSignStatus } from '../model/use-sign-status.ts';

  const props = defineProps<{
    model: ActionsExecutingModel,
    /** Соответствие стадий для маршрута согласования */
    actionToStageMap: ActionToStageMap,
    baseUrl: string,
    responsibleEmployee?: Author | null,
    approvalList?: ApprovalItem[],
    currentStatus?: string | null
    /** Callback на сохранение approvalList */
    saveApprovalListCb:(data:{newApprovalList: ApprovalItem[], exKeys?: string[] | undefined}) => Promise<void | boolean>
  }>();

  const ApprovalRoute = defineAsyncComponent(() => import('./approval-route/approval-route.vue'));

  const isFinishSignTriggered = ref(false);

  function getSignModalAttachFormatter(params:any) {
    return `${params.api}/${params.exKey}/attachment/${params.fileStoreId}`;
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
  /** Кб на выполнение действия согласования после нажатия на кнопку Согласовать */
  // eslint-disable-next-line consistent-return
  async function executeConform(data:{newApprovalList: ApprovalItem[], exKeys?: string[] | undefined}) {
    const result = await saveApprovalList(data);
    if (!result) return null;
    // создаем эту функцию снаружи, т.к. если создавать ее внутри класса и передавать в компонент - происходит потеря контекста
    const conformAction = findByField(
      unref(props.model.actions),
      'actionCode',
      props.model.purposeActions.openApprovalRoute,
    );
    return props.model.executeAction(conformAction as Action, {}, { skipOpenApprovalList: true })
      .finally(isApprovalRouteModal.onClose);
  }

  const { cancelSign, finishSign, processStatusModal, getProcessStatus } = useSignStatus({
    onClose: () => {
      signModal.onClose();
      _signData.value = [];
    },
  });

  function onCloseProcessStatus() {
    processStatusModal.onClose();
    props.model.refetch(props.model.exKey);
    signModal.onClose();
    _signData.value = [];
  }

  // обработка статуса процесса
  function onCancelSign() {
    if (isFinishSignTriggered.value) {
      signModal.onClose();
      return;
    }

    cancelSign({
      exProcessKey: _exProcessKey.value || '',
      exKey: props.model.exKey,
    });
  }
  function onFinishSign() {
    isFinishSignTriggered.value = true;
    finishSign({
      exProcessKey: _exProcessKey.value || '',
      exKey: props.model.exKey,
    });
  }
  function onGetProcessStatus() {
    return getProcessStatus({
      exProcessKey: _exProcessKey.value || '',
      exKey: props.model.exKey,
    });
  }

  watch(signModal.isOpen, () => {
    isFinishSignTriggered.value = false;
  });

  onBeforeUnmount(() => {
    _exProcessKey.value = null;
    _signData.value = [];
    signModal.onClose();
    isApprovalRouteModal.onClose();
  });
</script>

<template>
  <Teleport to="body">
    <ConfirmationModal />
  </Teleport>
  <ApprovalRoute
    v-if="model && isApprovalRouteModal.isOpen.value"
    :actionToStageMap="actionToStageMap"
    :approvalList="approvalList || []"
    :currentStatus="currentStatus"
    :isOpen="isApprovalRouteModal.isOpen.value"
    :responsibleEmployee="responsibleEmployee"
    @onClose="isApprovalRouteModal.onClose"
    @onConform="executeConform"
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
      :objectCode="_signData[0].objectCode"
      @close="onCancelSign"
      @success="onFinishSign"
    />
  </Teleport>
</template>
