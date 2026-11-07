import { lisbonToDate } from "@/lib/lisbon-time";

/**
 * Black Friday 2026 (2º aniversário do BLOKO). Os valores vêm do cartaz da campanha.
 * `endsAt` é o início do dia 23 em Lisboa, ou seja, a promoção vale o dia 22 inteiro.
 * Passada essa data, o popup e a secção da página do ginásio desaparecem sozinhos.
 */
export const BLACK_FRIDAY = {
  endsAt: lisbonToDate(2026, 11, 23, 0, 0).getTime(),
  untilLabel: "22 de novembro",
  yearPriceEur: 120,
  enrollmentEur: 15,
  monthPriceEur: 10,
  spots: 30,
  poster: "/images/campaigns/black-friday-feed.webp",
  story: "/images/campaigns/black-friday-story.webp",
  video: "/videos/black-friday-2026.mp4",
  href: "/ginasio#black-friday",
} as const;

export function isBlackFridayActive(now: number = Date.now()): boolean {
  return now < BLACK_FRIDAY.endsAt;
}
