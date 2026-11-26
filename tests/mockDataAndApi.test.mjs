import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_TENANT,
  MOCK_NOTICIAS,
  MOCK_NOTIFICACOES,
  MOCK_BURACOS,
  MOCK_AGENDAMENTO_CATALOGO,
  MOCK_ENQUETES,
} from '../minhaprefeitura/data/mockData.js';
import {
  stripHtml,
  normalizeSearchText,
  formatDatePtBr,
  generateProtocol,
} from '../minhaprefeitura/utils/formatters.js';
import {
  fetchNoticias,
  fetchNoticiaBySlug,
  fetchNotificacoes,
  fetchInitialModulesData,
} from '../minhaprefeitura/services/api.js';

test('mockData mirrors official News API fields and includes all 3 new modules', () => {
  assert.ok(MOCK_TENANT.slug);
  assert.ok(MOCK_NOTICIAS.length >= 5);
  for (const n of MOCK_NOTICIAS) {
    assert.ok(n.id && n.titulo && n.slug && n.resumo && n.publicado_em && n.conteudo);
    assert.equal(n.status, 'publicado');
    assert.ok('imagem_capa_url' in n);
  }
  assert.ok(MOCK_NOTICIAS.some((n) => n.imagem_capa_url === null));
  assert.ok(MOCK_NOTIFICACOES.length >= 3);
  assert.ok(MOCK_BURACOS.length >= 4);
  assert.ok(MOCK_AGENDAMENTO_CATALOGO.saude.servicos.length >= 3);
  assert.ok(MOCK_AGENDAMENTO_CATALOGO.documentos.servicos.length >= 3);
  assert.ok(MOCK_ENQUETES.length >= 3);
});

test('stripHtml removes HTML tags while preserving paragraph breaks', () => {
  assert.equal(
    stripHtml('<p>Primeiro parágrafo.</p><p>Linha 1<br/>Linha 2</p>'),
    'Primeiro parágrafo.\n\nLinha 1\nLinha 2'
  );
  assert.equal(stripHtml(null), '');
});

test('normalizeSearchText ignores accents, case and outer whitespace', () => {
  assert.equal(normalizeSearchText('  Saúde Pública  '), 'saude publica');
});

test('fetchNoticias supports accent-insensitive search, blank query and empty results', async () => {
  const all = await fetchNoticias({ q: '   ' });
  assert.equal(all.data.length, MOCK_NOTICIAS.length);
  assert.equal(all.meta.total, MOCK_NOTICIAS.length);

  const saude = await fetchNoticias({ q: 'vacinacao' });
  assert.ok(saude.data.length >= 1);

  const none = await fetchNoticias({ q: 'termo-inexistente-xyz' });
  assert.deepEqual(none.data, []);
  assert.equal(none.meta.total, 0);
});

test('fetchNoticiaBySlug returns full news item or throws 404-like error', async () => {
  const first = MOCK_NOTICIAS[0];
  const res = await fetchNoticiaBySlug(first.slug);
  assert.equal(res.data.id, first.id);
  await assert.rejects(() => fetchNoticiaBySlug('slug-nao-existe'), /não encontrada/i);
});

test('formatDatePtBr and generateProtocol produce expected formats', () => {
  assert.equal(formatDatePtBr('2026-11-26T14:30:00Z'), '26/11/2026');
  assert.equal(generateProtocol('BUR', 7, 2026), 'BUR-2026-0007');
});

test('fetchNotificacoes and fetchInitialModulesData return structured payloads', async () => {
  const notif = await fetchNotificacoes();
  assert.ok(Array.isArray(notif.data) && notif.meta.total === notif.data.length);
  const mod = await fetchInitialModulesData();
  assert.ok(mod.buracos.length >= 4 && mod.enquetes.length >= 3 && mod.coletaLixo.length >= 4);
});
