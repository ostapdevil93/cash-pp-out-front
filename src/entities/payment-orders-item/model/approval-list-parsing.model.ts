import { ApprovingListApi } from '@/shared/ui/approving-list';
import { ApprovalListItemDto, StageApprovalDto } from '@/shared/api/index.ts';
import { SignStatusesMap, SignTabItemsMap, StepConfigMap, STEPS_CONFIG } from '../config/signs.ts';
import { parseSignItems } from '../lib/parse-sign-items.ts';

type Status = {color: string, title: string, code: string}

type GetRouteInfoArgs = {
  /** стадия маршрута согласования */
  stage: StageApprovalDto,
  /** код действия */
  actionCode: ApprovingListApi.RouteItem['actionCode'],
  /** Статус документа */
  docStatus: Status,
  /** Конфиг для определения статуса шага */
  config: StepConfigMap,
  exKey: string,
  objectCode: string,
}

type ParseApprovalListToRouteItemsArgs = {
  approvalList: ApprovalListItemDto[],
  docStatus: Status,
  exKey: string,
  objectCode: string,
}

export class ApprovalListParsingModel {
  /** Отсеивание элементов без требуемых exKey */
  static getAppropriateApprovalList(approvalList: ApprovalListItemDto[]): ApprovalListItemDto[] {
    return approvalList.map((approval) => ({
      ...approval,
      stagesApprovalList: approval.stagesApprovalList?.map((stage) => ({
        ...stage,
        staffApprovalList: stage.staffApprovalList?.filter((x) => !!x.exPpaServiceUserKey),
      })) || [],
    }));
  }

  /** Сбор информации для шага маршрута согласования */
  static getRouteInfo({ stage, actionCode, docStatus, config, exKey, objectCode }: GetRouteInfoArgs): ApprovingListApi.StepRouteInfo {
    const staff = stage.staffApprovalList?.[0];

    let status: ApprovingListApi.Status | null = null;
    let date: string | null = null;
    let signFileMeta: ApprovingListApi.StepRouteInfo['signFileMeta'] | null = null;
    let signItems: ApprovingListApi.SignItem[] = [];

    const parsedConfig = Array.from(config.entries());
    // заполнение статуса
    parsedConfig.forEach(([key, value]) => {
      const isAgreementMatch = staff?.isAgreement !== undefined && value.isAgreement.includes(staff.isAgreement);
      const isStatusMatch = (value.status && value.status === docStatus.code) || !value.status;

      if (isAgreementMatch && isStatusMatch) {
        status = SignStatusesMap.get(key) as unknown as ApprovingListApi.Status;
      }
    });

    if (staff) {
      if (staff.isAgreement === true) {
        date = staff.signatureList?.[0]?.signatureTs || null;
      }

      if (staff.signatureList && staff.signatureList.length > 0) {
        signFileMeta = {
          exKey,
          isAttachment: false,
          objectCode,
          fileStoreId: staff.signatureList?.[0]?.exFilestoreServiceAttachmentKey || '',
          signFileStoreId: staff.signatureList?.[0]?.exFilestoreServiceAttachmentSignatureTrustedKey || '',
        };
      }
      // берем только первую запись
      signItems = [parseSignItems(staff.signatureList)[0]];
    }

    return { status, date, signFileMeta, signItems, canEdit: false, actionCode };
  }

  /**
   * Парсинг согласующих в маршрут согласования
   */
  static parseApprovalListToRouteItems(
    { approvalList, docStatus, exKey, objectCode }: ParseApprovalListToRouteItemsArgs,
  ): ApprovingListApi.RouteItem[] {
    const preparedApprovalList = ApprovalListParsingModel.getAppropriateApprovalList(approvalList);
    const newItems: ApprovingListApi.RouteItem[] = [];
    let idx = 0;

    STEPS_CONFIG.forEach((step) => {
      const allStepsWithCurrentActionCode = preparedApprovalList
        .filter((x) => x.actionCode === step.actionCode);
      const foundedStep: ApprovalListItemDto | null = allStepsWithCurrentActionCode[0]
        ? {
          ...allStepsWithCurrentActionCode[0],
          stagesApprovalList: allStepsWithCurrentActionCode
            .flatMap((x) => (x?.stagesApprovalList ? x.stagesApprovalList : [])),
        }
        : null;

      if (foundedStep) {
        const { stagesApprovalList } = foundedStep;

        const res: ApprovingListApi.RouteItem = {
          step: foundedStep.actionCode ? SignTabItemsMap.get(foundedStep.actionCode) : null,
          stepIdx: idx,
          actionCode: foundedStep.actionCode,
          isSignatureAction: foundedStep.isSignatureAction,
          stagesApprovalList: stagesApprovalList?.map((stage) => {
            const routeInfo = ApprovalListParsingModel.getRouteInfo({
              stage,
              actionCode: foundedStep.actionCode,
              docStatus,
              config: step.statusConfig,
              exKey,
              objectCode,
            });

            const staffApprovalList = stage.staffApprovalList && stage.staffApprovalList.length > 0
              ? [stage.staffApprovalList[0]]
              : [];

            return { ...stage, routeInfo: { ...routeInfo, hasPhone: step.hasPhone }, staffApprovalList };
          }) || [],
        };
        idx++;
        newItems.push(res);
      }
    });

    return newItems;
  }
}
