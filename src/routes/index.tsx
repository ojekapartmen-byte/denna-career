import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { VACANCIES } from "@/data/vacancies";

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

const WHATSAPP_URL =
  "https://wa.me/628132543072?text=" +
  encodeURIComponent("Hi Deanna Day Spa, I am interested in applying for the vacancy...");

const BLUE = "#1DA1F2";
const CREAM = "#FDFCF0";
const BORDER = "rgba(29,161,242,0.18)";

function VacanciesListPage() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: CREAM }}>
      {/* Header */}
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
            <span className="text-neutral-500 font-normal">({VACANCIES.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VACANCIES.map((v) => (
            <Link
              key={v.slug}
              to="/vacancies/$slug"
              params={{ slug: v.slug }}
              className="group block rounded-2xl bg-white border p-5 sm:p-6 transition hover:shadow-md hover:-translate-y-0.5"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: BLUE }}
                >
                  Open
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: BLUE }} />
                  Spa
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
                  <MapPin className="h-3.5 w-3.5" style={{ color: BLUE }} />
                  Onsite
                </span>
              </div>

              <h3
                className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:underline"
                style={{ textDecorationColor: BLUE }}
              >
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
                  Closes {v.closesAt}
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
                <span className="text-xs text-neutral-500">Posted {v.postedAt}</span>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
