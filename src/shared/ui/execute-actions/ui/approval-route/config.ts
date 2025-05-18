import { ApprovingUserOption } from './use-approval-route.ts';

export const EMPTY_USER_EX_KEY = '';

export const emptyUser: ApprovingUserOption = {
  exKey: EMPTY_USER_EX_KEY,
  lastName: '',
  firstName: '',
  middleName: '',
  position: 'Не введено',
  label: 'Не выбрано',
  value: EMPTY_USER_EX_KEY,
};
