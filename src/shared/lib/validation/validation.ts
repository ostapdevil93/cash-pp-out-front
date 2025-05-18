import { getNoun } from '@ebp/utils';
import { getNestedField } from '../get-nested-field.ts';

export type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]:
  // eslint-disable-next-line no-use-before-define
  RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]:
  // eslint-disable-next-line no-use-before-define
  RecursiveKeyOfHandleValue<TObj[TKey], `['${TKey}']` | `.${TKey}`>;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<TValue, Text extends string> =
  TValue extends any[] ? Text :
    TValue extends object
      ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
      : Text;

declare namespace ValidationApi {
  interface ValidationRule {
    validator: (value: any, currentForm?: any) => boolean,
    message: string,
    key?: string,
  }

  type ValidationRules<DataType extends object> = Array<{
    field: RecursiveKeyOf<DataType>,
    rules: ValidationRule[],
  }>

  type Error = {
    field: string,
    messages: string[],
  }

  type Errors = Array<Error>
  // type Errors = Record<string, { messages: string[] }>

  type ValidateResult<DataType extends object> = {
    errors: Errors,
    isValid: boolean,
    getValidationErrors: (field: RecursiveKeyOf<DataType>) => string[],
  }
}

export type { ValidationApi };

export const getMaxLengthRule = (cnt: number): ValidationApi.ValidationRule => ({
  validator: (value: unknown) => (typeof value === 'string' ? value.length <= cnt : true),
  message: `Количество символов должно быть меньше ${cnt}`,
  key: 'maxLength',
});

export const rulesCreator = {
  /** Поле обязательно для заполнения */
  nonNull: (): ValidationApi.ValidationRule => ({
    validator: (value: unknown) => !!value,
    message: 'Обязательно для заполнения',
    key: 'notNull',
  }),
  /** Массив заполнен */
  arrayNotEmpty: (): ValidationApi.ValidationRule => ({
    validator: (value: unknown[]) => !!value.length,
    message: 'Обязательно для заполнения',
    key: 'arrayNotEmpty',
  }),
  /**
   * Провалидировать строку, у которого длина с разрешенным кол-вом символов
   *
   * Например, поле может содержать либо 8 символов, либо 12
   * @param possibleValues - возможные значения длины
   */
  lengthInPossibleValues: (possibleValues: number[]): ValidationApi.ValidationRule => {
    const symbolNounString = getNoun(possibleValues[possibleValues.length - 1], 'символ', 'символа', 'символов');
    let possibleValuesString: string;
    if (possibleValues.length > 2) {
      possibleValuesString = possibleValues.join(', ');
    } else if (possibleValues.length === 1) {
      possibleValuesString = possibleValues[0].toString();
    } else {
      possibleValuesString = `${possibleValues[0]} или ${possibleValues[1]}`;
    }
    return ({
      validator: (value: string) => (value ? possibleValues.includes(value.length) : true),
      message: `Поле может содержать ${possibleValuesString} ${symbolNounString}`,
    });
  },
  /**
   * Провалидировать строку на принадлежность диапазону
   *
   * Например, поле может содержать либо от 8 символов до 12
   * @param start - возможные значения длины
   * @param end - возможные значения длины
   */
  lengthInRange: (start: number, end: number, options?: {includeStart?: boolean, includeEnd?: boolean}): ValidationApi.ValidationRule => {
    const symbolNounString = getNoun(end, 'символ', 'символа', 'символов');
    return ({
      validator: (value: string) => {
        if (!value) return true;
        const includeStart = options?.includeStart || true;
        const includeEnd = options?.includeEnd || true;
        const startCondition = includeStart ? value.length >= start : value.length > start;
        const endCondition = includeEnd ? value.length <= end : value.length < end;
        return startCondition && endCondition;
      },
      message: `Поле может содержать от ${start} до ${end} ${symbolNounString}`,
    });
  },
  stringLength: (length: number, options?: {includeSpaces: boolean}): ValidationApi.ValidationRule => {
    const symbolNounString = getNoun(length, 'символ', 'символа', 'символов');
    return ({
      validator: (value: string) => {
        if (!value) return true;
        const valueToCheck = options?.includeSpaces ? value : value.replaceAll(' ', '');
        return valueToCheck.length === length;
      },
      message: `Поле должно содержать ${length} ${symbolNounString}`,
    });
  },
  /**
   * Проверка кол-ва знаков в десятичной части
   * @param lengthToCheck
   */
  sumValueRule: (lengthToCheck: number) => {
    const symbolNounString = getNoun(length, 'знак', 'знака', 'знаков');
    return {
      validator: (value: unknown) => {
        if (!value) return true;
        const { length } = Math.floor(+value).toString();
        return length <= lengthToCheck;
      },
      message: `Длина значения десятичной части не может превышать ${lengthToCheck} ${symbolNounString}`,
    };
  },

};

export function validate<DataType extends object>(
  form: DataType,
  rules: ValidationApi.ValidationRules<DataType>,
): ValidationApi.ValidateResult<DataType> {
  /** Правила, которые не проходят валидацию */
  const rulesWithErrors = rules.flatMap((rule) => {
    const hasErrors = rule.rules.flatMap((x) => {
      if (x.validator(getNestedField(rule.field, form), form)) return [];
      return x;
    });

    if (hasErrors.length === 0) return [];
    return {
      field: rule.field,
      rules: hasErrors,
    };
  });

  const errors: ValidationApi.Errors = rulesWithErrors.map((x) => {
    const messages = x.rules.map((rule) => rule.message);
    return {
      field: x.field,
      messages,
    };
  });
  const isValid = errors.length === 0;

  function getValidationErrors(field: string) {
    return errors.find((x) => x.field === field)?.messages || [];
  }

  return { errors, isValid, getValidationErrors };
}
