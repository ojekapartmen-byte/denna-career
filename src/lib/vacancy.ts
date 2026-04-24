export type Vacancy = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  long_intro: string;
  type: string;
  experience: string;
  reports_to: string;
  salary: string;
  posted_at: string;
  closes_at: string | null;
  status: "open" | "closed";
  responsibilities: string[];
  benefits: string[];
  location: string;
  department: string;
  cover_image_url: string | null;
  sort_order: number;
};

export function formatDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}
