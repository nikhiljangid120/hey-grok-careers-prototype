import { z } from "zod";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const acceptedResumeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
export const acceptedResumeExtensions = [".pdf", ".doc", ".docx"] as const;

const optionalUrl = z
  .string()
  .trim()
  .max(300, "URL must be 300 characters or fewer.")
  .refine(
    (value) => value === "" || /^https?:\/\/.+/i.test(value),
    "Enter a complete URL beginning with http:// or https://.",
  )
  .refine((value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Enter a valid URL.");

export const applicationFieldsSchema = z.object({
  jobId: z.string().uuid("The selected role is invalid."),
  jobSlug: z.string().min(1, "The selected role is invalid."),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "Name must be 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number must be 40 characters or fewer."),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  coverNote: z
    .string()
    .trim()
    .max(2000, "Cover note must be 2,000 characters or fewer."),
});

export type ApplicationFields = z.infer<typeof applicationFieldsSchema>;

export function validateResume(file: File | undefined) {
  if (!file || file.size === 0) return "Attach your resume.";
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (
    !acceptedResumeTypes.includes(
      file.type as (typeof acceptedResumeTypes)[number],
    ) ||
    !acceptedResumeExtensions.includes(
      extension as (typeof acceptedResumeExtensions)[number],
    )
  ) {
    return "Upload a PDF, DOC, or DOCX file.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "Resume must be 5 MB or smaller.";
  }
  return true;
}

export function formDataToApplicationFields(formData: FormData) {
  const value = (key: string) => String(formData.get(key) ?? "");
  return {
    jobId: value("jobId"),
    jobSlug: value("jobSlug"),
    fullName: value("fullName"),
    email: value("email"),
    phone: value("phone"),
    githubUrl: value("githubUrl"),
    linkedinUrl: value("linkedinUrl"),
    portfolioUrl: value("portfolioUrl"),
    coverNote: value("coverNote"),
  };
}