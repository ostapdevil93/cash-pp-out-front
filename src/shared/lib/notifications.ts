import { showServerNotification, CoreApi } from '@ebp/core';
import { AxiosError } from '@ebp/mfe-utils';

export const notifyDefaultError = (e: AxiosError<CoreApi.ErrorResponse> | unknown) => {
  const defaultError = (e as AxiosError<CoreApi.ErrorResponse>)?.response?.data?.details?.notification?.notificationType === 'error';

  if (!defaultError) {
    showServerNotification(null, { showDefaultError: true });
  } else {
    showServerNotification((e as AxiosError<CoreApi.ErrorResponse>)?.response?.data);
  }
};
