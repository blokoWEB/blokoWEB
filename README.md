# BLOKO — site novo

Site em Next.js (React + TypeScript) para o BLOKO — Padel, Ginásio & Lounge, Bragança.

## Stack

- **Next.js 16** (App Router) + Tailwind CSS 4 + Framer Motion (animações de scroll)
- **Supabase** (Postgres) para o sistema de marcação de aulas
- Deploy recomendado: **Vercel** (gratuito para este tamanho de projeto)

## Configuração inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto Supabase

1. Cria uma conta gratuita em [supabase.com](https://supabase.com) e um novo projeto.
2. Vai a **SQL Editor** e corre o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
3. Vai a **Project Settings > API** e copia o `Project URL` e a `service_role` key (não a `anon` key).

### 3. Configurar variáveis de ambiente

Copia `.env.local.example` para `.env.local` e preenche:

```bash
cp .env.local.example .env.local
```

- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` — do passo anterior.
- `ADMIN_USERNAME` — o utilizador que vai entrar em `/admin`.
- `ADMIN_PASSWORD_HASH_B64` — gera com:
  ```bash
  node scripts/hash-password.mjs "a-password-que-quiseres"
  ```
  e cola o resultado.
- `ADMIN_SESSION_SECRET` — qualquer string aleatória longa (ex: `openssl rand -hex 32`).

### 4. Correr localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Painel Admin

- `/admin` — login com o utilizador/password definidos em `.env.local`.
- `/admin/dashboard` — criar/eliminar aulas, ver inscritos e marcar presenças.

## Estrutura

```
src/app/            páginas (Home, Ginásio, Padel, Torneios, Patrocinadores, Aulas, Contactos, Admin)
src/app/api/        rotas de API (aulas, marcações, login admin)
src/components/     Navbar, Footer, animações de scroll
src/lib/            conteúdo do site, Supabase, sessão admin
supabase/schema.sql schema da base de dados
public/images/      logótipo + imagens
```

## Por fazer / a decidir com o cliente

- Substituir as imagens geradas (placeholders futuristas) por fotografia real do espaço.
- Preencher a lista real de patrocinadores em `src/lib/site-data.ts` (`sponsorTiers`).
- Confirmar se as inscrições em torneios devem passar a ser feitas no site (atualmente só WhatsApp).
- Deploy em produção (Vercel) e domínio.
- **Segurança do WordPress atual (bloko.com.pt)**: foi detetado spam de SEO injetado no site em produção — sinal de comprometimento. Recomenda-se mudar a password do wp-admin e limpar o site atual, independentemente do lançamento deste site novo.
