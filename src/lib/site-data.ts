export const site = {
  name: "BLOKO",
  tagline: "Padel, Ginásio & Lounge",
  city: "Bragança, Portugal",
  address: "Rua Coronel Teófilo Morais 40, Bragança, Portugal 5300-427",
  phone: "+351 912 129 102",
  phoneHref: "tel:+351912129102",
  email: "geral@bloko.com.pt",
  playtomicUrl: "https://playtomic.com/clubs/bloko-padel-gym-lounge",
  whatsappUrl: "https://wa.me/351912129102",
  whatsappCommunityUrl: "https://chat.whatsapp.com/JuBRo7xgtpHEEe0ppVEwnZ",
  whatsappBookingUrl: "https://chat.whatsapp.com/KhClWNjP0ADAvngusFRjIH",
  navPadelBookingUrl: "https://wa.link/1aozcg",
  blokosAppUrl: "https://blokos.bloko.com.pt",
  instagramUrl: "https://www.instagram.com/bloko_padel.gym.lounge/",
  facebookUrl: "https://www.facebook.com/BLOKO.PADEL.GYM.LOUNGE/",
  youtubeUrl: "https://www.youtube.com/@bloko_padel_gym_longe",
  googleReviewsUrl: "https://share.google/jg9JifDamS9sg6t9P",
  googleReviewUrl: "https://g.page/r/Cfif2PXqJyVlEBM/review",
  hours: {
    ginasio: [
      { days: "Seg. a Sex.", time: "07h–13h e 14h–22h" },
      { days: "Sáb., Dom. e feriados", time: "9h30–13h e 15h–19h30" },
    ],
    padel: [
      { days: "Seg. a Sex.", time: "07h–13h e 14h–00h" },
      { days: "Sáb., Dom. e feriados", time: "9h30–13h e 15h–19h30" },
    ],
  },
};

export type NavLink = {
  href: string;
  label: string;
  submenu: { href: string; label: string }[];
  icon?: string;
};

export const navLinks: NavLink[] = [
  {
    href: "/sobre",
    label: "Sobre",
    submenu: [{ href: "/sobre/eventos", label: "Eventos" }],
  },
  {
    href: "/ginasio",
    label: "Ginásio",
    submenu: [
      { href: "/aulas?categoria=ginasio", label: "Aulas de Ginásio" },
      { href: "/ginasio/precario", label: "Preçário" },
    ],
  },
  {
    href: "/padel",
    label: "Padel",
    submenu: [
      { href: "/padel/aulas", label: "Aulas de Padel" },
      { href: "/academia", label: "Academia BLOKO" },
      { href: "/torneios", label: "Torneios" },
      { href: "/padel/precario", label: "Preçário" },
    ],
  },
  { href: "/patrocinadores", label: "Patrocinadores", submenu: [] },
  { href: "/contactos", label: "Contactos", submenu: [] },
  { href: "/blokos", label: "Blokos", submenu: [], icon: "/images/blokos-logo.png" },
];

export const classCategories = [
  { key: "ginasio", label: "Ginásio", blurb: "Aulas de grupo incluídas na mensalidade." },
  { key: "padel", label: "Padel", blurb: "Aulas avulsas para todos os níveis." },
  { key: "academia", label: "Academia Padel", blurb: "Turmas fixas de formação, por escalão etário." },
] as const;

export type ClassCategoryKey = (typeof classCategories)[number]["key"];

