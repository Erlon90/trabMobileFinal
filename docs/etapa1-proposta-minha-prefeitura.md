# Etapa 1 — Planejamento e Proposta: Aplicativo "Minha Prefeitura"

**Disciplina:** Desenvolvimento Mobile (React Native / Expo Snack)  
**Professor:** Renato Sousa Botacim  
**Projeto Base:** `minhaprefeitura` (Expo Snack)  
**API Oficial de Referência:** `https://news-api.uat.i9tasks.com.br/docs/`

---

## 1. Objetivo da Solução

Expandir o template **Minha Prefeitura** mantendo sua identidade visual e estrutura de navegação intuitiva (cabeçalho de busca rápida, alerta de utilidade pública, atalhos de serviços, feed de notícias e barra inferior de 4 abas), incorporando:

- **Módulo obrigatório de Notícias e Avisos** com feed filtrável, tela de detalhes completos, sanitização de conteúdo HTML e central de comunicados oficiais;
- **Três novos módulos utilitários** voltados à participação cidadã, manutenção urbana e agilidade no atendimento público;
- **Arquitetura desacoplada de dados mockados** (`minhaprefeitura/data/mockData.js` + `minhaprefeitura/services/api.js`), espelhando fielmente os contratos REST da API oficial (`{ data, meta }`) para permitir substituição direta por `fetch` na etapa de integração.

---

## 2. Descrição dos 3 Novos Módulos Propostos

### Módulo 1: Curadoria de Buracos
- **Propósito:** Permitir que moradores denunciem buracos e afundamentos em vias públicas, destacando problemas **recorrentes** (vias onde reparos anteriores cederam) para priorização de recapeamento definitivo pela Secretaria de Obras.
- **Funcionalidades:**
  - Registro de nova ocorrência com título, rua/avenida, bairro, ponto de referência, gravidade (`Baixa`, `Média`, `Alta`), marcador de recorrência e descrição detalhada, gerando protocolo `BUR-2026-XXXX`.
  - Botão colaborativo **"Confirmar buraco"** (`+1 / -1` por usuário, evitando contagem duplicada) para validar ocorrências existentes na comunidade.
  - Painel de KPIs (`Registros`, `Recorrentes`, `Resolvidos`), busca textual por rua/bairro/protocolo e filtro por status (`Aberto`, `Em análise`, `Recapeamento agendado`, `Resolvido`).

### Módulo 2: Agendamento Municipal
- **Propósito:** Evitar filas presenciais oferecendo marcação de horários em **Postos de Saúde (UBS)** e **Emissão de Documentos (Casa do Cidadão)** diretamente pelo aplicativo.
- **Funcionalidades:**
  - Seleção guiada em etapas: Área (`Postos de Saúde` ou `Documentos`) → Serviço (com duração estimada e lista de documentos exigidos) → Unidade de atendimento → Data e Horário disponível.
  - Controle dinâmico de disponibilidade: horários já reservados em uma unidade/data ficam bloqueados (`Ocupado`).
  - Validação oficial de dígitos verificadores de CPF (`000.000.000-00`), geração de comprovante com protocolo `AGD-2026-XXXX` e aba **Meus Agendamentos** com opção de cancelamento que libera o horário imediatamente.

### Módulo 3: Enquetes e Consulta Popular
- **Propósito:** Fortalecer o orçamento participativo e a escuta ativa da prefeitura, permitindo votação em prioridades de bairros e projetos da cidade.
- **Funcionalidades:**
  - Filtros por tipo (`Prioridades de Bairros`, `Projetos da Cidade`, `Encerradas`).
  - Votação única por consulta ativa, bloqueio de voto em consultas encerradas e exibição imediata de barras proporcionais com percentuais e contagem de votos.
  - Área expansível **Opiniões da População** em cada enquete para leitura e envio de comentários validados pelos moradores.

---

## 3. Esboço da Estrutura de Dados Mockados (`minhaprefeitura/data/mockData.js`)

Os dados residem em `minhaprefeitura/data/mockData.js` e são acessados por `minhaprefeitura/services/api.js` no mesmo formato paginado `{ data, meta }` da API REST oficial:

