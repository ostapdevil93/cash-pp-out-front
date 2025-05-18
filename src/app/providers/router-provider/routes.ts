import { RouteRecordRaw } from 'vue-router';
import { getRouteNames, getRoutePaths } from '@/shared/config';
import { PaymentOrdersPage } from '@/pages/base-orders';
import { PaymentDebitsPage } from '@/pages/base-debits';
import { OrderEditView } from '@/features/order-edit';
import { DebitEditView } from '@/features/debit-edit';

/**
 * Динамическое формирование роутов в зависимости от префиксов при встраивании мфе в хост
 * @param prefix - префикс передается принудительно для правильного формирования роутов в хосте
 */
export default function getRoutes(prefix: string) {
  const appPaths = getRoutePaths(prefix);
  const appNames = getRouteNames(prefix);

  return [
    {
      path: appPaths.ORDERS_LIST,
      name: appNames.ORDERS_LIST,
      component: PaymentOrdersPage,
    },
    {
      path: appPaths.ORDERS_FORM,
      name: appNames.ORDERS_FORM,
      component: OrderEditView,
    },
    {
      path: appPaths.DEBITS_LIST,
      name: appNames.DEBITS_LIST,
      component: PaymentDebitsPage,
    },
    {
      path: appPaths.DEBITS_FORM,
      name: appNames.DEBITS_FORM,
      component: DebitEditView,
    },
  ] as RouteRecordRaw[];
}

export const routes = getRoutes('');
