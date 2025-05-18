import { STATUS_NAME } from '@/shared/config';

export const getFilterStatusesOptions = (): { label: string, value: string }[] => Object.keys(STATUS_NAME).map((e) => ({
  label: STATUS_NAME[e as keyof typeof STATUS_NAME],
  value: e,
}));
