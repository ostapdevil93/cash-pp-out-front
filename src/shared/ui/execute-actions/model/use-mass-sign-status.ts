import { ApiResponse } from '@ebp/process-status';
import { AxiosError } from '@ebp/mfe-utils';
import { useToggle } from '@ebp/utils';
import { CoreApi, showServerNotification } from '@ebp/core';
import { showNotification } from '@ebp/notification';
import {
  cancelMassActionsQuery,
  completeMassActionsQuery,
  getMassActionsStatusQuery,
  ExecutionKey,
} from '@/shared/api';

type Params = {
  executionKeys: ExecutionKey[],
}

/**
 * Обработка статусов в процессе подписания
 *
 * Вынесено отдельно на случай, если при переносе в другой МФЕ обработка статусов вестись не должна
 */
export function useMassSignStatus(opts: {onClose: () => void}) {
  const processStatusModal = useToggle(false);

  /** Отмена процесса подписания */
  async function cancelSign(params: Params) {
    await cancelMassActionsQuery({
      executionKeys: params.executionKeys,
    })
      .catch(() => {});
    opts.onClose();
  }

  /** Получение статуса процесса */
  async function getProcessStatus(params: Params) {
    return getMassActionsStatusQuery({
      executionKeys: params.executionKeys,
    })
      .then((resp) => {
        const activeProcessItem = resp?.data?.find((item) => item?.details?.processStatus === 'ACTIVE');
        if (activeProcessItem) {
          const res: ApiResponse = {
            notification: {
              text: activeProcessItem?.details?.notification?.text,
              header: activeProcessItem?.details.notification?.header,
              notificationType: activeProcessItem?.details?.notification?.notificationType,
            },
            processStatus: activeProcessItem?.details?.processStatus,
            description: activeProcessItem?.details?.description,
          };
          return res;
        }

        const errorProcessItems = resp?.data?.filter((item) => item?.details?.processStatus === 'ERROR');
        if (errorProcessItems?.length) {
          errorProcessItems.forEach((item) => {
            showNotification({
              header: item.details.notification?.header,
              text: item.details.notification?.text,
              notificationType: 'error',
            });
          });
        }

        const successResult: ApiResponse = {
          notification: {
            text: '',
            header: 'Обработка документов завершена',
            notificationType: 'success',
          },
          processStatus: 'COMPLETE',
          description: '',
        };
        return successResult;
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        showServerNotification(err.response?.data);
        return null;
      });
  }

  /**
   * Завершение процесса подписания (по окончании открывается МО проверки статуса)
   */
  async function finishSign(params: Params) {
    await completeMassActionsQuery({
      executionKeys: params.executionKeys,
    })
      .then((resp) => {
        resp?.data?.map((item) => {
          if ('errorCode' in item) {
            console.log(item);
            showServerNotification(item);
          }
          return null;
        });
        processStatusModal.onOpen();
      })
      .catch((err: AxiosError<CoreApi.ErrorResponse>) => {
        showServerNotification(err.response?.data);
        cancelSign(params);
        opts.onClose();
      });
  }

  return {
    cancelSign,
    finishSign,
    getProcessStatus,
    processStatusModal,
  };
}
