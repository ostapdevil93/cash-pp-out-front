<script setup lang="ts">
  import { FlexRow, VDrawer, VGrid, VUpload, Button } from '@ebp/vue-ui-lib';
  import { ref } from 'vue';
  import { AxiosError } from '@ebp/mfe-utils';
  import { showServerNotification } from '@ebp/core';
  import { notifyDefaultError } from '@/shared/lib';
  import { uploadXML } from '@/shared/api/info-api';

  const emit = defineEmits<{(e: 'onClose', isOpen: boolean): void }>();
  const allowedExtensions = ['.xml'];
  const uploadInfo = 'Максимальный размер файла 50 МБ.';
  const uploadData = ref<File[] | null>(null);
  const uploadError = ref('');

  const upload = async () => {
    try {
      if (!uploadData.value) return;
      const response = await uploadXML<Blob>(uploadData.value[0]);
      showServerNotification(response);
    } catch (e: unknown) {
      const _e = e as AxiosError;
      notifyDefaultError(e);
      uploadError.value = _e?.message;
    } finally {
      if (!uploadError.value) {
        emit('onClose', false);
      }
    }
  };
</script>

<template>
  <VDrawer
    header="Импорт"
    open
    @close="emit('onClose', false)"
  >
    <FlexRow direction="col" gap="4">
      <VGrid>
        <VUpload
          v-model="uploadData"
          :allowedExtensions="allowedExtensions"
          :bottomHint="uploadInfo"
          :errorMessages="uploadError"
          :hasError="!!uploadError.length"
          :maxFileSize="51200"
          :maxFilesCount="1"
          :multiple="false"
          size="large"
        />
      </VGrid>
    </FlexRow>
    <template #footer="{ close }">
      <FlexRow
        fullWidth
        gap="4"
        justify="c"
      >
        <Button
          size="small"
          variant="text"
          @click="close"
        >
          Отменить
        </Button>
        <Button
          :disabled="!uploadData"
          size="small"
          @click="upload()"
        >
          Загрузить
        </Button>
      </FlexRow>
    </template>
  </VDrawer>
</template>

<style scoped lang="scss">

</style>
