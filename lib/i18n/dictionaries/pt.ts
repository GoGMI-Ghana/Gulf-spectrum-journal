// European/African Portuguese register (as used in São Tomé and Príncipe,
// Angola and the other Lusophone Gulf of Guinea states), not Brazilian.

import type { Dictionary } from './en'

const pt: Dictionary = {
  meta: {
    siteTitle: 'Gulf Spectrum Journal — Uma publicação do Gulf of Guinea Maritime Institute',
    siteDescription:
      'O Gulf Spectrum Journal é a revista de investigação do Gulf of Guinea Maritime Institute (GoGMI). Publica investigação produzida localmente e revista por um conselho editorial sobre segurança e governação marítimas no golfo da Guiné.',
  },

  journal: {
    subtitle: 'Uma publicação do Gulf of Guinea Maritime Institute',
    frequency: 'Publicação anual, em volumes temáticos',
    issnPending: 'ISSN em atribuição',
    aboutText: `O Gulf Spectrum Journal é a revista de investigação do Gulf of Guinea Maritime Institute (GoGMI). Publica perspetivas de dentro, produzidas localmente, sobre a governação, a segurança e a proteção marítimas no golfo da Guiné. A sua missão é oferecer aos intervenientes da região e de fora dela uma plataforma credível e consolidada para a investigação dos oficiais, investigadores e profissionais que trabalham diretamente nestas questões — como alternativa à investigação sobre a região produzida noutros lugares.

Cada volume é revisto por um conselho editorial dedicado, composto por especialistas na matéria, que define o estilo de citação e as orientações de extensão do volume e supervisiona a qualidade e o rigor do seu conteúdo antes da publicação. A revista apoia o trabalho mais amplo de advocacia e reforço de capacidades do GoGMI nas suas quatro áreas principais: Investigação, Advocacia, Reforço de Capacidades e Consultoria — incluindo iniciativas emblemáticas como o International Maritime Security Working Group (IMSWG) e o programa WYTEC Blue para mulheres e jovens na economia azul.`,
    scopeAreas: [
      'Segurança marítima',
      'Desenvolvimento da economia azul',
      'Cooperação regional e governação no golfo da Guiné',
      'Reforço de capacidades, incluindo a participação de jovens e mulheres na economia azul',
      'Experiências de consultoria e estudos de caso, quando adequados para divulgação pública',
      'Assuntos marítimos do golfo da Guiné e da África Ocidental em geral',
    ],
  },

  common: {
    loading: 'A carregar…',
    signIn: 'Inicie sessão',
    signInButton: 'Iniciar sessão',
    signUpButton: 'Registar-se',
    signOut: 'Terminar sessão',
    email: 'E-mail',
    password: 'Palavra-passe',
    fullName: 'Nome completo',
    or: 'ou',
    sending: 'A enviar…',
    submitting: 'A enviar…',
    saving: 'A guardar…',
    somethingWrong: 'Ocorreu um erro. Tente novamente.',
    copied: 'Copiada',
    copyCitation: 'Copiar citação',
    researchArticle: 'Artigo de investigação',
    issueNumber: 'Número {number}',
    volumeShort: 'Vol. {volume} · {date}',
    articleCount: { one: '{count} artigo', other: '{count} artigos' },
    and: ' e ',
    accountEyebrow: 'Conta',
  },

  nav: {
    home: 'Início',
    articlesAndIssues: 'Artigos e números',
    topics: 'Temas',
    about: 'Sobre a revista',
    authors: 'Autores',
    submissions: 'Normas de submissão',
    contact: 'Contacto',
    citations: 'Citações',
    analytics: 'Estatísticas',
    upload: 'Submeter',
    tools: 'Ferramentas',
    latestIssue: 'Último número',
    editorialBoard: 'Conselho editorial',
    bookmarks: 'Favoritos',
    messages: 'Mensagens',
    notifications: 'Notificações',
    myProfile: 'O meu perfil',
    accountSettings: 'Definições da conta',
    dashboard: 'Painel',
    editorialAdmin: 'Administração editorial',
    authorProfiles: 'Perfis de autores',
  },

  header: {
    publicationOf: 'Uma publicação do Gulf of Guinea Maritime Institute',
    toggleMenu: 'Mostrar ou ocultar o menu',
    language: 'Idioma',
  },

  footer: {
    blurb:
      '{subtitle}, publicada pelo Gulf of Guinea Maritime Institute (GoGMI). Investigação produzida localmente e revista por um conselho editorial sobre a governação, a segurança e a proteção marítimas no golfo da Guiné.',
    journalHeading: 'A revista',
    moreHeading: 'Mais',
    contactOffice: 'Contactar a redação',
    correctionPolicy: 'Política de correções',
    rights: '© {year} Gulf of Guinea Maritime Institute. Todos os direitos reservados.',
  },

  accountMenu: {
    ariaLabel: 'Menu da conta',
    guest: 'Investigador convidado',
    notSignedIn: 'Sessão não iniciada',
    signedIn: 'Sessão iniciada',
    sectionAccount: 'Conta',
    sectionEditorial: 'Editorial',
    sectionMyResearch: 'A minha investigação',
    sectionMore: 'Mais',
  },

  subNav: {
    searchPlaceholder: 'Pesquisar na revista',
    search: 'Pesquisar',
    submitArticle: 'Submeta o seu artigo →',
  },

  home: {
    metaDescription:
      'O Gulf Spectrum Journal é a revista de investigação do Gulf of Guinea Maritime Institute (GoGMI). Publica investigação produzida localmente e revista por um conselho editorial sobre segurança marítima, economia azul, governação e reforço de capacidades.',
    intro:
      'Investigação produzida localmente e revista por um conselho editorial sobre a governação, a segurança e a proteção marítimas no golfo da Guiné — escrita pelos oficiais de marinha, investigadores e profissionais que trabalham diretamente nestas questões.',
    readLatest: 'Ler o último número',
    aboutJournal: 'Sobre a revista',
    issueHeading: 'Número {number}: {theme}',
    viewIssue: 'Ver número →',
    aboutBody:
      'O Gulf Spectrum Journal dá aos intervenientes do golfo da Guiné e de fora dele acesso a perspetivas de dentro, produzidas localmente, sobre a governação, a segurança e a proteção marítimas na região.',
    learnMore: 'Saber mais →',
    submitHeading: 'Submeta a sua investigação',
    submitBody:
      'O Gulf Spectrum Journal aceita submissões de investigadores, oficiais e profissionais que trabalham em assuntos marítimos do golfo da Guiné.',
    viewGuidelines: 'Ver as normas de submissão →',
    boardHeading: 'Conselho editorial',
    boardBody:
      'Conheça os editores que revêem e publicam a investigação do Gulf Spectrum Journal — ou candidate-se para se juntar a eles.',
    applyBoard: 'Candidatar-se ao conselho editorial →',
    browseByTopic: 'Explorar por tema',
    allTopics: 'Todos os temas →',
    browseArticlesIssues: 'Explorar artigos e números',
    viewAll: 'Ver tudo →',
    emptyHeading: 'Primeiro número em breve',
    emptyBody:
      'O Gulf Spectrum Journal está a preparar o seu primeiro número. Entretanto, conheça a revista ou submeta a sua investigação.',
  },

  about: {
    metaTitle: 'Sobre a revista',
    metaDescription:
      'A missão do Gulf Spectrum Journal: investigação produzida localmente sobre segurança e governação marítimas no golfo da Guiné, revista por um conselho editorial dedicado.',
    eyebrow: 'Sobre',
    title: 'Sobre a revista',
    heroAlt:
      'Oficiais de marinha, investigadores e decisores políticos na Conferência de Segurança Marítima 2025 do GoGMI, em Acra',
    heroCaption:
      'Conferência de Segurança Marítima 2025 do GoGMI, Acra — a rede de colaboradores em que esta revista se apoia.',
    scope: 'Âmbito',
    standards: 'Normas de conteúdo e garantias de confiança',
    trustSignals: [
      {
        title: 'Revisão editorial',
        body: 'Cada volume é revisto por um conselho editorial dedicado antes da publicação. Os revisores definem o estilo de citação e as orientações de extensão do volume.',
      },
      {
        title: 'Autoria identificada',
        body: 'Cada artigo apresenta o nome, a fotografia e a afiliação institucional de cada autor, juntamente com uma lista completa de referências formatada.',
      },
      {
        title: 'Política de correções',
        body: 'As correções aos artigos publicados são assinaladas e datadas no próprio artigo. Consulte a nossa política de correções para mais pormenores.',
      },
      {
        title: 'Declaração de interesses',
        body: 'Os artigos incluem, quando aplicável, uma declaração sobre financiamento ou conflitos de interesses.',
      },
    ],
    details: 'Dados da revista',
    publisher: 'Editora',
    frequency: 'Periodicidade',
    issn: 'ISSN',
    founded: 'Fundação',
    board: 'Conselho editorial',
    noBoard: 'Ainda não há membros do conselho editorial listados.',
    viewFullBoard: 'Ver o conselho editorial completo →',
    readCorrectionPolicy: 'Ler a política de correções →',
  },

  issues: {
    metaTitle: 'Artigos e números',
    metaDescription: 'Explore todos os artigos e números do Gulf Spectrum Journal por volume, tema e assunto.',
    eyebrow: 'Arquivo',
    title: 'Artigos e números',
    description:
      'Explore o Gulf Spectrum Journal por volume. Cada número é uma coleção temática de artigos de investigação revistos por um conselho editorial. Prefere explorar por assunto? {link}',
    seeTopics: 'Ver temas →',
    empty: 'Ainda não foi publicado nenhum número — o primeiro está a caminho.',
  },

  issue: {
    notFound: 'Número não encontrado',
    metaTitle: 'Número {number}: {theme}',
    volume: 'Volume {volume} · {date}',
    inThisIssue: 'Neste número',
    issueBoard: 'Conselho editorial do número',
    allIssues: '← Todos os números',
    downloadPdf: 'Descarregar o número completo (PDF)',
    coverAlt: 'Capa: número {number}, {theme}',
  },

  article: {
    notFound: 'Artigo não encontrado',
    breadcrumb: 'Artigo',
    abstract: 'Resumo',
    keywords: 'Palavras-chave —',
    conclusion: 'Conclusão',
    references: 'Referências',
    aboutAuthors: 'Sobre os autores',
    citeHeading: 'Citar este artigo',
    views: 'Visualizações',
    downloads: 'Descargas do PDF',
    volumeIssue: 'Volume {volume}, número {number}',
    publishedOnline: 'Publicado online: {date}',
    citeLink: 'Citar este artigo',
    doiPending: 'DOI: pendente',
    fullArticle: 'Artigo completo',
    authorsTab: 'Autores',
    inThisArticle: 'Neste artigo',
    relatedHeading: 'Mais deste número',
    viewIssue: 'Ver o número completo →',
    citeStyle: 'Estilo de citação',
    citeExport: 'Exportar para gestores de referências:',
    downloadPdf: 'Descarregar PDF',
    correction: 'Correção',
    correctionPolicyLink: 'Leia a nossa política de correções →',
    disclosure: 'Financiamento e conflitos de interesses',
    share: 'Partilhar',
    shareOnX: 'Partilhar no X',
    shareOnFacebook: 'Partilhar no Facebook',
    shareOnLinkedIn: 'Partilhar no LinkedIn',
    shareOnWhatsApp: 'Partilhar no WhatsApp',
    copyLink: 'Copiar ligação',
    linkCopied: 'Ligação copiada',
  },

  bookmarkButton: {
    signInAria: 'Inicie sessão para guardar este artigo nos favoritos',
    signInLabel: 'Inicie sessão para guardar',
    remove: 'Remover dos favoritos',
    add: 'Guardar este artigo nos favoritos',
    bookmarked: 'Nos favoritos',
    bookmark: 'Guardar',
  },

  support: {
    heading: 'Apoie esta investigação',
    body: 'Achou este artigo útil? Envie uma contribuição direta a {authors}. {authorPercent}% vai para os autores; o Gulf Spectrum Journal (GoGMI) retém {platformPercent}% para manter a plataforma.',
    fallbackAuthors: 'os autores',
    invalidEmail: 'Introduza um e-mail válido — a Paystack envia-lhe o recibo para lá.',
    startFailed: 'Ocorreu um erro ao iniciar o pagamento.',
    otherAmount: 'Outro (GHS)',
    namePlaceholder: 'O seu nome (opcional)',
    emailPlaceholder: 'O seu e-mail',
    redirecting: 'A redirecionar para a Paystack…',
    donate: 'Doar {amount} GHS',
    secure:
      'Concluirá o pagamento na página segura da Paystack — nunca vemos nem guardamos os dados do seu cartão.',
    thanks:
      'Obrigado pelo seu donativo — estamos a confirmar o pagamento. Normalmente é imediato; o recibo ser-lhe-á enviado diretamente pela Paystack.',
  },

  topics: {
    metaTitle: 'Temas',
    metaDescription:
      'Explore o Gulf Spectrum Journal por tema — segurança marítima, economia azul, governação, reforço de capacidades e muito mais.',
    eyebrow: 'Explorar por assunto',
    title: 'Temas',
    description:
      'O Gulf Spectrum Journal abrange todo o âmbito do trabalho do GoGMI, e não apenas a segurança marítima. Explore os artigos por tema abaixo.',
  },

  topic: {
    notFound: 'Tema não encontrado',
    kicker: 'Tema',
    empty: 'Ainda não foram publicados artigos neste tema. Explore {topicsLink} ou {issuesLink}.',
    allTopicsLink: 'todos os temas',
    allIssuesLink: 'todos os números',
    back: '← Todos os temas',
  },

  authors: {
    empty: 'Os perfis dos colaboradores aparecerão aqui assim que os primeiros artigos forem publicados.',
    metaTitle: 'Autores',
    metaDescription:
      'Conheça os oficiais de marinha, investigadores e juristas que colaboram com o Gulf Spectrum Journal.',
    eyebrow: 'Colaboradores',
    title: 'Autores',
    description:
      'Os colaboradores do Gulf Spectrum Journal são oficiais da marinha e da guarda costeira, investigadores universitários, juristas e outros especialistas do Gana e de países parceiros.',
  },

  author: {
    notFound: 'Autor não encontrado',
    articles: 'Artigos',
    biography: 'Biografia',
    back: '← Todos os autores',
    isThisYou: 'É você? {link}.',
    signInToClaim: 'Inicie sessão para reivindicar este perfil',
    claimProfile: 'Reivindicar este perfil',
  },

  claim: {
    metaTitle: 'Reivindicar {name}',
    metaFallback: 'Reivindicar perfil de autor',
    eyebrow: 'Autores',
    title: 'Reivindicar {name}',
    description: 'Associe este perfil de autor à sua conta.',
    signInPrompt: '{link} para reivindicar este perfil.',
    alreadyClaimed: 'Este perfil já está associado a uma conta.',
    alreadyLinked:
      'A sua conta já está associada a outro perfil de autor. Contacte a redação se se tratar de um erro.',
    pending:
      'O seu pedido relativo a {name} está a ser analisado pela equipa editorial. Verá o perfil associado à sua conta assim que for aprovado.',
    intro:
      'Reivindicar {name} associa este perfil de autor à sua conta, para que possa manter atualizados a biografia, a fotografia e as credenciais.',
    messageLabel: 'Qualquer informação que ajude a confirmar que é você (opcional)',
    messagePlaceholder:
      'p. ex., o seu e-mail institucional, uma ligação para o seu trabalho ou a forma como a redação pode verificá-lo.',
    submit: 'Enviar pedido',
  },

  citations: {
    metaTitle: 'Citações',
    metaDescription: 'Citações prontas a copiar para todos os artigos publicados no Gulf Spectrum Journal.',
    featureCards: [
      {
        title: 'Citações',
        subtitle: 'Verificadas, em formato APA',
        body: 'Dados de autores, número e revista extraídos diretamente do artigo — sem formatação manual.',
      },
      {
        title: 'Referências',
        subtitle: 'Todas as fontes citadas',
        body: 'Veja em que se baseia cada artigo — a lista completa de referências está na página de cada artigo.',
      },
      {
        title: 'Temas',
        subtitle: 'Explorar por assunto',
        body: 'Filtre as citações por segurança marítima, governação, reforço de capacidades e muito mais.',
      },
    ],
    bottomFeatures: ['Todos os artigos indexados', 'Formato APA, automaticamente', 'Cópia com um clique'],
    heroPills: { topics: 'Temas', issues: 'Números', authors: 'Autores' },
    kicker: 'Índice de citações',
    heading: '{count} fontes citadas no {journal}',
    intro:
      'Cada artigo publicado, totalmente referenciado e pronto a citar — gerado a partir de dados reais de autores, números e revista, e não estimado.',
    browseIndex: 'Explorar o índice de citações →',
    insideHeading: 'Por dentro do índice de citações',
    trackHeading: 'Acompanhe o corpus',
    trackBody: 'Veja o total de citações disponíveis e como o corpus cresce número a número.',
    totalCitations: 'Total de citações',
    articlesIndexed: 'Artigos indexados',
    topicsCovered: 'Temas abrangidos',
    colTopic: 'Tema',
    colArticles: 'Artigos',
    whereHeading: 'Veja onde se concentram as citações',
    whereBody:
      'Citações repartidas por tema, para ver rapidamente o que já foi escrito sobre um assunto — e onde o corpus ainda é escasso.',
    trustLine:
      'Todas as citações desta página são geradas a partir dos dados publicados pelo próprio Gulf Spectrum Journal — sem recolha externa nem estimativas.',
    exploreHeading: 'Explorar citações',
    ctaHeading: 'Apoie a investigação por detrás destas citações',
    ctaBody:
      'Faça um donativo diretamente aos autores de um artigo a partir da respetiva página — a maior parte de cada contribuição vai diretamente para os investigadores que o escreveram.',
    browseArticles: 'Explorar artigos →',
    issueLabel: 'Número {number} · {year}',
    viewArticle: 'Ver artigo →',
    empty: 'As citações aparecerão aqui assim que os primeiros artigos forem publicados.',
  },

  contact: {
    metaTitle: 'Contacto',
    metaDescription:
      'Contacte a redação do Gulf Spectrum Journal, uma publicação do Gulf of Guinea Maritime Institute.',
    eyebrow: 'Fale connosco',
    title: 'Contacto',
    description: 'Questões sobre submissões, números anteriores ou parcerias com o Gulf Spectrum Journal.',
    office: 'Redação',
    address: 'Morada',
    addressValue: 'Gulf of Guinea Maritime Institute, Acra, Gana',
    gogmiBody:
      'O Gulf Spectrum Journal é publicado pelo Gulf of Guinea Maritime Institute, um centro de estudos marítimos sem fins lucrativos que atua em toda a região.',
    visit: 'Visitar gogmi.org.gh →',
    name: 'Nome',
    subject: 'Assunto',
    message: 'Mensagem',
    send: 'Enviar mensagem',
    thanks: 'Obrigado — a sua mensagem foi enviada à redação.',
  },

  submissions: {
    metaTitle: 'Normas de submissão',
    metaDescription:
      'Orientações para autores e coautores que pretendam submeter investigação ao Gulf Spectrum Journal.',
    eyebrow: 'Para autores',
    title: 'Normas de submissão',
    description:
      'O Gulf Spectrum Journal aceita investigação original de oficiais da marinha e da guarda costeira, académicos, juristas e outros especialistas que trabalham em assuntos marítimos do golfo da Guiné.',
    prepareHeading: 'O que preparar',
    prepareIntro:
      'Cada artigo requer os seguintes campos estruturados. O estilo de citação e as orientações de extensão são definidos pelo conselho editorial do número e ser-lhe-ão confirmados no momento da submissão.',
    fields: [
      'Título',
      'Autor(es) / coautor(es), cada um com fotografia e afiliação institucional',
      'Resumo',
      'Palavras-chave',
      'Corpo do texto com secções tituladas',
      'Conclusão',
      'Uma lista de referências formatada',
    ],
    workflowHeading: 'Processo editorial',
    workflow: [
      { title: 'Submissão', body: 'Envie o seu manuscrito e os dados dos autores através do formulário abaixo.' },
      { title: 'Revisão editorial', body: 'O conselho editorial do número avalia a qualidade e o rigor da submissão.' },
      { title: 'Revisões', body: 'Os autores respondem às observações dos revisores antes de o artigo ser finalizado.' },
      { title: 'Publicação', body: 'O artigo é publicado no respetivo número temático, com crédito total aos autores.' },
    ],
    coauthorHeading: 'Coautoria',
    coauthorBody:
      'Os artigos com vários autores são bem-vindos e frequentes nesta revista. Indique o nome, a fotografia e a afiliação institucional de cada coautor no momento da submissão.',
    referencingHeading: 'Referências',
    referencingBody:
      'O estilo de referências é definido para cada número pelo respetivo conselho editorial. Submeta a sua lista de referências no formato usado na sua área; o conselho confirmará o estilo final durante a revisão.',
    formHeading: 'Inicie a sua submissão',
    titleLabel: 'Título proposto para o artigo',
    abstractLabel: 'Resumo (rascunho)',
    manuscriptLabel: 'Manuscrito (opcional)',
    manuscriptHint: 'Word, PDF, OpenDocument ou RTF, até {max} MB.',
    manuscriptWrongType: 'Anexe um ficheiro Word, PDF, OpenDocument ou RTF.',
    manuscriptTooLarge: 'O ficheiro é demasiado grande — o limite é de {max} MB.',
    manuscriptUploading: 'A carregar o manuscrito…',
    manuscriptUploadFailed: 'Não foi possível carregar o manuscrito. Tente novamente.',
    submit: 'Submeter para revisão',
    thanks: 'Obrigado — a sua proposta foi enviada à redação para revisão.',
  },

  board: {
    metaTitle: 'Conselho editorial',
    metaDescription: 'Conheça o atual conselho editorial do Gulf Spectrum Journal.',
    title: 'Conselho editorial',
    description: 'Os editores que revêem e publicam a investigação do Gulf Spectrum Journal.',
    empty: 'Ainda não há membros do conselho editorial listados.',
    joinHeading: 'Tem interesse em juntar-se?',
    joinBody:
      'O Gulf Spectrum Journal integra periodicamente novos membros no conselho editorial, escolhidos entre os seus leitores registados e colaboradores.',
    apply: 'Candidatar-se ao conselho editorial →',
  },

  boardApply: {
    metaTitle: 'Candidatura ao conselho editorial',
    metaDescription: 'Candidate-se ao conselho editorial do Gulf Spectrum Journal.',
    eyebrow: 'Conselho editorial',
    title: 'Candidatura ao conselho editorial',
    description: 'As candidaturas são analisadas pela equipa de administração do Gulf Spectrum Journal.',
    signInPrompt: '{link} para se candidatar — os membros do conselho editorial têm de ter conta na plataforma.',
    alreadyMember: 'Já faz parte do conselho editorial, como {title}.',
    pending:
      'A sua candidatura está com a equipa de administração{submitted}. O seu cargo no conselho aparecerá na sua conta depois de a candidatura ser analisada.',
    submittedOn: ' desde {date}',
    declined: 'A sua candidatura anterior não foi aceite. Pode voltar a candidatar-se abaixo.',
    statementLabel: 'Porque gostaria de se juntar ao conselho editorial?',
    statementPlaceholder:
      'O seu percurso, a sua experiência relevante e o que traria à revisão e publicação da investigação do Gulf Spectrum Journal.',
    submit: 'Enviar candidatura',
  },

  search: {
    metaTitle: 'Pesquisa',
    metaTitleQuery: 'Pesquisa: {query}',
    metaDescription: 'Resultados da pesquisa por «{query}» no Gulf Spectrum Journal.',
    eyebrow: 'Pesquisa',
    title: 'Pesquisa',
    resultsFor: 'Resultados para «{query}»',
    found: {
      one: '{count} artigo encontrado em títulos, resumos, palavras-chave e autores.',
      other: '{count} artigos encontrados em títulos, resumos, palavras-chave e autores.',
    },
    prompt: 'Introduza um termo para encontrar artigos por título, resumo, palavra-chave ou autor.',
    noResults: 'Nenhum artigo corresponde a «{query}». Experimente outro termo ou explore {link}.',
    allIssues: 'todos os números',
  },

  tools: {
    metaTitle: 'Ferramentas',
    metaDescription: 'Pesquisa, citações, favoritos e outras ferramentas para trabalhar com o Gulf Spectrum Journal.',
    title: 'Ferramentas',
    description: 'Tudo o que precisa para trabalhar com o Gulf Spectrum Journal, num só lugar.',
    searchTitle: 'Pesquisa',
    searchBody: 'Encontre artigos por título, resumo, palavra-chave ou autor.',
    citationsTitle: 'Citações',
    citationsBody: 'Copie uma citação pronta para qualquer artigo publicado.',
    bookmarksTitle: 'Favoritos',
    bookmarksBody: {
      one: '{count} artigo guardado na sua conta.',
      other: '{count} artigos guardados na sua conta.',
    },
    uploadTitle: 'Carregar / Submeter',
    uploadBody: 'Inicie uma submissão para um próximo número.',
    analyticsTitle: 'Estatísticas',
    analyticsBody: 'Leitores e interação em toda a revista.',
  },

  analytics: {
    metaTitle: 'Estatísticas',
    metaDescription: 'Estatísticas de leitura do Gulf Spectrum Journal.',
    title: 'Estatísticas',
    tabOverview: 'Visão geral',
    tabPapers: 'Artigos',
    tabTopics: 'Temas',
    tabAuthors: 'Autores',
    days30: '30 dias',
    days60: '60 dias',
    exportCsv: 'Exportar como CSV',
    engagement: 'Interação com os artigos',
    chartLabel: 'Visualizações e transferências de artigos ao longo do tempo',
    periodViews: 'Visualizações em {days} dias',
    periodDownloads: 'Transferências em {days} dias',
    allTimeViews: 'Visualizações (total)',
    allTimeDownloads: 'Transferências (total)',
    colTopic: 'Tema',
    colArticles: 'Artigos',
    colAuthor: 'Autor',
    colTitle: 'Título',
    footnote:
      "As visualizações e as transferências de PDF são contadas a partir de visitas reais à página de cada artigo, desde que cada acompanhamento foi implementado — os valores anteriores serão baixos ou nulos.",
  },

  dashboard: {
    metaTitle: 'Painel',
    metaDescription: 'O seu painel do Gulf Spectrum Journal.',
    shareCta: 'Partilhe a sua investigação com outros profissionais marítimos do golfo da Guiné →',
    recent: 'Artigos recentes',
    submitNew: 'Submeter novo artigo',
    empty: 'Ainda não foi publicado nenhum artigo.',
  },

  bookmarks: {
    metaTitle: 'Favoritos',
    metaDescription: 'Os artigos que guardou nos favoritos do Gulf Spectrum Journal.',
    eyebrow: 'A sua lista de leitura',
    title: 'Favoritos',
    description: 'Guardados na sua conta — inicie sessão para os ver em qualquer dispositivo.',
    signInPrompt: '{link} para ver os seus favoritos — agora ficam guardados na sua conta, e não apenas neste navegador.',
    loading: 'A carregar os seus favoritos…',
    empty:
      'Ainda não tem favoritos. Abra qualquer artigo e toque no ícone de favorito para o guardar aqui. Explore {link} para começar.',
    emptyLink: 'os artigos e números',
  },

  signIn: {
    metaTitle: 'Iniciar sessão',
    metaDescription: 'Inicie sessão na sua conta do Gulf Spectrum Journal.',
    title: 'Iniciar sessão',
    description: 'Inicie sessão para guardar artigos, enviar mensagens a outros membros e aceder ao seu painel.',
    passwordTab: 'Palavra-passe',
    codeTab: 'Código por e-mail',
    forgot: 'Esqueceu-se da palavra-passe?',
    submitting: 'A iniciar sessão…',
    newHere: 'É novo por cá? {link}',
    createAccount: 'Crie uma conta',
    google: 'Continuar com o Google',
    oauthFailed: 'Não foi possível concluir o início de sessão com o Google. Tente novamente ou inicie sessão com o seu e-mail abaixo.',
  },

  signUp: {
    metaTitle: 'Criar conta',
    metaDescription: 'Crie uma conta gratuita no Gulf Spectrum Journal para guardar artigos e aceder ao seu painel.',
    title: 'Criar conta',
    description: 'Gratuita — permite guardar artigos, enviar mensagens a outros membros e aceder ao seu painel.',
    minLength: 'Pelo menos 8 caracteres.',
    submitting: 'A criar conta…',
    submit: 'Criar conta',
    haveAccount: 'Já tem conta? {link}',
    noPassword: 'Prefere não definir uma palavra-passe? {link}',
    emailedCode: 'Receba antes um código por e-mail',
  },

  otp: {
    sentTo: 'Enviámos um código de 6 dígitos para {email}. É válido durante alguns minutos.',
    code: 'Código',
    verifying: 'A verificar…',
    verify: 'Verificar e iniciar sessão',
    different: 'Usar outro e-mail ou reenviar',
    hint: 'Não precisa de palavra-passe — enviamos-lhe um código por e-mail. É novo por cá? Isto também cria a sua conta.',
    request: 'Enviar-me um código',
  },

  resetPassword: {
    metaTitle: 'Repor palavra-passe',
    metaDescription: 'Reponha a palavra-passe da sua conta do Gulf Spectrum Journal.',
    title: 'Repor palavra-passe',
    description: 'Enviamos-lhe uma ligação por e-mail para voltar a entrar.',
    sent: 'Se existir uma conta para {email}, a ligação para repor a palavra-passe está a caminho. Verifique a sua caixa de entrada — a ligação inicia a sua sessão e leva-o diretamente ao sítio onde pode definir uma nova palavra-passe.',
    submit: 'Enviar ligação',
    back: '← Voltar a iniciar sessão',
  },

  profile: {
    metaTitle: 'O meu perfil',
    metaDescription: 'Gira a sua conta do Gulf Spectrum Journal.',
    title: 'O meu perfil',
    description: 'O seu nome e os dados da sua conta.',
    loading: 'A carregar o seu perfil…',
    signInPrompt: '{link} para ver o seu perfil.',
    saved: 'Guardado.',
    emailNote: 'Ainda não é possível alterar o e-mail.',
    save: 'Guardar alterações',
    accountType: 'Tipo de conta',
    memberSince: 'Membro desde',
    viewAuthor: 'Ver o seu perfil de autor e artigos publicados →',
    roles: { reader: 'Leitor', author: 'Autor', editor: 'Editor', admin: 'Administrador' },
  },

  messages: {
    metaTitle: 'Mensagens',
    metaDescription: 'Mensagens privadas com outros membros do Gulf Spectrum Journal.',
    eyebrow: 'Mensagens diretas',
    title: 'Mensagens',
    description: 'Conversas privadas entre membros — só você e a outra pessoa as podem ver.',
    unnamed: 'Leitor sem nome',
    signInPrompt: '{link} para enviar e receber mensagens.',
    searchPlaceholder: 'Pesquisar membros pelo nome…',
    closeSearch: 'Fechar pesquisa',
    searching: 'A pesquisar…',
    noMembers: 'Nenhum membro encontrado.',
    newMessage: 'Nova mensagem',
    empty: 'Ainda não há conversas. Use «Nova mensagem» para encontrar outro membro.',
    selectPrompt: 'Selecione uma conversa ou inicie uma nova.',
    back: '← Voltar',
    typePlaceholder: 'Escreva uma mensagem…',
    send: 'Enviar mensagem',
  },

  notifications: {
    metaTitle: 'Notificações',
    metaDescription: 'Novidades sobre novos números e artigos do Gulf Spectrum Journal.',
    eyebrow: 'Novidades',
    title: 'Notificações',
    description:
      'Novos números e novos artigos nos temas dos seus favoritos. Geradas automaticamente quando a revista publica algo — não é uma caixa de entrada geral.',
    loading: 'A carregar as suas notificações…',
    signInPrompt: '{link} para ver as suas notificações.',
    empty:
      'Ainda não tem notificações. Receberá uma quando for publicado um novo número ou quando surgir um novo artigo num tema dos seus favoritos.',
    markAll: 'Marcar tudo como lido',
    newIssue: 'Novo número publicado: {theme}',
    newArticle: 'Novo artigo num tema que segue: {title}',
    update: 'Atualização',
    unread: 'Não lida',
  },

  accountSettings: {
    metaTitle: 'Definições da conta',
    metaDescription: 'Gira a sua palavra-passe, sessões e conta.',
    title: 'Definições da conta',
    description: 'Palavra-passe, sessões e eliminação da conta.',
    signInPrompt: '{link} para gerir as definições da sua conta.',
    tooShort: 'A palavra-passe tem de ter pelo menos 8 caracteres.',
    mismatch: 'As palavras-passe não coincidem.',
    changePassword: 'Alterar palavra-passe',
    changePasswordBody:
      'Se se registou com o Google, isto define uma palavra-passe que também pode usar para iniciar sessão diretamente.',
    passwordUpdated: 'Palavra-passe atualizada.',
    newPassword: 'Nova palavra-passe',
    confirmPassword: 'Confirmar nova palavra-passe',
    updatePassword: 'Atualizar palavra-passe',
    codeIntro: 'Por segurança, enviámos um código de 6 dígitos para {email}. Introduza-o para confirmar a alteração da palavra-passe.',
    confirmChange: 'Confirmar e atualizar',
    resendCode: 'Reenviar código',
    cancelChange: 'Cancelar',
    sessions: 'Sessões',
    sessionsBody: 'Termine sessão em todo o lado se achar que outro dispositivo ou navegador ainda tem a sua sessão iniciada.',
    signingOut: 'A terminar sessão…',
    signOutEverywhere: 'Terminar sessão em todo o lado',
    emailHeading: 'Notificações por e-mail',
    emailBody: 'E-mails ocasionais da revista. As notificações no próprio site não são afetadas.',
    emailNewIssue: 'Enviar-me um e-mail quando for publicado um novo número',
    emailFailed: 'Não foi possível guardar a sua preferência.',
    deleteHeading: 'Eliminar conta',
    deleteBody:
      'Elimina permanentemente a sua conta, perfil, favoritos, mensagens e notificações. Esta ação não pode ser anulada.',
    confirmLabel: 'Escreva {email} para confirmar',
    confirmMismatch: 'Escreva exatamente o e-mail da sua conta para confirmar.',
    deleteFailed: 'Não foi possível eliminar a conta.',
    deleting: 'A eliminar…',
    deleteButton: 'Eliminar permanentemente a minha conta',
  },

  correctionPolicy: {
    metaTitle: 'Política de correções',
    metaDescription: 'Como o Gulf Spectrum Journal corrige erros em artigos publicados e como comunicar um erro.',
    eyebrow: 'Normas editoriais',
    title: 'Política de correções',
    description: 'Como tratamos os erros em artigos publicados e como comunicar um erro.',
    // {email} is the editorial office's address (lib/staticContent.ts).
    sections: [
      {
        heading: 'O nosso compromisso',
        body: 'O Gulf Spectrum Journal corrige os erros em artigos publicados com rapidez e transparência. O que é publicado deve ser exato, e os leitores devem poder sempre saber quando um artigo foi alterado e porquê.',
      },
      {
        heading: 'Correções menores',
        body: 'Os erros de ortografia, pontuação e formatação que não afetam o sentido de um artigo são corrigidos sem aviso.',
      },
      {
        heading: 'Correções que afetam o sentido',
        body: 'Quando um erro afeta o sentido, os dados, a atribuição ou as conclusões de um artigo, este é corrigido e é apresentado, no início do artigo e no respetivo PDF, um aviso de correção datado que descreve a alteração.',
      },
      {
        heading: 'Retratações',
        body: 'Se os resultados de um artigo se revelarem fundamentalmente pouco fiáveis, ou se houver provas de plágio, dados fabricados ou outra falta grave, o conselho editorial pode retratá-lo. Um artigo retratado permanece no site com um aviso que explica a retratação, para que o registo fique completo.',
      },
      {
        heading: 'Comunicar um erro',
        body: 'Os leitores e os autores podem comunicar um possível erro à redação através de {email} ou da página de Contacto. Indique o título do artigo e descreva o erro. O conselho editorial analisa todas as comunicações e, sempre que possível, consulta os autores antes de decidir o que fazer.',
      },
    ],
  },

  notFound: {
    title: 'Página não encontrada',
    body: 'A página que procura desviou-se da rota. Vamos pô-lo de novo no rumo certo.',
    home: 'Voltar ao início',
  },
}

export default pt
