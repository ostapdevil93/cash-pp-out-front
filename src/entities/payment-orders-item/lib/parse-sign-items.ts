import { getFullName } from '@ebp/utils';
import { StaffApprovalDto } from '@/shared/api';
import { ApprovingListApi } from '@/shared/ui/approving-list';

/** Парсинг элементов списка подписей в необходимые для SignsDrawer */
export function parseSignItems(signatureList: StaffApprovalDto['signatureList']): ApprovingListApi.SignItem[] {
  return signatureList?.map((x) => ({
    signFileStoreId: x.exFilestoreServiceAttachmentSignatureTrustedKey ?? '',
    signedTs: x.signatureTs || '',
    signedTzCode: x.signatureTzCode || '',
    userFIO: getFullName(x.signatureLastName, x.signatureFirstName, x.signatureMiddleName) || '',
    exMchdKey: x?.exUrdZAlInfoMchdKey || '',
    userPosition: x.signaturePosition || '',
    userOrganization: x.signatureOrganizationName || '',
    sertSerialNumber: x.certificate || '',
    sertIssuer: x.certificateIssued || '',
    validBeginTs: x.certificateBeginDate || '',
    validEndTs: x.certificateEndDate || '',
  })) || [];
}
