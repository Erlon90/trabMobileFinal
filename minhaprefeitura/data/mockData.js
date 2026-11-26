/**
 * Dados mockados estruturados para o aplicativo "Minha Prefeitura".
 * Espelha o contrato da API REST oficial (https://news-api.uat.i9tasks.com.br/docs/)
 * e fornece a base inicial dos módulos utilitários e dos 3 novos módulos do projeto.
 */

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
    resumo:
      'Todas as Unidades Básicas de Saúde (UBS) estarão abastecidas com doses contra gripe e atualização da caderneta a partir de segunda-feira.',
    categoria: 'Saúde',
    imagem_capa_url:
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    publicado_em: '2026-11-26T10:00:00Z',
    conteudo:
      '<p>A Secretaria Municipal de Saúde inicia na próxima segunda-feira a etapa municipal da Campanha de Vacinação em todas as 18 Unidades Básicas de Saúde da cidade.</p><p>O atendimento ocorrerá das 08h às 16h30, de segunda a sexta-feira.<br/>Leve documento oficial com foto, CPF ou Cartão do SUS e a caderneta de vacinação.</p><p>Grupos prioritários podem realizar o agendamento prévio pelo módulo de Agendamento Municipal aqui no aplicativo para evitar filas.</p>',
    status: 'publicado',
    tenant_id: 1,
  },
  {
    id: 102,
    titulo: 'Manutenção e recapeamento asfáltico avançam em novas vias',
    slug: 'manutencao-e-recapeamento-asfaltico-avancam-em-novas-vias',
    resumo:
      'Equipes da Secretaria de Obras concluíram mais 4 km de recuperação viária e priorizam pontos sinalizados por moradores na Curadoria de Buracos.',
    categoria: 'Obras',
    imagem_capa_url:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
    publicado_em: '2026-11-26T07:30:00Z',
    conteudo:
      '<p>O programa de recuperação asfáltica avançou nesta semana para corredores estratégicos nos bairros Centro, Praia da Costa e Glória.</p><p>Além da aplicação de nova capa asfáltica em trechos com desgaste histórico, a equipe técnica incorporou as ocorrências com maior índice de confirmação no módulo Curadoria de Buracos.</p><p>Durante os trabalhos, trechos pontuais operam em sistema pare-e-siga com sinalização reforçada.</p>',
    status: 'publicado',
    tenant_id: 1,
  },
  {
    id: 103,
    titulo: 'Matrículas digitais para rede municipal de ensino abrem em dezembro',
    slug: 'matriculas-digitais-para-rede-municipal-abrem-em-dezembro',
    resumo:
      'Pais e responsáveis poderão solicitar transferência e novas vagas na Educação Infantil e Ensino Fundamental de forma online.',
    categoria: 'Educação',
    imagem_capa_url:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    publicado_em: '2026-11-25T15:20:00Z',
    conteudo:
      '<p>A Secretaria de Educação divulgou o calendário oficial de matrículas e rematrículas para o próximo ano letivo nas 62 escolas da rede pública municipal.</p><p>Quem precisar de atendimento presencial assistido pode reservar horário nas unidades da Casa do Cidadão pelo aplicativo.</p>',
    status: 'publicado',
    tenant_id: 1,
  },
  {
    id: 104,
    titulo: 'Novas linhas alimentadoras ampliam integração do transporte coletivo',
    slug: 'novas-linhas-alimentadoras-ampliam-integracao-do-transporte',
    resumo:
      'Readequação nos horários de pico reduz o tempo de espera nos bairros da Região 5 e integra corredores com ciclovias.',
    categoria: 'Transporte',
    imagem_capa_url: null,
    publicado_em: '2026-11-24T18:00:00Z',
    conteudo:
      '<p>A partir do dia 1º de dezembro, três novas linhas alimentadoras passam a operar com intervalos de 12 minutos nos horários de pico da manhã e da tarde.</p><p>A definição dos novos trajetos contou com sugestões recebidas nas consultas públicas de mobilidade urbana.<br/>Os quadros de horários completos estão disponíveis nos terminais e no portal da prefeitura.</p>',
    status: 'publicado',
    tenant_id: 1,
  },
  {
    id: 105,
    titulo: 'Mutirão de coleta seletiva e reciclagem chega a cinco bairros no sábado',
    slug: 'mutirao-de-coleta-seletiva-chega-a-cinco-bairros',
    resumo:
      'Ação conjunta com cooperativas de catadores recolherá papel, plástico, vidro, metais e lixo eletrônico em pontos de entrega voluntária.',
    categoria: 'Meio Ambiente',
    imagem_capa_url:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    publicado_em: '2026-11-23T11:45:00Z',
    conteudo:
      '<p>Neste sábado, das 08h às 14h, equipes ambientais estarão em praças estratégicas recebendo materiais recicláveis e pequenos eletrodomésticos sem uso.</p><p>Consulte também o calendário semanal regular no serviço Coleta de Lixo.</p>',
    status: 'publicado',
    tenant_id: 1,
  },
  {
    id: 106,
    titulo: 'Festival Cultural de Verão abre inscrições para artistas locais',
    slug: 'festival-cultural-de-verao-abre-inscricoes-para-artistas',
    resumo:
      'Edital contempla apresentações de música, teatro, dança e feiras de artesanato na orla e praças históricas do município.',
    categoria: 'Cultura',
    imagem_capa_url:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    publicado_em: '2026-11-22T09:15:00Z',
    conteudo:
      '<p>Artistas independentes e coletivos culturais da cidade já podem submeter propostas para a programação oficial de verão.</p><p>As apresentações serão gratuitas e distribuídas por quatro polos descentralizados escolhidos em enquete popular.</p>',
    status: 'publicado',
    tenant_id: 1,
  },
];

