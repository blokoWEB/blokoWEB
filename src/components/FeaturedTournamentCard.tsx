import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Trophy, Users } from "lucide-react";
import type { TournamentEntry } from "@/lib/site-data";

export default function FeaturedTournamentCard({ tournament }: { tournament: TournamentEntry }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row">
      <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto shrink-0">
        {tournament.poster ? (
          <Image
            src={tournament.poster}
            alt={tournament.name}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Trophy size={40} className="text-[var(--color-lime)]" />
          </div>
        )}
        {tournament.comingSoon && (
          <span className="absolute top-4 right-4 text-[10px] font-display uppercase tracking-wide px-3 py-1.5 rounded-full bg-[var(--color-lime)] text-black glow-lime">
            Brevemente
          </span>
        )}
      </div>

      <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-2">
          {tournament.tag}
          {tournament.dates ? ` · ${tournament.dates}` : ""}
        </p>
        <h3 className="font-display uppercase text-2xl md:text-3xl mb-4">{tournament.name}</h3>
        {tournament.summary && (
          <p className="text-sm text-[var(--color-text-muted)] mb-5">{tournament.summary}</p>
        )}

        {tournament.details && tournament.details.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-7">
            {tournament.details.map((d) => (
              <li key={d} className="text-sm text-[var(--color-text-muted)] flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[var(--color-lime)] shrink-0 mt-0.5" /> {d}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-3">
          {tournament.registerUrl && (
            <a
              href={tournament.registerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Inscrever <ArrowRight size={15} />
            </a>
          )}
          {tournament.partnerUrl && (
            <a
              href={tournament.partnerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              <Users size={15} /> Encontrar Parceiro
            </a>
          )}
          {tournament.hasDetailPage && (
            <Link
              href={`/torneios/${tournament.slug}`}
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              Ver Torneio Completo <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
