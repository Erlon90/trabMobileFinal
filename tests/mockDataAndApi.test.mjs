import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_TENANT,
  RADAR_CATEGORIES,
  MOCK_NOTICIAS,
  MOCK_NOTIFICACOES,
  MOCK_OCORRENCIAS,
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
  API_CONFIG,
  fetchTenant,
  fetchNoticias,
  fetchNoticiaBySlug,
  fetchNotificacoes,
  fetchInitialModulesData,
} from '../minhaprefeitura/services/api.js';

const VALID_STACK_ROUTES = new Set([
  'MainTabs',
  'NewsDetail',
  'Notifications',
  'TrashCollection',
  'RadarUrbano',
  'Appointment',
  'Polls',
]);

test('mockData mirrors official News API fields and includes Radar Urbano multi-category items', () => {
  assert.equal(API_CONFIG.useMock, true);
  assert.ok(MOCK_TENANT.slug);
  assert.deepEqual(RADAR_CATEGORIES, [
    'Pavimentação',
    'Iluminação Pública',
    'Poda e Árvores',
    'Drenagem',
    'Limpeza Urbana',
  ]);

  assert.ok(MOCK_NOTICIAS.length >= 5);
  for (const n of MOCK_NOTICIAS) {
    assert.ok(n.id && n.titulo && n.slug && n.resumo && n.publicado_em && n.conteudo);
    assert.equal(n.status, 'publicado');
    assert.ok('imagem_capa_url' in n);
  }
  assert.ok(MOCK_NOTICIAS.some((n) => n.imagem_capa_url === null));

  const news102 = MOCK_NOTICIAS.find((n) => n.id === 102);
  assert.ok(news102);
  assert.match(news102.resumo, /Radar Urbano/);
  assert.match(news102.conteudo, /Radar Urbano/);

  assert.ok(MOCK_NOTIFICACOES.length >= 3);
  for (const notif of MOCK_NOTIFICACOES) {
    if (notif.link_acao !== null) {
      assert.ok(
        VALID_STACK_ROUTES.has(notif.link_acao),
        `Invalid route in MOCK_NOTIFICACOES: ${notif.link_acao}`
      );
    }
  }
  assert.equal(MOCK_NOTIFICACOES[0].link_acao, 'RadarUrbano');

  assert.ok(MOCK_OCORRENCIAS.length >= 5);
  const categoriesPresent = new Set();
  for (const issue of MOCK_OCORRENCIAS) {
    assert.match(issue.protocolo, /^RAD-2026-\d{4}$/);
    assert.ok(RADAR_CATEGORIES.includes(issue.categoria));
    assert.equal(typeof issue.confirmacoes, 'number');
    assert.equal(typeof issue.recorrente, 'boolean');
    assert.equal(typeof issue.confirmadoPeloUsuario, 'boolean');
    categoriesPresent.add(issue.categoria);
  }
  assert.equal(categoriesPresent.size, RADAR_CATEGORIES.length);
  assert.ok(MOCK_OCORRENCIAS.some((o) => o.status === 'Manutenção agendada'));

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
  assert.equal(normalizeSearchText('  Iluminação Pública  '), 'iluminacao publica');
});

test('fetchTenant and fetchNoticias keep mocked { data, meta } contract', async () => {
  const tenant = await fetchTenant();
  assert.equal(tenant.data.slug, MOCK_TENANT.slug);

  const all = await fetchNoticias({ q: '   ' });
  assert.equal(all.data.length, MOCK_NOTICIAS.length);
  assert.equal(all.meta.total, MOCK_NOTICIAS.length);

  const saude = await fetchNoticias({ q: 'vacinacao' });
  assert.ok(saude.data.length >= 1);

  const radar = await fetchNoticias({ q: 'radar urbano' });
  assert.ok(radar.data.some((n) => n.id === 102));

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
  assert.equal(generateProtocol('RAD', 7, 2026), 'RAD-2026-0007');
});

test('fetchNotificacoes and fetchInitialModulesData return structured payloads with ocorrencias', async () => {
  const notif = await fetchNotificacoes();
  assert.ok(Array.isArray(notif.data) && notif.meta.total === notif.data.length);
  const mod = await fetchInitialModulesData();
  assert.ok(
    mod.ocorrencias.length >= 5 &&
      mod.enquetes.length >= 3 &&
      mod.coletaLixo.length >= 4
  );
});
