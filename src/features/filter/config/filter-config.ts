import { type ActiveFilterConfig } from '@ebp/vue-ui-lib';
import { GetUrlQueryStringConfig } from '@ebp/utils';
import { AppFilterVocabulary } from '../vocabulary';
import { OrderFilterKey, FilterType } from '../types';

export const filterConfig: ActiveFilterConfig<FilterType> = [
  { key: OrderFilterKey.docNumber, type: 'INPUT', label: AppFilterVocabulary.docNumber },
  { key: OrderFilterKey.docDateFrom, type: 'DATE', label: AppFilterVocabulary.dataPeriod },
  { key: OrderFilterKey.docDateTo, type: 'DATE', label: AppFilterVocabulary.dataPeriod },
  { key: OrderFilterKey.createdTsFrom, type: 'DATE', label: AppFilterVocabulary.createdTs },
  { key: OrderFilterKey.createdTsTo, type: 'DATE', label: AppFilterVocabulary.createdTs },
  { key: OrderFilterKey.amount, type: 'INPUT', label: AppFilterVocabulary.amount },
  { key: OrderFilterKey.docType, type: 'INPUT', label: AppFilterVocabulary.docType },
  { key: OrderFilterKey.recipientInn, type: 'INPUT', label: AppFilterVocabulary.recipientInn },
  { key: OrderFilterKey.recipientKpp, type: 'INPUT', label: AppFilterVocabulary.recipientKpp },
  { key: OrderFilterKey.recipientPersonalAccount, type: 'INPUT', label: AppFilterVocabulary.recipientPersonalAccount },
  { key: OrderFilterKey.recipientName, type: 'INPUT', label: AppFilterVocabulary.recipientName },
  { key: OrderFilterKey.recipientBankAccount, type: 'INPUT', label: AppFilterVocabulary.recipientBankAccount },
  { key: OrderFilterKey.recipientBankName, type: 'INPUT', label: AppFilterVocabulary.recipientBankName },
  { key: OrderFilterKey.payerInn, type: 'INPUT', label: AppFilterVocabulary.payerInn },
  { key: OrderFilterKey.payerKpp, type: 'INPUT', label: AppFilterVocabulary.payerKpp },
  { key: OrderFilterKey.payerPersonalAccount, type: 'INPUT', label: AppFilterVocabulary.payerPersonalAccount },
  { key: OrderFilterKey.payerName, type: 'INPUT', label: AppFilterVocabulary.payerName },
  { key: OrderFilterKey.payerBankAccount, type: 'INPUT', label: AppFilterVocabulary.payerBankAccount },
  { key: OrderFilterKey.payerBankName, type: 'INPUT', label: AppFilterVocabulary.payerBankName },
  { key: OrderFilterKey.primaryDocCode, type: 'MULTIPLE_SELECT', label: AppFilterVocabulary.primaryDocCode },
  { key: OrderFilterKey.code, type: 'MULTIPLE_SELECT', label: AppFilterVocabulary.code },
  { key: OrderFilterKey.typeOfOperation, type: 'MULTIPLE_SELECT', label: AppFilterVocabulary.typeOfOperation },
  { key: OrderFilterKey.status, type: 'MULTIPLE_SELECT', label: AppFilterVocabulary.status },
];

export const URL_CONFIG: GetUrlQueryStringConfig = { fields: { clientExKey: { include: ['label', 'value'] } } };
