import { getRoutesConfig } from '@ebp/mfe-utils';

/**
 * Внутренние пути МФЕ
 *
 * Путь не должен начинаться со слэша - он встраивается в getRoutePaths
 */
const relativePaths = {
  ORDERS_LIST: '',
  ORDERS_FORM: ':exKey?',
  DEBITS_LIST: 'debits',
  DEBITS_FORM: 'debits/:exKey',
} as const;

/**
 * Названия роутов приложения
 */
const routeNames = {
  ORDERS_LIST: 'ppout:ordersList',
  ORDERS_FORM: 'ppout:ordersForm',
  DEBITS_LIST: 'ppout:debitsList',
  DEBITS_FORM: 'ppout:debitsForm',
} as const;

export const {
  getRoutePaths,
  getRouteNames,
  _paths,
  _routeNames,
} = getRoutesConfig({ paths: relativePaths, routeNames });
