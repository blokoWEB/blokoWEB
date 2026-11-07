export type PtTeacherKind = "ginasio" | "padel";
export type PtKind = "pt" | "aula_padel";
export type PtScope = "this" | "following";

export type PtTeacher = {
  id: string;
  name: string;
  kind: PtTeacherKind;
  color: string;
  active: boolean;
};

export type PtStudent = {
  id: string;
  session_id: string;
  name: string;
  attended: boolean;
};

export type PtSession = {
  id: string;
  teacher_id: string;
  kind: PtKind;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  notes: string | null;
  series_id: string | null;
  status: "agendada" | "cancelada";
  altered: boolean;
  altered_at: string | null;
  created_at: string;
  updated_at: string;
  students: PtStudent[];
};

export type PtLogEntry = {
  id: string;
  session_id: string;
  at: string;
  actor: string;
  action: string;
  detail: string | null;
};

export const PT_KIND_LABEL: Record<PtKind, string> = {
  pt: "PT",
  aula_padel: "Aula de padel",
};
