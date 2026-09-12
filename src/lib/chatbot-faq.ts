import {
  academiaPricing,
  classTypes,
  courtSponsors,
  events,
  gymFamilyPack,
  gymMembership,
  gymPersonalTraining,
  gymWeekendPack,
  groupClassPricing,
  padelCourtPricing,
  padelGymComboPack,
  padelLessonPricing,
  pastTournaments,
  site,
  sponsors,
  tournamentSponsors,
} from "@/lib/site-data";

export type FaqLink = { url: string; label: string };

export type FaqEntry = {
  id: string;
  keywords: string[];
  /** Resposta factual (preços, horários, etc.) */
  answer: string;
  /** Nota amigável/desafiadora — enviada como balão separado. */
  prompt?: string;
  /** Interpreta a resposta do utilizador ao `prompt`. Devolve null para cair no FAQ normal. */
  followUp?: (reply: string) => string | null;
  /** Botão de ação a mostrar junto da resposta (ex: link da comunidade de WhatsApp). */
  link?: FaqLink;
};

function euro(v: string) {
  return v.replace(".", ",");
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// Palavras demasiado comuns para ajudarem a distinguir o tema da pergunta.
const STOPWORDS = new Set(
  [
    "a",
    "o",
    "os",
    "as",
    "de",
    "do",
    "da",
    "dos",
    "das",
    "um",
    "uma",
    "uns",
    "umas",
    "e",
    "ou",
    "com",
    "sem",
    "para",
    "por",
    "no",
    "na",
    "nos",
    "nas",
    "em",
    "ao",
    "aos",
    "à",
    "às",
    "que",
    "e",
    "é",
    "sao",
    "está",
    "esta",
    "estao",
    "tem",
    "tens",
    "ter",
    "tenho",
    "posso",
    "pode",
    "podem",
    "quero",
    "queres",
    "qual",
    "quais",
    "quanto",
    "quanta",
    "quantos",
    "quantas",
    "como",
    "onde",
    "quando",
    "ha",
    "vosso",
    "vossa",
    "voces",
    "bloko",
    "clube",
    "custa",
    "custam",
    "vc",
  ].map((w) => normalize(w))
);

function words(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

export const faq: FaqEntry[] = [
  {
    id: "quantos-campos",
    keywords: [
      "quantos campos",
      "campos de padel tem",
      "numero de campos",
      "quantos campos de padel",
    ],
    answer: `Temos ${courtSponsors.length} campos de padel panorâmicos indoor, com piso Mondo Supercourt e iluminação de competição.`,
    prompt: `Vem conhecer o espaço — queres marcar uma visita ou já um jogo?`,
  },
  {
    id: "preco-padel-campo",
    keywords: [
      "preco hora padel",
      "quanto custa padel",
      "preco campo",
      "preco padel",
      "aluguer campo",
      "aluguer de campo",
      "alugar campo",
      "preco do campo",
      "quanto custa o campo",
      "quanto custa alugar um campo",
      "reservar campo preco",
      "preco raquete",
      "aluguer raquete",
    ],
    answer:
      `Aluguer de campo: Off Peak (seg-sex, ${padelCourtPricing.offPeakHours.toLowerCase()}) ${padelCourtPricing.offPeak[0].price} (1h) ou ${padelCourtPricing.offPeak[1].price} (1h30). ` +
      `Peak Hour: ${padelCourtPricing.peak[0].price} (1h) ou ${padelCourtPricing.peak[1].price} (1h30). ` +
      `Aluguer de raquete: ${padelCourtPricing.racketRental[0].model} ${padelCourtPricing.racketRental[0].price}, ${padelCourtPricing.racketRental[1].model} ${padelCourtPricing.racketRental[1].price}.`,
    prompt: `Já sabes o preço — agora só falta marcar! Já tens dupla, ou precisas que te arranjemos parceiro?`,
  },
  {
    id: "preco-ginasio-diario",
    keywords: [
      "entrada diaria ginasio",
      "preco dia ginasio",
      "passe diario",
      "treino unico",
      "experimentar ginasio",
      "ir uma vez ao ginasio",
      "entrada avulsa",
    ],
    answer:
      `Uma entrada avulsa/diária no ginásio (Treino Único) custa ${euro(gymMembership.trial[0].price)}. Se depois te inscreveres na mensalidade, esse valor é-te devolvido. ` +
      `Também podes experimentar mais tempo: 1 Semana de Acesso Livre por ${euro(gymMembership.trial[1].price)} ou 2 Semanas por ${euro(gymMembership.trial[2].price)}.`,
    prompt: `Já sabes o preço, agora só falta a motivação para começar! Vamos a isso?`,
  },
  {
    id: "mensalidade-ginasio",
    keywords: [
      "mensalidade ginasio",
      "preco ginasio",
      "preco do ginasio",
      "quanto custa o ginasio",
      "inscricao ginasio",
      "quanto custa inscrever",
      "preco mensal ginasio",
    ],
    answer: `Mensalidade do Ginásio: Acesso Livre ${euro(gymMembership.plans[0].price)}/mês, ou Off Peak (${gymMembership.plans[1].note?.toLowerCase()}) por ${euro(gymMembership.plans[1].price)}/mês. Inscrição: ${euro(gymMembership.inscricao)} (inclui avaliação física e plano de treino).`,
    prompt: `Treinas toda a semana ou preferes só ao fim de semana? E já agora — vens com família? Temos o Pack Família com desconto por pessoa!`,
    followUp: (reply) => {
      const r = normalize(reply);
      const wantsWeekend = /fim.?de.?semana|\bfds\b|so.?ao?.?fim|weekend|sexta/.test(r);
      const wantsFullWeek = /toda a semana|semana toda|todos os dias|diari|qualquer dia/.test(r);
      const wantsFamily = /familia|amigo|pai\b|mae\b|irma|marido|mulher|namorad|filho|filha|mais gente|duas pessoas|tres pessoas/.test(
        r
      );
      const isYes = /^sim\b|\bsim\b|claro|quero|gostava/.test(r);

      const parts: string[] = [];
      if (wantsWeekend) {
        parts.push(
          `Então o Pack Fim-de-Semana é ideal: ${euro(gymWeekendPack.price)}${gymWeekendPack.period} (${gymWeekendPack.note}).`
        );
      } else if (wantsFullWeek) {
        parts.push(
          `Nesse caso o Acesso Livre (${euro(gymMembership.plans[0].price)}/mês) é o que te dá mais liberdade — treinas quando quiseres, todos os dias.`
        );
      }
      if (wantsFamily || isYes) {
        parts.push(
          `E já agora — o Pack Família fica em ${euro(gymFamilyPack[0].price)}${gymFamilyPack[0].period} para ${gymFamilyPack[0].members.toLowerCase()}, ou ${euro(gymFamilyPack[1].price)}${gymFamilyPack[1].period} para ${gymFamilyPack[1].members.toLowerCase()}. Tragam todos!`
        );
      }
      if (parts.length === 0) return null;
      parts.push("Queres já marcar a tua primeira visita?");
      return parts.join(" ");
    },
  },
  {
    id: "pack-familia",
    keywords: ["pack familia", "desconto familia", "inscrever familia", "preco familia"],
    answer: `Pack Família do Ginásio: ${gymFamilyPack[0].members} — ${euro(gymFamilyPack[0].price)}${gymFamilyPack[0].period}; ${gymFamilyPack[1].members} — ${euro(gymFamilyPack[1].price)}${gymFamilyPack[1].period}.`,
    prompt: `Chama o resto da família e treinem juntos — quantos são?`,
  },
  {
    id: "pack-fds",
    keywords: ["pack fim de semana", "fim-de-semana ginasio", "sexta a noite"],
    answer: `Pack Fim-de-Semana: ${euro(gymWeekendPack.price)}${gymWeekendPack.period} — ${gymWeekendPack.note}.`,
    prompt: `Perfeito se só tens tempo ao fim de semana — vamos marcar o teu primeiro treino?`,
  },
  {
    id: "combo-padel-ginasio",
    keywords: ["combo padel ginasio", "pack padel ginasio", "padel e ginasio junto"],
    answer: `Pack Padel + Ginásio: ${euro(padelGymComboPack.price)}${padelGymComboPack.period} (${padelGymComboPack.note}). Inscrição: ${euro(padelGymComboPack.inscricao)}.`,
    prompt: `Dois desportos, uma só mensalidade — queres experimentar os dois já esta semana?`,
  },
  {
    id: "personal-training",
    keywords: ["personal training", "treino personalizado", "preco pt", "personal trainer"],
    answer:
      `Personal Training Ginásio (preço/mês): Individual — 1x ${euro(gymPersonalTraining[0].plans[0].price)}, 2x ${euro(gymPersonalTraining[0].plans[1].price)}, 3x ${euro(gymPersonalTraining[0].plans[2].price)} por semana. ` +
      `Em 2 pessoas ou 3 pessoas fica mais barato por pessoa — pergunta-nos os valores no WhatsApp.`,
    prompt: `Queres um treino só para ti? Diz-nos o teu objetivo e ajudamos-te a escolher o plano certo.`,
  },
  {
    id: "pt-padel",
    keywords: [
      "pt padel",
      "pt de padel",
      "personal trainer padel",
      "personal trainer de padel",
      "personal training padel",
      "treino personalizado padel",
    ],
    answer: `Temos dois tipos de Personal Training: Personal Training Ginásio (treino individual no ginásio) e Personal Training Padel — aula individual de padel, a sós com o treinador, a partir de ${padelLessonPricing.offPeak[0].plans[0].price} (Off Peak) ou ${padelLessonPricing.peak[0].plans[0].price} (Peak Hour). Se procuras algo mais estruturado, a Academia BLOKO tem turmas fixas para todas as idades e níveis — da iniciação à competição, em grupos reduzidos de até 4 alunos.`,
    prompt: `Preferes Personal Training Padel ao teu ritmo, ou uma turma fixa da Academia?`,
  },
  {
    id: "aulas-padel-preco",
    keywords: [
      "preco aulas padel",
      "aula de padel preco",
      "quanto custa uma aula de padel",
      "marcar aula de padel",
      "aula padel individual",
    ],
    answer:
      `Aulas de Padel (individual): Peak Hour ${padelLessonPricing.peak[0].plans[0].price} (1 aula) / ${padelLessonPricing.peak[0].plans[1].price} (5 aulas) / ${padelLessonPricing.peak[0].plans[2].price} (10 aulas). ` +
      `Off Peak: ${padelLessonPricing.offPeak[0].plans[0].price} / ${padelLessonPricing.offPeak[0].plans[1].price} / ${padelLessonPricing.offPeak[0].plans[2].price}. Em grupo o preço por pessoa desce bastante — ${padelLessonPricing.founderDiscount.toLowerCase()}.`,
    prompt: `Bora subir de nível? Marca a tua primeira aula!`,
  },
  {
    id: "academia-preco",
    keywords: ["academia preco", "academia padel preco", "inscricao academia", "academia mensalidade"],
    answer: `Academia BLOKO: Adultos 1x/semana ${academiaPricing.tiers[0].plans[0].price} ou 2x/semana ${academiaPricing.tiers[0].plans[1].price}. Kids 1x/semana ${academiaPricing.tiers[1].plans[0].price} ou 2x/semana ${academiaPricing.tiers[1].plans[1].price}. ${academiaPricing.founderDiscount}.`,
    prompt: `É a forma mais divertida de aprender padel a sério — é para ti ou para o teu filho/filha?`,
  },
  {
    id: "aulas-grupo-preco",
    keywords: [
      "aulas de grupo",
      "aula de grupo preco",
      "aulas de grupo preco",
      "marcar aula de grupo",
      "gap abs funcional preco",
      "aula avulso ginasio",
      "gap abs funcional",
    ],
    answer: `Aulas de Grupo (GAP, ABS, Funcional) já estão incluídas na mensalidade do Ginásio. Sem mensalidade: ${groupClassPricing.tiers[0].plans[0].freq} por ${groupClassPricing.tiers[0].plans[0].price}, ou pacotes semanais a partir de ${groupClassPricing.tiers[0].plans[1].price}. ${groupClassPricing.note}. Marca-se online no Mapa de Aulas, sem precisares de conta.`,
    prompt: `Já experimentaste alguma? É só apareceres — qual te apetece mais?`,
  },
  {
    id: "horarios",
    keywords: ["horario", "horarios", "a que horas abrem", "quando abrem", "quando fecham"],
    answer:
      `Ginásio: ${site.hours.ginasio.map((h) => `${h.days} ${h.time}`).join(" · ")}. ` +
      `Padel: ${site.hours.padel.map((h) => `${h.days} ${h.time}`).join(" · ")}.`,
    prompt: `Aparece quando quiseres — vemo-nos em breve?`,
  },
  {
    id: "morada",
    keywords: ["morada", "onde fica", "localizacao", "endereco", "onde e o bloko"],
    answer: `Estamos em ${site.address}.`,
  },
  {
    id: "contacto",
    keywords: ["contacto", "telefone", "numero de telefone", "email"],
    answer: `Podes ligar-nos para ${site.phone} ou escrever para ${site.email}.`,
  },
  {
    id: "bar-lounge",
    keywords: ["bar", "lounge", "servico de bar", "convivio", "bebidas"],
    answer: `Sim! Temos um espaço de bar e lounge para o convívio antes ou depois do jogo e do treino.`,
    prompt: `Fica cá depois do teu jogo para umas bebidas com a malta!`,
  },
  {
    id: "reservar-padel",
    keywords: [
      "reservar padel",
      "marcar campo",
      "marcar jogo",
      "marcar um jogo",
      "posso marcar",
      "quero jogar padel",
      "quero marcar",
      "como marco",
      "playtomic",
    ],
    answer: `Reserva o teu campo diretamente pelo WhatsApp ou pelo Playtomic — o que preferires.`,
    prompt: `Combina já um jogo, é rapidinho!`,
    link: { url: site.whatsappBookingUrl, label: "Reservar no WhatsApp" },
  },
  {
    id: "parceiro-padel",
    keywords: [
      "preciso de parceiro",
      "procuro parceiro",
      "nao tenho com quem jogar",
      "jogo aberto",
      "jogos abertos",
      "encontrar parceiro",
      "onde encontrar parceiros",
    ],
    answer: `Sem problema! Junta-te aos grupos de WhatsApp de Jogos Abertos — combina-se lá jogos de padel com outros jogadores, mesmo sem teres dupla.`,
    link: { url: site.whatsappCommunityUrl, label: "Entrar na Comunidade" },
  },
  {
    id: "vamos-treinar",
    keywords: ["vamos treinar", "bora treinar", "topas treinar", "vamos malhar"],
    answer: `Vamos! O primeiro passo é sempre o mais difícil — marca já o teu treino ou fala connosco no WhatsApp para te ajudarmos a começar.`,
  },
  {
    id: "quando-comecas",
    keywords: ["quando comecas", "quando começo", "quando posso comecar", "posso ir hoje"],
    answer: `Podes começar quando quiseres — hoje, se te apetecer! Passa por cá ou fala connosco no WhatsApp para marcarmos a tua primeira sessão.`,
  },
  {
    id: "torneios",
    keywords: ["torneios", "nonstop", "quando e o proximo torneio", "competir"],
    answer: `Temos Nonstops semanais e Torneios Sociais várias vezes por ano. As datas são anunciadas nos grupos de WhatsApp do clube.`,
    prompt: `Já jogaste algum? Vais adorar a energia!`,
    link: { url: site.whatsappCommunityUrl, label: "Entrar na Comunidade" },
  },
  {
    id: "blokos",
    keywords: ["blokos pontos", "sistema de pontos", "o que sao os blokos"],
    answer: `Blokos é o nosso sistema de pontos: jogas torneios, acumulas Blokos, e trocas por horas de padel, artigos da loja e mais. Consulta o teu saldo na app BLOKOS.`,
    link: { url: site.blokosAppUrl, label: "Abrir App BLOKOS" },
  },
  {
    id: "campanha",
    keywords: ["campanha", "desconto atual", "promocao", "oferta"],
    answer: `Setembro trouxe uma campanha especial: 50% de desconto na 1ª mensalidade se pagares as 4 mensalidades seguintes adiantado até ao fim do ano — e ainda levas 1 hora de PT + toalha BLOKO.`,
    prompt: `Fala connosco no WhatsApp para aproveitares!`,
  },
  {
    id: "quero-ser-patrocinador",
    keywords: [
      "quero ser patrocinador",
      "como ser patrocinador",
      "ser patrocinador",
      "patrocinio",
      "patrocinar o bloko",
      "proposta de patrocinio",
      "parceria com o bloko",
      "quero patrocinar",
      "empresa parceira",
    ],
    answer: `Boa! Temos várias formas de patrocínio — naming rights de campos, patrocínio de torneios e parcerias locais. Manda-nos uma mensagem com o nome da tua empresa e vemos contigo as opções disponíveis.`,
    prompt: `Qual é a tua empresa? Vamos ver o melhor encaixe para vocês!`,
    link: { url: site.whatsappUrl, label: "Falar no WhatsApp" },
  },
  {
    id: "patrocinador-campo",
    keywords: [
      "patrocinador do campo",
      "patrocinadores dos campos",
      "nome dos campos",
      "quem patrocina os campos",
      "naming rights",
    ],
    answer: `Os 4 campos têm naming rights de patrocinadores: Campo 1 — ${courtSponsors[0].sponsor}, Campo 2 — ${courtSponsors[1].sponsor}, Campo 3 — ${courtSponsors[2].sponsor}, Campo 4 — ${courtSponsors[3].sponsor}.`,
  },
  {
    id: "patrocinadores-gerais",
    keywords: [
      "quem sao os patrocinadores",
      "lista de patrocinadores",
      "parceiros do bloko",
      "quais sao os parceiros",
    ],
    answer: `Contamos com o apoio de vários parceiros locais: ${sponsors.map((s) => s.name).join(", ")}.`,
  },
  {
    id: "patrocinadores-torneios",
    keywords: [
      "patrocinadores dos torneios",
      "quem patrocina os torneios",
      "patrocinadores de torneios anteriores",
    ],
    answer: `Os nossos torneios já tiveram o apoio de: ${tournamentSponsors.map((s) => s.name).join(", ")}.`,
  },
];

// Base de conhecimento "geral" — dados reais do site que não têm uma
// resposta curada dedicada. Consultada só depois de `faq` não encontrar
// nada, para tentar sempre responder com informação real antes de desistir.
const classBySlug = (slug: string) => classTypes.find((c) => c.slug === slug)!;

export const knowledge: FaqEntry[] = [
  {
    id: "tipos-aulas-padel",
    keywords: [
      "tipos de aulas de padel",
      "niveis de aulas de padel",
      "iniciacao aperfeicoamento",
      "aula para iniciantes padel",
    ],
    answer: `Temos aulas de Padel para dois níveis: ${classBySlug("padel-iniciacao").full} (${classBySlug("padel-iniciacao").description.toLowerCase()}) e ${classBySlug("padel-aperfeicoamento").full} (${classBySlug("padel-aperfeicoamento").description.toLowerCase()})`,
  },
  {
    id: "escaloes-academia",
    keywords: [
      "escaloes da academia",
      "idades da academia",
      "academia sub 12",
      "academia sub 16",
      "para que idades e a academia",
    ],
    answer: `A Academia tem duas turmas fixas por escalão: ${classBySlug("academia-sub12").full} (${classBySlug("academia-sub12").description.toLowerCase()}) e ${classBySlug("academia-sub16").full} (${classBySlug("academia-sub16").description.toLowerCase()})`,
  },
  {
    id: "descricao-aulas-grupo",
    keywords: [
      "o que e o gap",
      "o que e abs",
      "o que e funcional",
      "descricao das aulas de grupo",
      "em que consistem as aulas",
    ],
    answer: `${classBySlug("gap").full} (GAP): ${classBySlug("gap").description} ${classBySlug("abs").full} (ABS): ${classBySlug("abs").description} ${classBySlug("funcional").full}: ${classBySlug("funcional").description}`,
  },
  {
    id: "eventos-realizados",
    keywords: [
      "eventos que ja fizeram",
      "eventos anteriores",
      "festas do bloko",
      "aniversario bloko",
      "que eventos ja houve",
    ],
    answer: `Já fizemos vários eventos temáticos, entre eles: ${events.map((e) => e.name).join(", ")}.`,
  },
  {
    id: "torneios-realizados",
    keywords: [
      "torneios que ja fizeram",
      "torneios anteriores",
      "historico de torneios",
      "que torneios ja houve",
    ],
    answer: `Já realizámos vários Torneios Sociais, entre eles: ${pastTournaments.map((t) => t.name).join(", ")}.`,
  },
  {
    id: "socio-fundador",
    keywords: ["socio fundador", "desconto fundador", "o que e socio fundador"],
    answer: `Os Sócios Fundadores têm ${padelLessonPricing.founderDiscount.toLowerCase()} nas Aulas de Padel e ${academiaPricing.founderDiscount.toLowerCase()} na Academia.`,
  },
  {
    id: "grupo-marcacoes",
    keywords: ["grupo de marcacoes", "avisos de marcacoes"],
    answer: `Para pedidos e avisos sobre marcações de campos e aulas, junta-te ao grupo "Marcações" na nossa comunidade de WhatsApp.`,
    link: { url: site.whatsappCommunityUrl, label: "Entrar na Comunidade" },
  },
];

function findBestMatch<T extends { keywords: string[] }>(question: string, entries: T[]): T | null {
  const qWords = words(question);
  if (qWords.length === 0) return null;

  const bags = entries.map((entry) => new Set(entry.keywords.flatMap((k) => words(k))));

  // Peso por palavra: quanto mais entries partilham essa palavra, menos ela distingue
  // o tema da pergunta (ex: "padel" aparece em quase tudo; "pt" só numa entry).
  // Isto evita que uma palavra genérica empate com uma palavra rara e decida por
  // ordem do array em vez de por relevância real.
  const df = new Map<string, number>();
  for (const bag of bags) {
    for (const w of bag) df.set(w, (df.get(w) ?? 0) + 1);
  }
  const weight = (w: string) => 1 / (df.get(w) ?? 1);

  const nq = normalize(question);
  let best: { entry: T; score: number } | null = null;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const bag = bags[i];
    const matched = qWords.filter((w) => bag.has(w));
    if (matched.length === 0) continue;

    const weightedMatch = matched.reduce((sum, w) => sum + weight(w), 0);

    // Bónus grande se alguma frase-chave inteira aparecer tal e qual na pergunta.
    let phraseBonus = 0;
    for (const kw of entry.keywords) {
      const nkw = normalize(kw);
      if (nq.includes(nkw)) {
        phraseBonus = Math.max(phraseBonus, words(kw).length * 3);
      }
    }

    // Favorece respostas que expliquem a maior parte da pergunta (precisão),
    // sem penalizar perguntas mais longas que só têm uma palavra-chave forte.
    const coverage = matched.length / qWords.length;
    const score = weightedMatch * 2 + phraseBonus + coverage;

    if (!best || score > best.score) {
      best = { entry, score };
    }
  }

  return best ? best.entry : null;
}

export function matchFaq(question: string): FaqEntry | null {
  return findBestMatch(question, faq);
}

/** Pesquisa a base de conhecimento geral — usada só depois de `matchFaq` falhar,
 * para tentar sempre encontrar informação real do site antes de admitir que não sabe. */
export function matchKnowledge(question: string): FaqEntry | null {
  return findBestMatch(question, knowledge);
}
