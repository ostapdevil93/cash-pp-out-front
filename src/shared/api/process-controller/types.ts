import { ResponseDataWithDetails, CommonData } from '../types/types.ts';

export type ProcessControllerStatus = ResponseDataWithDetails<CommonData> & {
  details: Required<ResponseDataWithDetails<CommonData>['details']> & {
    processStatus: 'COMPLETE' | 'ACTIVE' | 'ERROR',
    actionSignType?: string | null,
    description: string,
  },
}
