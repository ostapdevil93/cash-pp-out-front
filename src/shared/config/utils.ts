/**
 * Принимает объект и тип (в виде интерфейса или типа), и возвращает объект с заполненными недостающими ключами в соответствии с их типами
 */
export function replaceUndefinedWithTemplateValue<T>(obj: Partial<T>, template: T): T {
  const result: any = Array.isArray(template) ? [] : {};

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in template) {
    const templateValue = (template as any)[key];
    const objValue = (obj as any)[key];

    if (objValue === undefined || objValue === null) {
      if (Array.isArray(templateValue)) {
        result[key] = [];
      } else if (templateValue !== null && typeof templateValue === 'object') {
        result[key] = replaceUndefinedWithTemplateValue({}, templateValue);
      } else {
        result[key] = null;
      }
    } else if (
      templateValue !== null
            && typeof templateValue === 'object'
            && !Array.isArray(templateValue)
    ) {
      result[key] = replaceUndefinedWithTemplateValue(objValue, templateValue);
    } else {
      result[key] = objValue;
    }
  }

  return result;
}

export const AUTO_CONTROLS_ERROR_CODE = 422;
