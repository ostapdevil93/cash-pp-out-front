import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AutoControlApi } from '@ebp/auto-monitoring-results';
import { EventLogApi } from '@ebp/core';
import { DocumentStatus, replaceUndefinedWithTemplateValue, STATUS_NAME } from '@/shared/config';
import { ActionCode, ActionType } from '@/shared/api/types/actions';
import { Action, ApprovalListItemDto, JournalItem, OptionsFlags, Pagable } from '@/shared/api/types';
import { get, searchJournal } from '@/shared/api/info-api';
import { notifyDefaultError } from '@/shared/lib';
import { ApprovingListApi } from '@/shared/ui/approving-list';
import { PaymentOrdersTableItem, PaymentOrdersDocument, Recipient, PaymentInfo } from './payment-orders-table-item';
import { PaymentOrderKey } from '../types/payment-orders-table-key';
import { paymentOrdersItemTemplate } from '../templates/payment-orders-item-template';
import {
  validationRule,
  fieldNamesToValidate,
  fieldRecipientToValidate,
  fieldPaymentInfoToValidate,
} from '../config/debits-validation-rules';
import { ApprovalListParsingModel } from './approval-list-parsing.model';
import { PAYMENTS_FORM_TABS } from '../config/payments-tabs';

export type NullableItem<T> = { [P in keyof T]: T[P] extends object ? NullableItem<T[P]> : T[P] | null };

export const usePaymentItemStore = defineStore('paymentItemStore', () => {
  const data = ref<NullableItem<PaymentOrdersTableItem>>();
  const isEditMode = ref(false);
  const isInCreateMode = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const autoControlResult = ref<AutoControlApi.Result | null>(null);
  const isAutoControlModalOpen = ref<boolean>(false);

  const actions = computed(() => (data.value?.actions as Action<ActionCode, ActionType>[] | null) ?? []);

  const document = computed<NullableItem<PaymentOrdersDocument> | undefined>(() => data.value?.document);
  const systemData = computed(() => data.value?.systemData);
  const payer = computed(() => document.value?.paymentOrder.payer);
  const payerBankDetails = computed(() => document.value?.paymentOrder.payerBankDetails);
  const recipient = computed(() => document.value?.paymentOrder.recipient);
  const recipientBankDetails = computed(() => document.value?.paymentOrder.recipientBankDetails);
  const paymentInfo = computed(() => document.value?.paymentOrder.paymentInfo);
  const taxPayments = computed(() => document.value?.paymentOrder.taxPayments);
  const additionalInformation = computed(() => document.value?.paymentOrder.additionalInformation);
  const orfkMark = computed(() => document.value?.paymentOrder.orfkMark);
  const printFormList = computed(() => data.value!.systemData.printFormList || []);
  const approvalList = ref<ApprovingListApi.RouteItem[]>([]);
  const shownTabs = computed(() => (approvalList.value.length === 0 ? PAYMENTS_FORM_TABS.filter((tab) => tab.value !== 'signs') : PAYMENTS_FORM_TABS));

  const currentErrors = computed(() => {
    const errors: OptionsFlags<PaymentOrdersDocument> & { hasError?: boolean } = {};
    if (!document.value) {
      return errors;
    }
    fieldNamesToValidate.forEach((key: PaymentOrderKey) => {
      const currentValue = (document.value as NullableItem<PaymentOrdersDocument>)[key as keyof PaymentOrdersDocument] as string | null;
      const currentRule = validationRule(key);
      if (currentRule?.validator) {
        errors[key as keyof PaymentOrdersDocument] = !currentRule.validator(currentValue);
      }
    });
    return errors;
  });

  const currentRecipientErrors = computed(() => {
    const errors: OptionsFlags<Recipient> & { hasError?: boolean } = {};
    if (!recipient.value) {
      return errors;
    }
    fieldRecipientToValidate.forEach((key: PaymentOrderKey) => {
      const currentValue = (recipient.value as NullableItem<Recipient>)[key as keyof Recipient] as string | null;
      const currentRule = validationRule(key);
      if (currentRule?.validator) {
        errors[key as keyof Recipient] = !currentRule.validator(currentValue);
      }
    });
    return errors;
  });

  const currentPaymentInfoErrors = computed(() => {
    const errors: OptionsFlags<PaymentInfo> & { hasError?: boolean } = {};
    if (!paymentInfo.value) {
      return errors;
    }
    fieldPaymentInfoToValidate.forEach((key: PaymentOrderKey) => {
      const currentValue = (paymentInfo.value as NullableItem<PaymentInfo>)[key as keyof PaymentInfo] as string | null;
      const currentRule = validationRule(key);
      if (currentRule?.validator) {
        errors[key as keyof PaymentInfo] = !currentRule.validator(currentValue);
      }
    });
    return errors;
  });

  const hasFormErrors = computed(() => Object.values(currentErrors.value).includes(true)
      || Object.values(currentPaymentInfoErrors.value).includes(true)
      || Object.values(currentRecipientErrors.value).includes(true));

  const getEventLogData: EventLogApi.GetEventLogData = ({ paginationParams }) => searchJournal<Pagable<JournalItem>>(
    data.value?.exKey,
    paginationParams,
    [],
  ).then((response) => ({
    items: response.content.map((item) => {
      const newItem: EventLogApi.Item = {
        ...item,
        exKey: item.exEntityKey,
        action: {
          ...item.action,
          actionTzCode: '',
          actionStatusInfo: item.action.actionStatusInfo && {
            ...item.action.actionStatusInfo,
            statusEndName: STATUS_NAME[item.action.actionStatusInfo.statusEnd as keyof typeof DocumentStatus] ?? '',
          },
        },
      };
      return newItem;
    }),
    totalElements: response.totalElements,
  }));

  const setData = (value: NullableItem<PaymentOrdersTableItem> = paymentOrdersItemTemplate) => {
    data.value = replaceUndefinedWithTemplateValue<NullableItem<PaymentOrdersTableItem>>(value, paymentOrdersItemTemplate);
    autoControlResult.value = systemData.value?.autoControlResult ?? null;
  };

  const setEditMode = (value: boolean) => {
    isEditMode.value = value;
  };

  const fetchValue = async (exKey?: string) => {
    if (!exKey) {
      setData();
      return;
    }
    try {
      const response = await get(exKey) as PaymentOrdersTableItem;
      setEditMode(response.currentStatus === DocumentStatus.DRAFT);
      approvalList.value = ApprovalListParsingModel.parseApprovalListToRouteItems({
        approvalList: response.approvalList as ApprovalListItemDto[] || [],
        docStatus: {
          title: 'atata',
          color: 'gray',
          code: response.currentStatus as string,
        },
        exKey: response.exKey,
        objectCode: response.objectCode || '',
      });
      setData(response);
    } catch (e) {
      notifyDefaultError(e);
    }
  };

  return {
    setData,
    fetchValue,
    data,
    document,
    systemData,
    payer,
    payerBankDetails,
    recipient,
    recipientBankDetails,
    paymentInfo,
    taxPayments,
    additionalInformation,
    orfkMark,
    printFormList,
    isEditMode,
    setEditMode,
    autoControlResult,
    isAutoControlModalOpen,
    isInCreateMode,
    isLoading,
    hasFormErrors,
    actions,
    currentErrors,
    currentRecipientErrors,
    currentPaymentInfoErrors,
    getEventLogData,
    approvalList,
    shownTabs,
  };
});
