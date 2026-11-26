import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createUrbanIssue,
  toggleUrbanIssueSupport,
  filterUrbanIssues,
  getAvailableSlots,
  createAppointment,
  cancelAppointment,
  calculatePollResults,
  castPollVote,
  addPollComment,
} from '../minhaprefeitura/utils/domainLogic.js';

test('Radar Urbano validates required fields, creates RAD protocol and toggles support without duplicating', () => {
  const invalid = createUrbanIssue([], {
    categoria: 'Categoria Inexistente',
    titulo: '',
    endereco: '',
    bairro: '',
    descricao: 'curta',
    gravidade: 'Alta',
  });
  assert.equal(invalid.ok, false);
  assert.ok(
    invalid.errors.categoria &&
      invalid.errors.titulo &&
      invalid.errors.endereco &&
      invalid.errors.bairro &&
      invalid.errors.descricao
  );

  const created = createUrbanIssue([], {
    categoria: 'Iluminação Pública',
    titulo: 'Postes apagados na esquina',
    endereco: 'Av. Champagnat, 450',
    bairro: 'Praia da Costa',
    pontoReferencia: 'Em frente à padaria',
    descricao: 'Luminárias apagadas há três dias prejudicando pedestres.',
    gravidade: 'Alta',
    recorrente: false,
  });
  assert.equal(created.ok, true);
  assert.match(created.item.protocolo, /^RAD-\d{4}-\d{4}$/);
  assert.equal(created.item.categoria, 'Iluminação Pública');
  assert.equal(created.item.confirmacoes, 1);
  assert.equal(created.item.confirmadoPeloUsuario, true);

  const unsupported = toggleUrbanIssueSupport(created.list, created.item.id);
  assert.equal(unsupported[0].confirmadoPeloUsuario, false);
  assert.equal(unsupported[0].confirmacoes, 0);

  const resupported = toggleUrbanIssueSupport(unsupported, created.item.id);
  assert.equal(resupported[0].confirmadoPeloUsuario, true);
  assert.equal(resupported[0].confirmacoes, 1);

  const nearRecurrent = [{ ...resupported[0], confirmacoes: 2, confirmadoPeloUsuario: false }];
  const promotedToRecurrent = toggleUrbanIssueSupport(nearRecurrent, created.item.id);
  assert.equal(promotedToRecurrent[0].confirmacoes, 3);
  assert.equal(promotedToRecurrent[0].recorrente, true);
});

test('filterUrbanIssues filters by categoria, status, bairro and accent-insensitive search query', () => {
  const sample = [
    {
      id: '1',
      protocolo: 'RAD-2026-0001',
      categoria: 'Pavimentação',
      titulo: 'Desnível na pista',
      endereco: 'Av. Champagnat, 100',
      bairro: 'Praia da Costa',
      pontoReferencia: '',
      descricao: 'Asfalto cedeu perto da faixa.',
      status: 'Manutenção agendada',
    },
    {
      id: '2',
      protocolo: 'RAD-2026-0002',
      categoria: 'Iluminação Pública',
      titulo: 'Poste apagado',
      endereco: 'Rua da Aurora, 50',
      bairro: 'Glória',
      pontoReferencia: 'Próx. praça',
      descricao: 'Sem iluminação à noite.',
      status: 'Aberto',
    },
    {
      id: '3',
      protocolo: 'RAD-2026-0003',
      categoria: 'Drenagem',
      titulo: 'Bueiro entupido',
      endereco: 'Rua Santa Catarina, 200',
      bairro: 'Itapuã',
      pontoReferencia: '',
      descricao: 'Alagamento em dias de chuva.',
      status: 'Resolvido',
    },
  ];

  assert.equal(filterUrbanIssues(sample, { categoria: 'Todas', status: 'Todos' }).length, 3);
  assert.equal(filterUrbanIssues(sample, { categoria: 'Iluminação Pública' }).length, 1);
  assert.equal(filterUrbanIssues(sample, { status: 'Manutenção agendada' }).length, 1);
  assert.equal(filterUrbanIssues(sample, { bairro: 'Itapuã' }).length, 1);
  assert.equal(filterUrbanIssues(sample, { q: 'iluminacao' }).length, 1);
  assert.equal(filterUrbanIssues(sample, { q: 'RAD-2026-0003' }).length, 1);
  assert.equal(
    filterUrbanIssues(sample, { categoria: 'Drenagem', status: 'Aberto' }).length,
    0
  );
});

