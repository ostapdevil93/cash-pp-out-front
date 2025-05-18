<script setup lang="ts">
  import {
    Button,
    Input,
    Drawer,
    Divider,
    SingleSelect,
    FlexCol,
    FlexRow,
    SelIcon,
    Text,
    VGrid,
    Accordion,
    Tag,
  } from '@ebp/vue-ui-lib';
  import { getFullName, getUserCookieInfo } from '@ebp/utils';
  import { computed, onBeforeMount, ref, watch } from 'vue';
  import { openDialog } from '@ebp/mfe-utils';
  import { ApprovingApi, getUserQuery } from '@ebp/core';
  import { Author, ApprovalItem, StaffApprovalItem } from '@/shared/api/index.ts';
  import { DOC_OBJECT_CODE_EBP } from '@/shared/api/info-api/info-api.ts';
  import { DocumentStatus } from '@/shared/config/statuses.ts';
  import {
    ActionToStageMap, ApprovalListItem, ApprovingUserOption, useApprovalRoute,
  } from './use-approval-route.ts';

  import { EMPTY_USER_EX_KEY, emptyUser } from './config.ts';

  const props = defineProps<{
    /** используется при массовом подписании */
    exKeys?: string[],
    exKeyNumberMap?: Map<string, string>,
    currentStatus?: string | null,
    approvalList: ApprovalListItem[],
    isOpen: boolean,
    responsibleEmployee?: Author | null,
    /** Определяем мапу действий на стадию снаружи, т.к. для разных документов она отличается */
    actionToStageMap: ActionToStageMap,
  }>();

  const emit = defineEmits<{(e: 'onClose'): void,
                            (e: 'onSaveApprovalList', data: { newApprovalList: ApprovalItem[], exKeys?: string[] | undefined }): Promise<void>,
                            (e: 'onConform', data: { newApprovalList: ApprovalItem[], exKeys?: string[] | undefined }): Promise<void>,
                            (e:'onRemoveExKey', exKey: string): void
  }>();

  const {
    getUsersForSign, approvingUsers, getRows, convertApprovalUserToApprovalListItem,
    convertApprovalListItemToApprovalUser, currentUser, getFinalResponsibleEmployee,
  } = useApprovalRoute();

  // TODO: некоторым действиям нужно будет добавить проверку на права доступа
  // const accessStore = useUserAccessStore();

  const isExKeysAccordionOpen = ref(true);

  const isMassApprovalRoute = ref(false);

  /** Инитное значение маршрута согласования (до предпринятия каких-то действий над ним) */
  const _initialApprovalList = ref<ApprovalListItem[]>([]);

  onBeforeMount(async () => {
    getFinalResponsibleEmployee(props.responsibleEmployee);
    getUsersForSign(DOC_OBJECT_CODE_EBP);
    currentUser.value = await getUserQuery();
  });

  // ======================= работа с блоком Согласование =======================
  /** Согласующие */
  function initRow(action: string): ApprovingUserOption {
    const rows = getRows(props.approvalList, action) as ApprovalListItem[];
    if (!rows?.length) return emptyUser;
    return convertApprovalListItemToApprovalUser(rows[0] as StaffApprovalItem);
  }

  /** Руководитель или уполномоченное лицо */
  const _responsibleExecutor = computed<ApprovingUserOption>(() => {
    const userCookieInfo = getUserCookieInfo();
    return approvingUsers.value?.find((user) => user.exKey === userCookieInfo.userExKey) ?? emptyUser;
  });

  /** Руководитель или уполномоченное лицо */
  const _headAccRow = ref<ApprovingUserOption>(initRow(props.actionToStageMap.toSignHeadAcc));

  /** Руководитель или уполномоченное лицо */
  const _chiefRow = ref<ApprovingUserOption>(initRow(props.actionToStageMap.toSignChief));

  // ==========================================================================

  function getApprovalItemByActionCodeToSave(actionCode: string, users: ApprovingUserOption[]) {
    const usersWithData = users.filter((user) => user.exKey !== EMPTY_USER_EX_KEY);
    return usersWithData.flatMap((user) => convertApprovalUserToApprovalListItem(actionCode, user) || []);
  }

  /** Активность кнопки Согласовать */
  const _isApprovalButtonEnabled = computed(() => _responsibleExecutor.value?.exKey
    && _headAccRow.value.exKey
    && _chiefRow.value.exKey);

  /** Получение актуального маршрута согласования (с учетом всех выбранных данных) */
  function getActualApprovalList(): ApprovalItem[] {
    const conformUser = getApprovalItemByActionCodeToSave(props.actionToStageMap.toConform, [_responsibleExecutor.value]);
    const headAccUser = getApprovalItemByActionCodeToSave(props.actionToStageMap.toSignHeadAcc, [_headAccRow.value]);
    const chiefUser = getApprovalItemByActionCodeToSave(props.actionToStageMap.toSignChief, [_chiefRow.value]);
    return [conformUser, headAccUser, chiefUser].flatMap((x) => x || []);
  }

  /** Действие на кнопку Сохранить */
  function onSave() {
    return emit('onSaveApprovalList', { newApprovalList: JSON.parse(JSON.stringify(getActualApprovalList())), exKeys: props.exKeys ?? [] });
  }

  function onConform() {
    return emit('onConform', { newApprovalList: JSON.parse(JSON.stringify(getActualApprovalList())), exKeys: props.exKeys ?? [] });
  }

  /** Инициализация значений */
  function init() {
    _initialApprovalList.value = JSON.parse(JSON.stringify(props.approvalList));
    _headAccRow.value = initRow(props.actionToStageMap.toSignHeadAcc);
    _chiefRow.value = initRow(props.actionToStageMap.toSignChief);
  }

  // todo: надо будет переделать
  const _isFormHasChanges = ref(false);

  function preCloseHandler() {
    if (_isFormHasChanges.value) {
      openDialog({
        title: 'Подтверждение закрытия',
        content: 'Изменения не сохранены. Вы хотите сохранить изменения в маршруте согласования?',
        cancelBtn: 'Не сохранять',
        submitBtn: 'Сохранить',
        onCancel: () => {
          init();
          emit('onClose');
        },
        onClose: () => {
          init();
          emit('onClose');
        },
        onSubmit: onSave,
      });
    }
    return !_isFormHasChanges.value;
  }

  watch(() => props.approvalList, () => {
    init();
  }, { immediate: true });

  onBeforeMount(() => {
    if (props.exKeys?.length) isMassApprovalRoute.value = true;
  });
