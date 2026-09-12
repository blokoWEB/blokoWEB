export type ClassSession = {
  id: string;
  category: "ginasio" | "padel" | "academia";
  title: string;
  description: string | null;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  location: string;
  series_id: string | null;
  instructor: string | null;
  created_at: string;
};

export type ClassSessionWithCount = ClassSession & {
  booked_count: number;
};

export type Booking = {
  id: string;
  session_id: string;
  name: string;
  email: string;
  member_code: string | null;
  attended: boolean;
  cancelled: boolean;
  created_at: string;
};

export type AcademiaInscricao = {
  id: string;
  level: string;
  name: string;
  contact: string;
  created_at: string;
};
