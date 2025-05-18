import { RouteLocationNormalized } from 'vue-router';
import { createCheckUserAccess } from '@ebp/core';
import { useRegisterAxiosInstance, useRegisterQueryClient } from '@ebp/mfe-utils';
import { useUserAccessStore } from '../store';

export const checkUserAccess = async (to: RouteLocationNormalized) => {
  useRegisterAxiosInstance();
  useRegisterQueryClient();
  const accessStore = useUserAccessStore();
  const privilegeCodes = await accessStore.getUserAccessCodes();
  return createCheckUserAccess(privilegeCodes, to);
};
