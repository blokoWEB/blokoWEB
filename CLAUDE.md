@AGENTS.md

## Peso das imagens e vídeos (regra permanente)

O dono já pediu isto várias vezes: o site tem de ser leve em telemóvel (muitos visitantes vêm por WhatsApp/Instagram com dados móveis). **Qualquer imagem, foto ou vídeo novo tem de ser redimensionado e comprimido antes de entrar, e o peso tem de ser medido antes de dizer que está feito.**

1. **Nunca copiar originais para `public/` nem para o Supabase.**
   - Fotos para `public/images`: lado maior ≤ 2560 px, JPEG mozjpeg q78. `node scripts/optimize-images.js` (simula) e `--apply` (aplica; guarda os originais em `.imagens-originais/`, fora do git).
   - Cartazes/gráficos já prontos (ex.: cartazes dos vencedores): ~800 px de largura, WebP q76 (~50 KB cada).
   - Galeria de fotos (Supabase): só com `scripts/upload-gallery.js` (grande 1600 px mozjpeg q72 + miniatura 500 px; simula por defeito, `--upload` para enviar, recusa passar de 85 % do plano). A exportação do Lightroom pesa ~4× mais do que o mozjpeg para a mesma qualidade, por isso nunca enviar direto.
2. **Usar `next/image` com `sizes` certo.** Fundos CSS e `<video poster>` **não** passam pelo otimizador e chegam inteiros ao telemóvel: usar `optimizedImageUrl()` de `src/lib/images.ts` (já usado em `ParallaxDive` e `VideoShowcase`). No Next 16 só a qualidade 75 é permitida e as larguras são as de `deviceSizes` (640, 750, 828, 1080, 1200, 1920…).
3. **Medir, não adivinhar.** Com o servidor de desenvolvimento a correr: `npm run audit:images` soma as imagens de cada página do sitemap (limites: 1,5 MB por página, 400 KB por imagem). Correr antes de publicar páginas ou imagens novas, corrigir os avisos, e repetir contra produção depois do deploy (`node scripts/audit-site-images.js https://bloko.com.pt`).
4. **Supabase (plano gratuito):** 1 GB de armazenamento e 5 GB/mês de largura de banda; ultrapassar qualquer um restringe a conta e o site inteiro deixa de funcionar. O painel mostra ~15 % mais armazenamento do que a soma dos ficheiros pela API.
5. **Vídeos:** o único é `public/videos/bloko-ginasio.mp4` (13 MB, 58 s, 720×1280, ~1,9 Mbps) e reproduz-se sozinho quando entra no ecrã (gasta dados sem o visitante carregar em play). Qualquer vídeo novo deve ser comprimido antes (H.264, ≤ 1 Mbps em vertical 720p). Não há ffmpeg instalado nesta máquina.
6. Ao acrescentar uma foto a um topo de página, uma galeria ou uma campanha, referir no fim quanto pesa (KB) e o resultado da auditoria.
