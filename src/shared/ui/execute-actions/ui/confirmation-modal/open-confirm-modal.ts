import { ref } from 'vue';

export type ConfirmationModalSubmitPayload = {
  comment?: string | null,
}

type ConfirmationModalPayload = {
  /** Обязательность комментария */
  isRequiredComment?: boolean,
  /** Кб нажатия на кнопку Перевести */
  onSubmit: (payload: ConfirmationModalSubmitPayload) => void,
  /** Кб нажатия на кнопку Закрыть */
  onClose?: () => void,
}

export const _data = ref<ConfirmationModalPayload | null>(null);

/**
 * Открывает МО перехода статуса
 * @param payload
 */
export function openConfirmModal(payload: ConfirmationModalPayload) {
  _data.value = payload;
}
