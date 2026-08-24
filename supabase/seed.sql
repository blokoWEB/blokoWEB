-- BLOKO — aulas de exemplo para testar o sistema de marcação.
-- Corre isto no SQL Editor do Supabase DEPOIS de correres schema.sql.
-- As datas são calculadas a partir de "agora", por isso ficam sempre no futuro
-- (podes correr este ficheiro outra vez a qualquer momento para gerar novas).

insert into class_sessions (category, title, description, starts_at, duration_minutes, capacity, location)
values
  -- Ginásio — aulas de grupo, incluídas na mensalidade
  ('ginasio', 'GAP', 'Glúteos, Abdominais e Pernas — treino de tonificação em circuito.',
    (now() + interval '1 day')::date + time '18:15', 45, 14, 'BLOKO - Rua Coronel Teófilo Morais, 40, Bragança'),
  ('ginasio', 'BLOKO BURN', 'Treino metabólico de alta intensidade ao ritmo da música.',
    (now() + interval '2 day')::date + time '18:15', 45, 14, 'BLOKO - Rua Coronel Teófilo Morais, 40, Bragança'),
  ('ginasio', 'ABS', 'Core & Abdominais — postura e definição.',
    (now() + interval '3 day')::date + time '18:30', 30, 16, 'BLOKO - Rua Coronel Teófilo Morais, 40, Bragança'),
  ('ginasio', 'Funcional', 'Treino funcional multiarticular para força e mobilidade.',
    (now() + interval '4 day')::date + time '18:15', 45, 14, 'BLOKO - Rua Coronel Teófilo Morais, 40, Bragança'),

  -- Padel — aulas avulsas
  ('padel', 'Padel — Iniciação', 'Técnica de base, posicionamento e regras do jogo. Para quem está a começar.',
    (now() + interval '2 day')::date + time '10:00', 60, 4, 'BLOKO - Campo 2'),
  ('padel', 'Padel — Aperfeiçoamento', 'Evolução tática e técnica para jogadores com experiência.',
    (now() + interval '5 day')::date + time '19:00', 60, 4, 'BLOKO - Campo 3'),

  -- Academia — turmas fixas por escalão etário
  ('academia', 'Academia Sub-12', 'Turma fixa semanal — técnica de base e competição adaptada.',
    (now() + interval '1 day')::date + time '17:00', 60, 8, 'BLOKO - Campo 1'),
  ('academia', 'Academia Sub-16', 'Turma fixa semanal — formação e competição para adolescentes.',
    (now() + interval '3 day')::date + time '17:00', 60, 8, 'BLOKO - Campo 1');
