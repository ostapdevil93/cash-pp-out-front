import { createMutation, createQuery } from '@ebp/mfe-utils';
import { CoreApi } from '@ebp/core';
import { BASE_URLS } from '../base-urls.ts';
import { ExKeyWithObjectCode, ResponseDataOrErrorWithDetails, ResponseDataWithDetails, CommonData, ExecutionKey } from '../types/types.ts';
import { ProcessControllerStatus } from './types.ts';

type Params = {
  exKey: string,
  exProcessKey : string,
  objectCode: string,
}

export const DATA_INFO_BY_EX_KEY_URL = `${BASE_URLS.CBS}doc-cs-0001`;

const GET_ACTION_STATUS_QUERY_KEY = 'getActionStatus';
const CREATE_ACTION_PROCESS_QUERY_KEY = 'createActionProcess';

export async function completeActionQuery({ exKey, exProcessKey, objectCode }: Params) {
  return createMutation<{objectCode: string, exKey: string, exProcessKey: string}, CoreApi.SearchResponse<CommonData>>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/${exKey}/process/${exProcessKey}/complete`,
    method: 'POST',
    invalidateQueries: [[GET_ACTION_STATUS_QUERY_KEY]],
  })({ objectCode, exKey, exProcessKey });
}

export async function cancelActionQuery({ exKey, exProcessKey, objectCode }: Params) {
  return createMutation<{objectCode: string, exKey: string, exProcessKey: string}, string>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/${exKey}/process/${exProcessKey}/cancel`,
    method: 'POST',
    invalidateQueries: [[GET_ACTION_STATUS_QUERY_KEY]],
  })({ objectCode, exKey, exProcessKey });
}

export async function getActionStatusQuery({ exKey, exProcessKey, objectCode }: Params) {
  return createQuery<{objectCode: string, exKey: string, exProcessKey: string}, ProcessControllerStatus>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/${exKey}/process/${exProcessKey}/status`,
    method: 'POST',
    queryKey: [GET_ACTION_STATUS_QUERY_KEY, { exKey, exProcessKey }],
    data: { objectCode, exKey, exProcessKey },
  });
}

export async function createActionProcess({ exKey }: Omit<Params, 'exProcessKey'>) {
  return createMutation < {}, ResponseDataWithDetails<ExKeyWithObjectCode>>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/${exKey}/process`,
    method: 'POST',
    invalidateQueries: [[CREATE_ACTION_PROCESS_QUERY_KEY]],
  })({});
}

export async function getActionProcess({ exKey }: Omit<Params, 'exProcessKey'>) {
  return createQuery<{}, ResponseDataWithDetails<ExKeyWithObjectCode>>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/${exKey}/process`,
    queryKey: [GET_ACTION_STATUS_QUERY_KEY, { exKey }],
  });
}

/** Mass actions */

type MassActionsParams = {
  executionKeys: ExecutionKey[],
}

export async function completeMassActionsQuery({ executionKeys }: MassActionsParams) {
  return createMutation<{}, ResponseDataWithDetails<ResponseDataOrErrorWithDetails<CommonData>[]>>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/group/process/complete`,
    method: 'POST',
    invalidateQueries: [[GET_ACTION_STATUS_QUERY_KEY]],
  })({ data: executionKeys });
}

export async function cancelMassActionsQuery({ executionKeys }: MassActionsParams) {
  return createMutation<{}, ResponseDataWithDetails<ResponseDataWithDetails<CommonData>[]>>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/group/process/cancel`,
    method: 'POST',
    invalidateQueries: [[GET_ACTION_STATUS_QUERY_KEY]],
  })({ data: executionKeys });
}

export async function getMassActionsStatusQuery({ executionKeys }: MassActionsParams) {
  return createMutation<{}, ResponseDataWithDetails<ProcessControllerStatus[]>>({
    url: `${DATA_INFO_BY_EX_KEY_URL}/group/process/status`,
    method: 'POST',
    invalidateQueries: [[GET_ACTION_STATUS_QUERY_KEY]],
  })({ data: executionKeys });
}