export const classTypes = [
  // Ginásio — aulas de grupo, incluídas na mensalidade
  {
    slug: "gap",
    category: "ginasio" as ClassCategoryKey,
    name: "GAP",
    full: "Glúteos, Abdominais e Pernas",
    description:
      "Treino de tonificação focado no trem inferior e core, com séries curtas e alta intensidade.",
    image: "/images/class-gap-real.jpg",
  },
  {
    slug: "abs",
    category: "ginasio" as ClassCategoryKey,
    name: "ABS",
    full: "Core & Abdominais",
    description: "Sessão focada no fortalecimento do core, postura e definição abdominal.",
    image: "/images/class-abs-stock.png",
  },
  {
    slug: "funcional",
    category: "ginasio" as ClassCategoryKey,
    name: "Funcional",
    full: "Treino Funcional",
    description:
      "Movimentos multiarticulares e funcionais para força, mobilidade e resistência geral.",
    image: "/images/class-funcional-real.jpg",
  },
  // Padel — aulas avulsas, para todos os níveis
  {
    slug: "padel-iniciacao",
    category: "padel" as ClassCategoryKey,
    name: "Iniciação",
    full: "Aula de Padel — Iniciação",
    description: "Para quem está a começar: técnica de base, posicionamento e regras do jogo.",
    image: "/images/real-court-meususuper.jpg",
  },
  {
    slug: "padel-aperfeicoamento",
    category: "padel" as ClassCategoryKey,
    name: "Aperfeiçoamento",
    full: "Aula de Padel — Aperfeiçoamento",
    description: "Para jogadores com experiência que querem evoluir tática e tecnicamente.",
    image: "/images/real-court-ca.jpg",
  },
  // Academia — turmas fixas, por escalão etário
  {
    slug: "academia-sub12",
    category: "academia" as ClassCategoryKey,
    name: "Academia Sub-12",
    full: "Academia BLOKO — Sub-12",
    description: "Turma fixa para os mais jovens: técnica de base e competição adaptada.",
    image: "/images/real-academia-sub12.jpg",
  },
  {
    slug: "academia-sub16",
    category: "academia" as ClassCategoryKey,
    name: "Academia Sub-16",
    full: "Academia BLOKO — Sub-16",
    description: "Turma fixa de formação e competição para adolescentes.",
    image: "/images/real-academia-sub16.jpg",
  },
] as const;

export const padelFeatures = [
  "4 campos panorâmicos indoor",
  "Piso Mondo Supercourt",
  "Iluminação LED de competição",
  "Aluguer de equipamento no local",
  "Reservas via Playtomic",
  "Torneios semanais e ligas",
];

// Preçário — Ginásio: mensalidade base
export const gymMembership = {
  inscricao: "15€",
  plans: [
    { name: "Acesso Livre", price: "34,60€", period: "/mês" },
    {
      name: "Off Peak",
      price: "25,95€",
      period: "/mês",
      note: "Diariamente das 7h às 17h",
    },
  ],
  trial: [
    { name: "Treino Único", price: "4,99€" },
    { name: "1 Semana Acesso Livre", price: "9,99€" },
    { name: "2 Semanas Acesso Livre", price: "19,98€" },
  ],
};

// Preçário — Ginásio: Pack Família
export const gymFamilyPack = [
  { members: "2 elementos", price: "29,95€", period: "/mês por pessoa" },
  { members: "3 elementos", price: "25,95€", period: "/mês por pessoa" },
];

// Preçário — Ginásio: Pack Fim-de-Semana
export const gymWeekendPack = {
  price: "13,95€",
  period: "/mês",
  note: "Oferta sexta-feira das 17h às 22h",
};

// Preçário — Pack Padel + Ginásio (combo)
export const padelGymComboPack = {
  price: "45,95€",
  period: "/mês",
  note: "Inclui 20€ Padel",
  inscricao: "15€",
};

// Preçário — Aulas de Grupo (para quem não tem mensalidade de ginásio)
export const groupClassPricing = {
  note: "10% de desconto para clientes de ginásio",
  tiers: [
    {
      label: "Clientes Externos",
      plans: [
        { freq: "1 aula avulso", price: "5€" },
        { freq: "2 aulas/semana", price: "24,95€/mês" },
        { freq: "3 aulas/semana", price: "29,95€/mês" },
      ],
    },
    {
      label: "Kids",
      plans: [{ freq: "1 aula/semana", price: "15,95€/mês" }],
    },
    {
      label: "Ativos +60",
      plans: [{ freq: "2 aulas/semana", price: "24,95€/mês" }],
    },
  ],
};

// Preçário — Academia (mensalidade recorrente)
export const academiaPricing = {
  founderDiscount: "10% de desconto para Sócios Fundadores",
  tiers: [
    {
      label: "Adultos",
      plans: [
        { freq: "1x semana", price: "55€/mês" },
        { freq: "2x semana", price: "95€/mês" },
      ],
    },
    {
      label: "Kids",
      plans: [
        { freq: "1x semana", price: "45€/mês" },
        { freq: "2x semana", price: "80€/mês" },
      ],
    },
  ],
};

