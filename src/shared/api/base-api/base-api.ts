import { createQuery, createMutation } from '@ebp/mfe-utils';
import { CoreApi } from '@ebp/core';
import { Pagable } from '../types';

export interface GetDataResponse<TResponse> {
  data: TResponse,
  details: CoreApi.DetailsPayload | null,
}

export const getDataTableQuery = async <TResponse extends Pagable<object>>(
  url: string,
  paginationParams: Record<string, any>,
  fieldFilters: any[],
): Promise<TResponse['data']> => {
  const res = await createQuery<typeof paginationParams, TResponse>({
    url,
    method: 'POST',
    data: {
      fieldFilters,
    },
    params: paginationParams,
    queryKey: `GET_DATA_TABLE_QUERY_KEY_${JSON.stringify(fieldFilters)}_${JSON.stringify(paginationParams)}`,
  });
  return res.data;
};

export const getByExKeyQuery = async <TResponse extends { data: any }>(
  url: string,
  exKey: string,
): Promise<TResponse['data']> => {
  const res = await createQuery<null, TResponse>({
    url,
    queryKey: `GET_BY_EX_KEY_QUERY_KEY_${exKey}`,
  });
  return res.data;
};

export const executeDataInfo = async <TData>(
  url: string,
  exKey: string,
): Promise<GetDataResponse<TData>> => createQuery<null, GetDataResponse<TData>>({
  url,
  method: 'POST',
  queryKey: `POST_EXECUTE_DATA_INFO_QUERY_KEY_${exKey}`,
});

export const uploadDataXML = async <TData extends string | Blob>(
  url: string,
  value: TData,
): Promise<GetDataResponse<TData>> => {
  const formData = new FormData();
  formData.append('file', value);

  return createMutation<FormData, GetDataResponse<TData>>(
    {
      url,
      method: 'POST',
    },
  )(formData);
};

export const getLinksByExKeyQuery = async <TResponse>(
  url: string,
  exKey: string,
): Promise<TResponse> => createQuery<null, TResponse>({
  url,
  queryKey: `GET_LINKS_BY_EX_KEY_QUERY_KEY_${exKey}`,
});

export const sendSvapRequest = async <TData>(
  url: string,
  exKey: string,
): Promise<GetDataResponse<TData>> => createQuery<null, GetDataResponse<TData>>({
  url,
  method: 'POST',
  queryKey: `POST_SEND_SVAP_REQUEST_QUERY_KEY_${exKey}`,
});

export const getJournalQuery = async <TResponse extends Pagable<object>>(
  url: string,
  paginationParams: Record<string, any>,
  fieldFilters: any[],
): Promise<TResponse['data']> => {
  const res = await createQuery<typeof paginationParams, TResponse>({
    url,
    method: 'GET',
    params: paginationParams,
    queryKey: `HISTORY_TABLE_QUERY_KEY_${JSON.stringify(fieldFilters)}_${JSON.stringify(paginationParams)}`,
  });
  return res.data;
};
