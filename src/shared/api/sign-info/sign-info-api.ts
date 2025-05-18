import { createQuery } from '@ebp/mfe-utils';
import { SignDocumentPayload } from '@ebp/sign';
import { BASE_URLS } from '../base-urls.ts';

const url = `${BASE_URLS.CBS}sign-info`;

const CBS_GET_SIGN_INFO_DATA = 'cbs_get_sign_info_data';

export async function getSignInfoQueryNew(params: { exKeys: string [], objectCode: string }) {
  return createQuery<typeof params, {data: SignDocumentPayload['data']}>({
    url,
    method: 'POST',
    queryKey: CBS_GET_SIGN_INFO_DATA,
    data: params,
  });
}
