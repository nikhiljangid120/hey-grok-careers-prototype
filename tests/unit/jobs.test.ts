import { describe, expect, it } from "vitest";
import { getJobById, getJobBySlug, jobs } from "@/lib/jobs/jobs";

describe("job selection and route propagation", () => {
  it("resolves the Full-Stack Engineer by stable slug and ID", () => {
    const bySlug = getJobBySlug("full-stack-engineer");
    expect(bySlug?.title).toBe("Full-Stack Engineer");
    expect(getJobById(bySlug!.id)).toEqual(bySlug);
  });

  it("provides unique slugs and IDs for every opening", () => {
    expect(new Set(jobs.map((job) => job.slug)).size).toBe(jobs.length);
    expect(new Set(jobs.map((job) => job.id)).size).toBe(jobs.length);
  });
});