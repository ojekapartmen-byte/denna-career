export type Vacancy = {
  slug: string;
  title: string;
  intro: string;
  longIntro: string;
  type: string;
  experience: string;
  reportsTo: string;
  salary: string;
  postedAt: string;
  closesAt: string;
  responsibilities: string[];
  status: "open" | "closed";
};

export const VACANCIES: Vacancy[] = [
  {
    slug: "senior-therapist",
    title: "Senior Therapist",
    intro:
      "Deliver premium spa treatments and shape an unforgettable guest experience at Deanna Day Spa.",
    longIntro:
      "As a Senior Therapist at Deanna Day Spa, you will be the cornerstone of our guest experience. You will perform premium, expert treatments, ensuring each guest receives a truly luxurious and personalized escape. We are looking for an experienced spa therapist to deliver premium treatments to our valued guests.",
    type: "Full-time",
    experience: "5+ Years",
    reportsTo: "Spa Manager",
    salary: "Competitive · Based on experience",
    postedAt: "1 October 2025",
    closesAt: "31 December 2025",
    responsibilities: [
      "Perform a wide range of premium massage techniques (Deep Tissue, Hot Stone, Aromatherapy).",
      "Deliver advanced facial and body treatments using luxury spa products.",
      "Mentor junior therapists and uphold service excellence across the team.",
      "Maintain an immaculate, calming spa environment following strict hygiene and safety protocols.",
      "Consult with guests to understand their needs and recommend curated treatments.",
    ],
    status: "open",
  },
  {
    slug: "assistant",
    title: "Spa Assistant",
    intro:
      "Support daily spa operations and help create an exceptional experience for every guest.",
    longIntro:
      "As a Spa Assistant, you will support our therapists and front-of-house team to keep daily operations running smoothly. You'll help create a calm, welcoming atmosphere for every guest from the moment they arrive until they leave.",
    type: "Full-time",
    experience: "Entry level welcome",
    reportsTo: "Senior Therapist",
    salary: "Competitive · Based on experience",
    postedAt: "1 October 2025",
    closesAt: "31 December 2025",
    responsibilities: [
      "Prepare treatment rooms and ensure linens, products, and tools are ready before each guest.",
      "Greet and assist guests, escorting them through the spa journey.",
      "Maintain cleanliness and hygiene across all spa areas at all times.",
      "Support therapists during treatments when needed.",
      "Help with laundry, restocking, and general daily upkeep of the spa.",
    ],
    status: "open",
  },
];

export function getVacancy(slug: string): Vacancy | undefined {
  return VACANCIES.find((v) => v.slug === slug);
}