test('Agendamento Municipal blocks invalid CPF, blocks occupied slots and releases slot on cancel', () => {
  const baseSlots = ['08:00', '09:00'];
  const badCpf = createAppointment(
    [],
    {
      categoria: 'saude',
      servicoId: 'vacina',
      unidadeId: 'ubs-centro',
      data: '2026-11-30',
      horario: '08:00',
      cidadaoNome: 'Maria Silva',
      cidadaoCpf: '000.000.000-00',
    },
    { servicoNome: 'Vacinação', unidadeNome: 'UBS Centro' }
  );
  assert.equal(badCpf.ok, false);
  assert.ok(badCpf.errors.cidadaoCpf);

  const first = createAppointment(
    [],
    {
      categoria: 'saude',
      servicoId: 'vacina',
      unidadeId: 'ubs-centro',
      data: '2026-11-30',
      horario: '08:00',
      cidadaoNome: 'Maria Silva',
      cidadaoCpf: '52998224725',
    },
    { servicoNome: 'Vacinação', unidadeNome: 'UBS Centro' }
  );
  assert.equal(first.ok, true);
  assert.match(first.item.protocolo, /^AGD-\d{4}-\d{4}$/);

  const slotsAfter = getAvailableSlots(baseSlots, first.list, 'ubs-centro', '2026-11-30');
  assert.deepEqual(slotsAfter, [
    { horario: '08:00', disponivel: false },
    { horario: '09:00', disponivel: true },
  ]);

  const conflict = createAppointment(
    first.list,
    {
      categoria: 'saude',
      servicoId: 'vacina',
      unidadeId: 'ubs-centro',
      data: '2026-11-30',
      horario: '08:00',
      cidadaoNome: 'João Souza',
      cidadaoCpf: '52998224725',
    },
    { servicoNome: 'Vacinação', unidadeNome: 'UBS Centro' }
  );
  assert.equal(conflict.ok, false);
  assert.ok(conflict.errors.horario);

  const afterCancel = cancelAppointment(first.list, first.item.id);
  const afterCancelAgain = cancelAppointment(afterCancel, first.item.id);
  assert.equal(afterCancelAgain[0].status, 'Cancelado');
  const slotsReleased = getAvailableSlots(baseSlots, afterCancelAgain, 'ubs-centro', '2026-11-30');
  assert.equal(slotsReleased[0].disponivel, true);
});

test('Enquetes handles zero votes without NaN, blocks duplicate/closed votes and rejects blank opinions', () => {
  const zeroPoll = {
    id: 'p0',
    status: 'ativa',
    opcoes: [
      { id: 'a', texto: 'A', votos: 0 },
      { id: 'b', texto: 'B', votos: 0 },
    ],
    comentarios: [],
  };
  const zeroRes = calculatePollResults(zeroPoll);
  assert.equal(zeroRes.totalVotes, 0);
  assert.equal(zeroRes.options[0].percentual, 0);

  const closedPoll = {
    id: 'p-closed',
    status: 'encerrada',
    opcoes: [{ id: 'x', texto: 'X', votos: 5 }],
    comentarios: [],
  };
  const polls = [zeroPoll, closedPoll];

  const v1 = castPollVote(polls, 'p0', 'a', {});
  assert.equal(v1.ok, true);
  assert.equal(v1.polls[0].opcoes[0].votos, 1);

  const vDup = castPollVote(v1.polls, 'p0', 'b', v1.votedPollIds);
  assert.equal(vDup.ok, false);
  assert.equal(vDup.reason, 'already_voted');

  const vClosed = castPollVote(v1.polls, 'p-closed', 'x', v1.votedPollIds);
  assert.equal(vClosed.ok, false);
  assert.equal(vClosed.reason, 'poll_closed');

  const badComment = addPollComment(v1.polls, 'p0', { texto: '   ' });
  assert.equal(badComment.ok, false);

  const goodComment = addPollComment(v1.polls, 'p0', {
    autor: 'Ana',
    bairro: 'Centro',
    texto: 'Priorizar iluminação!',
  });
  assert.equal(goodComment.ok, true);
  assert.equal(goodComment.polls[0].comentarios.length, 1);
});
