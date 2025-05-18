import { CellComponent, StatusFormatter, UniversalFormatter } from '@ebp/vue-ui-lib';
import { h } from 'vue';
import { DocumentStatus, STATUS_COLOR, STATUS_NAME } from '@/shared/config';
import { PaymentOrdersDocumentForTable } from '../model';

export const paymentStatusFormatter = (cell: CellComponent) => {
  const data = cell.getRow().getData() as Partial<PaymentOrdersDocumentForTable>;
  if (!data.paymentOrder?.bankLight) {
    return UniversalFormatter(h(StatusFormatter, {
      title: STATUS_NAME[DocumentStatus.DRAFT],
      color: STATUS_COLOR.DRAFT,
    }));
  }
  return UniversalFormatter(h(StatusFormatter, {
    title: data.paymentOrder?.bankLight.info,
    color: data.paymentOrder?.bankLight.color,
  }));
};

export const paymentStatusNameFormatter = (cell: CellComponent) => {
  const data = cell.getRow().getData() as Partial<PaymentOrdersDocumentForTable>;
  if (!data.status) {
    return STATUS_NAME[DocumentStatus.DRAFT];
  }
  return STATUS_NAME[data.status];
};
