import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { BackHandler } from 'react-native';
import {
  fetchInitialModulesData,
  fetchNoticias,
  fetchNotificacoes,
  fetchTenant,
} from '../services/api.js';
import {
  addPollComment,
  cancelAppointment,
  castPollVote,
  createAppointment,
  createPotholeReport,
  togglePotholeConfirmation,
} from '../utils/domainLogic.js';
import { INITIAL_NAV_STATE, navReducer } from '../utils/navigationReducer.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [coletaLixo, setColetaLixo] = useState([]);
  const [buracos, setBuracos] = useState([]);
  const [catalogoAgendamento, setCatalogoAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [enquetes, setEnquetes] = useState([]);
  const [votedPollIds, setVotedPollIds] = useState({});
  const [reportedPotholeIds, setReportedPotholeIds] = useState([]);

  const [navState, dispatch] = useReducer(navReducer, INITIAL_NAV_STATE);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        setLoading(true);
        const [tenantRes, noticiasRes, notificacoesRes, modulesRes] = await Promise.all([
          fetchTenant(),
          fetchNoticias(),
          fetchNotificacoes(),
          fetchInitialModulesData(),
        ]);

        if (!active) return;

        setTenant(tenantRes.data);
        setNoticias(noticiasRes.data);
        setNotificacoes(notificacoesRes.data);
        setColetaLixo(modulesRes.coletaLixo);
        setBuracos(modulesRes.buracos);
        setCatalogoAgendamento(modulesRes.catalogoAgendamento);
        setAgendamentos(modulesRes.agendamentos);
        setEnquetes(modulesRes.enquetes);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Não foi possível carregar os dados da prefeitura.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navState.stack.length > 0) {
        dispatch({ type: 'GO_BACK' });
        return true;
      }
      return false;
    });

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [navState.stack.length]);

  const switchTab = useCallback((tab) => {
    dispatch({ type: 'SWITCH_TAB', tab });
  }, []);

  const navigate = useCallback((name, params = {}) => {
    dispatch({ type: 'PUSH_ROUTE', name, params });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', query });
  }, []);

  const addPothole = useCallback(
    (input) => {
      const result = createPotholeReport(buracos, input);
      if (result.ok) {
        setBuracos(result.list);
        setReportedPotholeIds((prev) => [result.item.id, ...prev]);
      }
      return result;
    },
    [buracos]
  );

  const toggleConfirmPothole = useCallback((potholeId) => {
    setBuracos((prev) => togglePotholeConfirmation(prev, potholeId));
  }, []);

  const bookAppointment = useCallback(
    (input, meta) => {
      const result = createAppointment(agendamentos, input, meta);
      if (result.ok) {
        setAgendamentos(result.list);
      }
      return result;
    },
    [agendamentos]
  );

  const cancelUserAppointment = useCallback((appointmentId) => {
    setAgendamentos((prev) => cancelAppointment(prev, appointmentId));
  }, []);

  const voteInPoll = useCallback(
    (pollId, optionId) => {
      const result = castPollVote(enquetes, pollId, optionId, votedPollIds);
      if (result.ok) {
        setEnquetes(result.polls);
        setVotedPollIds(result.votedPollIds);
      }
      return result;
    },
    [enquetes, votedPollIds]
  );

  const commentOnPoll = useCallback(
    (pollId, input) => {
      const result = addPollComment(enquetes, pollId, input);
      if (result.ok) {
        setEnquetes(result.polls);
      }
      return result;
    },
    [enquetes]
  );

  const currentRoute =
    navState.stack.length > 0 ? navState.stack[navState.stack.length - 1] : null;

  const value = useMemo(
    () => ({
      loading,
      error,
      tenant,
      noticias,
      notificacoes,
      coletaLixo,
      buracos,
      catalogoAgendamento,
      agendamentos,
      enquetes,
      votedPollIds,
      reportedPotholeIds,
      navState,
      activeTab: navState.activeTab,
      currentRoute,
      searchQuery: navState.searchQuery,
      setSearchQuery,
      switchTab,
      navigate,
      goBack,
      addPothole,
      toggleConfirmPothole,
      bookAppointment,
      cancelUserAppointment,
      voteInPoll,
      commentOnPoll,
    }),
    [
      loading,
      error,
      tenant,
      noticias,
      notificacoes,
      coletaLixo,
      buracos,
      catalogoAgendamento,
      agendamentos,
      enquetes,
      votedPollIds,
      reportedPotholeIds,
      navState,
      currentRoute,
      setSearchQuery,
      switchTab,
      navigate,
      goBack,
      addPothole,
      toggleConfirmPothole,
      bookAppointment,
      cancelUserAppointment,
      voteInPoll,
      commentOnPoll,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider.');
  }
  return ctx;
}
