import { StepItem } from '@ebp/vue-ui-lib';
import { ApprovingApi } from '@ebp/core';
import { StaffApprovalDto, StageApprovalDto } from '@/shared/api';

type Colors = 'grey' | 'green' | 'orange' | 'blue' | 'red' | 'yellow'

declare namespace ApprovingListApi {
  type Status = {
    color: Colors,
    text: string,
  }

  // todo тип продублирован из @ebp/sign, его надо вынести
  type SignItem = {
    signFileStoreId: string,
    statusName?: string,
    signedTs: string,
    signedTzCode: string,
    userFIO: string,
    userPosition: string,
    userOrganization: string,
    sertSerialNumber: string,
    sertIssuer: string,
    validBeginTs: string,
    validEndTs: string,
    exMchdKey: string | null,
  }

  type StepRouteInfo = {
    status: Status | null,
    date: string | null,
    canEdit: boolean,
    signFileMeta: {
      exKey: string,
      objectCode: string,
      fileStoreId: string,
      isAttachment: boolean,
      /** По этому ключу будет осуществляться запрос по получению электронной подписи */
      signFileStoreId: string,
    } | null,
    signItems: SignItem[],
    actionCode: string | null,
    hasPhone?: boolean,
  }

  type StaffItem = StaffApprovalDto

  type StageItem = Omit<StageApprovalDto, 'staffApprovalList'> & {
    staffApprovalList: StaffApprovalDto[],
    routeInfo: StepRouteInfo,
  }

  type RouteItem = {
    /** Шаг в табе соответствует элементу с нужным actionCode */
    step?: StepItem | null,
    stepIdx: number,
    actionCode: string | null,
    isSignatureAction?: boolean,
    stagesApprovalList: ApprovingListApi.StageItem[],
  }

  type ApprovingUserOption = ApprovingApi.ApprovingUser & {
    label: string,
    value: string,
  }
}

export type { ApprovingListApi };
