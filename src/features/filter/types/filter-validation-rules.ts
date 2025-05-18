import type { FilterType } from 'src/features/filter/types/filter-type.ts';

type ValidationRules<Type> = {
  [Property in keyof Type]?: {
    mask?: string,
    maskTokens?: {[s: string]: any},
    validator?: (val: string | null) => boolean,
  };
};

export type FilterValidationRules = ValidationRules<FilterType>
