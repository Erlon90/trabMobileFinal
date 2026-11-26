import test from 'node:test';
import assert from 'node:assert/strict';
import { RADAR_CATEGORIES } from '../minhaprefeitura/data/mockData.js';
import {
  onlyDigits,
  formatCpf,
  validateCpf,
  validateUrbanIssue,
  validateAppointmentInput,
  validatePollComment,
} from '../minhaprefeitura/utils/validators.js';

test('validateCpf and formatCpf handle valid, malformed and repeated-digit CPFs', () => {
  assert.equal(onlyDigits('529.982.247-25'), '52998224725');
  assert.equal(formatCpf('52998224725'), '529.982.247-25');
  assert.equal(validateCpf('52998224725'), true);
  assert.equal(validateCpf('529.982.247-25'), true);
  assert.equal(validateCpf('111.111.111-11'), false);
  assert.equal(validateCpf('123.456.789-00'), false);
});

test('validateUrbanIssue enforces valid Radar Urbano category and occurrence fields', () => {
  for (const categoria of RADAR_CATEGORIES) {
    const res = validateUrbanIssue({
      categoria,
      titulo: 'Ocorrência teste',
      endereco: 'Av. Central, 120',
      bairro: 'Centro',
      descricao: 'Descrição detalhada da ocorrência urbana.',
      gravidade: 'Média',
    });
    assert.equal(res.valid, true, `Expected category ${categoria} to be valid`);
  }

  const missingCat = validateUrbanIssue({
    categoria: '',
    titulo: 'Galho caído',
    endereco: 'Rua A, 100',
    bairro: 'Glória',
    descricao: 'Galho grande obstruindo a passagem na calçada.',
    gravidade: 'Alta',
  });
  assert.equal(missingCat.valid, false);
  assert.ok(missingCat.errors.categoria);

  const invalidGravity = validateUrbanIssue({
    categoria: 'Drenagem',
    titulo: 'Bueiro entupido',
    endereco: 'Rua B, 250',
    bairro: 'Itapuã',
    descricao: 'Água acumulada na esquina em dias chuvosos.',
    gravidade: 'Crítica',
  });
  assert.equal(invalidGravity.valid, false);
  assert.ok(invalidGravity.errors.gravidade);
});

test('validateAppointmentInput and validatePollComment validate citizen inputs', () => {
  const invalidAppt = validateAppointmentInput({});
  assert.equal(invalidAppt.valid, false);
  assert.ok(invalidAppt.errors.categoria && invalidAppt.errors.cidadaoCpf);

  const validComment = validatePollComment({ texto: 'Excelente iniciativa!' });
  assert.equal(validComment.valid, true);
});
