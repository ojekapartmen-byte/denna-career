import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Sparkles,
  MapPin,
  User,
  Briefcase,
  Building2,
  Clock,
  Calendar,
  DollarSign,
  Award,
  Users,
  TrendingUp,
  Gift,
  ClipboardList,
  Info,
} from "lucide-react";
import { getVacancy, VACANCIES } from "@/data/vacancies";

export const Route = createFileRoute("/vacancies/$slug")({
  loader: ({ params }) => {
    const vacancy = getVacancy(params.slug);
    if (!vacancy) throw notFound();
    return { vacancy };
  },
  head: ({ loaderData }) => {
    const v = loaderData?.vacancy;
    const title = v ? `${v.title} — Deanna Day Spa Careers` : "Vacancy — Deanna Day Spa";
    const desc = v?.intro ?? "Open vacancy at Deanna Day Spa Bali.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: VacancyDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-bold">Vacancy not found</h1>
      <Link to="/" className="underline" style={{ color: "#1DA1F2" }}>
        ← Back to vacancies
      </Link>
    </div>
  ),
});

const BLUE = "#1DA1F2";
const CREAM = "#FDFCF0";
const CREAM_SOFT = "#F6F1E4";
const BORDER = "rgba(29,161,242,0.18)";

function whatsappUrl(title: string) {
  return (
    "https://wa.me/628132543072?text=" +
    encodeURIComponent(`Hi Deanna Day Spa, I am interested in applying for the ${title} vacancy...`)
  );
}

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center h-7 w-7 rounded-full border bg-white"
      style={{ borderColor: BORDER, color: BLUE }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl bg-white border p-5 sm:p-6 ${className}`}
      style={{ borderColor: BORDER }}
    >
      {children}
    </section>
  );
}

function ResponsibilityRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border px-4 py-3 text-[15px] text-neutral-700 leading-relaxed"
      style={{ borderColor: BORDER, backgroundColor: CREAM_SOFT }}
    >
      {children}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <span style={{ color: BLUE }}>{icon}</span>
        <span>{label}</span>
        {hint && <Info className="h-3.5 w-3.5 text-neutral-400" />}
      </div>
      <div className="mt-1 text-[15px] font-semibold text-neutral-900">{value}</div>
    </div>
  );
}

function VacancyDetailPage() {
  const { vacancy } = Route.useLoaderData();
  const idx = VACANCIES.findIndex((v) => v.slug === vacancy.slug);
  const total = VACANCIES.length;
  const prev = VACANCIES[(idx - 1 + total) % total];
  const next = VACANCIES[(idx + 1) % total];
  const wa = whatsappUrl(vacancy.title);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: CREAM }}>
      {/* Top Bar */}
      <header
        className="w-full border-b sticky top-0 z-20 backdrop-blur"
        style={{ borderColor: BORDER, backgroundColor: "rgba(253,252,240,0.92)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border bg-white hover:bg-neutral-50"
            style={{ borderColor: BORDER }}
            aria-label="Back to vacancies"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-700" />
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 truncate">
              {vacancy.title}
            </h1>
            <ChevronDown className="h-5 w-5 text-neutral-500 flex-shrink-0" />
          </div>

          <div className="hidden sm:flex items-center gap-2 ml-3">
            <Link
              to="/vacancies/$slug"
              params={{ slug: prev.slug }}
              className="h-8 px-3 rounded-full border bg-white inline-flex items-center justify-center text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              style={{ borderColor: BORDER }}
            >
              ← Prev
            </Link>
            <Link
              to="/vacancies/$slug"
              params={{ slug: next.slug }}
              className="h-8 px-3 rounded-full border bg-white inline-flex items-center justify-center text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              style={{ borderColor: BORDER }}
            >
              Next →
            </Link>
            <span className="text-sm text-neutral-500 ml-1">
              {idx + 1} of {total}
            </span>
          </div>

          <div className="flex-1" />

          <button
            className="hidden sm:inline-flex h-9 w-9 rounded-full border bg-white items-center justify-center"
            style={{ borderColor: BORDER }}
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4 text-neutral-600" />
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 h-9 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: BLUE }}
          >
            <ExternalLink className="h-4 w-4" />
            Apply Now
          </a>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: BLUE }}
          >
            Open
          </span>
          <span className="text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1.5 text-sm text-neutral-700">
            <Sparkles className="h-3.5 w-3.5" style={{ color: BLUE }} /> Spa
          </span>
          <span className="text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1.5 text-sm text-neutral-700">
            <MapPin className="h-3.5 w-3.5" style={{ color: BLUE }} /> Onsite
          </span>
          <span className="text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1.5 text-sm text-neutral-700">
            <User className="h-3.5 w-3.5" style={{ color: BLUE }} /> Posted by HR
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 border-t" style={{ borderColor: BORDER }}>
          <div className="flex gap-6">
            <button
              className="py-3 text-sm font-semibold border-b-2"
              style={{ color: BLUE, borderColor: BLUE }}
            >
              <span className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Overview
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <IconCircle>
                <Calendar className="h-4 w-4" />
              </IconCircle>
              <h2 className="text-lg font-semibold text-neutral-900">Hiring period</h2>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-neutral-500">Posted at</div>
                  <div className="text-base font-semibold text-neutral-900">{vacancy.postedAt}</div>
                </div>
                <div className="text-neutral-400">→</div>
                <div>
                  <div className="text-xs text-neutral-500">Closes at</div>
                  <div className="text-base font-semibold text-neutral-900">{vacancy.closesAt}</div>
                </div>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: "rgba(29,161,242,0.12)", color: BLUE }}
              >
                <Clock className="h-3.5 w-3.5" />
                Open until filled
              </span>
            </div>
            <div
              className="mt-4 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(29,161,242,0.15)" }}
            >
              <div className="h-full w-1/3" style={{ backgroundColor: BLUE }} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <IconCircle>
                <Info className="h-4 w-4" />
              </IconCircle>
              <h2 className="text-lg font-semibold text-neutral-900">About this job</h2>
            </div>
            <p className="text-[15px] text-neutral-700 leading-relaxed">{vacancy.longIntro}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <IconCircle>
                <ClipboardList className="h-4 w-4" />
              </IconCircle>
              <h2 className="text-lg font-semibold text-neutral-900">Responsibilities</h2>
            </div>
            <div className="space-y-3">
              {vacancy.responsibilities.map((r, i) => (
                <ResponsibilityRow key={i}>{r}</ResponsibilityRow>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Job details</h3>
            <div className="space-y-4">
              <DetailRow
                icon={<Briefcase className="h-4 w-4" />}
                label="Job role"
                value={vacancy.title}
              />
              <DetailRow
                icon={<Building2 className="h-4 w-4" />}
                label="Job placement"
                value="Onsite"
              />
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Type"
                  value={vacancy.type}
                  hint
                />
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Reports to"
                  value={vacancy.reportsTo}
                  hint
                />
              </div>
              <DetailRow
                icon={<Award className="h-4 w-4" />}
                label="Experience"
                value={vacancy.experience}
              />
              <DetailRow
                icon={<DollarSign className="h-4 w-4" />}
                label="Salary"
                value={vacancy.salary}
              />
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={
                  <span className="font-semibold text-neutral-900 leading-snug block">
                    Deanna Day Spa, Seminyak,
                    <br />
                    Kuta, Kabupaten Badung, Bali
                  </span>
                }
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Why Deanna Spa?</h3>
            <ul className="space-y-3 text-[15px] text-neutral-700">
              <li className="flex items-center gap-3">
                <IconCircle>
                  <Sparkles className="h-4 w-4" />
                </IconCircle>
                Premium Work Environment
              </li>
              <li className="flex items-center gap-3">
                <IconCircle>
                  <TrendingUp className="h-4 w-4" />
                </IconCircle>
                Professional Growth Opportunities
              </li>
              <li className="flex items-center gap-3">
                <IconCircle>
                  <Gift className="h-4 w-4" />
                </IconCircle>
                Competitive Benefits Package
              </li>
              <li className="flex items-center gap-3">
                <IconCircle>
                  <Users className="h-4 w-4" />
                </IconCircle>
                Supportive Team Culture
              </li>
            </ul>
          </Card>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-6 py-4 rounded-full text-white font-bold uppercase tracking-wide text-base shadow-lg"
            style={{ backgroundColor: BLUE }}
          >
            Apply Now via WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