// Preçário — Ginásio: Treino Personalizado (PT)
export const gymPersonalTraining = [
  {
    label: "Individuais",
    plans: [
      { freq: "1 treino/semana", price: "71€" },
      { freq: "2 treinos/semana", price: "134€" },
      { freq: "3 treinos/semana", price: "188€" },
    ],
  },
  {
    label: "2 Pessoas",
    plans: [
      { freq: "1 treino/semana", price: "53€" },
      { freq: "2 treinos/semana", price: "98€" },
      { freq: "3 treinos/semana", price: "139€" },
    ],
  },
  {
    label: "3 Pessoas",
    plans: [
      { freq: "1 treino/semana", price: "44€" },
      { freq: "2 treinos/semana", price: "80€" },
      { freq: "3 treinos/semana", price: "112€" },
    ],
  },
];

// Preçário — Padel: aluguer de campo
export const padelCourtPricing = {
  offPeakHours: "Segunda a sexta, das 07h às 17h",
  offPeak: [
    { duration: "1h", price: "4€ / pessoa" },
    { duration: "1h30", price: "6€ / pessoa" },
  ],
  peak: [
    { duration: "1h", price: "6€ / pessoa" },
    { duration: "1h30", price: "8,5€ / pessoa" },
  ],
  racketRental: [
    { model: "Nox", price: "1,5€ / raquete" },
    { model: "Quad", price: "3,5€ / raquete" },
  ],
};

// Preçário — Padel: aulas (Peak Hour / Off Peak, por nº de alunos)
export const padelLessonPricing = {
  founderDiscount: "10% de desconto para Sócios Fundadores",
  peak: [
    {
      group: "Individuais",
      plans: [
        { label: "1 aula", price: "39€" },
        { label: "5 aulas", price: "175€" },
        { label: "10 aulas", price: "310€" },
      ],
    },
    {
      group: "2 Alunos",
      plans: [
        { label: "1 aula", price: "24€" },
        { label: "5 aulas", price: "110€" },
        { label: "10 aulas", price: "190€" },
      ],
    },
    {
      group: "3 Alunos",
      plans: [
        { label: "1 aula", price: "19€" },
        { label: "5 aulas", price: "85€" },
        { label: "10 aulas", price: "150€" },
      ],
    },
    {
      group: "4 Alunos",
      plans: [
        { label: "1 aula", price: "16€" },
        { label: "5 aulas", price: "70€" },
        { label: "10 aulas", price: "125€" },
      ],
    },
  ],
  offPeak: [
    {
      group: "Individuais",
      plans: [
        { label: "1 aula", price: "29€" },
        { label: "5 aulas", price: "130€" },
        { label: "10 aulas", price: "230€" },
      ],
    },
    {
      group: "2 Alunos",
      plans: [
        { label: "1 aula", price: "19€" },
        { label: "5 aulas", price: "85€" },
        { label: "10 aulas", price: "150€" },
      ],
    },
    {
      group: "3 Alunos",
      plans: [
        { label: "1 aula", price: "15€" },
        { label: "5 aulas", price: "68€" },
        { label: "10 aulas", price: "120€" },
      ],
    },
    {
      group: "4 Alunos",
      plans: [
        { label: "1 aula", price: "12€" },
        { label: "5 aulas", price: "55€" },
        { label: "10 aulas", price: "95€" },
      ],
    },
  ],
};

export const whatsappGroups = [
  {
    name: "Jogos Abertos Masculinos",
    description: "Combina jogos de padel masculinos com outros sócios, fora dos torneios.",
  },
  {
    name: "Jogos Abertos Femininos",
    description: "Combina jogos de padel femininos com outras sócias, fora dos torneios.",
  },
  {
    name: "Jogos Abertos Mistos",
    description: "Combina jogos de padel mistos com outros sócios, fora dos torneios.",
  },
  {
    name: "Marcações",
    description: "Pedidos e avisos sobre marcações de campos e aulas.",
  },
];

// Formatos de competição recorrentes.
export const tournamentFormats = [
  {
    slug: "nonstop",
    name: "Nonstop Semanal",
    frequency: "Todas as semanas",
    description:
      "8 duplas, 7 jogos de 13 minutos, todas contra todas. Pode disputar-se em formato normal ou estilo americano. Inscrições via WhatsApp.",
  },
];