export const MOCK_NOTIFICACOES = [
  {
    id: 1,
    titulo: 'AVISO DE UTILIDADE PÚBLICA',
    mensagem:
      'Interdição parcial na Av. Champagnat (entre ruas 15 e 18) hoje até as 17h para recapeamento preventivo.',
    tipo: 'alerta',
    link_acao: 'buracos',
    enviado_em: '2026-11-26T09:00:00Z',
    expira_em: '2026-11-27T23:59:59Z',
  },
  {
    id: 2,
    titulo: 'ALERTA DE CHUVAS INTENSAS',
    mensagem:
      'Defesa Civil em estado de atenção nas próximas 24 horas. Evite vias alagadas e acione o 199 em emergências.',
    tipo: 'emergencia',
    link_acao: null,
    enviado_em: '2026-11-26T06:30:00Z',
    expira_em: '2026-11-27T18:00:00Z',
  },
  {
    id: 3,
    titulo: 'CAMPANHA DE VACINAÇÃO 2026',
    mensagem:
      'Agende sua dose contra gripe e atualização vacinal nas UBS pelo módulo de Agendamento Municipal.',
    tipo: 'campanha',
    link_acao: 'agendamento',
    enviado_em: '2026-11-25T14:00:00Z',
    expira_em: '2026-12-15T23:59:59Z',
  },
  {
    id: 4,
    titulo: 'CONSULTA POPULAR ABERTA',
    mensagem:
      'Participe das enquetes ativas e ajude a definir as prioridades de investimento do seu bairro.',
    tipo: 'utilidade_publica',
    link_acao: 'enquetes',
    enviado_em: '2026-11-24T10:00:00Z',
    expira_em: '2026-12-20T23:59:59Z',
  },
];

