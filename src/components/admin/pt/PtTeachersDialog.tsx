"use client";

/** Gerir os professores: nome, cor no calendário, ativar/desativar e juntar um novo. Só a administração. */
import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type { PtTeacher, PtTeacherKind } from "@/lib/pt-types";
import { ptApi } from "./pt-api";

type Props = {
  teachers: PtTeacher[];
  onClose: () => void;
  onChanged: (teachers: PtTeacher[]) => void;
};

const PALETTE = ["#a9c81e", "#5b81cf", "#e5a13a", "#d96c9b", "#4fc3b0", "#9b7bd8", "#e8604c"];

export default function PtTeachersDialog({ teachers, onClose, onChanged }: Props) {
  const [list, setList] = useState(teachers);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<PtTeacherKind>("ginasio");
  const [color, setColor] = useState(PALETTE[list.length % PALETTE.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function commit(next: PtTeacher[]) {
    setList(next);
    onChanged(next);
  }

  async function patch(t: PtTeacher, change: { name?: string; color?: string; active?: boolean }) {
    setBusy(t.id);
    setError(null);
    try {
      const updated = await ptApi.updateTeacher(t.id, change);
      commit(list.map((x) => (x.id === t.id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo correu mal.");
    } finally {
      setBusy(null);
    }
  }

  async function add() {
    if (!name.trim()) return;
    setBusy("new");
    setError(null);
    try {
      const created = await ptApi.createTeacher({ name, kind, color });
      commit([...list, created]);
      setName("");
      setColor(PALETTE[(list.length + 1) % PALETTE.length]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo correu mal.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="glass-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 relative max-h-[92dvh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[var(--color-text-muted)] hover:text-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
        <h3 className="font-display uppercase text-xl sm:text-2xl mb-1 pr-8">Professores</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">
          A cor serve para reconhecer rapidamente as aulas de cada um no calendário. Um professor desativado deixa de
          aparecer ao criar aulas, mas as aulas dele ficam no histórico.
        </p>

        <div className="space-y-2">
          {list.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 ${t.active ? "" : "opacity-55"}`}
            >
              <input
                type="color"
                value={t.color}
                disabled={busy === t.id}
                onChange={(e) => patch(t, { color: e.target.value })}
                className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0"
                aria-label={`Cor de ${t.name}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{t.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {t.kind === "padel" ? "Padel" : "Ginásio"}
                  {t.active ? "" : " · desativado"}
                </p>
              </div>
              <button
                disabled={busy === t.id}
                onClick={() => patch(t, { active: !t.active })}
                className="text-xs rounded-full border border-white/15 px-3 py-1.5 text-[var(--color-text-muted)] hover:text-white"
              >
                {t.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 p-4 space-y-3">
          <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Novo professor</p>
          <input
            className="input"
            placeholder="Nome"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <div className="flex items-center gap-3">
            <select className="input" value={kind} onChange={(e) => setKind(e.target.value as PtTeacherKind)}>
              <option value="ginasio">Ginásio (PT)</option>
              <option value="padel">Padel (aulas)</option>
            </select>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              aria-label="Cor"
            />
          </div>
          <button
            disabled={busy === "new" || !name.trim()}
            onClick={add}
            className="w-full flex items-center justify-center gap-2 font-display uppercase text-xs tracking-wide rounded-full bg-[var(--color-lime)] text-black py-3 disabled:opacity-40"
          >
            {busy === "new" ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Juntar professor
          </button>
        </div>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </div>
    </div>
  );
}