export type TournamentEntry = {
  slug: string;
  name: string;
  dates: string;
  tag: string;
  summary: string;
  details?: string[];
  poster?: string | null;
  registerUrl?: string;
  regulamentoUrl?: string;
  partnerUrl?: string;
  example?: boolean;
  comingSoon?: boolean;
  /** Folder name under the "gallery" Supabase Storage bucket for this entry's photos. */
  gallerySlug?: string;
  /** Whether a recap video exists under gallery/<type>/<gallerySlug>/video/. */
  hasVideo?: boolean;
};

// Torneios Sociais — os grandes eventos do clube, 3 a 4 por ano.
// Datas/resultados de próximos eventos são anunciados no grupo de WhatsApp.
export const upcomingTournaments: TournamentEntry[] = [
  {
    slug: "torneio-social-outubro-2026",
    name: "Torneio Social",
    dates: "9, 10 e 11 de Outubro de 2026",
    tag: "Save the Date",
    summary: "Brevemente mais info.",
    poster: null,
    comingSoon: true,
    registerUrl: "#",
    regulamentoUrl: "#",
    partnerUrl: site.whatsappCommunityUrl,
  },
];

// Torneios Sociais já realizados — nomes reais dos eventos do clube.
// Ordenados do mais recente para o mais antigo.
export const pastTournaments: TournamentEntry[] = [
  {
    slug: "big-padel-masters-ii",
    name: "Big Padel Masters II",
    dates: "10 a 12 de Abril",
    tag: "Torneio Social",
    summary: "2º Torneio Social McDonald's Bragança.",
    details: ["Categorias: M4, M5, M6, F6, MX"],
    poster: "/images/posters/poster-big-padel-masters-ii.jpg",
    gallerySlug: "big-padel-masters-ii",
  },
  {
    slug: "torneio-social-mudda-domus",
    name: "Torneio Social — Rede Imobiliária Mudda Domus",
    dates: "9 a 11 de Janeiro",
    tag: "Torneio Social",
    summary: "Mais de 700€ em prémios.",
    details: ["Categorias: M4, M5, M6, F6, MX"],
    poster: "/images/posters/poster-torneio-social-mudda-domus.jpg",
    gallerySlug: "torneio-social-mudda-domus",
    hasVideo: true,
  },
  {
    slug: "residentes-braganca-2026",
    name: "Torneio de Padel — Residentes no Distrito de Bragança",
    dates: "18 e 19 de Outubro",
    tag: "Torneio Social",
    summary: "Para jogadores com 50 ou mais anos. Inscrição gratuita, todos os jogos incluídos.",
    details: [
      "Jogadores: 50 ou mais anos",
      "Inscrição gratuita — todos os jogos incluídos + welcome kit",
      "Categorias: Masculino e Feminino",
      "Finalistas com acesso à Final Ibérica (Bragança–Zamora)",
    ],
    poster: "/images/posters/poster-residentes-braganca.jpg",
    registerUrl: "https://wa.me/351912129102",
    gallerySlug: "residentes-braganca-2026",
  },
  {
    slug: "big-padel-masters",
    name: "Big Padel Masters",
    dates: "2 a 4 de Maio",
    tag: "Torneio Social",
    summary: "1º Torneio Social McDonald's Bragança.",
    details: ["Categorias: M4, M5, M6, Mx"],
    poster: "/images/posters/poster-big-padel-masters.jpg",
    gallerySlug: "big-padel-masters",
    hasVideo: true,
  },
  {
    slug: "liga-corporativa-grandson",
    name: "Liga Corporativa — Grandson Interiores",
    dates: "",
    tag: "Liga",
    summary: "Liga corporativa em parceria com a Grandson Interiores.",
    poster: "/images/posters/poster-liga-corporativa-grandson.jpg",
    gallerySlug: "liga-corporativa-grandson",
  },
];

