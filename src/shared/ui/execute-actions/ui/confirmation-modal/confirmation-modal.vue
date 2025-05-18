<script setup lang="ts">
  import { Button, Modal, Textarea, FlexRow } from '@ebp/vue-ui-lib';
  import { computed, ref, watchEffect } from 'vue';
  import { useState } from '@ebp/utils';
  import { _data, ConfirmationModalSubmitPayload } from './open-confirm-modal.ts';

  const [isOpen, setIsOpen] = useState(false);

  const _form = ref<ConfirmationModalSubmitPayload>({
    comment: null,
  });

  const _disabledSubmit = computed(() => !!(_data.value?.isRequiredComment && !_form.value.comment));

  const onClose = () => {
    _data.value?.onClose?.();
    _data.value = null;
    _form.value.comment = null;
  };

  const onSubmit = () => {
    _data.value?.onSubmit(_form.value);
    _data.value = null;
    _form.value.comment = null;
  };

  watchEffect(() => {
    setIsOpen(!!_data.value);
  });

</script>

<template>
  <Modal
    v-if="isOpen"
    class="confirmation-modal"
    height="284px"
    width="560px"
    :zIndex="1500"
    @onClose="onClose"
  >
    <template #header>
      Подтвердите перевод статуса документа
    </template>
    <Textarea
      v-model="_form.comment"
      label="Комментарий к переводу статуса"
      :maxLength="1000"
      placeholder="Ввод текста"
      :required="_data?.isRequiredComment || false"
      :rows="3"
      size="small"
    />
    <template #footer>
      <FlexRow justify="sb">
        <Button variant="text" @click="onClose">
          Закрыть
        </Button>
        <Button :disabled="_disabledSubmit" @click="onSubmit">
          Перевести
        </Button>
      </FlexRow>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.confirmation-modal {
  :deep(.modal__content-body) {
    flex-grow: 1;
    overflow: hidden;
  }
}
</style>
