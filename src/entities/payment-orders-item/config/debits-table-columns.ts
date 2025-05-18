import {
  ColumnDefinition,
  DateTimeFormatter,
  FormatterParams,
  LinkFormatter,
  LongTextFormatter,
  ContextMenuFormatter,
  MoneyFormatter,
} from '@ebp/vue-ui-lib';
import { Router } from 'vue-router';
import { _paths } from '@/shared/config';
import { PaymentOrderKey, PaymentOrdersVocabulary } from '../types';
import { paymentStatusNameFormatter } from '../formatters';

interface DebitsTableColumns extends ColumnDefinition {
  formatterParams?: FormatterParams & {items?: any[]},
}

export const getDebitsTableColumns = (router: Router, contextMenuItems: Array<Record<string, any>> = []) => [
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.docNumber],
    field: PaymentOrderKey.docNumber,
    tooltip: () => '',
    formatter: (cell) => LinkFormatter({
      to: { path: _paths.DEBITS_FORM, params: { exKey: (cell.getData() as Record<string, any>).exKey } },
      text: (cell.getData() as Record<string, any>).docNumber,
      router,
    }),
    width: 150,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.docDate],
    field: PaymentOrderKey.docDate,
    width: 110,
    formatter: DateTimeFormatter,
    formatterParams: {
      inputFormat: 'iso',
      outputFormat: 'dd.MM.yyyy',
    },
    minWidth: 100,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.createdTs],
    field: PaymentOrderKey.createdTs,
    width: 200,
    formatter: DateTimeFormatter,
    formatterParams: {
      inputFormat: 'iso',
      outputFormat: 'dd.MM.yyyy HH:mm:ss \'(МСК +0)\'',
    },
    minWidth: 200,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.currentStatus],
    field: PaymentOrderKey.status,
    formatter: paymentStatusNameFormatter,
    width: 175,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.docType],
    field: PaymentOrderKey.docType,
    formatter: (cell) => {
      const data = cell.getData() as Record<string, any>;
      return data.docType === 'ЭДИ' ? 'Исходящий' : data.docType;
    },
    width: 110,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.edType],
    field: PaymentOrderKey.edType,
    width: 100,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.amount],
    field: PaymentOrderKey.amount,
    formatter: MoneyFormatter({ maxDots: 2, minDots: 2, separator: '.' }),
    hozAlign: 'right',
    width: 150,
  },
  {
    title: PaymentOrdersVocabulary[PaymentOrderKey.typeOfOperation],
    field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.paymentInfo}.${PaymentOrderKey.typeOfOperation}`,
    width: 100,
  },
  {
    title: 'Реквизиты плательщика',
    headerHozAlign: 'center',
    columns: [
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.payerInn],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.payer}.${PaymentOrderKey.payerInn}`,
        width: 150,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.payerKpp],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.payer}.${PaymentOrderKey.payerKpp}`,
        width: 120,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.payerName],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.payer}.${PaymentOrderKey.payerName}`,
        formatter: LongTextFormatter,
        width: 300,
      },
    ],
  },
  {
    title: 'Реквизиты банка плательщика',
    headerHozAlign: 'center',
    columns: [
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.payerBankAccount],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.payerBankDetails}.${PaymentOrderKey.payerBankAccount}`,
        width: 210,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.payerBik],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.payerBankDetails}.${PaymentOrderKey.payerBik}`,
        width: 130,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.payerBankName],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.payerBankDetails}.${PaymentOrderKey.payerBankName}`,
        formatter: LongTextFormatter,
        width: 200,
      },
    ],
  },
  {
    title: 'Реквизиты получателя',
    headerHozAlign: 'center',
    columns: [
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.recipientInn],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.recipient}.${PaymentOrderKey.recipientInn}`,
        width: 150,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.recipientKpp],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.recipient}.${PaymentOrderKey.recipientKpp}`,
        width: 120,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.recipientName],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.recipient}.${PaymentOrderKey.recipientName}`,
        formatter: LongTextFormatter,
        width: 300,
      },
    ],
  },
  {
    title: 'Реквизиты банка получателя',
    headerHozAlign: 'center',
    columns: [
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.recipientBankAccount],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.recipientBankDetails}.${PaymentOrderKey.recipientBankAccount}`,
        width: 210,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.recipientBik],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.recipientBankDetails}.${PaymentOrderKey.recipientBik}`,
        width: 130,
      },
      {
        title: PaymentOrdersVocabulary[PaymentOrderKey.recipientBankName],
        field: `${PaymentOrderKey.paymentOrder}.${PaymentOrderKey.recipientBankDetails}.${PaymentOrderKey.recipientBankName}`,
        formatter: LongTextFormatter,
        width: 200,
      },
    ],
  },
  {
    title: '',
    formatter: ContextMenuFormatter,
    formatterParams: {
      items: contextMenuItems,
    },
    frozen: true,
    headerSort: false,
    width: 50,
  },

] as DebitsTableColumns[];