</script>

<template>
  <Drawer
    v-if="isOpen"
    header="Маршрут согласования"
    :preCloseHandler="preCloseHandler"
    size="medium"
    @onClose="emit('onClose')"
  >
    <template #default>
      <FlexCol
        v-if="isMassApprovalRoute && exKeys?.length === 0"
        align="c"
        fullHeight
        justify="c"
      >
        <SelIcon
          color="blue"
          name="IconGrid64Large"
          style="width:64px;height:64px"
        />
        <Text variant="body2Long">Нет данных для отображения</Text>
      </FlexCol>
      <FlexCol v-else>
        <FlexCol v-if="exKeys?.length">
          <Accordion v-model="isExKeysAccordionOpen">
            <template #header>
              <Text variant="subtitle3">Выбранные РСКП</Text>
            </template>
            <template #content>
              <FlexRow gap="1">
                <Tag
                  v-for="key in exKeys"
                  :key="key"
                  class="approval-route__tag"
                  color="grey"
                  prependIcon="IconCloseCircle"
                  size="small"
                  :text="exKeyNumberMap?.get(key) || ''"
                  @click="emit('onRemoveExKey', key)"
                />
              </FlexRow>
            </template>
          </Accordion>
        </FlexCol>

        <FlexCol>
          <Text variant="subtitle2">Ответственный исполнитель (уполномоченное лицо)</Text>
          <VGrid
            v-if="currentStatus === DocumentStatus.PREPARED"
            cols="2"
          >
            <FlexCol fullWidth>
              <SingleSelect
                v-model="_responsibleExecutor"
                :canDeselect="false"
                label="ФИО"
                :options="approvingUsers || []"
                readonly
                returnObject
                :showClearButton="false"
                size="medium"
              >
                <template #optionTpl="{ option }: {option: ApprovingApi.ApprovingUser}">
                  {{ getFullName(option.lastName, option.firstName, option.middleName) }}
                </template>
              </SingleSelect>
            </FlexCol>
            <FlexCol fullWidth>
              <Input
                v-model="_responsibleExecutor.position"
                label="Должность"
                readonly
                size="medium"
              />
            </FlexCol>
          </VGrid>
          <Divider />
        </FlexCol>

        <FlexCol>
          <Text variant="subtitle2">Подписание глав. бухгалтером (иным уполномоченным лицом)</Text>
          <VGrid
            v-if="currentStatus === DocumentStatus.PREPARED"
            cols="2"
          >
            <FlexCol fullWidth>
              <SingleSelect
                v-model="_headAccRow"
                :canDeselect="false"
                label="ФИО"
                :options="approvingUsers || []"
                returnObject
                :showClearButton="false"
                size="medium"
              >
                <template #optionTpl="{ option }: {option: ApprovingApi.ApprovingUser}">
                  {{ getFullName(option.lastName, option.firstName, option.middleName) }}
                </template>
              </SingleSelect>
            </FlexCol>
            <FlexCol fullWidth>
              <Input
                v-model="_headAccRow.position"
                label="Должность"
                readonly
                size="medium"
              />
            </FlexCol>
          </VGrid>
          <Divider />
        </FlexCol>

        <FlexCol>
          <Text variant="subtitle2">Подписание руководителем (иным уполномоченным лицом)</Text>
          <VGrid
            v-if="currentStatus === DocumentStatus.PREPARED"
            cols="2"
          >
            <FlexCol fullWidth>
              <SingleSelect
                v-model="_chiefRow"
                :canDeselect="false"
                label="ФИО"
                :options="approvingUsers || []"
                returnObject
                :showClearButton="false"
                size="medium"
              >
                <template #optionTpl="{ option }: {option: ApprovingApi.ApprovingUser}">
                  {{ getFullName(option.lastName, option.firstName, option.middleName) }}
                </template>
              </SingleSelect>
            </FlexCol>
            <FlexCol fullWidth>
              <Input
                v-model="_chiefRow.position"
                label="Должность"
                readonly
                size="medium"
              />
            </FlexCol>
          </VGrid>
          <Divider />
        </FlexCol>
      </FlexCol>
    </template>
    <template #buttons>
      <FlexRow fullWidth justify="fe">
        <Button
          v-if="currentStatus === DocumentStatus.PREPARED"
          size="small"
          variant="outlined"
          @click="onSave"
        >
          Сохранить
        </Button>
        <Button :disabled="!_isApprovalButtonEnabled" size="small" @click="onConform">
          Согласовать
        </Button>
      </FlexRow>
    </template>
  </Drawer>
</template>

<style scoped lang="scss">
.approval-route__tag {
  cursor: pointer;
}
</style>
