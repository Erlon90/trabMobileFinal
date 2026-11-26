# Minha Prefeitura Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expandir o aplicativo React Native (Expo Snack) "Minha Prefeitura" com feed completo de notícias/avisos via dados mockados compatíveis com a API oficial do professor e implementar os 3 novos módulos escolhidos pelo time: Curadoria de Buracos, Agendamento Municipal e Enquetes / Consulta Popular.

**Architecture:** Aplicação React Native 100% compatível com Expo Snack, mantendo apenas as dependências leves já presentes no template (`expo`, `react`, `react-native`, `react-native-paper`, `@expo/vector-icons`) para evitar quebras nativas na nuvem. Toda a lógica de dados, validação, filtragem e transições de estado vive em módulos JS puros (`data/`, `services/`, `utils/`) testáveis via `node --test`, enquanto `context/AppContext.js` coordena estado global e navegação (abas inferiores + pilha de detalhes/módulos) preservando a identidade visual do template base.

**Tech Stack:** React Native `0.81.5`, Expo SDK `~54.0.37` (Expo Snack), React `19.1.0`, `@expo/vector-icons`, Node `24` (`node --test` para testes unitários sem dependências extras).

**Spec:** [Trabalho Prático: Desenvolvimento do Aplicativo "Minha Prefeitura".docx](file:///C:/Users/Erlon/Documents/UVV/Desenv.Mobile/trabFinal/Trabalho%20Pr%C3%A1tico_%20Desenvolvimento%20do%20Aplicativo%20_Minha%20Prefeitura_.docx) + Contrato da API oficial (`https://news-api.uat.i9tasks.com.br/docs/`).

## Global Constraints

- Plataforma alvo: **Expo Snack** (`https://snack.expo.dev/`) — proibido adicionar dependências nativas incompatíveis com Expo Snack (ex: `react-native-maps`, `react-native-reanimated`). Manter `minhaprefeitura/package.json` sem novas dependências de runtime obrigatórias.
- Aproveitar a base visual do template (`Header` azul `#1d4ed8`, busca rápida, cartão de aviso amarelo `#fef3c7`, grid de serviços, lista de notícias e barra inferior com 4 abas: `Início`, `Serviços`, `Notícias`, `Perfil`).
- Módulo obrigatório de Notícias e Avisos: carregar de arquivo mock separado (`minhaprefeitura/data/mockData.js`) e navegar ao clicar para tela de Detalhes da Notícia exibindo conteúdo completo, imagem e data.
- Arquitetura de Dados Mockados: todos os dados (notícias, notificações/avisos, coleta de lixo, buracos, agendamentos, enquetes) devem residir em `minhaprefeitura/data/mockData.js` simulando respostas da API (`{ data, meta }`), com `noticias` e `notificacoes` espelhando exatamente os campos da API REST do professor (`id`, `titulo`, `slug`, `resumo`, `imagem_capa_url`, `publicado_em`, `conteudo`, `status`, `tenant_id`; e notificações com `id`, `titulo`, `mensagem`, `tipo`, `link_acao`, `enviado_em`, `expira_em`).
- Implementar os 3 módulos novos escolhidos pelo time:
  1. **Curadoria de Buracos**: denunciar buracos recorrentes em vias públicas, confirmar recorrência e acompanhar status.
  2. **Agendamento Municipal**: simular agendamento em postos de saúde ou emissão de documentos, consultar e cancelar agendamentos.
  3. **Enquetes / Consulta Popular**: votar em prioridades de bairros ou opinar em projetos da cidade.
- Organização lógica de pastas dentro de `minhaprefeitura/`: `data/`, `services/`, `utils/`, `context/`, `components/`, `screens/`.
- Entregas documentais/finais: documento de Etapa 1 (proposta dos 3 módulos + esboço do mock) e pacote `.zip` final pronto para upload/entrega (sem `node_modules/`).

## Review Focus

1. **Busca vazia, com espaços ou acentos no feed de notícias/serviços**: digitar `"saude"` deve encontrar `"Saúde"`, digitar espaços em branco deve restaurar a lista completa e buscas sem correspondência devem exibir estado vazio sem erro. (Fixado em Task 1)
2. **Notícia com HTML simples no `conteudo` ou `imagem_capa_url: null`** (ambos válidos no schema OpenAPI `Noticia`): o app deve remover tags HTML (`<p>`, `<br>`, etc.) preservando quebras de parágrafo e renderizar fallback visual sem quebrar `<Image>`. (Fixado em Task 1 e Task 4)
3. **Curadoria de Buracos com campos inválidos ou confirmação duplicada**: envio sem rua/bairro/descrição mínima deve retornar erros claros sem criar item; clicar duas vezes em "Confirmar recorrência" deve alternar (+1 / -1) em vez de inflar infinitamente o contador. (Fixado em Task 2)
4. **Agendamento Municipal com CPF inválido, conflito de horário ou cancelamento repetido**: CPF malformado/inválido é rejeitado; dois agendamentos ativos para mesma unidade+data+horário são bloqueados; cancelar um agendamento libera o horário novamente e cancelar duas vezes é idempotente. (Fixado em Task 2)
5. **Enquetes / Consulta Popular com voto duplicado, enquete encerrada, zero votos ou opinião vazia**: impedir segundo voto na mesma enquete e votos em enquetes com `status: 'encerrada'`; calcular `0%` (nunca `NaN`) quando `totalVotes === 0`; rejeitar opiniões vazias ou só com espaços. (Fixado em Task 2)

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `minhaprefeitura/data/mockData.js` | Base estruturada de dados mockados (`MOCK_TENANT`, `MOCK_NOTICIAS`, `MOCK_NOTIFICACOES`, `MOCK_COLETA_LIXO`, `MOCK_BURACOS`, `MOCK_AGENDAMENTO_CATALOGO`, `MOCK_AGENDAMENTOS`, `MOCK_ENQUETES`). |
| `minhaprefeitura/utils/formatters.js` | Formatação de datas/relativo em pt-BR, sanitização de HTML para texto plano (`stripHtml`), normalização de busca sem acentos e gerador determinístico de protocolos. |
| `minhaprefeitura/services/api.js` | Fachada assíncrona simulando endpoints REST (`{ data, meta }`) sobre `mockData.js`, pronta para substituição por `fetch` na API real (`https://news-api.uat.i9tasks.com.br`). |
| `minhaprefeitura/utils/validators.js` | Validação de CPF, formulários de denúncia de buraco, agendamento e comentário em enquete. |
| `minhaprefeitura/utils/domainLogic.js` | Operações puras de negócio para Curadoria de Buracos, Agendamento Municipal e Enquetes / Consulta Popular. |
| `minhaprefeitura/utils/navigationReducer.js` | Reducer puro para navegação por abas + pilha de rotas (`tab`, `stack`, `searchQuery`). |
| `minhaprefeitura/context/AppContext.js` | Provedor React unificando dados carregados via `api.js`, mutações em memória (denúncias, agendamentos, votos, opiniões) e navegação. |
| `minhaprefeitura/components/Header.js` | Cabeçalho azul do template com branding, badge de notificações clicável e barra de busca. |
| `minhaprefeitura/components/BottomNav.js` | Barra de navegação inferior fixa com as 4 abas do template. |
| `minhaprefeitura/components/ScreenHeader.js` | Cabeçalho interno reutilizável com botão Voltar e subtítulo para telas secundárias/módulos. |
| `minhaprefeitura/components/NewsCard.js` | Card reutilizável de notícia com tag de categoria, imagem com fallback e data formatada. |
| `minhaprefeitura/components/StatusBadge.js` | Chip de status/gravidade reutilizável entre Notícias, Buracos, Agendamentos e Enquetes. |
| `minhaprefeitura/components/EmptyState.js` | Componente de estado vazio amigável para buscas/filtros sem resultado. |
| `minhaprefeitura/components/PotholeCard.js` | Card de ocorrência de buraco com contador de recorrência e botão de confirmação. |
| `minhaprefeitura/components/PotholeReportModal.js` | Modal de formulário para registrar nova denúncia de buraco recorrente. |
| `minhaprefeitura/components/AppointmentCard.js` | Card de comprovante de agendamento com protocolo, status e ação de cancelar. |
| `minhaprefeitura/components/PollCard.js` | Card interativo de enquete/consulta popular com barras de percentual, votação e comentários. |
| `minhaprefeitura/screens/HomeScreen.js` | Tela inicial fiel ao template: Header, alerta ativo, atalhos (Coleta + 3 módulos novos) e últimas notícias. |
| `minhaprefeitura/screens/NewsListScreen.js` | Feed completo de notícias com busca e filtro por categoria. |
| `minhaprefeitura/screens/NewsDetailScreen.js` | Detalhes completos da notícia (capa com fallback, categoria, data, resumo e texto integral). |
| `minhaprefeitura/screens/NotificationsScreen.js` | Central de avisos e comunicados oficiais (`NotificacaoSummary`). |
| `minhaprefeitura/screens/ServicesScreen.js` | Catálogo completo de serviços (Coleta de Lixo + 3 novos módulos + busca). |
| `minhaprefeitura/screens/TrashCollectionScreen.js` | Módulo utilitário base preservado: consulta de dias/horários de coleta por bairro. |
| `minhaprefeitura/screens/PotholeCuratorScreen.js` | Módulo 1: Curadoria de Buracos (KPIs, filtros, feed de recorrências, nova denúncia). |
| `minhaprefeitura/screens/AppointmentScreen.js` | Módulo 2: Agendamento Municipal (Saúde / Documentos, slots dinâmicos, Meus Agendamentos). |
| `minhaprefeitura/screens/PollsScreen.js` | Módulo 3: Enquetes / Consulta Popular (votação em prioridades e opiniões em projetos). |
| `minhaprefeitura/screens/ProfileScreen.js` | Perfil do cidadão com resumo dinâmico de denúncias, agendamentos e votos na sessão. |
| `minhaprefeitura/App.js` | Ponto de entrada limpo renderizando `AppProvider` e o roteador de telas dentro de `SafeAreaView`. |
| `tests/*.test.mjs` | Suíte de testes unitários Node 24 (`node --test`) cobrindo mock/API, formatadores, domínio e navegação. |
| `docs/etapa1-proposta-minha-prefeitura.md` | Documento de entrega da Etapa 1 (descrição dos 3 módulos e modelagem do mock). |

---

### Task 1: Camada de Dados Mockados, Formatadores e Serviço de API

**Files:**
- Create: `minhaprefeitura/data/mockData.js`
- Create: `minhaprefeitura/utils/formatters.js`
- Create: `minhaprefeitura/services/api.js`
- Test: `tests/mockDataAndApi.test.mjs`

**Interfaces:**
- Consumes: nenhum módulo interno.
- Produces:
  - `minhaprefeitura/data/mockData.js`: `MOCK_TENANT`, `MOCK_NOTICIAS`, `MOCK_NOTIFICACOES`, `MOCK_COLETA_LIXO`, `MOCK_BURACOS`, `MOCK_AGENDAMENTO_CATALOGO`, `MOCK_AGENDAMENTOS`, `MOCK_ENQUETES`
  - `minhaprefeitura/utils/formatters.js`: `stripHtml(html: string) -> string`, `normalizeSearchText(text: string) -> string`, `formatDatePtBr(isoString: string) -> string`, `formatRelativeTime(isoString: string, now?: Date) -> string`, `generateProtocol(prefix: string, sequence: number, year?: number) -> string`
  - `minhaprefeitura/services/api.js`: `API_CONFIG`, `fetchTenant(tenantSlug?: string) -> Promise<{ data }>`, `fetchNoticias(options?: { q?: string, categoria?: string, page?: number, per_page?: number }) -> Promise<{ data, meta }>`, `fetchNoticiaBySlug(slug: string) -> Promise<{ data }>`, `fetchNotificacoes() -> Promise<{ data, meta }>`, `fetchInitialModulesData() -> Promise<{ coletaLixo, buracos, catalogoAgendamento, agendamentos, enquetes }>`

- [ ] **Step 1: Write the failing test**

Criar `tests/mockDataAndApi.test.mjs` testando:
```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/mockDataAndApi.test.mjs`
Expected: FAIL com `ERR_MODULE_NOT_FOUND` para `minhaprefeitura/data/mockData.js`.

- [ ] **Step 3: Implement `minhaprefeitura/data/mockData.js`**

Criar o arquivo de dados mockados estruturados em português (contexto municipal, ex: `vila-velha` / `minha-prefeitura`), contendo:
- `MOCK_TENANT` com `{ id, nome, slug, codigo_ibge, ativo: 1 }`
- `MOCK_NOTICIAS` (pelo menos 6 notícias, incluindo as 2 do template original — Vacinação/Saúde e Recapeamento/Obras — além de Educação, Transporte, Cultura e Meio Ambiente; incluir ao menos 1 item com `conteudo` em HTML `<p>...</p>` e ao menos 1 item com `imagem_capa_url: null` para exercitar fallback)
- `MOCK_NOTIFICACOES` (4 comunicados com `tipo` dentre `'alerta' | 'campanha' | 'utilidade_publica' | 'emergencia'`)
- `MOCK_COLETA_LIXO` (5 bairros com dias da semana, turno, tipo `Orgânico / Seletiva`)
- `MOCK_BURACOS` (5 ocorrências iniciais com `id`, `protocolo`, `titulo`, `endereco`, `bairro`, `pontoReferencia`, `descricao`, `gravidade`: `'Baixa' | 'Média' | 'Alta'`, `status`: `'Aberto' | 'Em análise' | 'Recapeamento agendado' | 'Resolvido'`, `recorrencias` numérico, `recorrente`: boolean, `criadoEm`, `confirmadoPeloUsuario`: boolean)
- `MOCK_AGENDAMENTO_CATALOGO` dividido em `saude` e `documentos`, cada qual com `servicos` (`{ id, nome, duracaoMin, documentosNecessarios }`), `unidades` (`{ id, nome, bairro, endereco }`), `datasDisponiveis` (5 datas próximas em `YYYY-MM-DD`) e `horariosPadrao` (`['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']`)
- `MOCK_AGENDAMENTOS` (2 agendamentos iniciais ativos já ocupando slots específicos)
- `MOCK_ENQUETES` (4 enquetes cobrindo `Prioridades de Bairros` e `Projetos da Cidade`, sendo 3 `ativa` e 1 `encerrada`, com `opcoes: [{ id, texto, votos }]` e `comentarios: [{ id, autor, bairro, texto, criadoEm }]`)

- [ ] **Step 4: Implement `minhaprefeitura/utils/formatters.js` e `minhaprefeitura/services/api.js`**

- Em `formatters.js`: implementar `stripHtml`, `normalizeSearchText` (usando `.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()`), `formatDatePtBr`, `formatRelativeTime` e `generateProtocol`.
- Em `api.js`: exportar `API_CONFIG = { useMock: true, baseUrl: 'https://news-api.uat.i9tasks.com.br', tenantSlug: MOCK_TENANT.slug }` e as funções assíncronas que retornam cópias imutáveis no envelope `{ data, meta: { page, per_page, total, total_pages } }`.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/mockDataAndApi.test.mjs`
Expected: PASS (todos os testes verdes).

- [ ] **Step 6: Commit** (se repositório Git estiver inicializado)

```bash
git add minhaprefeitura/data/mockData.js minhaprefeitura/utils/formatters.js minhaprefeitura/services/api.js tests/mockDataAndApi.test.mjs
git commit -m "feat: add structured mock data, formatters and mock API service"
```

---

### Task 2: Regras de Domínio e Validações dos 3 Novos Módulos

**Files:**
- Create: `minhaprefeitura/utils/validators.js`
- Create: `minhaprefeitura/utils/domainLogic.js`
- Test: `tests/domainLogic.test.mjs`

**Interfaces:**
- Consumes: `generateProtocol`, `normalizeSearchText` de `minhaprefeitura/utils/formatters.js`.
- Produces:
  - `minhaprefeitura/utils/validators.js`:
    - `validateCpf(cpf: string) -> boolean`
    - `formatCpf(raw: string) -> string`
    - `validatePotholeReport(input: { titulo, endereco, bairro, descricao, gravidade }) -> { valid: boolean, errors: Record<string, string> }`
    - `validateAppointmentInput(input: { categoria, servicoId, unidadeId, data, horario, cidadaoNome, cidadaoCpf }) -> { valid: boolean, errors: Record<string, string> }`
    - `validatePollComment(input: { texto, autor? }) -> { valid: boolean, errors: Record<string, string> }`
  - `minhaprefeitura/utils/domainLogic.js`:
    - `createPotholeReport(existingList: Array, input: Object) -> { ok: boolean, item?: Object, list: Array, errors?: Object }`
    - `togglePotholeConfirmation(list: Array, potholeId: string) -> Array`
    - `filterPotholes(list: Array, filters: { status?: string, bairro?: string, q?: string }) -> Array`
    - `getAvailableSlots(allSlots: string[], existingAppointments: Array, unidadeId: string, data: string) -> Array<{ horario: string, disponivel: boolean }>`
    - `createAppointment(existingAppointments: Array, input: Object, meta: { servicoNome, unidadeNome }) -> { ok: boolean, item?: Object, list: Array, errors?: Object }`
    - `cancelAppointment(existingAppointments: Array, appointmentId: string) -> Array`
    - `calculatePollResults(poll: Object) -> { totalVotes: number, options: Array<{ id, texto, votos, percentual: number }> }`
    - `castPollVote(polls: Array, pollId: string, optionId: string, votedPollIds: Record<string, string>) -> { ok: boolean, reason?: string, polls: Array, votedPollIds: Record<string, string> }`
    - `addPollComment(polls: Array, pollId: string, input: { autor?: string, bairro?: string, texto: string }) -> { ok: boolean, polls: Array, errors?: Object }`

- [ ] **Step 1: Write the failing test**

Criar `tests/domainLogic.test.mjs` cobrindo todos os fluxos felizes e os itens 3, 4 e 5 do **Review Focus**:
```js
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
  const invalid = createPotholeReport([], { titulo: '', endereco: '', bairro: '', descricao: 'oi', gravidade: 'Alta' });
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
  const badCpf = createAppointment([], {
    categoria: 'saude',
    servicoId: 'vacina',
    unidadeId: 'ubs-centro',
    data: '2026-11-30',
    horario: '08:00',
    cidadaoNome: 'Maria Silva',
    cidadaoCpf: '000.000.000-00',
  }, { servicoNome: 'Vacinação', unidadeNome: 'UBS Centro' });
  assert.equal(badCpf.ok, false);
  assert.ok(badCpf.errors.cidadaoCpf);

  const first = createAppointment([], {
    categoria: 'saude',
    servicoId: 'vacina',
    unidadeId: 'ubs-centro',
    data: '2026-11-30',
    horario: '08:00',
    cidadaoNome: 'Maria Silva',
    cidadaoCpf: '52998224725',
  }, { servicoNome: 'Vacinação', unidadeNome: 'UBS Centro' });
  assert.equal(first.ok, true);
  assert.match(first.item.protocolo, /^AGD-\d{4}-\d{4}$/);

  const slotsAfter = getAvailableSlots(baseSlots, first.list, 'ubs-centro', '2026-11-30');
  assert.deepEqual(slotsAfter, [
    { horario: '08:00', disponivel: false },
    { horario: '09:00', disponivel: true },
  ]);

  const conflict = createAppointment(first.list, {
    categoria: 'saude',
    servicoId: 'vacina',
    unidadeId: 'ubs-centro',
    data: '2026-11-30',
    horario: '08:00',
    cidadaoNome: 'João Souza',
    cidadaoCpf: '52998224725',
  }, { servicoNome: 'Vacinação', unidadeNome: 'UBS Centro' });
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
    opcoes: [{ id: 'a', texto: 'A', votos: 0 }, { id: 'b', texto: 'B', votos: 0 }],
    comentarios: [],
  };
  const zeroRes = calculatePollResults(zeroPoll);
  assert.equal(zeroRes.totalVotes, 0);
  assert.equal(zeroRes.options[0].percentual, 0);

  const closedPoll = { id: 'p-closed', status: 'encerrada', opcoes: [{ id: 'x', texto: 'X', votos: 5 }], comentarios: [] };
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

  const goodComment = addPollComment(v1.polls, 'p0', { autor: 'Ana', bairro: 'Centro', texto: 'Priorizar iluminação!' });
  assert.equal(goodComment.ok, true);
  assert.equal(goodComment.polls[0].comentarios.length, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/domainLogic.test.mjs`
Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `minhaprefeitura/utils/validators.js` e `minhaprefeitura/utils/domainLogic.js`**

- Implementar validação oficial de dígitos verificadores de CPF em `validateCpf`, máscara incremental `formatCpf` e validações de campos obrigatórios (`descricao` >= 10 caracteres em buracos, nome >= 3 caracteres em agendamento, comentário >= 3 caracteres em enquetes).
- Implementar todas as funções puras e imutáveis em `domainLogic.js` garantindo idempotência de `cancelAppointment`, verificação de conflito de slot para agendamentos com `status === 'Confirmado'`, cálculo de percentual seguro (`totalVotes === 0 ? 0 : Math.round((votos / totalVotes) * 100)`) e proteção contra voto duplo ou enquete encerrada.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/domainLogic.test.mjs`
Expected: PASS (todos os testes verdes).

- [ ] **Step 5: Commit**

```bash
git add minhaprefeitura/utils/validators.js minhaprefeitura/utils/domainLogic.js tests/domainLogic.test.mjs
git commit -m "feat: add validators and pure domain logic for the 3 new modules"
```

---

### Task 3: Navegação, Estado Global e Componentes Reutilizáveis

**Files:**
- Create: `minhaprefeitura/utils/navigationReducer.js`
- Create: `minhaprefeitura/context/AppContext.js`
- Create: `minhaprefeitura/components/Header.js`
- Create: `minhaprefeitura/components/BottomNav.js`
- Create: `minhaprefeitura/components/ScreenHeader.js`
- Create: `minhaprefeitura/components/NewsCard.js`
- Create: `minhaprefeitura/components/StatusBadge.js`
- Create: `minhaprefeitura/components/EmptyState.js`
- Test: `tests/navigationState.test.mjs`

**Interfaces:**
- Consumes: `services/api.js`, `utils/domainLogic.js`, `utils/formatters.js`.
- Produces:
  - `navigationReducer.js`: `INITIAL_NAV_STATE`, `navReducer(state, action)` suportando `SWITCH_TAB`, `PUSH_ROUTE`, `GO_BACK`, `SET_SEARCH_QUERY`
  - `AppContext.js`: `AppProvider`, `useApp()` expondo `{ loading, tenant, noticias, notificacoes, coletaLixo, buracos, catalogoAgendamento, agendamentos, enquetes, votedPollIds, navState, activeTab, currentRoute, searchQuery, setSearchQuery, switchTab, navigate, goBack, addPothole, toggleConfirmPothole, bookAppointment, cancelUserAppointment, voteInPoll, commentOnPoll }`
  - Componentes visuais compartilhados (`Header`, `BottomNav`, `ScreenHeader`, `NewsCard`, `StatusBadge`, `EmptyState`) seguindo a paleta `#1d4ed8` / `#f3f4f6` / `#ffffff` do template original.

- [ ] **Step 1: Write the failing test**

Criar `tests/navigationState.test.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_NAV_STATE, navReducer } from '../minhaprefeitura/utils/navigationReducer.js';

test('navReducer handles tab switching, route pushing, back navigation and search', () => {
  let state = navReducer(INITIAL_NAV_STATE, { type: 'PUSH_ROUTE', name: 'newsDetail', params: { slug: 'vacina' } });
  assert.equal(state.stack.length, 1);
  assert.equal(state.stack[0].name, 'newsDetail');

  state = navReducer(state, { type: 'GO_BACK' });
  assert.equal(state.stack.length, 0);

  state = navReducer(state, { type: 'PUSH_ROUTE', name: 'buracos' });
  state = navReducer(state, { type: 'SWITCH_TAB', tab: 'noticias' });
  assert.equal(state.activeTab, 'noticias');
  assert.equal(state.stack.length, 0);

  state = navReducer(state, { type: 'SET_SEARCH_QUERY', query: 'obras' });
  assert.equal(state.searchQuery, 'obras');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/navigationState.test.mjs`
Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `navigationReducer.js`, `AppContext.js` e os 6 componentes base**

- Em `Header.js` e `BottomNav.js`: preservar fielmente o layout, espaçamentos, ícones (`@expo/vector-icons`) e cores do `App.js` original do professor, adicionando `onPressNotifications`, `unreadCount`, `searchValue`/`onChangeSearch` no `Header` e abas clicáveis com destaque ativo `#1d4ed8` no `BottomNav`.
- Em `NewsCard.js`: renderizar `<Image>` quando `imagem_capa_url` for válida ou um container ilustrado com ícone `Ionicons` (`newspaper-outline`) quando `imagem_capa_url` for `null`.
- Em `AppContext.js`: carregar dados iniciais via `fetchTenant`, `fetchNoticias`, `fetchNotificacoes` e `fetchInitialModulesData`, ligar `BackHandler` no Android para `goBack()` quando `stack.length > 0`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/navigationState.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add minhaprefeitura/utils/navigationReducer.js minhaprefeitura/context/AppContext.js minhaprefeitura/components/Header.js minhaprefeitura/components/BottomNav.js minhaprefeitura/components/ScreenHeader.js minhaprefeitura/components/NewsCard.js minhaprefeitura/components/StatusBadge.js minhaprefeitura/components/EmptyState.js tests/navigationState.test.mjs
git commit -m "feat: add navigation reducer, AppContext and shared UI components"
```

---

### Task 4: Telas Base e Módulo Obrigatório de Notícias e Avisos

**Files:**
- Create: `minhaprefeitura/screens/HomeScreen.js`
- Create: `minhaprefeitura/screens/NewsListScreen.js`
- Create: `minhaprefeitura/screens/NewsDetailScreen.js`
- Create: `minhaprefeitura/screens/NotificationsScreen.js`
- Create: `minhaprefeitura/screens/ServicesScreen.js`
- Create: `minhaprefeitura/screens/TrashCollectionScreen.js`
- Create: `minhaprefeitura/screens/ProfileScreen.js`

**Interfaces:**
- Consumes: `useApp()`, `Header`, `ScreenHeader`, `NewsCard`, `StatusBadge`, `EmptyState`, `stripHtml`, `formatDatePtBr`, `formatRelativeTime`, `normalizeSearchText`.
- Produces: Telas completas `HomeScreen`, `NewsListScreen`, `NewsDetailScreen` (recebe `{ slug }` nos `params`), `NotificationsScreen`, `ServicesScreen`, `TrashCollectionScreen`, `ProfileScreen`.

- [ ] **Step 1: Implement `HomeScreen.js`, `NewsListScreen.js`, `NewsDetailScreen.js` e `NotificationsScreen.js`**

- `HomeScreen`: mantém o `Header` com busca funcional (filtra notícias e serviços em tempo real), exibe o card de alerta mais recente (`notificacoes[0]`, clicável para `NotificationsScreen`), seção `Serviços e Utilidades` com 4 atalhos funcionais (`Coleta de Lixo`, `Curadoria de Buracos`, `Agendamento`, `Enquetes`) e link `Ver todos` -> aba `Serviços`, mais `Últimas Notícias` clicáveis abrindo `NewsDetailScreen`.
- `NewsListScreen`: chips de filtro por categoria (`Todas`, `Saúde`, `Obras`, `Educação`, `Transporte`, `Meio Ambiente`, `Cultura`), busca textual usando `normalizeSearchText`, e `EmptyState` quando nada casar.
- `NewsDetailScreen`: exibe botão voltar via `ScreenHeader`, imagem de capa em destaque (ou banner fallback quando `imagem_capa_url === null`), tag de categoria, data formatada (`formatDatePtBr`), título, resumo em destaque e conteúdo completo sanitizado com `stripHtml(noticia.conteudo)`.
- `NotificationsScreen`: lista todos os avisos oficiais diferenciados visualmente por `tipo` (`emergencia`, `alerta`, `utilidade_publica`, `campanha`) com data de envio e validade.

- [ ] **Step 2: Implement `ServicesScreen.js`, `TrashCollectionScreen.js` e `ProfileScreen.js`**

- `ServicesScreen`: catálogo organizado com descrição, ícones e badges de contagem ao vivo (ex: `"5 ocorrências"`, `"3 enquetes ativas"`) navegando para `coletaLixo`, `buracos`, `agendamento` e `enquetes`.
- `TrashCollectionScreen`: filtro por bairro exibindo dias da coleta comum e seletiva + horários.
- `ProfileScreen`: perfil do cidadão simulado + contadores dinâmicos ("Minhas Denúncias", "Meus Agendamentos", "Enquetes Votadas") com atalhos diretos para cada módulo.

- [ ] **Step 3: Verify syntax and imports across all screens**

Run: `node --input-type=module -e "import fs from 'node:fs'; for (const f of ['HomeScreen','NewsListScreen','NewsDetailScreen','NotificationsScreen','ServicesScreen','TrashCollectionScreen','ProfileScreen']) { const c = fs.readFileSync('minhaprefeitura/screens/' + f + '.js', 'utf8'); if (!c.includes('export default')) throw new Error('Missing default export in ' + f); } console.log('Base screens OK');"`
Expected: `Base screens OK`.

- [ ] **Step 4: Commit**

```bash
git add minhaprefeitura/screens/HomeScreen.js minhaprefeitura/screens/NewsListScreen.js minhaprefeitura/screens/NewsDetailScreen.js minhaprefeitura/screens/NotificationsScreen.js minhaprefeitura/screens/ServicesScreen.js minhaprefeitura/screens/TrashCollectionScreen.js minhaprefeitura/screens/ProfileScreen.js
git commit -m "feat: implement home, news feed/detail, notifications, services and profile screens"
```

---

### Task 5: Módulo 1 — Curadoria de Buracos

**Files:**
- Create: `minhaprefeitura/components/PotholeCard.js`
- Create: `minhaprefeitura/components/PotholeReportModal.js`
- Create: `minhaprefeitura/screens/PotholeCuratorScreen.js`

**Interfaces:**
- Consumes: `useApp()` (`buracos`, `addPothole`, `toggleConfirmPothole`, `goBack`), `filterPotholes`, `ScreenHeader`, `StatusBadge`, `EmptyState`, `formatDatePtBr`.
- Produces: `PotholeCuratorScreen` acessível via rota `buracos`.

- [ ] **Step 1: Implement `PotholeCard.js` e `PotholeReportModal.js`**

- `PotholeCard`: exibe protocolo, badge de status (`Aberto`, `Em análise`, `Recapeamento agendado`, `Resolvido`), badge de gravidade (`Baixa`, `Média`, `Alta`), selo `"Recorrente"` quando `recorrente || recorrencias >= 3`, endereço + bairro + ponto de referência, descrição e botão interativo `"Confirmar buraco (+N)"` que alterna destaque quando `confirmadoPeloUsuario === true`.
- `PotholeReportModal`: modal nativo (`<Modal animationType="slide" transparent>`) com campos: Título resumido, Endereço/Rua, Bairro, Ponto de referência (opcional), seletor de Gravidade (`Baixa` / `Média` / `Alta`), switch `"Buraco recorrente (já foi tapado antes)"`, Descrição detalhada e exibição inline de mensagens de erro retornadas por `addPothole`.

- [ ] **Step 2: Implement `PotholeCuratorScreen.js`**

- Cabeçalho `ScreenHeader` ("Curadoria de Buracos"), faixa de resumo com 3 KPIs (`Total`, `Recorrentes`, `Resolvidos`), barra de busca por rua/bairro, chips de filtro por status, botão principal `"+ Denunciar Buraco"` e lista ordenada por maior recorrência (ou mais recente), com feedback visual de protocolo gerado após cadastro.

- [ ] **Step 3: Run domain + smoke checks**

Run: `node --test tests/domainLogic.test.mjs`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add minhaprefeitura/components/PotholeCard.js minhaprefeitura/components/PotholeReportModal.js minhaprefeitura/screens/PotholeCuratorScreen.js
git commit -m "feat: implement Curadoria de Buracos module"
```

---

### Task 6: Módulo 2 — Agendamento Municipal

**Files:**
- Create: `minhaprefeitura/components/AppointmentCard.js`
- Create: `minhaprefeitura/screens/AppointmentScreen.js`

**Interfaces:**
- Consumes: `useApp()` (`catalogoAgendamento`, `agendamentos`, `bookAppointment`, `cancelUserAppointment`, `goBack`), `getAvailableSlots`, `formatCpf`, `ScreenHeader`, `StatusBadge`, `EmptyState`, `formatDatePtBr`.
- Produces: `AppointmentScreen` acessível via rota `agendamento`.

- [ ] **Step 1: Implement `AppointmentCard.js`**

- Exibe protocolo (`AGD-2026-XXXX`), categoria (`Posto de Saúde` ou `Emissão de Documentos`), nome do serviço, unidade + endereço, data e horário, nome do cidadão, badge de status (`Confirmado` / `Cancelado`) e botão `"Cancelar agendamento"` (com confirmação via `Alert.alert` ou confirmação em dois toques compatível com web/Snack) quando `status === 'Confirmado'`.

- [ ] **Step 2: Implement `AppointmentScreen.js`**

- Controle segmentado no topo: `"Novo Agendamento"` | `"Meus Agendamentos (N)"`.
- Na aba **Novo Agendamento**:
  1. Seletor de área: `Postos de Saúde` vs. `Emissão de Documentos`.
  2. Lista selecionável de serviços (exibindo duração e documentos necessários).
  3. Lista selecionável de unidades municipais (UBS / Casa do Cidadão).
  4. Chips horizontais de datas disponíveis e grade de horários calculada dinamicamente via `getAvailableSlots` (horários ocupados aparecem visualmente desabilitados com etiqueta `"Ocupado"`).
  5. Campos Nome completo e CPF (formatado ao digitar via `formatCpf`), mensagens de validação inline e botão `"Confirmar Agendamento"`.
  6. Banner/card de comprovante imediato ao concluir, com atalho para `"Ver em Meus Agendamentos"`.
- Na aba **Meus Agendamentos**: lista usando `AppointmentCard` ou `EmptyState`.

- [ ] **Step 3: Run domain tests to confirm contract**

Run: `node --test tests/domainLogic.test.mjs`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add minhaprefeitura/components/AppointmentCard.js minhaprefeitura/screens/AppointmentScreen.js
git commit -m "feat: implement Agendamento Municipal module"
```

---

### Task 7: Módulo 3 — Enquetes / Consulta Popular

**Files:**
- Create: `minhaprefeitura/components/PollCard.js`
- Create: `minhaprefeitura/screens/PollsScreen.js`

**Interfaces:**
- Consumes: `useApp()` (`enquetes`, `votedPollIds`, `voteInPoll`, `commentOnPoll`, `goBack`), `calculatePollResults`, `ScreenHeader`, `StatusBadge`, `EmptyState`, `formatDatePtBr`.
- Produces: `PollCard` e `PollsScreen` acessível via rota `enquetes`.

- [ ] **Step 1: Implement `PollCard.js`**

- Exibe categoria (`Prioridade de Bairro` ou `Projeto da Cidade`), bairro/abrangência, status (`Ativa` / `Encerrada`), título, descrição e prazo.
- Renderiza opções clicáveis quando a enquete está ativa e ainda não votada; após votar (ou se encerrada), exibe barra de progresso proporcional ao `percentual` de cada opção, destaque na escolha do cidadão e total de votos.
- Seção expansível `"Opiniões da População (N)"` com lista de comentários existentes e mini formulário (Nome opcional, Bairro opcional, Opinião obrigatória) com validação inline chamando `commentOnPoll`.

- [ ] **Step 2: Implement `PollsScreen.js`**

- `ScreenHeader` ("Enquetes e Consulta Popular"), chips de filtro (`Todas`, `Prioridades de Bairros`, `Projetos da Cidade`, `Encerradas`), indicadores rápidos (consultas ativas + votos registrados pelo cidadão) e lista de `PollCard` (ou `EmptyState`).

- [ ] **Step 3: Run domain tests to confirm contract**

Run: `node --test tests/domainLogic.test.mjs`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add minhaprefeitura/components/PollCard.js minhaprefeitura/screens/PollsScreen.js
git commit -m "feat: implement Enquetes e Consulta Popular module"
```

---

### Task 8: Integração Final (`App.js`), Documentação Etapa 1, Verificação e Pacote `.zip`

**Files:**
- Modify: `minhaprefeitura/App.js`
- Modify: `minhaprefeitura/README.md`
- Create: `docs/etapa1-proposta-minha-prefeitura.md`
- Create: `minhaprefeitura-entrega.zip` (gerado via script PowerShell excluindo `node_modules` e `.expo`)

**Interfaces:**
- Consumes: `AppProvider`, `useApp`, `BottomNav`, todas as 10 telas em `minhaprefeitura/screens/`.
- Produces: Aplicativo integrado rodando em Expo Snack / Expo Web, documentação da Etapa 1 e `.zip` final de entrega.

- [ ] **Step 1: Update `minhaprefeitura/App.js`**

- Substituir o monolito estático de 373 linhas por um componente raiz limpo (`AppProvider` + `AppRouter`) que:
  - Renderiza `StatusBar` compatível com o header `#1d4ed8`.
  - Roteia `currentRoute.name` (`newsDetail`, `notificacoes`, `coletaLixo`, `buracos`, `agendamento`, `enquetes`) ou a aba ativa (`home`, `servicos`, `noticias`, `perfil`).
  - Mantém `BottomNav` visível nas abas principais e limpa nas telas de detalhe/módulo (ou sempre acessível com destaque coerente).

- [ ] **Step 2: Write `docs/etapa1-proposta-minha-prefeitura.md` e atualizar `minhaprefeitura/README.md`**

- Documentar na Etapa 1: objetivo do aplicativo, descrição detalhada dos 3 novos módulos escolhidos (Curadoria de Buracos, Agendamento Municipal e Enquetes / Consulta Popular), fluxos de uso e o esboço da estrutura JSON/JS em `data/mockData.js` alinhado à API oficial do professor.
- Atualizar `minhaprefeitura/README.md` com instruções claras de execução no Expo Snack (importar `.zip` ou colar arquivos) e localmente.

- [ ] **Step 3: Run full test suite and bundle verification**

Run:
```powershell
node --test tests/*.test.mjs
```
Expected: 100% PASS em todas as suítes (`mockDataAndApi`, `domainLogic`, `navigationState`).

Em seguida, validar o bundle de produção web do Expo (sem poluir o `.zip` final com `node_modules` ou `dist`):
```powershell
cd minhaprefeitura; npm install --no-audit --no-fund; npx expo export --platform web
```
Expected: `Exported: dist` sem erros de importação, sintaxe JSX ou módulos faltantes. (Se o export web apontar dependência opcional como `react-dom`/`react-native-web`, validar com o comando exato ou Babel/Metro parse sem alterar as dependências essenciais do Snack.)

- [ ] **Step 4: Generate clean deliverable ZIP (`minhaprefeitura-entrega.zip`)**

Empacotar somente os arquivos-fonte e assets de `minhaprefeitura/` (excluindo `node_modules/`, `.expo/`, `dist/`) em `minhaprefeitura-entrega.zip` e validar o conteúdo listando as entradas do `.zip`.

- [ ] **Step 5: Final Commit**

```bash
git add minhaprefeitura/App.js minhaprefeitura/README.md docs/etapa1-proposta-minha-prefeitura.md
git commit -m "feat: integrate Minha Prefeitura app, add Stage 1 docs and verify build"
```