export const MOCK_COLETA_LIXO = [
  {
    id: 'col-1',
    bairro: 'Praia da Costa',
    coletaComum: 'Segunda, Quarta e Sexta • 19h00',
    coletaSeletiva: 'Terça e Sábado • 08h30',
    pontoEntregaVoluntaria: 'Praça da Praia da Costa (ao lado do parquinho)',
    observacao: 'Colocar os resíduos na calçada até 1 hora antes do turno.',
  },
  {
    id: 'col-2',
    bairro: 'Centro',
    coletaComum: 'Diária (Seg a Sáb) • 20h00',
    coletaSeletiva: 'Quarta e Sábado • 09h00',
    pontoEntregaVoluntaria: 'Praça Duque de Caxias',
    observacao: 'Comércio deve utilizar contentores fechados para orgânicos.',
  },
  {
    id: 'col-3',
    bairro: 'Itapuã',
    coletaComum: 'Segunda, Quarta e Sexta • 18h30',
    coletaSeletiva: 'Quinta-feira • 08h00',
    pontoEntregaVoluntaria: 'Av. Jair de Andrade, altura nº 320',
    observacao: 'Vidros devem ser embalados em papelão ou garrafa PET cortada.',
  },
  {
    id: 'col-4',
    bairro: 'Glória',
    coletaComum: 'Terça, Quinta e Sábado • 19h30',
    coletaSeletiva: 'Sexta-feira • 09h30',
    pontoEntregaVoluntaria: 'Polo Moda Glória — Estacionamento Norte',
    observacao: 'Recolhimento extra de papelão comercial às quartas-feiras.',
  },
  {
    id: 'col-5',
    bairro: 'Coqueiral de Itaparica',
    coletaComum: 'Terça, Quinta e Sábado • 18h00',
    coletaSeletiva: 'Segunda-feira • 08h30',
    pontoEntregaVoluntaria: 'Parque Urbano de Coqueiral',
    observacao: 'Descarte eletrônico recebido todo primeiro sábado do mês.',
  },
];

export const MOCK_BURACOS = [
  {
    id: 'bur-1',
    protocolo: 'BUR-2026-0001',
    titulo: 'Cratera próxima ao cruzamento da faixa de pedestres',
    endereco: 'Av. Champagnat, 890',
    bairro: 'Praia da Costa',
    pontoReferencia: 'Em frente à farmácia da esquina',
    descricao:
      'Buraco profundo na faixa da direita. Já passou por tapa-buraco duas vezes este ano e voltou a ceder com as chuvas.',
    gravidade: 'Alta',
    status: 'Recapeamento agendado',
    recorrencias: 14,
    recorrente: true,
    criadoEm: '2026-11-20T14:15:00Z',
    confirmadoPeloUsuario: false,
  },
  {
    id: 'bur-2',
    protocolo: 'BUR-2026-0002',
    titulo: 'Afundamento no corredor de ônibus',
    endereco: 'Av. Jerônimo Monteiro, 412',
    bairro: 'Centro',
    pontoReferencia: 'Ponto de ônibus próximo ao terminal antigo',
    descricao:
      'Asfalto ondulado e com duas fissuras abertas que acumulam água e causam risco para motociclistas.',
    gravidade: 'Alta',
    status: 'Em análise',
    recorrencias: 9,
    recorrente: true,
    criadoEm: '2026-11-22T09:40:00Z',
    confirmadoPeloUsuario: false,
  },
  {
    id: 'bur-3',
    protocolo: 'BUR-2026-0003',
    titulo: 'Desnível ao redor de tampa de bueiro',
    endereco: 'Rua Santa Catarina, 155',
    bairro: 'Itapuã',
    pontoReferencia: 'Ao lado da escola estadual',
    descricao:
      'Asfalto cedeu cerca de 10 cm em torno da grelha de drenagem, gerando barulho intenso na passagem de veículos.',
    gravidade: 'Média',
    status: 'Aberto',
    recorrencias: 4,
    recorrente: true,
    criadoEm: '2026-11-24T16:10:00Z',
    confirmadoPeloUsuario: false,
  },
  {
    id: 'bur-4',
    protocolo: 'BUR-2026-0004',
    titulo: 'Desgaste superficial em retorno de rua comercial',
    endereco: 'Rua da Aurora, 78',
    bairro: 'Glória',
    pontoReferencia: 'Esquina com a Rua Dom Pedro II',
    descricao:
      'Conjunto de pequenos buracos espalhados por 3 metros na conversão à direita.',
    gravidade: 'Baixa',
    status: 'Aberto',
    recorrencias: 2,
    recorrente: false,
    criadoEm: '2026-11-25T11:05:00Z',
    confirmadoPeloUsuario: false,
  },
  {
    id: 'bur-5',
    protocolo: 'BUR-2026-0005',
    titulo: 'Buraco próximo à rotatória da praça',
    endereco: 'Av. Santa Leopoldina, 610',
    bairro: 'Coqueiral de Itaparica',
    pontoReferencia: 'Saída norte da praça principal',
    descricao:
      'Recomposição asfáltica concluída com corte quadrado e selagem de borda após 7 confirmações de moradores.',
    gravidade: 'Média',
    status: 'Resolvido',
    recorrencias: 7,
    recorrente: true,
    criadoEm: '2026-11-15T13:30:00Z',
    confirmadoPeloUsuario: false,
  },
];

