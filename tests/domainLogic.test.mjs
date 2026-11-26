import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCpf, formatCpf } from '../minhaprefeitura/utils/validators.js';
import {
  createPotholeReport,
  togglePotholeConfirmation,
  filterPotholes,
  getAvailableSlots,
  createAppointment,
  cancelAppointment,
  calculatePollResults,
  castPollVote,
  addPollComment,
} from '../minhaprefeitura/utils/domainLogic.js';

test('validateCpf accepts valid CPF and rejects malformed or repeated digits', () => {
  assert.equal(validateCpf('52998224725'), true);
  assert.equal(validateCpf('529.982.247-25'), true);
  assert.equal(validateCpf('111.111.111-11'), false);
  assert.equal(validateCpf('123.456.789-00'), false);
  assert.equal(formatCpf('52998224725'), '529.982.247-25');
});

test('Curadoria de Buracos validates required fields and toggles confirmation without double-counting', () => {
  const invalid = createPotholeReport([], {
    titulo: '',
    endereco: '',
    bairro: '',
    descricao: 'oi',
    gravidade: 'Alta',
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.endereco && invalid.errors.bairro && invalid.errors.descricao);

  const created = createPotholeReport([], {
    titulo: 'Cratera na esquina',
    endereco: 'Av. Champagnat, 450',
    bairro: 'Praia da Costa',
    pontoReferencia: 'Em frente à padaria',
    descricao: 'Buraco reaparece toda vez que chove forte.',
    gravidade: 'Alta',
    recorrente: true,
  });
  assert.equal(created.ok, true);
  assert.match(created.item.protocolo, /^BUR-\d{4}-\d{4}$/);
  assert.equal(created.item.recorrencias, 1);

  const unconfirmed = togglePotholeConfirmation(created.list, created.item.id);
  assert.equal(unconfirmed[0].confirmadoPeloUsuario, false);
  assert.equal(unconfirmed[0].recorrencias, 0);

  const reconfirmed = togglePotholeConfirmation(unconfirmed, created.item.id);
  assert.equal(reconfirmed[0].confirmadoPeloUsuario, true);
  assert.equal(reconfirmed[0].recorrencias, 1);

  assert.equal(filterPotholes(reconfirmed, { bairro: 'Praia da Costa', status: 'Aberto' }).length, 1);
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
