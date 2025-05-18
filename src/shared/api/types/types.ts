import { CoreApi } from '@ebp/core';

export type Pagable<T> = {
  data: {
    content: T[],
    totalElements: number,
    number: -1,
    sort: {
      empty: true,
      unsorted: true,
      sorted: true,
    },
    first: true,
    last: true,
    numberOfElements: -1,
    pageable: {
      offset: -1,
      sort: {
        empty: true,
        unsorted: true,
        sorted: true,
      },
      unpaged: true,
      pageNumber: -1,
      pageSize: -1,
      paged: true,
    },
    empty: true,

  },
}

export type CommonData = {
  exKey: string,
  objectCode: string,
}

type StatusCode = string;

export type JournalItem = {
  exEntityKey: string,
  action: {
    actionCode: string,
    actionTs: string,
    isSystem: false,
    description: string,
    actionStatusInfo: {
      statusBegin: StatusCode | null,
      statusEnd: StatusCode | null,
      comment: string | null,
    },
    userLastName: string | null,
    userFirstName: string | null,
    userMiddleName: string | null,
    userPosition: string | null,
    exPpaServiceRegistryOrganizationKey: string | null,
    exPpaServiceNsiOrganizationTypeKey: string | null,
    userOrganizationName: string | null,
    nsiOrganizationTypeCode: string | null,
    exPpaServiceUserKey: string | null,
  },
}

export type ActionExecuteResponse = {
  data: CommonData,
  details: CoreApi.DetailsPayload,
}

export type ActionExecutePayload = {
  successComment: string | null,
}

export type ExKeyWithObjectCode = {
  exKey: string,
  objectCode: string,
}

export type SuccessResponse<T> = {
  data?: T,
  details: CoreApi.DetailsPayload | null,
}

export type ErrorResponse = {
  errorCode?: string,
  details: CoreApi.DetailsPayload | null,
}

export type ResponseDataWithDetails<T> = SuccessResponse<T>

export type ResponseDataOrErrorWithDetails<T> = ErrorResponse | SuccessResponse<T>

export type MassActionExecutePayload = {exKey: string}[]

export type ExecutionKey = {
  exKey: string,
  exProcessKey: string | null,
}

export type Author = {
  exPpaServiceNsiOrganizationTypeKey?: string,
  exPpaServiceRegistryOrganizationKey?: string,
  exPpaServiceUserKey?: string,
  firstName?: string | null,
  isSystem?: boolean,
  lastName?: string | null,
  middleName?: string | null,
  nsiOrganizationTypeCode?: string,
}

export type Signature = {
  exFilestoreServiceAttachmentKey?: string | null,
  exFilestoreServiceAttachmentSignatureKey?: string | null,
  exUrdZAlInfoMchdKey?: string | null,
  exFilestoreServiceAttachmentSignatureTrustedKey?: string | null,
  signatureTs?: string,
  signatureTzCode?: string,
  signatureLastName?: string,
  signatureFirstName?: string,
  signatureMiddleName?: string,
  signatureOrganizationName?: string,
  signaturePosition?: string,
  certificate?: string,
  certificateIssued?: string,
  certificateBeginDate?: string,
  certificateEndDate?: string,
}

export type StaffApprovalItem = {
  exPpaServiceUserKey?: string,
  userLastName?: string,
  userFirstName?: string,
  userMiddleName?: string,
  userPosition?: string,
  userPhoneNumber?: string,
  isAgreement?: boolean,
  signatureList?: Signature[] | null,
  agreementTs?: string | null,
  agreementTzCode?: string | null,
}

export type StageApprovalItem = {
  stageNumber?: string | number,
  exPpaServiceRegistryOrganizationKey?: string,
  userOrganizationName?: string,
  exPpaServiceNsiOrganizationTypeKey?: string,
  organizationSvrCode?: string,
  nsiOrganizationTypeCode?: string,
  staffApprovalList?: StaffApprovalItem[],
}

export type ApprovalItem = {
  actionCode?: string,
  isSignatureAction?: boolean,
  stagesApprovalList?: StageApprovalItem[],
}

export type AttachmentListDto = {
  fileName: string,
  fileType: 'rskp' | 'docBase',
  exFilestoreServiceAttachmentKey: string,
  exFilestoreServiceAttachmentSignatureKey: string,
}

type SignatureDto = {
  exFilestoreServiceAttachmentKey?: string | null,
  exFilestoreServiceAttachmentSignatureKey?: string | null,
  exUrdZAlInfoMchdKey?: string | null,
  exFilestoreServiceAttachmentSignatureTrustedKey?: string | null,
  signatureTs?: string,
  signatureTzCode?: string,
  signatureLastName?: string,
  signatureFirstName?: string,
  signatureMiddleName?: string,
  signatureOrganizationName?: string,
  signaturePosition?: string,
  certificate?: string,
  certificateIssued?: string,
  certificateBeginDate?: string,
  certificateEndDate?: string,
}

export type StaffApprovalDto = {
  exPpaServiceUserKey: string | null,
  userLastName: string | null,
  userFirstName: string | null,
  userMiddleName: string | null,
  userPosition: string | null,
  userPhoneNumber?: string | null,
  isAgreement?: boolean | null,
  signatureList?: SignatureDto[] | null,
  agreementTs?: string | null,
  agreementTzCode?: string | null,
}

export type StageApprovalDto = {
  stageNumber: string | number | null,
  exPpaServiceRegistryOrganizationKey: string | null,
  userOrganizationName: string | null,
  exPpaServiceNsiOrganizationTypeKey: string | null,
  organizationSvrCode: string | null,
  nsiOrganizationTypeCode: string | null,
  staffApprovalList?: StaffApprovalDto[],
}

export type ApprovalListItemDto = {
  actionCode: string | null,
  role?: string,
  isSignatureAction?: boolean,
  stagesApprovalList?: StageApprovalDto[],
}

export type RefKBKVidRashodDto = {
  code: string,
  name: string,
  exKey: string,
  externalGUID: string,
  fullName: string,
  shortName: string,
  metaId: string,
  uid: string,
  parentMetaId: string,
  parentId: string,
  parentCode: string,
  parentName: string,
  budgCode: string,
  tofkCode: string,
  dateExclusion: string,
  dateInclusion: string,
  endDateActive: string,
  startDateActive: string,
}

export type ApprovingUser = {
  exKey: string,
  lastName: string,
  firstName: string,
  middleName: string,
  position: string,
  isHeadMain: boolean,
}

export type ApprovingUsersResponse = {
  docTypeCode: string,
  orgExKey: string,
  orgName: string,
  approvingUsers: ApprovingUser[],
  conformingUsers: ApprovingUser[],
  approveContUsers: ApprovingUser[],
  isController: boolean,
}

export type OptionsFlags<Type> = {
  [Property in keyof Type]?: boolean;
};
