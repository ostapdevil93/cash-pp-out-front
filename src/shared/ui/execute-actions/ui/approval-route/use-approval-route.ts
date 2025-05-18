import { ref } from 'vue';
import { getFullName, getUserCookieInfo } from '@ebp/utils';
import { ApprovingApi, CoreApi, getApprovingQuery, PpaUserApi, showDefaultError, showServerNotification } from '@ebp/core';
import { AxiosError } from '@ebp/mfe-utils';
import { ApprovalItem, StaffApprovalItem, StageApprovalItem, Author } from '@/shared/api/index.ts';
import { getExtendedUser } from '@/shared/api/ppa/ppa-api';

export type ApprovalListItem = ApprovalItem;

export type ActionToStageMap = {
  /** Согласование ответственным исполнителем */
  toConform: string,
  /** Подписание глав. бухгалтером */
  toSignHeadAcc: string,
  /** Подписание руководителем */
  toSignChief: string,
}

export type ApprovingUserOption = Omit<ApprovingApi.ApprovingUser, 'isHeadMain'> & CoreApi.SelectOptionPayload

function prepareUserOptions(users: ApprovingApi.ApprovingUser[]) {
  return users
    .map((x) => ({ ...x, label: getFullName(x.lastName, x.firstName, x.middleName), value: x.exKey }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function useApprovalRoute() {
  const currentUser = ref<PpaUserApi.GetUserResponse | null>(null);

  const _conformingUsers = ref<ApprovingUserOption[]>([]);
  const _approvingUsers = ref<ApprovingUserOption[]>([]);
  const _approvingUsersInfo = ref<{
    nsiOrganizationTypeCode: string,
    nsiOrganizationTypeExKey: string,
    registryOrganizationExKey: string,
    userOrganizationName: string,
    svrCode: string,
  } | null>(null);
  const _finalResponsibleEmployee = ref<ApprovingUserOption | null>(null);

  function getUsersForSign(objectCode: string) {
    const userCookieInfo = getUserCookieInfo();

    getApprovingQuery({ docTypeCode: objectCode })
      .then((res) => {
        _conformingUsers.value = prepareUserOptions(res.conformingUsers);
        _approvingUsers.value = prepareUserOptions(res.approvingUsers);
        _approvingUsersInfo.value = {
          nsiOrganizationTypeCode: userCookieInfo.nsiOrganizationTypeExKey,
          nsiOrganizationTypeExKey: userCookieInfo.nsiOrganizationTypeExKey,
          registryOrganizationExKey: userCookieInfo.registryOrganizationExKey,
          svrCode: userCookieInfo.svrOrganisationCode,
          userOrganizationName: res.orgName,
        };
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        if (err.response?.data) {
          showServerNotification(err.response.data);
        } else {
          showDefaultError();
        }
      });
  }

  function getFinalResponsibleEmployee(responsibleEmployee?: Author | null) {
    if (!responsibleEmployee?.exPpaServiceUserKey) return;
    getExtendedUser(responsibleEmployee)
      .then((res) => {
        _finalResponsibleEmployee.value = {
          exKey: res.exKey,
          firstName: res.firstName,
          lastName: res.lastName,
          middleName: res.middleName,
          position: res.position,
          label: getFullName(res.lastName, res.firstName, res.middleName),
          value: res.exKey,
        };
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        if (err.response?.data) {
          showServerNotification(err.response.data);
        } else {
          showDefaultError();
        }
      });
  }

  function getRows(data: ApprovalListItem[] | null | undefined, actionCode: string): StaffApprovalItem[] {
    const items: StaffApprovalItem[] = data
      ?.filter(
        (item: ApprovalListItem) => item.actionCode === actionCode
          && item.stagesApprovalList
          && item.stagesApprovalList.length > 0
          && item.stagesApprovalList.some(
            (stage) => stage.exPpaServiceRegistryOrganizationKey
              && stage.nsiOrganizationTypeCode
              && stage.staffApprovalList
              && stage.staffApprovalList.length > 0
              && stage.staffApprovalList.some((staff) => staff.exPpaServiceUserKey),
          ),
      )
      .flatMap((item) => {
        const stages: StageApprovalItem[] = item.stagesApprovalList || [];
        return stages;
      })
      .flatMap((item) => {
        const staff: StaffApprovalItem[] = item.staffApprovalList || [];
        return staff;
      }) as StaffApprovalItem[];

    return items;
  }

  function convertApprovalUserToApprovalListItem(
    actionCode: string,
    user: ApprovingUserOption,
  ): ApprovalListItem | undefined {
    if (!_approvingUsersInfo.value) return undefined;
    return {
      actionCode,
      isSignatureAction: false,
      stagesApprovalList: [
        {
          stageNumber: '1',
          exPpaServiceRegistryOrganizationKey: _approvingUsersInfo.value.registryOrganizationExKey,
          userOrganizationName: _approvingUsersInfo.value.userOrganizationName,
          exPpaServiceNsiOrganizationTypeKey: _approvingUsersInfo.value.nsiOrganizationTypeExKey,
          nsiOrganizationTypeCode: _approvingUsersInfo.value.nsiOrganizationTypeCode,
          organizationSvrCode: _approvingUsersInfo.value.svrCode,
          staffApprovalList: [
            {
              exPpaServiceUserKey: user.exKey,
              userLastName: user.lastName,
              userFirstName: user.firstName,
              userMiddleName: user.middleName,
              userPosition: user.position,
              isAgreement: false,
              agreementTs: null,
              signatureList: null,
            },
          ],
        },
      ],
    };
  }

  function convertApprovalListItemToApprovalUser(item: StaffApprovalItem): ApprovingUserOption {
    return {
      exKey: item?.exPpaServiceUserKey || '',
      lastName: item?.userLastName || '',
      firstName: item?.userFirstName || '',
      middleName: item?.userMiddleName || '',
      position: item?.userPosition || '',
      label: getFullName(item.userLastName, item.userFirstName, item.userMiddleName),
      value: item?.exPpaServiceUserKey || '',
    };
  }

  return {
    getUsersForSign,
    getFinalResponsibleEmployee,
    conformingUsers: _conformingUsers,
    approvingUsers: _approvingUsers,
    finalResponsibleEmployee: _finalResponsibleEmployee,
    getRows,
    convertApprovalUserToApprovalListItem,
    convertApprovalListItemToApprovalUser,
    currentUser,
  };
}
