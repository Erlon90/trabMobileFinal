import React, { createContext, useContext, useEffect, useState } from 'react';
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
  createUrbanIssue,
  toggleUrbanIssueSupport,
} from '../utils/domainLogic.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [coletaLixo, setColetaLixo] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [catalogoAgendamento, setCatalogoAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [enquetes, setEnquetes] = useState([]);
  const [votedPollIds, setVotedPollIds] = useState({});
  const [reportedIssueIds, setReportedIssueIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
        setOcorrencias(modulesRes.ocorrencias);
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

  function addUrbanIssue(input) {
    const result = createUrbanIssue(ocorrencias, input);
    if (result.ok) {
      setOcorrencias(result.list);
      setReportedIssueIds((prev) => [result.item.id, ...prev]);
    }
    return result;
  }

  function toggleSupportUrbanIssue(issueId) {
    setOcorrencias((prev) => toggleUrbanIssueSupport(prev, issueId));
  }

  function bookAppointment(input, meta) {
    const result = createAppointment(agendamentos, input, meta);
    if (result.ok) {
      setAgendamentos(result.list);
    }
    return result;
  }

  function cancelUserAppointment(appointmentId) {
    setAgendamentos((prev) => cancelAppointment(prev, appointmentId));
  }

  function voteInPoll(pollId, optionId) {
    const result = castPollVote(enquetes, pollId, optionId, votedPollIds);
    if (result.ok) {
      setEnquetes(result.polls);
      setVotedPollIds(result.votedPollIds);
    }
    return result;
  }

  function commentOnPoll(pollId, input) {
    const result = addPollComment(enquetes, pollId, input);
    if (result.ok) {
      setEnquetes(result.polls);
    }
    return result;
  }

  const value = {
    loading,
    error,
    tenant,
    noticias,
    notificacoes,
    coletaLixo,
    ocorrencias,
    catalogoAgendamento,
    agendamentos,
    enquetes,
    votedPollIds,
    reportedIssueIds,
    searchQuery,
    setSearchQuery,
    addUrbanIssue,
    toggleSupportUrbanIssue,
    bookAppointment,
    cancelUserAppointment,
    voteInPoll,
    commentOnPoll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider.');
  }
  return ctx;
}
