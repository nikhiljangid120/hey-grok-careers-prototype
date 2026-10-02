export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  description: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  featured?: boolean;
  isPubliclyObserved?: boolean;
};