<script setup lang="ts">
  import { Divider, FlexCol, FlexRow, Input, SingleSelect, Tag, VGrid, Button } from '@ebp/vue-ui-lib';
  import { formatDateInTimeZone, getFullName, useToggle } from '@ebp/utils';
  import { ref, watch } from 'vue';
  import { SignsDrawer } from '@ebp/sign';
  import { ApprovingListApi } from '../model/types.ts';
  import { useApprovingRoute } from '../model/use-approving-route.ts';
  import { DataTestIds } from '../config/consts.ts';

  const props = defineProps<{
    item: ApprovingListApi.StageItem,
    signApi: string,
    isEdit: boolean,
    statusType?: 'tag' | 'withDot'
  }>();

  const emits = defineEmits<{(e: 'onChange', newItem: ApprovingListApi.StageItem | null): void}>();
  const { approvingUsers } = useApprovingRoute();
  const signDrawer = useToggle(false);

  const _firstStaff = ref<ApprovingListApi.StaffItem | null>();
  const _selectValue = ref<ApprovingListApi.ApprovingUserOption | null>(null);

  watch([() => props.item, approvingUsers], () => {
    _firstStaff.value = props.item.staffApprovalList[0] || null;
    _selectValue.value = approvingUsers.value
      .find((x) => _firstStaff.value?.exPpaServiceUserKey === x.exKey) || null;
  }, { immediate: true });

  watch(_selectValue, () => {
    let staffApprovalList: ApprovingListApi.StaffItem[] = [];
    if (_selectValue.value) {
      if (_firstStaff.value?.exPpaServiceUserKey === _selectValue.value.exKey && _firstStaff.value) {
        // если выбранный сотрудник совпадает с тем, который пришел ранее с бэка, возвращаем его (чтобы не потерять заполненные поля)
        staffApprovalList = [_firstStaff.value];
      } else {
        // если выбранный сотрудник не фигурирует в ответе с бэка, формируем маппинг руками
        staffApprovalList = [{
          userLastName: _selectValue.value.lastName,
          userFirstName: _selectValue.value.firstName,
          userMiddleName: _selectValue.value.middleName,
          userPosition: _selectValue.value.position,
          exPpaServiceUserKey: _selectValue.value.exKey,
        }];
      }
    }
    emits('onChange', { ...props.item, staffApprovalList });
  });

</script>

<template>
  <FlexCol gap="4">
    <FlexRow align="c" fullWidth>
      <Tag
        v-if="item.routeInfo.status"
        class="tag"
        :color="item.routeInfo.status.color"
        :data-testid="DataTestIds.approvingRouteStatus"
        :outlined="statusType === 'withDot'"
        :text="item.routeInfo.status.text"
        :withDot="statusType === 'withDot'"
      />
      <template v-if="item.routeInfo.date">
        <Divider class="divider" />
        <div class="date" :data-testid="DataTestIds.approvingRouteDate">
          {{ formatDateInTimeZone(item.routeInfo.date, { view: 'dateTime', timeZoneCode: _firstStaff?.agreementTzCode || '' }) }}
        </div>
      </template>
      <Divider />
      <Button
        v-if="item.routeInfo.signFileMeta"
        class="detail-btn"
        :data-testid="DataTestIds.approvingRouteDetailing"
        :disabled="!item.routeInfo.signFileMeta || item?.routeInfo.signItems.length === 0"
        prependIcon="IconArchiveBook"
        size="small"
        variant="link"
        @click="() => signDrawer.onOpen()"
      >
        Детализация
      </Button>
    </FlexRow>

    <div>
      <VGrid cols="2">
        <template v-if="item.routeInfo.canEdit">
          <SingleSelect
            v-model="_selectValue"
            canDeselect
            label="ФИО сотрудника"
            optionLabel="label"
            :options="approvingUsers"
            optionValue="value"
            :readonly="!item.routeInfo.canEdit || !isEdit"
            returnObject
            size="small"
          />
          <Input
            :data-testid="DataTestIds.approvingRouteUserPosition"
            label="Должность сотрудника"
            :modelValue="_selectValue?.position || ''"
            readonly
            size="small"
          />
        </template>

        <template v-else>
          <Input
            :data-testid="DataTestIds.approvingRouteUserPosition"
            label="ФИО сотрудника"
            :modelValue="getFullName(_firstStaff?.userLastName, _firstStaff?.userFirstName, _firstStaff?.userMiddleName)"
            readonly
            size="small"
          />
          <Input
            :data-testid="DataTestIds.approvingRouteUserPosition"
            label="Должность сотрудника"
            :modelValue="_firstStaff?.userPosition || ''"
            readonly
            size="small"
          />
          <Input
            v-if="item.routeInfo.hasPhone"
            label="Телефон"
            :modelValue="_firstStaff?.userPhoneNumber || ''"
            readonly
            size="small"
          />
        </template>
      </VGrid>
      <SignsDrawer
        v-if="signDrawer.isOpen.value && item.routeInfo.signFileMeta"
        v-model:open="signDrawer.isOpen.value"
        :api="signApi"
        :fileMeta="item.routeInfo.signFileMeta"
        :signs="item.routeInfo.signItems"
        @close="signDrawer.onClose"
      />
    </div>
  </FlexCol>
</template>

<style scoped lang="scss">
.tag {
  flex-shrink: 0;
}
.divider {
  flex-shrink: 0 !important;
  flex-basis: var(--indent-size-5) !important;
}
.date {
  color: var(--primary-colors-primary-2);
  white-space: nowrap;
  font-size: 12px;
  font-weight: 400;
}
.detail-btn {
  font-size: 12px !important;
}
</style>
