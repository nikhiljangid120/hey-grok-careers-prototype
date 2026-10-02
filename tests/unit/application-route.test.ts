// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitApplication } from "@/lib/applications/submit-application";
import { POST } from "@/app/api/applications/route";

vi.mock("@/lib/applications/submit-application", () => ({
  submitApplication: vi.fn(),
}));

const mockedSubmit = vi.mocked(submitApplication);

function validRequest() {
  const form = new FormData();
  form.set("jobId", "6157d852-3f20-43d7-8137-9e097ab45312");
  form.set("jobSlug", "full-stack-engineer");
  form.set("fullName", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("phone", "");
  form.set("githubUrl", "");
  form.set("linkedinUrl", "");
  form.set("portfolioUrl", "");
  form.set("coverNote", "I care about accessible product engineering.");
  form.set(
    "resume",
    new File(["%PDF"], "resume.pdf", { type: "application/pdf" }),
  );
  return new Request("http://localhost/api/applications", {
    method: "POST",
    body: form,
  });
}

describe("POST /api/applications", () => {
  beforeEach(() => mockedSubmit.mockReset());

  it("returns a successful submission and preserves job context", async () => {
    mockedSubmit.mockResolvedValue({
      ok: true,
      demo: false,
      applicationId: "cb8ed2a8-84dc-449d-907b-06c4917848c5",
      jobSlug: "full-stack-engineer",
      jobTitle: "Full-Stack Engineer",
      submittedAt: "2026-10-02T12:00:00.000Z",
    });
    const response = await POST(validRequest());
    expect(response.status).toBe(201);
    expect(mockedSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        job: expect.objectContaining({
          id: "6157d852-3f20-43d7-8137-9e097ab45312",
          slug: "full-stack-engineer",
        }),
      }),
    );
  });

  it("reports an upload failure without confirming submission", async () => {
    mockedSubmit.mockResolvedValue({
      ok: false,
      code: "UPLOAD_FAILED",
      message: "Upload failed.",
    });
    const response = await POST(validRequest());
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: "UPLOAD_FAILED",
    });
  });

  it("reports a database failure without confirming submission", async () => {
    mockedSubmit.mockResolvedValue({
      ok: false,
      code: "DATABASE_FAILED",
      message: "Database failed.",
    });
    const response = await POST(validRequest());
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: "DATABASE_FAILED",
    });
  });

  it("rejects a mismatched job ID and slug", async () => {
    const request = validRequest();
    const form = await request.formData();
    form.set("jobSlug", "product-designer");
    const response = await POST(
      new Request("http://localhost/api/applications", {
        method: "POST",
        body: form,
      }),
    );
    expect(response.status).toBe(400);
    expect(mockedSubmit).not.toHaveBeenCalled();
  });
});