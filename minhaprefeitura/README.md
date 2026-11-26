# Minha Prefeitura — Aplicativo Cidadão (React Native / Expo Snack)

Versão expandida do aplicativo utilitário **Minha Prefeitura**, desenvolvida em React Native (Expo SDK 54) com foco em usabilidade, componentização e compatibilidade direta com o **Expo Snack** e futura integração com a API REST oficial da disciplina.

## Funcionalidades Implementadas

1. **Módulo Obrigatório de Notícias e Avisos**
   - Feed completo de notícias com busca insensível a acentos e filtro por categoria (`Saúde`, `Obras`, `Educação`, `Transporte`, `Meio Ambiente`, `Cultura`).
   - Tela dedicada de **Detalhes da Notícia** exibindo imagem de capa (com fallback visual caso nula ou indisponível), data, resumo destacado e texto completo sanitizado (`stripHtml`).
   - **Central de Avisos e Comunicados** diferenciada por criticidade (`emergencia`, `alerta`, `campanha`, `utilidade_publica`).
2. **Utilidade Base — Coleta de Lixo**
   - Consulta de horários de coleta comum, coleta seletiva e Pontos de Entrega Voluntária (PEV) por bairro.
3. **Módulo 1 — Curadoria de Buracos**
   - Registro de novas denúncias com protocolo automático (`BUR-2026-XXXX`), endereço, bairro, gravidade e indicação de recorrência.
   - Confirmação colaborativa sem contagem duplicada (`+1 / -1`), KPIs ao vivo e filtros por status e busca.
4. **Módulo 2 — Agendamento Municipal**
   - Agendamento presencial em **Postos de Saúde (UBS)** ou **Emissão de Documentos**.
   - Validação real de CPF, bloqueio automático de horários já ocupados na mesma unidade/data, comprovante com protocolo (`AGD-2026-XXXX`) e cancelamento liberando o horário novamente.
5. **Módulo 3 — Enquetes e Consulta Popular**
   - Votação única por enquete em **Prioridades de Bairros** e **Projetos da Cidade**, com apuração percentual imediata e seção expansível de **Opiniões da População**.

---

## Estrutura de Pastas

```text
minhaprefeitura/
├── App.js                        # Ponto de entrada com AppProvider e roteamento
├── data/mockData.js              # Base mockada compatível com a API REST oficial
├── services/api.js               # Fachada assíncrona ({ data, meta })
├── context/AppContext.js         # Estado global, carregamento inicial e navegação
├── utils/
│   ├── formatters.js             # Datas pt-BR, stripHtml, normalização de busca e protocolos
│   ├── validators.js             # Validação de CPF e formulários
│   ├── domainLogic.js            # Regras puras dos 3 novos módulos
│   └── navigationReducer.js      # Reducer de abas + pilha de telas
├── components/                   # Componentes reutilizáveis (Header, BottomNav, Cards, Modal)
└── screens/                      # 10 telas completas do aplicativo
```

---

## Como Rodar o Aplicativo

### Opção 1: Expo Snack (Recomendado para apresentação)
1. Acesse [https://snack.expo.dev/](https://snack.expo.dev/).
2. Crie um novo Snack (ou abra o menu lateral de arquivos -> **Import git repository** / **Upload project**).
3. Envie o arquivo `minhaprefeitura-entrega.zip` (gerado na raiz do repositório) **ou** importe os arquivos da pasta `minhaprefeitura/`.
4. Escolha **Web**, **Android** ou **iOS** no painel direito do Expo Snack (ou leia o QR Code com o app **Expo Go**).

### Opção 2: Executar Localmente
Pré-requisitos: Node.js 20+ (testado em Node 24) e aplicativo **Expo Go** no celular (ou emulador Android/iOS).

```bash
cd minhaprefeitura
npm install
npx expo start
```

Depois, no terminal do Expo:
- Escaneie o **QR Code** com o aplicativo **Expo Go** no celular; ou
- Pressione `a` para abrir no emulador Android / `i` no simulador iOS.

### Executar Testes Automatizados (Regras de Negócio, Mock e Navegação)
Na raiz do repositório (`trabMobileFinal/`):

```bash
node --test tests/*.test.mjs
```
