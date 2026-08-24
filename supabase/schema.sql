-- BLOKO — schema do sistema de marcação de aulas.
-- Corre isto no SQL Editor do teu projeto Supabase (Database > SQL Editor).

create extension if not exists pgcrypto;

create table if not exists class_sessions (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'ginasio' check (category in ('ginasio', 'padel', 'academia')),
  title text not null,
  description text,
  starts_at timestamptz not null,
  duration_minutes integer not null default 45,
  capacity integer not null default 14,
  location text not null default 'BLOKO - Rua Coronel Teófilo Morais, 40, Bragança',
  series_id uuid,
  instructor text,
  created_at timestamptz not null default now()
);

create index if not exists class_sessions_series_id_idx on class_sessions(series_id);

-- Se a tabela já existia antes destes campos serem introduzidos, corre isto também:
-- alter table class_sessions add column if not exists category text not null default 'ginasio'
--   check (category in ('ginasio', 'padel', 'academia'));
-- alter table class_sessions add column if not exists series_id uuid;
-- alter table class_sessions add column if not exists instructor text;
-- create index if not exists class_sessions_series_id_idx on class_sessions(series_id);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references class_sessions(id) on delete cascade,
  name text not null,
  email text not null,
  member_code text,
  attended boolean not null default false,
  cancelled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists bookings_session_id_idx on bookings(session_id);
create index if not exists class_sessions_starts_at_idx on class_sessions(starts_at);

-- RLS ligado, sem policies: só o backend (service role key) acede a estas tabelas.
alter table class_sessions enable row level security;
alter table bookings enable row level security;
