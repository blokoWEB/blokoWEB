import {
  academiaPricing,
  gymFamilyPack,
  gymMembership,
  gymPersonalTraining,
  gymWeekendPack,
  groupClassPricing,
  padelCourtPricing,
  padelGymComboPack,
  padelLessonPricing,
  site,
} from "@/lib/site-data";

export type FaqEntry = {
  id: string;
  keywords: string[];
  answer: string;
};

function euro(v: string) {
  return v.replace(".", ",");
}

export const faq: FaqEntry[] = [
  {
    id: "preco-padel-campo",
    keywords: [
      "preco hora padel",
      "quanto custa padel",
      "preco campo",
      "aluguer campo",
      "alugar campo",
      "preco do campo",
      "quanto custa o campo",
      "reservar campo preco",
    ],
    answer:
      `Aluguer de campo: Off Peak (seg-sex, ${padelCourtPricing.offPeakHours.toLowerCase()}) ${padelCourtPricing.offPeak[0].price} (1h) ou ${padelCourtPricing.offPeak[1].price} (1h30). ` +
      `Peak Hour: ${padelCourtPricing.peak[0].price} (1h) ou ${padelCourtPricing.peak[1].price} (1h30). ` +
      `Aluguer de raquete: ${padelCourtPricing.racketRental[0].model} ${padelCourtPricing.racketRental[0].price}, ${padelCourtPricing.racketRental[1].model} ${padelCourtPricing.racketRental[1].price}. ` +
      `Já sabes o preço — agora só falta marcar! Já tens dupla, ou precisas que te arranjemos parceiro?`,
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
    ],
    answer:
      `Uma sessão avulsa (Treino Único) custa ${euro(gymMembership.trial[0].price)}. Também há opções para experimentares mais tempo: 1 Semana de Acesso Livre por ${euro(gymMembership.trial[1].price)} ou 2 Semanas por ${euro(gymMembership.trial[2].price)}. ` +
      `Já sabes o preço, agora só falta a motivação para começar! Vamos a isso?`,
  },
  {
    id: "mensalidade-ginasio",
    keywords: [
      "mensalidade ginasio",
      "preco ginasio",
      "quanto custa o ginasio",
      "inscricao ginasio",
      "quanto custa inscrever",
    ],
    answer:
      `Mensalidade do Ginásio: Acesso Livre ${euro(gymMembership.plans[0].price)}/mês, ou Off Peak (${gymMembership.plans[1].note?.toLowerCase()}) por ${euro(gymMembership.plans[1].price)}/mês. Inscrição: ${euro(gymMembership.inscricao)} (inclui avaliação física e plano de treino). ` +
      `Já sabes os preços, agora só falta a motivação para começar! Vamos a isso? Treinas toda a semana ou preferes só ao fim de semana? E já agora — vens com família ou amigos? Temos o Pack Família com desconto por pessoa!`,
  },
  {
    id: "pack-familia",
    keywords: ["pack familia", "desconto familia", "inscrever familia", "preco familia"],
    answer:
      `Pack Família do Ginásio: ${gymFamilyPack[0].members} — ${euro(gymFamilyPack[0].price)}${gymFamilyPack[0].period}; ${gymFamilyPack[1].members} — ${euro(gymFamilyPack[1].price)}${gymFamilyPack[1].period}. ` +
      `Chama o resto da família e treinem juntos — quantos são?`,
  },
  {
    id: "pack-fds",
    keywords: ["pack fim de semana", "fim-de-semana ginasio", "sexta a noite"],
    answer:
      `Pack Fim-de-Semana: ${euro(gymWeekendPack.price)}${gymWeekendPack.period} — ${gymWeekendPack.note}. ` +
      `Perfeito se só tens tempo ao fim de semana — vamos marcar o teu primeiro treino?`,
  },
  {
    id: "combo-padel-ginasio",
    keywords: ["combo padel ginasio", "pack padel ginasio", "padel e ginasio junto"],
    answer:
      `Pack Padel + Ginásio: ${euro(padelGymComboPack.price)}${padelGymComboPack.period} (${padelGymComboPack.note}). Inscrição: ${euro(padelGymComboPack.inscricao)}. ` +
      `Dois desportos, uma só mensalidade — queres experimentar os dois já esta semana?`,
  },
  {
    id: "personal-training",
    keywords: ["personal training", "treino personalizado", "preco pt", "personal trainer"],
    answer:
      `Personal Training (preço/mês): Individual — 1x ${euro(gymPersonalTraining[0].plans[0].price)}, 2x ${euro(gymPersonalTraining[0].plans[1].price)}, 3x ${euro(gymPersonalTraining[0].plans[2].price)} por semana. ` +
      `Em 2 pessoas ou 3 pessoas fica mais barato por pessoa — pergunta-nos os valores no WhatsApp. ` +
      `Queres um treino só para ti? Diz-nos o teu objetivo e ajudamos-te a escolher o plano certo.`,
  },
  {
    id: "aulas-padel-preco",
    keywords: ["preco aulas padel", "aula de padel preco", "quanto custa uma aula de padel"],
    answer:
      `Aulas de Padel (individual): Peak Hour ${padelLessonPricing.peak[0].plans[0].price} (1 aula) / ${padelLessonPricing.peak[0].plans[1].price} (5 aulas) / ${padelLessonPricing.peak[0].plans[2].price} (10 aulas). ` +
      `Off Peak: ${padelLessonPricing.offPeak[0].plans[0].price} / ${padelLessonPricing.offPeak[0].plans[1].price} / ${padelLessonPricing.offPeak[0].plans[2].price}. Em grupo o preço por pessoa desce bastante — ${padelLessonPricing.founderDiscount.toLowerCase()}. ` +
      `Bora subir de nível? Marca a tua primeira aula!`,
  },
  {
    id: "academia-preco",
    keywords: ["academia preco", "academia padel preco", "inscricao academia", "academia mensalidade"],
    answer:
      `Academia BLOKO: Adultos 1x/semana ${academiaPricing.tiers[0].plans[0].price} ou 2x/semana ${academiaPricing.tiers[0].plans[1].price}. Kids 1x/semana ${academiaPricing.tiers[1].plans[0].price} ou 2x/semana ${academiaPricing.tiers[1].plans[1].price}. ${academiaPricing.founderDiscount}. ` +
      `É a forma mais divertida de aprender padel a sério — é para ti ou para o teu filho/filha?`,
  },
  {
    id: "aulas-grupo-preco",
    keywords: ["aulas de grupo preco", "gap abs funcional preco", "aula avulso ginasio"],
    answer:
      `Aulas de Grupo (GAP, ABS, Funcional) já estão incluídas na mensalidade do Ginásio. Sem mensalidade: ${groupClassPricing.tiers[0].plans[0].freq} por ${groupClassPricing.tiers[0].plans[0].price}, ou pacotes semanais a partir de ${groupClassPricing.tiers[0].plans[1].price}. ${groupClassPricing.note}. ` +
      `Já experimentaste alguma? É só apareceres — qual te apetece mais?`,
  },
  {
    id: "horarios",
    keywords: ["horario", "horarios", "a que horas abrem", "quando abrem", "quando fecham"],
    answer:
      `Ginásio: ${site.hours.ginasio.map((h) => `${h.days} ${h.time}`).join(" · ")}. ` +
      `Padel: ${site.hours.padel.map((h) => `${h.days} ${h.time}`).join(" · ")}. ` +
      `Aparece quando quiseres — vemo-nos em breve?`,
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
    id: "reservar-padel",
    keywords: ["reservar padel", "marcar campo", "quero jogar padel", "playtomic"],
    answer: `Reserva o teu campo diretamente pelo WhatsApp ou pelo Playtomic — o que preferires. Combina já um jogo, é rapidinho!`,
  },
  {
    id: "parceiro-padel",
    keywords: [
      "preciso de parceiro",
      "procuro parceiro",
      "nao tenho com quem jogar",
      "jogo aberto",
      "encontrar parceiro",
    ],
    answer: `Sem problema! Junta-te aos grupos de WhatsApp de Jogos Abertos — combina-se lá padel com outros sócios fora dos torneios, mesmo sem teres dupla.`,
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
    answer: `Temos Nonstops semanais e Torneios Sociais várias vezes por ano. As datas são anunciadas nos grupos de WhatsApp do clube — dá uma vista de olhos na página de Torneios. Já jogaste algum? Vais adorar a energia!`,
  },
  {
    id: "blokos",
    keywords: ["blokos pontos", "sistema de pontos", "o que sao os blokos"],
    answer: `Blokos é o nosso sistema de pontos: jogas torneios, acumulas Blokos, e trocas por horas de padel, artigos da loja e mais. Consulta o teu saldo na app BLOKOS.`,
  },
  {
    id: "campanha",
    keywords: ["campanha", "desconto atual", "promocao", "oferta"],
    answer: `Setembro trouxe uma campanha especial: 50% de desconto na 1ª mensalidade se pagares as 4 mensalidades seguintes adiantado até ao fim do ano — e ainda levas 1 hora de PT + toalha BLOKO. Fala connosco no WhatsApp para aproveitares.`,
  },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function matchFaq(question: string): FaqEntry | null {
  const q = normalize(question);
  if (!q) return null;

  let best: { entry: FaqEntry; score: number } | null = null;

  for (const entry of faq) {
    let score = 0;
    for (const kw of entry.keywords) {
      const nkw = normalize(kw);
      if (q.includes(nkw)) {
        score += nkw.split(" ").length; // frases mais específicas pesam mais
      } else {
        // conta palavras individuais em comum (match parcial)
        const words = nkw.split(" ").filter((w) => w.length > 3);
        const hits = words.filter((w) => q.includes(w)).length;
        if (hits === words.length && words.length > 0) score += hits * 0.5;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best ? best.entry : null;
}
