import { ApiResponse } from '@ebp/process-status';
import { AxiosError } from '@ebp/mfe-utils';
import { useToggle } from '@ebp/utils';
import { CoreApi, showServerNotification } from '@ebp/core';
import { cancelActionQuery, completeActionQuery, getActionStatusQuery } from '@/shared/api';
import { DOC_OBJECT_CODE } from '@/shared/api/info-api/info-api.ts';

type Params = {
  exKey: string,
  exProcessKey: string,
}

/**
 * Обработка статусов в процессе подписания
 *
 * Вынесено отдельно на случай, если при переносе в другой МФЕ обработка статусов вестись не должна
 */
export function useSignStatus(opts: {onClose: () => void}) {
  const processStatusModal = useToggle(false);

  /** Отмена процесса подписания */
  async function cancelSign(params: Params) {
    await cancelActionQuery({
      exKey: params.exKey,
      exProcessKey: params.exProcessKey,
      objectCode: DOC_OBJECT_CODE,
    })
      .catch(() => {});
    opts.onClose();
  }

  /** Получение статуса процесса */
  async function getProcessStatus(params: Params) {
    return getActionStatusQuery({
      exKey: params.exKey,
      exProcessKey: params.exProcessKey,
      objectCode: DOC_OBJECT_CODE,
    })
      .then((resp) => {
        if (resp.details.processStatus && resp.details.description) {
          const res: ApiResponse = {
            notification: {
              text: resp.details.notification?.text,
              header: resp.details.notification?.header,
              notificationType: resp.details.notification?.notificationType,
            },
            processStatus: resp.details.processStatus,
            description: resp.details.description,
          };

          return res;
        }
        return null;
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
    await completeActionQuery({
      exKey: params.exKey,
      exProcessKey: params.exProcessKey,
      objectCode: DOC_OBJECT_CODE,
    })
      .then(() => processStatusModal.onOpen())
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
