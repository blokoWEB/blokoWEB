-- BLOKO — gestão de PTs, treinos personalizados e aulas de padel (só administração).
-- Corre isto no SQL Editor do Supabase (Database > SQL Editor). É seguro correr mais de uma vez.
-- Estas tabelas são separadas das aulas de grupo públicas (class_sessions / bookings).

create extension if not exists pgcrypto;

create table if not exists pt_teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind text not null check (kind in ('ginasio', 'padel')),
  color text not null default '#a9c81e',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists pt_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references pt_teachers(id),
  kind text not null default 'pt' check (kind in ('pt', 'aula_padel')),
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes between 5 and 480),
  capacity integer not null default 1 check (capacity between 1 and 30),
  notes text,
  series_id uuid,
  status text not null default 'agendada' check (status in ('agendada', 'cancelada')),
  altered boolean not null default false,
  altered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pt_sessions_starts_at_idx on pt_sessions(starts_at);
create index if not exists pt_sessions_teacher_idx on pt_sessions(teacher_id);
create index if not exists pt_sessions_series_idx on pt_sessions(series_id);

create table if not exists pt_students (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references pt_sessions(id) on delete cascade,
  name text not null,
  attended boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists pt_students_session_idx on pt_students(session_id);

create table if not exists pt_log (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references pt_sessions(id) on delete cascade,
  at timestamptz not null default now(),
  actor text not null default 'Administração',
  action text not null,
  detail text
);

create index if not exists pt_log_session_idx on pt_log(session_id, at);

-- RLS ligado, sem policies: só o backend (service role key) acede a estas tabelas.
alter table pt_teachers enable row level security;
alter table pt_sessions enable row level security;
alter table pt_students enable row level security;
alter table pt_log enable row level security;

-- Professores iniciais (podes acrescentar/desativar mais no admin).
insert into pt_teachers (name, kind, color) values
  ('Pedro Aires', 'ginasio', '#a9c81e'),
  ('André Felix', 'ginasio', '#5b81cf'),
  ('Rodrigo Sá', 'ginasio', '#e5a13a'),
  ('André Teixeira', 'padel', '#d96c9b')
on conflict (name) do nothing;
