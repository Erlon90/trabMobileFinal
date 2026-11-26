/**
 * Fachada de serviços simulando os endpoints REST da API oficial do projeto
 * ("https://news-api.uat.i9tasks.com.br/docs/") sobre a base mockada local.
 * Quando API_CONFIG.useMock for alterado para false em etapas futuras, as chamadas
 * podem ser direcionadas a um cliente HTTP mantendo o mesmo contrato { data, meta }.
 */

import {
  MOCK_TENANT,
  MOCK_NOTICIAS,
  MOCK_NOTIFICACOES,
  MOCK_COLETA_LIXO,
  MOCK_OCORRENCIAS,
  MOCK_AGENDAMENTO_CATALOGO,
  MOCK_AGENDAMENTOS,
  MOCK_ENQUETES,
} from '../data/mockData.js';
import { normalizeSearchText, stripHtml } from '../utils/formatters.js';

export const API_CONFIG = {
  useMock: true,
  baseUrl: 'https://news-api.uat.i9tasks.com.br',
  tenantSlug: MOCK_TENANT.slug,
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Retorna os dados públicos do tenant/prefeitura configurada.
 * @param {string} [tenantSlug]
 * @returns {Promise<{ data: Object }>}
 */
export async function fetchTenant(tenantSlug = API_CONFIG.tenantSlug) {
  if (tenantSlug && tenantSlug !== MOCK_TENANT.slug) {
    throw new Error(`Prefeitura "${tenantSlug}" não encontrada.`);
  }
  return { data: cloneData(MOCK_TENANT) };
}

/**
 * Lista notícias publicadas com busca insensível a acentos, filtro por categoria e paginação.
 * @param {{ q?: string, categoria?: string, page?: number, per_page?: number }} [options]
 * @returns {Promise<{ data: Array, meta: { page: number, per_page: number, total: number, total_pages: number } }>}
 */
export async function fetchNoticias(options = {}) {
  const { q = '', categoria = 'Todas', page = 1, per_page = 20 } = options;
  const normalizedQuery = normalizeSearchText(q);
  const normalizedCategory = normalizeSearchText(categoria);

  const filtered = MOCK_NOTICIAS.filter((item) => {
    if (normalizedCategory && normalizedCategory !== 'todas') {
      if (normalizeSearchText(item.categoria) !== normalizedCategory) {
        return false;
      }
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = normalizeSearchText(
      `${item.titulo} ${item.resumo} ${item.categoria} ${stripHtml(item.conteudo)}`
    );
    return searchableText.includes(normalizedQuery);
  });

  const safePerPage = Math.max(1, Number(per_page) || 20);
  const safePage = Math.max(1, Number(page) || 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));
  const startIndex = (safePage - 1) * safePerPage;
  const paged = filtered.slice(startIndex, startIndex + safePerPage);

  return {
    data: cloneData(paged),
    meta: {
      page: safePage,
      per_page: safePerPage,
      total,
      total_pages: totalPages,
    },
  };
}

/**
 * Busca os detalhes completos de uma notícia publicada pelo seu slug.
 * @param {string} slug
 * @returns {Promise<{ data: Object }>}
 */
export async function fetchNoticiaBySlug(slug) {
  const found = MOCK_NOTICIAS.find((item) => item.slug === slug);
  if (!found) {
    throw new Error(`Notícia "${slug}" não encontrada.`);
  }
  return { data: cloneData(found) };
}

/**
 * Lista comunicados e avisos ativos (NotificacaoSummary).
 * @returns {Promise<{ data: Array, meta: { page: number, per_page: number, total: number, total_pages: number } }>}
 */
export async function fetchNotificacoes() {
  const total = MOCK_NOTIFICACOES.length;
  return {
    data: cloneData(MOCK_NOTIFICACOES),
    meta: {
      page: 1,
      per_page: total,
      total,
      total_pages: 1,
    },
  };
}

/**
 * Carrega a base inicial dos serviços utilitários e dos 3 módulos participativos do aplicativo.
 * @returns {Promise<{ coletaLixo: Array, ocorrencias: Array, catalogoAgendamento: Object, agendamentos: Array, enquetes: Array }>}
 */
export async function fetchInitialModulesData() {
  return {
    coletaLixo: cloneData(MOCK_COLETA_LIXO),
    ocorrencias: cloneData(MOCK_OCORRENCIAS),
    catalogoAgendamento: cloneData(MOCK_AGENDAMENTO_CATALOGO),
    agendamentos: cloneData(MOCK_AGENDAMENTOS),
    enquetes: cloneData(MOCK_ENQUETES),
  };
}