export const MOCK_AGENDAMENTO_CATALOGO = {
  saude: {
    label: 'Postos de Saúde (UBS)',
    servicos: [
      {
        id: 'sau-vacina',
        nome: 'Vacinação (Gripe e Caderneta)',
        duracaoMin: 15,
        documentosNecessarios: 'Documento com foto, CPF e Caderneta de Vacinação',
      },
      {
        id: 'sau-clinico',
        nome: 'Consulta Clínica Geral',
        duracaoMin: 30,
        documentosNecessarios: 'Documento com foto, CPF e Cartão do SUS',
      },
      {
        id: 'sau-odonto',
        nome: 'Avaliação Odontológica',
        duracaoMin: 30,
        documentosNecessarios: 'Documento com foto, CPF e Comprovante de residência',
      },
      {
        id: 'sau-exames',
        nome: 'Coleta de Exames Laboratoriais',
        duracaoMin: 20,
        documentosNecessarios: 'Pedido médico, Documento com foto e Cartão do SUS',
      },
    ],
    unidades: [
      {
        id: 'ubs-centro',
        nome: 'UBS Centro — Dr. Paulo Sérgio',
        bairro: 'Centro',
        endereco: 'Rua Henrique Laranja, 240 — Centro',
      },
      {
        id: 'ubs-praia',
        nome: 'UBS Praia da Costa / Itapuã',
        bairro: 'Itapuã',
        endereco: 'Rua Jair de Andrade, 510 — Itapuã',
      },
      {
        id: 'ubs-gloria',
        nome: 'UBS Glória',
        bairro: 'Glória',
        endereco: 'Av. Carlos Lindenberg, 1180 — Glória',
      },
    ],
  },
  documentos: {
    label: 'Emissão de Documentos',
    servicos: [
      {
        id: 'doc-rg',
        nome: 'Carteira de Identidade Nacional (CIN / RG)',
        duracaoMin: 25,
        documentosNecessarios: 'Certidão de Nascimento ou Casamento original + CPF',
      },
      {
        id: 'doc-iptu',
        nome: '2ª Via e Negociação de IPTU / Alvará',
        duracaoMin: 20,
        documentosNecessarios: 'Documento com foto e Inscrição Imobiliária ou CPF',
      },
      {
        id: 'doc-cadunico',
        nome: 'Atualização CadÚnico / Assistência Social',
        duracaoMin: 35,
        documentosNecessarios: 'RG, CPF e comprovante de residência de todos os moradores',
      },
      {
        id: 'doc-cartao-idoso',
        nome: 'Cartão de Estacionamento (Idoso / PCD)',
        duracaoMin: 15,
        documentosNecessarios: 'Documento com foto, comprovante de residência e laudo (se PCD)',
      },
    ],
    unidades: [
      {
        id: 'cid-centro',
        nome: 'Casa do Cidadão — Unidade Centro',
        bairro: 'Centro',
        endereco: 'Av. Luciano das Neves, 100 — Centro',
      },
      {
        id: 'cid-coqueiral',
        nome: 'Posto de Atendimento Regional — Coqueiral',
        bairro: 'Coqueiral de Itaparica',
        endereco: 'Av. Santa Leopoldina, 845 — Coqueiral',
      },
    ],
  },
  datasDisponiveis: [
    '2026-11-27',
    '2026-11-30',
    '2026-12-01',
    '2026-12-02',
    '2026-12-03',
  ],
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
    status: 'Confirmado',
    criadoEm: '2026-11-25T16:40:00Z',
  },
  {
    id: 'agd-2',
    protocolo: 'AGD-2026-0002',
    categoria: 'documentos',
    servicoId: 'doc-rg',
    servicoNome: 'Carteira de Identidade Nacional (CIN / RG)',
    unidadeId: 'cid-centro',
    unidadeNome: 'Casa do Cidadão — Unidade Centro',
    data: '2026-11-30',
    horario: '14:00',
    cidadaoNome: 'Mariana Oliveira',
    cidadaoCpf: '529.982.247-25',
    status: 'Confirmado',
    criadoEm: '2026-11-26T08:15:00Z',
  },
];

