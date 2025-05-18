import { FilterType } from 'src/features/filter/types/filter-type.ts';

export type OptionsFlags<Type> = {
  [Property in keyof Type]?: boolean;
};

export type InfoFilterErrors = OptionsFlags<
Omit<FilterType, 'clientExKey' | 'ksDateOpen' | 'showOnlyActual'>
> & { hasError?: boolean}
