import { defineStore } from 'pinia';
import { useState } from '@ebp/utils';
import { useUserAccess } from '@ebp/core';
import { PERMISSION_CODES, PERMISSIONS } from '../config/permissions.ts';

export const USER_ACCESS_STORE_NAME = `${import.meta.env.VITE_APP_NAME}:user-access`;

export type PermissionsKeys = keyof typeof PERMISSIONS
export type PermissionsMap = Record<PermissionsKeys, boolean>

const initialAccess = Object.keys(PERMISSIONS).reduce((res: Record<string, any>, cur: string) => {
  res[cur] = false;
  return res;
}, {}) as PermissionsMap;

export const useUserAccessStore = defineStore(USER_ACCESS_STORE_NAME, () => {
  const [access, setAccess] = useState<PermissionsMap>({ ...initialAccess });

  const { init, privilegeCodes, isInited, getUserAccessCodes, checkPermissions } = useUserAccess<PermissionsKeys>({
    menuSectionCodes: PERMISSION_CODES,
    setAccess,
    permissionsMap: PERMISSIONS,
  });

  return {
    init,
    privilegeCodes,
    isInited,
    getUserAccessCodes,
    checkPermissions,
    access,
  };
});
