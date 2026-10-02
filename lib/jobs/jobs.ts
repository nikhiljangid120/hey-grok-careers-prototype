import type { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: "62699ae1-d869-4620-b446-054cfa66ea84",
    slug: "senior-ml-engineer",
    title: "Senior ML Engineer",
    department: "Engineering",
    description:
      "Build reliable learning systems that turn complex models into useful product experiences.",
    location: "San Francisco or Remote (US)",
    employmentType: "Full-time",
    salaryRange: "$190,000–$245,000",
    responsibilities: [
      "Own model development from experiments through monitored production systems.",
      "Partner with product and platform engineers on practical AI capabilities.",
      "Improve evaluation, observability, and model-serving reliability.",
    ],
    requirements: [
      "5+ years building production machine-learning systems.",
      "Strong Python and applied ML fundamentals.",
      "Experience operating model workloads in cloud environments.",
    ],
    skills: ["Python", "PyTorch", "MLOps", "Evaluation"],
  },
  {
    id: "9f0a84c2-b700-4874-8cad-3da8fd9cfac8",
    slug: "product-designer",
    title: "Product Designer",
    department: "Design",
    description:
      "Shape clear, trustworthy product experiences for ambitious AI workflows.",
    location: "New York or Remote (US)",
    employmentType: "Full-time",
    salaryRange: "$150,000–$195,000",
    responsibilities: [
      "Lead end-to-end product design from discovery to polished delivery.",
      "Prototype and test complex interactions with customers.",
      "Evolve a coherent, accessible design system.",
    ],
    requirements: [
      "4+ years designing high-quality software products.",
      "Strong interaction and visual design craft.",
      "A portfolio demonstrating systems thinking and shipped work.",
    ],
    skills: ["Product strategy", "Prototyping", "Research", "Design systems"],
  },
  {
    id: "15488177-0565-4288-936b-533f01010f5c",
    slug: "ai-safety-researcher",
    title: "AI Safety Researcher",
    department: "Research",
    description:
      "Develop practical methods for understanding and improving advanced AI behavior.",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    salaryRange: "$200,000–$270,000",
    responsibilities: [
      "Design rigorous safety experiments and evaluations.",
      "Translate research insights into product and engineering guidance.",
      "Communicate findings to technical and non-technical partners.",
    ],
    requirements: [
      "Research experience in ML safety, robustness, or interpretability.",
      "Strong experimental design and statistical reasoning.",
      "Clear technical writing and collaborative judgment.",
    ],
    skills: ["AI safety", "Interpretability", "Python", "Experimental design"],
  },
  {
    id: "6157d852-3f20-43d7-8137-9e097ab45312",
    slug: "full-stack-engineer",
    title: "Full-Stack Engineer",
    department: "Engineering",
    description:
      "Build thoughtful, dependable product experiences across the browser, API, and data layer.",
    location: "Remote (US time zones)",
    employmentType: "Full-time",
    salaryRange: "$175,000–$230,000",
    responsibilities: [
      "Ship accessible customer-facing features from concept to production.",
      "Design secure APIs and pragmatic data models for fast-moving products.",
      "Improve performance, observability, testing, and developer experience.",
      "Work closely with design and AI engineers to turn prototypes into durable systems.",
    ],
    requirements: [
      "5+ years building and operating modern web applications.",
      "Strong TypeScript, React, server-side, and relational-database experience.",
      "A product mindset with care for usability, accessibility, and edge cases.",
      "Clear written communication and comfort owning ambiguous problems.",
    ],
    skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Accessibility"],
    featured: true,
  },
  {
    id: "cde69702-02a9-4a6b-8c99-2c2ee09954e1",
    slug: "developer-advocate",
    title: "Developer Advocate",
    department: "Developer Experience",
    description:
      "Help builders understand, adopt, and succeed with a new generation of AI tools.",
    location: "Remote",
    employmentType: "Full-time",
    salaryRange: "$145,000–$190,000",
    responsibilities: [
      "Create technical guides, demos, and sample applications.",
      "Represent developer needs in product planning.",
      "Build genuine relationships with technical communities.",
    ],
    requirements: [
      "Professional software-development experience.",
      "Excellent teaching, writing, and public-speaking skills.",
      "A track record of useful technical content.",
    ],
    skills: ["Technical writing", "TypeScript", "Community", "Public speaking"],
  },
  {
    id: "49096b13-74cc-4864-8066-74e5d0a9db13",
    slug: "content-marketing-manager",
    title: "Content Marketing Manager",
    department: "Marketing",
    description:
      "Tell crisp, useful stories that help technical audiences understand an evolving product.",
    location: "Remote",
    employmentType: "Full-time",
    salaryRange: "$125,000–$165,000",
    responsibilities: [
      "Own editorial planning across product, research, and customer stories.",
      "Create distinctive content for technical and executive audiences.",
      "Measure content quality and iterate on distribution.",
    ],
    requirements: [
      "5+ years in B2B or developer-focused content.",
      "Exceptional editing and narrative judgment.",
      "Ability to make complex technical ideas approachable.",
    ],
    skills: ["Editorial strategy", "Writing", "Distribution", "Analytics"],
  },
];

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}