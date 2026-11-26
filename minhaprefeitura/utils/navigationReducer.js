/**
 * Reducer puro para navegação principal (abas inferiores + pilha de rotas) e busca global.
 */

export const INITIAL_NAV_STATE = {
  activeTab: 'home',
  stack: [],
  searchQuery: '',
};

export function navReducer(state = INITIAL_NAV_STATE, action) {
  if (!action || !action.type) {
    return state;
  }

  switch (action.type) {
    case 'SWITCH_TAB': {
      return {
        ...state,
        activeTab: action.tab || 'home',
        stack: [],
      };
    }

    case 'PUSH_ROUTE': {
      if (!action.name) {
        return state;
      }
      return {
        ...state,
        stack: [
          ...state.stack,
          {
            name: action.name,
            params: action.params || {},
          },
        ],
      };
    }

    case 'GO_BACK': {
      if (state.stack.length === 0) {
        return state;
      }
      return {
        ...state,
        stack: state.stack.slice(0, -1),
      };
    }

    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: typeof action.query === 'string' ? action.query : '',
      };
    }

    default:
      return state;
  }
}