export const MOCK_ENQUETES = [
  {
    id: 'enq-1',
    titulo: 'Prioridade de investimento para o bairro Praia da Costa / Itapuã',
    categoria: 'Prioridade de Bairro',
    bairro: 'Praia da Costa / Itapuã',
    descricao:
      'Escolha qual intervenção deve liderar o pacote de obras participativas do primeiro trimestre de 2027.',
    status: 'ativa',
    encerraEm: '2026-12-10',
    opcoes: [
      { id: 'opt-1a', texto: 'Iluminação em LED e reforço de rondas noturnas', votos: 128 },
      { id: 'opt-1b', texto: 'Microdrenagem para reduzir pontos de alagamento', votos: 164 },
      { id: 'opt-1c', texto: 'Reforma da praça e instalação de academia ao ar livre', votos: 72 },
    ],
    comentarios: [
      {
        id: 'com-1',
        autor: 'Carlos Eduardo',
        bairro: 'Itapuã',
        texto: 'A drenagem nas ruas transversais precisa de solução urgente antes do verão.',
        criadoEm: '2026-11-25T11:20:00Z',
      },
      {
        id: 'com-2',
        autor: 'Fernanda Lima',
        bairro: 'Praia da Costa',
        texto: 'Troca para LED nas travessias de pedestres também ajuda muito na segurança.',
        criadoEm: '2026-11-26T09:05:00Z',
      },
    ],
  },
  {
    id: 'enq-2',
    titulo: 'Expansão da malha cicloviária conectando bairros ao Centro',
    categoria: 'Projeto da Cidade',
    bairro: 'Toda a cidade',
    descricao:
      'A prefeitura estuda implantar 12 km de ciclovia segregada. Qual eixo deve ser entregue na fase inicial?',
    status: 'ativa',
    encerraEm: '2026-12-15',
    opcoes: [
      { id: 'opt-2a', texto: 'Eixo Norte-Sul pela Av. Luciano das Neves', votos: 95 },
      { id: 'opt-2b', texto: 'Ligação Glória – Centro – Terminal', votos: 112 },
      { id: 'opt-2c', texto: 'Interligação das orlas e parques urbanos', votos: 83 },
    ],
    comentarios: [
      {
        id: 'com-3',
        autor: 'Rafael Costa',
        bairro: 'Glória',
        texto: 'Quem trabalha no comércio da Glória e Centro ganha muito com a faixa segregada.',
        criadoEm: '2026-11-24T17:40:00Z',
      },
    ],
  },
  {
    id: 'enq-3',
    titulo: 'Horário estendido das Unidades Básicas de Saúde (UBS)',
    categoria: 'Projeto da Cidade',
    bairro: 'Toda a cidade',
    descricao:
      'Qual formato facilita mais o acesso de trabalhadores e estudantes ao atendimento básico de saúde?',
    status: 'ativa',
    encerraEm: '2026-12-18',
    opcoes: [
      { id: 'opt-3a', texto: 'Terça e quinta até as 20h00', votos: 210 },
      { id: 'opt-3b', texto: 'Plantão matinal aos sábados (08h às 13h)', votos: 145 },
      { id: 'opt-3c', texto: 'Abertura mais cedo às 07h00 em dias úteis', votos: 64 },
    ],
    comentarios: [],
  },
  {
    id: 'enq-4',
    titulo: 'Escolha do tema cultural para o Festival de Verão 2026',
    categoria: 'Prioridade de Bairro',
    bairro: 'Orla e Praças Históricas',
    descricao:
      'Consulta encerrada que definiu os polos e estilos predominantes na programação cultural gratuita.',
    status: 'encerrada',
    encerraEm: '2026-11-20',
    opcoes: [
      { id: 'opt-4a', texto: 'Música regional, feiras criativas e gastronomia', votos: 318 },
      { id: 'opt-4b', texto: 'Cinema ao ar livre e teatro infantil nos bairros', votos: 204 },
    ],
    comentarios: [
      {
        id: 'com-4',
        autor: 'Juliana Alves',
        bairro: 'Centro',
        texto: 'Excelente incluir os artesãos locais na programação das praças!',
        criadoEm: '2026-11-19T19:10:00Z',
      },
    ],
  },
];