// Eventos sociais/temáticos do clube — distintos dos Torneios (sem formato
// competitivo/ranking): festas, aniversários, edições especiais.
// Ordenados do mais recente para o mais antigo.
export const events: TournamentEntry[] = [
  {
    slug: "bloko-em-festa-edicao-2",
    name: "BLOKO em Festa — 1ª Maratona de Padel",
    dates: "5 e 6 de Setembro",
    tag: "Maratona",
    summary: "Maratona de padel masculinos e femininos, com jantar incluído na inscrição.",
    poster:
      "https://jucvqopkwuwgkvguupqy.supabase.co/storage/v1/object/public/gallery/eventos/bloko-em-festa-edicao-2/full/780748558_18030587834834522_6720622019271501258_n.jpg",
    gallerySlug: "bloko-em-festa-edicao-2",
    hasVideo: true,
  },
  {
    slug: "i-aniversario-bloko",
    name: "I Aniversário BLOKO",
    dates: "22 de Novembro",
    tag: "Aniversário",
    summary: "Acesso gratuito ao ginásio, torneio especial de padel, sorteios e giveaways.",
    poster:
      "https://jucvqopkwuwgkvguupqy.supabase.co/storage/v1/object/public/gallery/eventos/i-aniversario-bloko/full/583138688_17997259907834522_3626510149372453328_n.jpg",
    gallerySlug: "i-aniversario-bloko",
  },
  {
    slug: "bloko-especial-halloween",
    name: "BLOKO Especial Halloween — Edição Luz Negra",
    dates: "",
    tag: "Halloween",
    summary: "Edição especial de Halloween em luz negra, no padel e no ginásio.",
    poster:
      "https://jucvqopkwuwgkvguupqy.supabase.co/storage/v1/object/public/gallery/eventos/bloko-especial-halloween/full/DSC08736-Enhanced-NR-2.jpg",
    gallerySlug: "bloko-especial-halloween",
    hasVideo: true,
  },
  {
    slug: "bloko-em-festa",
    name: "BLOKO em Festa — Edição 1",
    dates: "5 de Julho",
    tag: "Evento",
    summary: "Torneio Duplo Padel — 8 duplas masculinas + 8 duplas femininas. Mais de 100€ em prémios.",
    poster: "/images/posters/poster-bloko-em-festa.jpg",
    gallerySlug: "bloko-em-festa",
    hasVideo: true,
  },
];

// Patrocinadores com naming rights de cada um dos 4 campos.
export const courtSponsors = [
  {
    court: 1,
    sponsor: "McDonald's" as string | null,
    image: "/images/real-court-mcdonalds.jpg",
    logo: "/images/logos/mcdonalds.png" as string | null,
  },
  {
    court: 2,
    sponsor: "Chamauto" as string | null,
    image: "/images/real-court-chamauto.jpg",
    logo: "/images/logos/chamauto.png" as string | null,
  },
  {
    court: 3,
    sponsor: "Caixa Crédito Agrícola" as string | null,
    image: "/images/real-court-ca.jpg",
    logo: "/images/logos/ca-credito-agricola.png" as string | null,
  },
  {
    court: 4,
    sponsor: "Meu Super Bragança" as string | null,
    image: "/images/real-court-meususuper.jpg",
    logo: "/images/logos/meususuper.png" as string | null,
  },
];

export type Sponsor = { name: string; url?: string; logo?: string };

export const sponsors: Sponsor[] = [
  { name: "Sier Energia", logo: "/images/sponsors/sier-energia.png" },
  { name: "Farmácia Vale D'Álvaro", logo: "/images/sponsors/farmacia-vale-dalvaro.png" },
  { name: "Barrad'Ouro Bragança", logo: "/images/sponsors/barradouro.png" },
  { name: "Farmácia Bem Saúde", logo: "/images/sponsors/farmacia-bem-saude.png" },
  { name: "be up — Agência Criativa", logo: "/images/sponsors/be-up.png" },
  { name: "Enerduo", logo: "/images/sponsors/enerduo.png" },
  { name: "Mudda Domus", logo: "/images/sponsors/mudda-domus.png" },
  { name: "NORD Higiene", logo: "/images/sponsors/nord-higiene.png" },
  { name: "Mundotur", logo: "/images/sponsors/mundotur.png" },
  { name: "Clínica Montes de Saúde", logo: "/images/sponsors/montes-de-saude.png" },
  { name: "CrossXLed Solutions", logo: "/images/sponsors/crossxled-solutions.png" },
  { name: "TMJanelas", logo: "/images/sponsors/tmjanelas.png" },
  { name: "McDonald's Bragança", logo: "/images/logos/mcdonalds.png" },
  { name: "Grandson Interiores" },
];
