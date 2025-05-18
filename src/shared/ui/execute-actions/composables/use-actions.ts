import { computed, ref, watch } from 'vue';
import { storeToRefs, Store, StateTree, _GettersTree } from 'pinia';
import { AutoControlApi } from '@ebp/auto-monitoring-results';
import { Action } from '@/shared/api/types';
import { mapActionTypeToLabel, ActionableTableItem, ActionCode, ActionType } from '@/shared/api/types/actions';
import { ActionsExecutingModel } from '../model/actions-executing.model';

interface ActionsState extends StateTree {
  data: ActionableTableItem,
  actions: Action<ActionCode, ActionType>[],
  autoControlResult: AutoControlApi.Result | null,
  isAutoControlModalOpen: boolean,
}

interface ActionsGetters extends _GettersTree<ActionsState> {}

interface ActionsActions {
  fetchValue: (exKey?: string) => Promise<void>,
}

export interface ActionsStore extends Store<string, ActionsState, ActionsGetters, ActionsActions> {}

/**
 * Формирование блока управления действиями
 */
export function useCardActions(defaultActions: any[], store: ActionsStore) {
  const _model = ref<ActionsExecutingModel | null>(null);

  const { data, actions, autoControlResult, isAutoControlModalOpen } = storeToRefs(store);

  const actionButtons = computed<Array<{ label: string, onClick:() => void } & Action>>(() => {
    if (!_model.value) {
      return [
        ...defaultActions,
      ];
    }
    return [
      ...defaultActions,
      ...actions.value.map((action) => ({
        ...action,
        label: mapActionTypeToLabel(action),
        onClick: _model.value?.setOnClick(action),
      })),
    ];
  });

  /** Приоритетные действия (priority = true) */
  const _priorityActions = computed(() => actionButtons.value
    .filter((x) => x.isPriority));

  /**
   * Целевая кнопка
   *
   * Определение отображаемого действия:
   * - если действие одно - отображаем его
   * - если действий несколько и есть приоритетные - отображаем первое приоритетное
   * - если действий несколько и нет приоритетных - не отображаем
   */
  const _primaryBtn = computed(() => {
    if (actionButtons.value.length === 0) return null;
    if (actionButtons.value.length === 1) {
      return actionButtons.value[0];
    }

    const [firstPriorityAction] = _priorityActions.value;
    if (firstPriorityAction) {
      return firstPriorityAction;
    }
    return null;
  });

  /*
  заполнение модели производится после успешного запроса на данные, т.к. только после этого будет доступен objectCode,
  и если есть доступные actions - т.к. создание модели без них бессмысленно
   */
  watch(() => actions.value, (_actions) => {
    if (_actions.length > 0) {
      _model.value = new ActionsExecutingModel({
        exKey: (data.value as ActionableTableItem).exKey,
        refetch: async (newExKey?: string) => {
          await store.fetchValue(newExKey);
          // store.refetchEventLog?.();
        },
        autoControlsCb: (autoControls) => {
          autoControlResult.value = autoControls;
          isAutoControlModalOpen.value = true;
        },
        actions: _actions,
        purposeActions: {
          openApprovalRoute: ActionCode.PREPARED_TO_HEADACCSIGN,
          sign: [
            ActionCode.HEADACCSIGN_TO_CHIEFSIGN,
            ActionCode.CHIEFSIGN_TO_SIGNED,
            ActionCode.HEADACCSIGN_TO_CHIEFSIGN_START,
            ActionCode.CHIEFSIGN_TO_SIGNED_START,
          ],
        },
      });
    }
  }, { deep: true, immediate: true });

  /**
   * Перечень доступных действий кроме первого приоритетного
   *
   * - если действие одно - отображаем его обычной кнопкой
   * - если действий несколько - отображаем их в кнопке с многоточием
   */
  const _dotsBtnItems = computed<Array<{ label: string, onClick:() => void } & Action>>(() => {
    if (_model.value) {
      const nonPriorityActions = actionButtons.value
        .filter((x) => !x.isPriority);

      return [..._priorityActions.value, ...nonPriorityActions]
        .filter((x) => x.label !== _primaryBtn.value?.label);
    }
    return [];
  });

  return {
    dotsBtnItems: _dotsBtnItems,
    primaryBtn: _primaryBtn,
    model: _model,
  };
}
