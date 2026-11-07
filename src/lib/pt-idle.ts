/**
 * Tempos de inatividade da área dos professores (/admin/professores). Ficam num ficheiro à parte, sem código de
 * servidor, para o servidor (pt-session.ts) e o ecrã (TeacherPortal.tsx) usarem sempre os mesmos valores.
 *
 * - Passado `PT_IDENTITY_IDLE_SECONDS` sem usar, volta a perguntar "Quem és tu?" (evita que outra pessoa mexa
 *   no calendário em nome do colega que deixou o ecrã aberto).
 * - Passado `PT_SESSION_IDLE_SECONDS` sem usar, pede o login outra vez.
 * - `PT_SESSION_MAX_SECONDS` é o limite absoluto, mesmo com uso constante.
 */
export const PT_IDENTITY_IDLE_SECONDS = 5 * 60;
export const PT_SESSION_IDLE_SECONDS = 30 * 60;
export const PT_SESSION_MAX_SECONDS = 12 * 60 * 60;
