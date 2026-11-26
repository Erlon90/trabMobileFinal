# Minha Prefeitura — Aplicativo Cidadão (React Native / Expo SDK 54)

Aplicativo cidadão **Minha Prefeitura**, desenvolvido em **React Native (Expo SDK 54)** com navegação nativa em pilha (**React Navigation — `Stack.Navigator`**), listagens performáticas com **`FlatList`**, componentização reutilizável via `props`, gerenciamento de estado didático com `useState`/`useEffect` e camada de serviços **100% mockada** compatível com **Expo Snack** e preparada para integração REST (`{ data, meta }`).

## Funcionalidades Implementadas

1. **Módulo Obrigatório de Notícias e Avisos**
   - Feed de notícias municipais em `FlatList` com busca insensível a acentos (`SearchBar`) e filtro por categoria (`Saúde`, `Obras`, `Educação`, `Transporte`, `Meio Ambiente`, `Cultura`).
   - Tela dedicada de **Detalhes da Notícia** (`NewsDetail`) recebendo `{ slug }` via `route.params`, exibindo imagem de capa com fallback visual, data, resumo destacado e texto completo sanitizado (`stripHtml`).
   - **Central de Avisos e Comunicados** (`Notifications`) diferenciada por criticidade (`emergencia`, `alerta`, `campanha`, `utilidade_publica`) e atalhos diretos para as rotas do `Stack.Navigator`.
2. **Utilidade Base — Coleta de Lixo (`TrashCollection`)**
   - Consulta em `FlatList` dos horários de coleta comum, coleta seletiva e Pontos de Entrega Voluntária (PEV) com busca e filtro por bairro.
3. **Módulo 1 — Radar Urbano (`RadarUrbano`)**
   - Sistema colaborativo multi-categoria para ocorrências urbanas nas categorias **`Pavimentação`**, **`Iluminação Pública`**, **`Poda e Árvores`**, **`Drenagem`** e **`Limpeza Urbana`**.
   - Registro de novas ocorrências com protocolo automático (`RAD-2026-XXXX`), validação completa de categoria/endereço/gravidade e indicação de problema recorrente.
   - Apoio colaborativo sem contagem duplicada (`+1 / -1`), KPIs em tempo real (`Registros`, `Recorrentes`, `Resolvidos`), busca textual e filtros combinados em chips horizontais de **Categoria** e **Status** (`Aberto`, `Em análise`, `Manutenção agendada`, `Resolvido`).
4. **Módulo 2 — Agendamento Municipal (`Appointment`)**
   - Agendamento presencial em **Postos de Saúde (UBS)** ou **Emissão de Documentos** com formulário guiado em 5 etapas (`AppointmentForm`).
   - Validação oficial de CPF (dígitos verificadores), bloqueio automático de horários ocupados na mesma unidade/data, comprovante com protocolo (`AGD-2026-XXXX`) e aba **Meus Agendamentos** em `FlatList` com cancelamento que libera o horário imediatamente.
5. **Módulo 3 — Enquetes e Consulta Popular (`Polls`)**
   - Votação única por enquete em **Prioridades de Bairros** e **Projetos da Cidade**, apuração percentual imediata e seção expansível de **Opiniões da População** (`PollCommentsSection`).

---

## Arquitetura e Padrões Aplicados

- **React Navigation (`@react-navigation/native` + `@react-navigation/native-stack`):** `Stack.Navigator` gerenciando a tela raiz `MainTabs` (com `BottomNav` inferior) e as rotas internas `NewsDetail`, `Notifications`, `TrashCollection`, `RadarUrbano`, `Appointment` e `Polls`.
- **Safe Area Moderna:** Uso de `SafeAreaProvider` e `SafeAreaView` de `react-native-safe-area-context`.
- **Listagens com `FlatList`:** Implementadas em `NewsListScreen`, `UrbanIssuesScreen`, `PollsScreen`, `TrashCollectionScreen`, `NotificationsScreen` e `AppointmentScreen`, mantendo cabeçalhos, `SearchBar` e chips de filtro fora da `FlatList` para preservar o foco do teclado.
- **Base 100% Mockada (`API_CONFIG.useMock = true`):** Sem chamadas HTTP externas, preservando o contrato assíncrono `{ data, meta }` em `services/api.js`.

