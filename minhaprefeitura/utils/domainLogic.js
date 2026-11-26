/**
 * Regras de negócio puras e imutáveis para os 3 módulos participativos:
 * 1. Radar Urbano
 * 2. Agendamento Municipal
 * 3. Enquetes / Consulta Popular
 */

import { generateProtocol, normalizeSearchText } from '../utils/formatters.js';
import {
  formatCpf,
  validateAppointmentInput,
  validatePollComment,
  validateUrbanIssue,
} from '../utils/validators.js';

function getNextSequence(list, prefix) {
  const pattern = new RegExp(`^${prefix}-\\d{4}-(\\d+)$`);
  let maxSeq = list.length;
  for (const item of list) {
    const match = String(item?.protocolo || '').match(pattern);
    if (match) {
      const parsed = Number(match[1]);
      if (parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }
  return maxSeq + 1;
}

/**
 * Cria uma nova ocorrência no Radar Urbano após validar os campos obrigatórios.
 */
export function createUrbanIssue(existingList = [], input = {}) {
  const validation = validateUrbanIssue(input);
  if (!validation.valid) {
    return { ok: false, list: existingList, errors: validation.errors };
  }

  const seq = getNextSequence(existingList, 'RAD');
  const item = {
    id: `rad-${Date.now()}-${seq}`,
    protocolo: generateProtocol('RAD', seq),
    categoria: String(input.categoria).trim(),
    titulo: String(input.titulo).trim(),
    endereco: String(input.endereco).trim(),
    bairro: String(input.bairro).trim(),
    pontoReferencia: String(input.pontoReferencia || '').trim(),
    descricao: String(input.descricao).trim(),
    gravidade: input.gravidade,
    status: 'Aberto',
    confirmacoes: 1,
    recorrente: Boolean(input.recorrente),
    criadoEm: new Date().toISOString(),
    confirmadoPeloUsuario: true,
  };

  return {
    ok: true,
    item,
    list: [item, ...existingList],
  };
}

/**
 * Alterna o apoio do cidadão em uma ocorrência urbana (+1 / -1 sem duplicar).
 */
export function toggleUrbanIssueSupport(list = [], issueId) {
  return list.map((item) => {
    if (item.id !== issueId) {
      return item;
    }
    const nextConfirmed = !item.confirmadoPeloUsuario;
    const delta = nextConfirmed ? 1 : -1;
    const nextCount = Math.max(0, (Number(item.confirmacoes) || 0) + delta);
    return {
      ...item,
      confirmadoPeloUsuario: nextConfirmed,
      confirmacoes: nextCount,
      recorrente: item.recorrente || nextCount >= 3,
    };
  });
}

/**
 * Filtra ocorrências do Radar Urbano por categoria, status, bairro e busca textual sem acentos.
 */
export function filterUrbanIssues(list = [], filters = {}) {
  const categoriaFilter = normalizeSearchText(filters.categoria);
  const statusFilter = normalizeSearchText(filters.status);
  const bairroFilter = normalizeSearchText(filters.bairro);
  const query = normalizeSearchText(filters.q);

  return list.filter((item) => {
    if (
      categoriaFilter &&
      categoriaFilter !== 'todas' &&
      categoriaFilter !== 'todos'
    ) {
      if (normalizeSearchText(item.categoria) !== categoriaFilter) {
        return false;
      }
    }

    if (statusFilter && statusFilter !== 'todos' && statusFilter !== 'todas') {
      if (normalizeSearchText(item.status) !== statusFilter) {
        return false;
      }
    }

    if (bairroFilter && bairroFilter !== 'todos' && bairroFilter !== 'todas') {
      if (normalizeSearchText(item.bairro) !== bairroFilter) {
        return false;
      }
    }

    if (query) {
      const searchable = normalizeSearchText(
        `${item.protocolo} ${item.categoria || ''} ${item.titulo} ${item.endereco} ${item.bairro} ${item.pontoReferencia || ''} ${item.descricao}`
      );
      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Retorna a grade de horários para uma unidade e data marcando horários ocupados por agendamentos ativos.
 */
export function getAvailableSlots(allSlots = [], existingAppointments = [], unidadeId, data) {
  const occupied = new Set(
    existingAppointments
      .filter(
        (item) =>
          item.status === 'Confirmado' &&
          item.unidadeId === unidadeId &&
          item.data === data
      )
      .map((item) => item.horario)
  );

  return allSlots.map((horario) => ({
    horario,
    disponivel: !occupied.has(horario),
  }));
}

/**
 * Registra um novo agendamento municipal validando CPF e evitando conflito de horário na mesma unidade/data.
 */
export function createAppointment(existingAppointments = [], input = {}, meta = {}) {
  const validation = validateAppointmentInput(input);
  if (!validation.valid) {
    return { ok: false, list: existingAppointments, errors: validation.errors };
  }

  const hasConflict = existingAppointments.some(
    (item) =>
      item.status === 'Confirmado' &&
      item.unidadeId === input.unidadeId &&
      item.data === input.data &&
      item.horario === input.horario
  );

  if (hasConflict) {
    return {
      ok: false,
      list: existingAppointments,
      errors: {
        horario: 'Este horário já está ocupado nesta unidade. Selecione outro.',
      },
    };
  }

  const seq = getNextSequence(existingAppointments, 'AGD');
  const item = {
    id: `agd-${Date.now()}-${seq}`,
    protocolo: generateProtocol('AGD', seq),
    categoria: input.categoria,
    servicoId: input.servicoId,
    servicoNome: meta.servicoNome || input.servicoId,
    unidadeId: input.unidadeId,
    unidadeNome: meta.unidadeNome || input.unidadeId,
    data: input.data,
    horario: input.horario,
    cidadaoNome: String(input.cidadaoNome).trim(),
    cidadaoCpf: formatCpf(input.cidadaoCpf),
    status: 'Confirmado',
    criadoEm: new Date().toISOString(),
  };

  return {
    ok: true,
    item,
    list: [item, ...existingAppointments],
  };
}

/**
 * Cancela um agendamento de forma idempotente, liberando o horário para novas reservas.
 */
export function cancelAppointment(existingAppointments = [], appointmentId) {
  return existingAppointments.map((item) => {
    if (item.id !== appointmentId || item.status === 'Cancelado') {
      return item;
    }
    return {
      ...item,
      status: 'Cancelado',
    };
  });
}

/**
 * Calcula total e percentuais de votos de uma enquete protegendo contra divisão por zero.
 */
export function calculatePollResults(poll) {
  const optionsList = Array.isArray(poll?.opcoes) ? poll.opcoes : [];
  const totalVotes = optionsList.reduce((acc, opt) => acc + (Number(opt.votos) || 0), 0);

  return {
    totalVotes,
    options: optionsList.map((opt) => {
      const votos = Number(opt.votos) || 0;
      const percentual = totalVotes === 0 ? 0 : Math.round((votos / totalVotes) * 100);
      return {
        ...opt,
        votos,
        percentual,
      };
    }),
  };
}

/**
 * Registra voto único em uma enquete ativa.
 */
export function castPollVote(polls = [], pollId, optionId, votedPollIds = {}) {
  const targetPoll = polls.find((p) => p.id === pollId);
  if (!targetPoll) {
    return { ok: false, reason: 'not_found', polls, votedPollIds };
  }
  if (targetPoll.status !== 'ativa') {
    return { ok: false, reason: 'poll_closed', polls, votedPollIds };
  }
  if (votedPollIds[pollId]) {
    return { ok: false, reason: 'already_voted', polls, votedPollIds };
  }

  const hasOption = (targetPoll.opcoes || []).some((o) => o.id === optionId);
  if (!hasOption) {
    return { ok: false, reason: 'invalid_option', polls, votedPollIds };
  }

  const nextPolls = polls.map((poll) => {
    if (poll.id !== pollId) {
      return poll;
    }
    return {
      ...poll,
      opcoes: poll.opcoes.map((opt) =>
        opt.id === optionId ? { ...opt, votos: (Number(opt.votos) || 0) + 1 } : opt
      ),
    };
  });

  return {
    ok: true,
    polls: nextPolls,
    votedPollIds: {
      ...votedPollIds,
      [pollId]: optionId,
    },
  };
}

/**
 * Adiciona uma opinião/comentário validado em uma enquete.
 */
export function addPollComment(polls = [], pollId, input = {}) {
  const validation = validatePollComment(input);
  if (!validation.valid) {
    return { ok: false, polls, errors: validation.errors };
  }

  const targetExists = polls.some((p) => p.id === pollId);
  if (!targetExists) {
    return { ok: false, polls, errors: { poll: 'Enquete não encontrada.' } };
  }

  const newComment = {
    id: `com-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    autor: String(input.autor || '').trim() || 'Cidadão Anônimo',
    bairro: String(input.bairro || '').trim() || 'Não informado',
    texto: String(input.texto).trim(),
    criadoEm: new Date().toISOString(),
  };

  const nextPolls = polls.map((poll) => {
    if (poll.id !== pollId) {
      return poll;
    }
    return {
      ...poll,
      comentarios: [newComment, ...(poll.comentarios || [])],
    };
  });

  return {
    ok: true,
    comment: newComment,
    polls: nextPolls,
  };
}
