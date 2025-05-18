import { ref } from 'vue';
import { getFullName } from '@ebp/utils';
import { ApprovingApi, getApprovingQuery } from '@ebp/core';
import { ApprovingListApi } from './types.ts';

const _approvingUsers = ref<ApprovingListApi.ApprovingUserOption[]>([]);
const _conformingUsers = ref<ApprovingListApi.ApprovingUserOption[]>([]);
const _approvingRouteItems = ref<ApprovingListApi.RouteItem[]>([]);

export const useApprovingRoute = () => {
  function setItems(newItems: ApprovingListApi.RouteItem[]) {
    _approvingRouteItems.value = newItems;
  }

  function selectify(x: ApprovingApi.ApprovingUser): ApprovingListApi.ApprovingUserOption {
    return {
      ...x,
      label: getFullName(x.lastName, x.firstName, x.middleName),
      value: x.exKey,
    };
  }

  /**
   * Получение перечня утверждающих и согласующих по коду типа документа
   * @param docTypeCode - код типа документа
   */
  function getApprovalsList(docTypeCode: string) {
    getApprovingQuery({ docTypeCode })
      .then((res) => {
        _approvingUsers.value = res.approvingUsers.map(selectify);
        _conformingUsers.value = res.conformingUsers.map(selectify);
      });
  }

  /**
   * По выбранному сотруднику с учетом номера стадии и кода действия добавляем его на нужную позицию в stagesApprovalList
   * @param newItem
   */
  function changeApprovingRoute(newItem: ApprovingListApi.StageItem | null) {
    _approvingRouteItems.value = _approvingRouteItems.value.map((x) => ({
      ...x,
      stagesApprovalList: x.stagesApprovalList
        .map((stage) => (
          stage.stageNumber === newItem?.stageNumber && x.actionCode === newItem.routeInfo.actionCode
            ? newItem
            : stage
        )),
    }));
  }

  return {
    setItems,
    approvingUsers: _approvingUsers,
    conformingUsers: _conformingUsers,
    approvingRouteItems: _approvingRouteItems,
    getApprovalsList,
    changeApprovingRoute,
  };
};
