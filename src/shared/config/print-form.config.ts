import { PrintFormAdapter, PrintFormApi } from '@ebp/core';
import { getPfData, getPfFile } from '../api/info-api';

export const PRINT_FORM_TRIGGER = {
  DOC_CS_0005: 'DOC_CS_0005',
};

type PrintFormTriggerValues = typeof PRINT_FORM_TRIGGER[keyof typeof PRINT_FORM_TRIGGER];

const PRINT_FORM_API_MAP: PrintFormApi.ApiMap<PrintFormTriggerValues> = new Map([
  [PRINT_FORM_TRIGGER.DOC_CS_0005, {
    getPfData: async (item: { exKey: string }) => getPfData(item.exKey),
    getPfFile,
  }],
]);

export const printFormAdapter = new PrintFormAdapter<PrintFormTriggerValues>({
  apiMap: PRINT_FORM_API_MAP,
});
