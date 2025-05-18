import { StatusColors } from '@ebp/vue-ui-lib';
import { PrintFormApi } from '@ebp/core';
import { AutoControlApi } from '@ebp/auto-monitoring-results';
import { DocumentStatus } from '@/shared/config';
import { Action, ActionCode, ActionType, ApprovalListItemDto } from '@/shared/api/types';
import { PaymentOrderKey } from '../types';

export type Payer = {
  [PaymentOrderKey.payerInn]: string,
  [PaymentOrderKey.payerKpp]: string,
  [PaymentOrderKey.payerName]: string,
  [PaymentOrderKey.payerPersonalAccount]: string,
  [PaymentOrderKey.payerOrgName]: string,
  [PaymentOrderKey.payerRegistryCode]: string,
  [PaymentOrderKey.payerCardNumber]: string,
  [PaymentOrderKey.payerBudgetCode]: string,
  [PaymentOrderKey.payerBudgetType]: string,
  [PaymentOrderKey.payerOktmoPpo]: string,
  [PaymentOrderKey.payerServiceTofkCode]: string,
  [PaymentOrderKey.accountCode]: string,
  [PaymentOrderKey.accountingCs]: string,
}

export type PayerBankDetails = {
  [PaymentOrderKey.payerBankAccount]: string,
  [PaymentOrderKey.payerBik]: string,
  [PaymentOrderKey.payerBankName]: string,
  [PaymentOrderKey.payerCorBankAccount]: string,
  [PaymentOrderKey.payerOrderNumber]: string,
  [PaymentOrderKey.payerOrderDate]: string,
}

export type Recipient = {
  [PaymentOrderKey.recipientName]: string,
  [PaymentOrderKey.recipientInn]: string,
  [PaymentOrderKey.recipientKpp]: string,
  [PaymentOrderKey.recipientPersonalAccount]: string,
  [PaymentOrderKey.recipientRegistryCode]: string,
  [PaymentOrderKey.recipientBudgetCode]: string,
  [PaymentOrderKey.recipientBudgetType]: string,
  [PaymentOrderKey.recipientOktmoPpo]: string,
  [PaymentOrderKey.recipientServiceTofkCode]: string,
}

export type RecipientBankDetails = {
  [PaymentOrderKey.recipientBankAccount]: string,
  [PaymentOrderKey.recipientBik]: string,
  [PaymentOrderKey.recipientBankName]: string,
  [PaymentOrderKey.recipientCorBankAccount]: string,
}

export type PaymentInfo = {
  [PaymentOrderKey.typeOfOperation]: string,
  [PaymentOrderKey.paymentPriority]: string,
  [PaymentOrderKey.paymentPurpose]: string,
  [PaymentOrderKey.code]: string,
  [PaymentOrderKey.receiptDate]: string,
  [PaymentOrderKey.putInFileDate]: string,
  [PaymentOrderKey.writtenOffDate]: string,
  [PaymentOrderKey.paymentTerm]: string,
  [PaymentOrderKey.paymentSource]: string,
}

export type TaxPayments = {
  [PaymentOrderKey.payerStatus]: string,
  [PaymentOrderKey.kbk]: string,
  [PaymentOrderKey.oktmoCode]: string,
  [PaymentOrderKey.paymentPurpose]: string,
  [PaymentOrderKey.taxPeriod]: string,
  [PaymentOrderKey.taxDocNumber]: string,
  [PaymentOrderKey.taxDocDate]: string,
  [PaymentOrderKey.payoutCode]: string,
  [PaymentOrderKey.reserveField]: string,
  [PaymentOrderKey.taxPurposeOfPayment]: string,
}

export type AdditionalInformation = {
  [PaymentOrderKey.fundsTypeCode]: string,
  [PaymentOrderKey.primaryDocCode]: string,
  [PaymentOrderKey.primaryDocShortName]: string,
  [PaymentOrderKey.primaryDocKey]: string,
  [PaymentOrderKey.primaryDocName]: string,
  [PaymentOrderKey.primaryRowKey]: string,
  [PaymentOrderKey.purposeCode]: string,
  [PaymentOrderKey.kbk]: string,
  [PaymentOrderKey.oks]: string,
}

export type OrfkMark = {
  [PaymentOrderKey.bankDate]: string,
}

export type BankLight = {
  [PaymentOrderKey.color]: StatusColors,
  [PaymentOrderKey.info]: string,
}

export interface Attachment {
  fileName: string,
  exFilestoreServiceAttachmentKey: string,
}

export type PaymentOrdersDocument = {
  [PaymentOrderKey.docSource]: string,
  [PaymentOrderKey.docNumber]: string,
  [PaymentOrderKey.docDate]: string,
  [PaymentOrderKey.amount]: number,
  [PaymentOrderKey.amountInText]: string,
  [PaymentOrderKey.docType]: string,
  [PaymentOrderKey.typeOfPayment]: string,
  [PaymentOrderKey.paymentPriority]: string,
  [PaymentOrderKey.edId]: string,
  [PaymentOrderKey.edType]: string,
  [PaymentOrderKey.docOperationType]: string,
  [PaymentOrderKey.bankLight]: BankLight,
  [PaymentOrderKey.paymentOrder]: {
    [PaymentOrderKey.payer]: Payer,
    [PaymentOrderKey.payerBankDetails]: PayerBankDetails,
    [PaymentOrderKey.recipient]: Recipient,
    [PaymentOrderKey.recipientBankDetails]: RecipientBankDetails,
    [PaymentOrderKey.paymentInfo]: PaymentInfo,
    [PaymentOrderKey.taxPayments]: TaxPayments,
    [PaymentOrderKey.additionalInformation]: AdditionalInformation,
    [PaymentOrderKey.orfkMark]: OrfkMark,
    [PaymentOrderKey.bankLight]: BankLight,
  },
  [PaymentOrderKey.attachmentList]: Attachment[],
}

export type PaymentOrdersTableItem = {
  [PaymentOrderKey.status]?: DocumentStatus,
  [PaymentOrderKey.currentStatus]?: DocumentStatus,
  [PaymentOrderKey.document]: PaymentOrdersDocument,
  [PaymentOrderKey.exKey]: string,
  [PaymentOrderKey.objectCode]: string,
  [PaymentOrderKey.systemData]: {
    createdTs: string,
    updatedTs: string,
    isSystem: boolean,
    createdBy: {
      lastName: string,
      firstName: string,
      middleName: string,
    },
    [PaymentOrderKey.printFormList]?: PrintFormApi.PrintFormListItem[],
    [PaymentOrderKey.autoControlResult]: AutoControlApi.Result | null,
  },
  [PaymentOrderKey.isBlocked]: boolean,
  [PaymentOrderKey.blockedReason]: string,
  [PaymentOrderKey.actions]: Action<ActionCode, ActionType>[],
  [PaymentOrderKey.printFormList]?: PrintFormApi.PrintFormListItem[],
  [PaymentOrderKey.approvalList]: ApprovalListItemDto[],
}

export type PaymentOrdersDocumentForTable = PaymentOrdersTableItem & PaymentOrdersDocument & {
  [PaymentOrderKey.createdTs]: string,
};
