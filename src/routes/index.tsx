import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Job Vacancies — Deanna Day Spa" },
      {
        name: "description",
        content:
          "Join the Deanna Day Spa team. Open positions for Senior Therapist and Assistant in Seminyak, Bali.",
      },
      { property: "og:title", content: "Job Vacancies — Deanna Day Spa" },
      {
        property: "og:description",
        content:
          "Join the Deanna Day Spa team. Open positions for Senior Therapist and Assistant in Seminyak, Bali.",
      },
    ],
  }),
  component: VacanciesHome,
});

const WHATSAPP_URL =
  "https://wa.me/628132543072?text=" +
  encodeURIComponent("Hi Deanna Day Spa, I am interested in applying for the vacancy...");

const BRAND_BLUE = "#1DA1F2";
const BRAND_CREAM = "#FDFCF0";

function VacancyCard({
  title,
  intro,
  bullets,
}: {
  title: string;
  intro: string;
  bullets: Array<{ bold: string; rest?: string }>;
}) {
  return (
    <article
      className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border"
      style={{ borderColor: "rgba(29,161,242,0.15)" }}
    >
      <h2
        className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-4"
        style={{ color: BRAND_BLUE }}
      >
        {title}
      </h2>
      <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed mb-5">{intro}</p>
      <ul className="space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className="text-lg sm:text-xl text-neutral-700 leading-relaxed flex gap-3">
            <span
              className="mt-2 h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: BRAND_BLUE }}
            />
            <span>
              <strong className="font-bold text-neutral-900">{b.bold}</strong>
              {b.rest ? <span> {b.rest}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function VacanciesHome() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: BRAND_CREAM }}>
      <main className="w-full px-5 sm:px-8 py-10 sm:py-14 max-w-2xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-center mb-3"
          style={{ color: BRAND_BLUE }}
        >
          Job Vacancies
        </h1>
        <p className="text-lg sm:text-xl text-neutral-700 text-center leading-relaxed mb-10">
          Join our growing team at Deanna Day Spa in Seminyak, Bali.
        </p>

        <div className="space-y-6">
          <VacancyCard
            title="Senior Therapist Vacancy"
            intro="We are looking for an experienced spa therapist to deliver premium treatments to our valued guests."
            bullets={[
              { bold: "Minimum 5 years experience", rest: "in a professional spa environment." },
              { bold: "Fluent in English", rest: "(spoken & written)." },
              { bold: "Skilled in massage, facial & body treatments." },
              { bold: "Positive attitude", rest: "and excellent guest service." },
            ]}
          />

          <VacancyCard
            title="Assistant Vacancy"
            intro="Support our daily spa operations and help create an exceptional experience for every guest."
            bullets={[
              { bold: "Hard-working", rest: "and willing to learn." },
              { bold: "Fluent in English", rest: "is a plus." },
              { bold: "Positive attitude", rest: "and team-oriented." },
              { bold: "Well-presented", rest: "and reliable." },
            ]}
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-lg sm:text-xl text-neutral-700">
            For appointment and enquiries, contact:
          </p>
          <p className="text-lg sm:text-xl font-bold mt-1" style={{ color: BRAND_BLUE }}>
            WhatsApp: +62 813-2543-072
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold uppercase tracking-wide text-base sm:text-lg shadow-lg transition-transform active:scale-95 hover:opacity-95"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <MessageCircle className="h-6 w-6" />
            Apply Now via WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