---

## Estrutura de Pastas

```text
minhaprefeitura/
├── App.js                             # SafeAreaProvider, AppProvider, NavigationContainer e Stack.Navigator
├── index.js                           # Registro raiz do Expo
├── package.json                       # Dependências compatíveis com Expo SDK 54 / Expo Snack
├── data/
│   └── mockData.js                    # Base mockada (notícias, avisos, coleta, Radar Urbano, agendamentos e enquetes)
├── services/
│   └── api.js                         # Fachada assíncrona 100% mockada ({ data, meta })
├── context/
│   └── AppContext.js                  # Estado global simples com useState e useEffect
├── utils/
│   ├── formatters.js                  # Datas pt-BR, stripHtml, normalização sem acentos e protocolos
│   ├── validators.js                  # Validação de CPF e formulários (Radar Urbano, Agendamento e Enquetes)
│   └── domainLogic.js                 # Regras puras (createUrbanIssue, toggleUrbanIssueSupport, filterUrbanIssues, etc.)
├── components/
│   ├── AppointmentCard.js             # Card de agendamento com confirmação de cancelamento
│   ├── AppointmentForm.js             # Formulário em 5 etapas + comprovante de agendamento
│   ├── BottomNav.js                   # Barra de navegação inferior das abas principais
│   ├── EmptyState.js                  # Estado vazio reutilizável com ação opcional
│   ├── Header.js                      # Cabeçalho principal com busca integrada e badge de avisos
│   ├── NewsCard.js                    # Card de notícia com fallback de imagem
│   ├── PollCard.js                    # Card de enquete com votação e barras de resultado
│   ├── PollCommentsSection.js         # Seção expansível de opiniões da população
│   ├── ScreenHeader.js                # Cabeçalho padrão das telas internas da pilha
│   ├── SearchBar.js                   # Barra de busca reutilizável com botão de limpar
│   ├── StatusBadge.js                 # Badges coloridos para categorias e status
│   ├── UrbanIssueCard.js              # Card de ocorrência do Radar Urbano com botão de apoio
│   └── UrbanIssueModal.js             # Modal de cadastro de ocorrência multi-categoria
└── screens/
    ├── AppointmentScreen.js           # Tela de Agendamento Municipal (formulário + FlatList)
    ├── HomeScreen.js                  # Tela inicial com alertas, atalhos e últimas notícias
    ├── NewsDetailScreen.js            # Leitura completa da notícia via route.params.slug
    ├── NewsListScreen.js              # Lista de notícias em FlatList com busca e categorias
    ├── NotificationsScreen.js         # Central de avisos em FlatList
    ├── PollsScreen.js                 # Enquetes e consulta popular em FlatList
    ├── ProfileScreen.js               # Perfil do cidadão e resumo de participação
    ├── ServicesScreen.js              # Catálogo de serviços municipais
    ├── TrashCollectionScreen.js       # Coleta de lixo e seletiva em FlatList
    └── UrbanIssuesScreen.js           # Tela do Radar Urbano com KPIs, chips e FlatList
```

---

## Como Rodar o Aplicativo

### Opção 1: Expo Snack (Web, Android e iOS)
1. Acesse [https://snack.expo.dev/](https://snack.expo.dev/) (SDK 54).
2. Importe os arquivos da pasta `minhaprefeitura/`.
3. Execute diretamente nas abas **Web**, **Android** ou **iOS** (ou via QR Code no **Expo Go**).

### Opção 2: Executar Localmente
```bash
cd minhaprefeitura
npm install
npx expo start
```

### Executar Testes Automatizados (Node ESM)
Na raiz do repositório (`trabMobileFinal/`):

```bash
node --test tests/*.test.mjs
```
