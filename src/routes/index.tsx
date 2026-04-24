import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Vacancy } from "@/lib/vacancy";
import { formatDate } from "@/lib/vacancy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Job Vacancies — Deanna Day Spa" },
      {
        name: "description",
        content:
          "Open positions at Deanna Day Spa Bali. Browse current vacancies in Seminyak and apply via WhatsApp.",
      },
      { property: "og:title", content: "Job Vacancies — Deanna Day Spa" },
      {
        property: "og:description",
        content:
          "Browse open positions at Deanna Day Spa Bali. Senior Therapist, Assistant, and more.",
      },
    ],
  }),
  component: VacanciesListPage,
});

const BLUE = "#1DA1F2";
const CREAM = "#FDFCF0";
const BORDER = "rgba(29,161,242,0.18)";

function VacanciesListPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("vacancies")
      .select("*")
      .eq("status", "open")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setVacancies(data as Vacancy[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: CREAM }}>
      <header
        className="w-full border-b"
        style={{ borderColor: BORDER, backgroundColor: "rgba(253,252,240,0.92)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold uppercase tracking-wide"
            style={{ color: BLUE }}
          >
            Job Vacancies
          </h1>
          <p className="mt-2 text-base sm:text-lg text-neutral-700">
            Join our growing team at Deanna Day Spa in Seminyak, Bali.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-neutral-900">
            Open Positions{" "}
            <span className="text-neutral-500 font-normal">({vacancies.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-neutral-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : vacancies.length === 0 ? (
          <div
            className="rounded-2xl border bg-white p-10 text-center text-neutral-600"
            style={{ borderColor: BORDER }}
          >
            No open vacancies at the moment. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vacancies.map((v) => (
              <Link
                key={v.id}
                to="/vacancies/$slug"
                params={{ slug: v.slug }}
                className="group block rounded-2xl bg-white border overflow-hidden transition hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: BORDER }}
              >
                {v.cover_image_url && (
                  <div className="aspect-[16/8] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={v.cover_image_url}
                      alt={v.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: BLUE }}
                    >
                      Open
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
                      <Sparkles className="h-3.5 w-3.5" style={{ color: BLUE }} />
                      {v.department}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
                      <MapPin className="h-3.5 w-3.5" style={{ color: BLUE }} />
                      Onsite
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:underline">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[15px] text-neutral-700 leading-relaxed line-clamp-3">
                    {v.intro}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" style={{ color: BLUE }} />
                      {v.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" style={{ color: BLUE }} />
                      {v.experience}
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Calendar className="h-4 w-4" style={{ color: BLUE }} />
                      Closes {formatDate(v.closes_at)}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: BLUE }}
                    >
                      View details
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-xs text-neutral-500">
                      Posted {formatDate(v.posted_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
