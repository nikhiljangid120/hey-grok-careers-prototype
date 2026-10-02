import { describe, expect, it } from "vitest";
import {
  applicationFieldsSchema,
  validateResume,
} from "@/lib/validation/application";

const validFields = {
  jobId: "6157d852-3f20-43d7-8137-9e097ab45312",
  jobSlug: "full-stack-engineer",
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  phone: "",
  githubUrl: "https://github.com/ada",
  linkedinUrl: "",
  portfolioUrl: "",
  coverNote: "",
};

describe("application validation", () => {
  it("rejects missing required fields", () => {
    const result = applicationFieldsSchema.safeParse({
      ...validFields,
      fullName: "",
      email: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      applicationFieldsSchema.safeParse({
        ...validFields,
        email: "not-an-email",
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid URL", () => {
    expect(
      applicationFieldsSchema.safeParse({
        ...validFields,
        githubUrl: "github.com/ada",
      }).success,
    ).toBe(false);
  });

  it("rejects an unsupported resume file", () => {
    const file = new File(["hello"], "resume.txt", { type: "text/plain" });
    expect(validateResume(file)).toBe("Upload a PDF, DOC, or DOCX file.");
  });

  it("accepts a valid PDF resume", () => {
    const file = new File(["%PDF"], "resume.pdf", {
      type: "application/pdf",
    });
    expect(validateResume(file)).toBe(true);
  });
});