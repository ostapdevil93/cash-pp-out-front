import { ref } from 'vue';
import { validate, ValidationApi } from './validation.ts';

export function useValidation<Item extends object>({ rules }: {rules: ValidationApi.ValidationRules<Item>}) {
  const _validation = ref<ValidationApi.ValidateResult<Item>>({
    errors: [],
    isValid: false,
    getValidationErrors: () => [],
  });

  function validateData(data: Item) {
    return validate(data, rules);
  }

  function clearValidation() {
    _validation.value = {
      errors: [],
      isValid: false,
      getValidationErrors: () => [],
    };
  }

  return {
    validation: _validation,
    validate: validateData,
    clearValidation,
  };
}