```js
// 1. Tenant e Notícias (espelhando schemas TenantPublic e Noticia da API oficial)
export const MOCK_TENANT = {
  id: 1,
  nome: 'Prefeitura Municipal de Vila Velha',
  slug: 'vila-velha',
  codigo_ibge: '3205200',
  ativo: 1,
};

export const MOCK_NOTICIAS = [
  {
    id: 101,
    titulo: 'Campanha de Vacinação municipal começa na próxima semana',
    slug: 'campanha-de-vacinacao-municipal-comeca-na-proxima-semana',
    resumo: 'Unidades Básicas de Saúde abastecidas a partir de segunda-feira.',
    categoria: 'Saúde',
    imagem_capa_url: 'https://...', // aceita null com fallback visual no app
    publicado_em: '2026-11-26T10:00:00Z',
    conteudo: '<p>Texto completo em HTML simples ou texto plano...</p>',
    status: 'publicado',
    tenant_id: 1,
  },
];

// 2. Notificações / Avisos (espelhando NotificacaoSummary)
export const MOCK_NOTIFICACOES = [
  {
    id: 1,
    titulo: 'AVISO DE UTILIDADE PÚBLICA',
    mensagem: 'Interdição parcial na Av. Champagnat até as 17h.',
    tipo: 'alerta', // 'alerta' | 'emergencia' | 'campanha' | 'utilidade_publica'
    link_acao: 'buracos',
    enviado_em: '2026-11-26T09:00:00Z',
    expira_em: '2026-11-27T23:59:59Z',
  },
];

// 3. Módulo Curadoria de Buracos
export const MOCK_BURACOS = [
  {
    id: 'bur-1',
    protocolo: 'BUR-2026-0001',
    titulo: 'Cratera próxima ao cruzamento da faixa de pedestres',
    endereco: 'Av. Champagnat, 890',
    bairro: 'Praia da Costa',
    pontoReferencia: 'Em frente à farmácia da esquina',
    descricao: 'Buraco profundo que voltou a ceder com as chuvas.',
    gravidade: 'Alta', // 'Baixa' | 'Média' | 'Alta'
    status: 'Recapeamento agendado', // 'Aberto' | 'Em análise' | 'Recapeamento agendado' | 'Resolvido'
    recorrencias: 14,
    recorrente: true,
    criadoEm: '2026-11-20T14:15:00Z',
    confirmadoPeloUsuario: false,
  },
];

// 4. Módulo Agendamento Municipal
export const MOCK_AGENDAMENTO_CATALOGO = {
  saude: { label: 'Postos de Saúde (UBS)', servicos: [...], unidades: [...] },
  documentos: { label: 'Emissão de Documentos', servicos: [...], unidades: [...] },
  datasDisponiveis: ['2026-11-27', '2026-11-30', ...],
  horariosPadrao: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
};

export const MOCK_AGENDAMENTOS = [
  {
    id: 'agd-1',
    protocolo: 'AGD-2026-0001',
    categoria: 'saude',
    servicoId: 'sau-vacina',
    servicoNome: 'Vacinação (Gripe e Caderneta)',
    unidadeId: 'ubs-centro',
    unidadeNome: 'UBS Centro — Dr. Paulo Sérgio',
    data: '2026-11-27',
    horario: '09:00',
    cidadaoNome: 'Mariana Oliveira',
    cidadaoCpf: '529.982.247-25',
    status: 'Confirmado', // 'Confirmado' | 'Cancelado'
    criadoEm: '2026-11-25T16:40:00Z',
  },
];

// 5. Módulo Enquetes / Consulta Popular
export const MOCK_ENQUETES = [
  {
    id: 'enq-1',
    titulo: 'Prioridade de investimento para o bairro Praia da Costa / Itapuã',
    categoria: 'Prioridade de Bairro', // 'Prioridade de Bairro' | 'Projeto da Cidade'
    bairro: 'Praia da Costa / Itapuã',
    descricao: 'Escolha qual intervenção deve liderar as obras do trimestre.',
    status: 'ativa', // 'ativa' | 'encerrada'
    encerraEm: '2026-12-10',
    opcoes: [
      { id: 'opt-1a', texto: 'Iluminação em LED', votos: 128 },
      { id: 'opt-1b', texto: 'Microdrenagem', votos: 164 },
    ],
    comentarios: [
      {
        id: 'com-1',
        autor: 'Carlos Eduardo',
        bairro: 'Itapuã',
        texto: 'A drenagem precisa de solução urgente.',
        criadoEm: '2026-11-25T11:20:00Z',
      },
    ],
  },
];
```
