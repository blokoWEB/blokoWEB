/**
 * URL do otimizador de imagens do Next para sítios onde o next/image não serve
 * (fundos CSS, poster de <video>). Sem isto o telemóvel descarrega o ficheiro original inteiro.
 *
 * `width` tem de ser uma das larguras do Next (640, 750, 828, 1080, 1200, 1920, 2048, 3840) e a
 * qualidade é a única permitida por omissão no Next 16 (75). Imagens remotas têm de estar em
 * images.remotePatterns (next.config.ts).
 */
export function optimizedImageUrl(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
