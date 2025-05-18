import { getPrintFormFileQuery, getPrintFormDataQuery, PrintFormApi, downloadFileByUrl } from '@ebp/core';
import { createMutation } from '@ebp/mfe-utils';
import {
  getByExKeyQuery,
  getDataTableQuery,
  executeDataInfo,
  uploadDataXML,
  getLinksByExKeyQuery,
  sendSvapRequest,
  GetDataResponse, getJournalQuery,
} from '../base-api';
import { BASE_URLS } from '..';
import { ActionCode, ActionExecutePayload, ActionExecuteResponse, MassActionExecutePayload, Pagable } from '../types';

export const ACTIONS_IN_APPROVAL_LIST = {
  toConform: ActionCode.PREPARED_TO_HEADACCSIGN,
  toSignHeadAcc: ActionCode.HEADACCSIGN_TO_CHIEFSIGN,
  toSignChief: ActionCode.CHIEFSIGN_TO_SIGNED,
};

const SERVICE_URL = `${BASE_URLS.CBS}`;
const DATA_TABLE_URL_CASH_PP_OUT = `${SERVICE_URL}doc-cs-0005/search`;
const DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT = `${SERVICE_URL}doc-cs-0005`;
const DATA_LINKS_TABLE_BY_EX_KEY_URL = `${BASE_URLS.LINKS}search`;

export const DOC_OBJECT_CODE = 'DOC_CS_0005';
export const DOC_OBJECT_CODE_EBP = 'DOC_CASH_0188';

export const search = async <TResponse extends Pagable<object>>(
  paginationParams: Record<string, any>,
  fieldFilters: any[],
): Promise<TResponse['data']> => getDataTableQuery(DATA_TABLE_URL_CASH_PP_OUT, paginationParams, [...fieldFilters]);

export const get = async <TResponse>(
  exKey: string,
): Promise<TResponse> => getByExKeyQuery(`${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}`, exKey);

export const execute = async <TData>(
  exKey: string,
  code: string,
): Promise<GetDataResponse<TData>> => executeDataInfo(`${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}/execute/${code}`, exKey);

export const uploadXML = async <TData extends string | Blob>(
  value: TData,
): Promise<GetDataResponse<TData>> => uploadDataXML(`${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/import`, value);

export const getLinks = async <TData>(
  exKey: string,
  objectCode: string,
): Promise<TData> => getLinksByExKeyQuery(`${DATA_LINKS_TABLE_BY_EX_KEY_URL}?exKey=${exKey}&objectCode=${objectCode}`, exKey);

export const getPfData: PrintFormApi.GetPfData = async (exKey: string) => getPrintFormDataQuery({
  baseUrl: `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}`,
  exKey,
});

export const getPfFile: PrintFormApi.GetPfFile = async (params) => getPrintFormFileQuery({
  baseUrl: `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}`,
  ...params,
});

export const getXmlFile = async (
  exKey: string,
  xmlKey: string,
  xmlName: string,
) => downloadFileByUrl({
  url: `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}/xml/${xmlKey}`,
  fileName: xmlName,
  method: 'GET',
});

export const sendSVAP = async <TData>(
  exKey: string,
): Promise<GetDataResponse<TData>> => sendSvapRequest(
  `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}/execute/cs-poo-executed-to-svap`,
  exKey,
);

export function actionMutation(
  { exKey, actionCode }: { exKey: string | number, actionCode: string},
) {
  return createMutation<ActionExecutePayload, ActionExecuteResponse>({
    url: `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}/execute/${actionCode}`,
    method: 'POST',
    // invalidateQueries: [[GET_CBS_QUERY_KEY]],
  });
}

export function massActionMutation({ actionCode }: { actionCode: string}) {
  return createMutation<MassActionExecutePayload, ActionExecuteResponse[] | ActionExecuteResponse>({
    url: `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/group/execute/${actionCode}`,
    method: 'POST',
  });
}

export const searchJournal = async <TResponse extends Pagable<object>>(
  exKey: string | null | undefined,
  paginationParams: Record<string, any>,
  fieldFilters: any[],
): Promise<TResponse['data']> => getJournalQuery(`${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}/journal`, paginationParams, fieldFilters);

/// Временное решение для Экспорта
export const sentToSent = async <TData>(
  exKey: string,
): Promise<GetDataResponse<TData>> => sendSvapRequest(
  `${DATA_INFO_BY_EX_KEY_URL_CASH_PP_OUT}/${exKey}/execute/cs-poo-sentbank-to-sentbank`,
  exKey,
);
