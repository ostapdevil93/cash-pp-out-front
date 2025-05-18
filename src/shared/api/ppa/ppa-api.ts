import { createQuery } from '@ebp/mfe-utils';
import { BASE_URLS } from '../base-urls';
import { PpaApi } from './types';
import { Author } from '../types';

const USER_PPA_QUERY_KEY = 'user_extended';

export async function getExtendedUser(finalResponsibleEmployee: Author) {
  return createQuery<Record<string, any>, PpaApi.UserExtendedResponse>({
    url: `${BASE_URLS.PPA}user/extended`,
    method: 'POST',
    queryKey: USER_PPA_QUERY_KEY,
    data: {
      userExKey: finalResponsibleEmployee.exPpaServiceUserKey,
      nsiOrganizationTypeExKey: finalResponsibleEmployee.exPpaServiceNsiOrganizationTypeKey,
      nsiOrganizationTypeCode: finalResponsibleEmployee.nsiOrganizationTypeCode,
    },
  });
}
