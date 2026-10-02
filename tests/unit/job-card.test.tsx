import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobCard } from "@/components/careers/job-card";
import { getJobBySlug } from "@/lib/jobs/jobs";

describe("JobCard", () => {
  it("renders direct details and role-bound application links", () => {
    const job = getJobBySlug("full-stack-engineer")!;
    render(<JobCard job={job} />);

    expect(screen.getByRole("link", { name: "View role" })).toHaveAttribute(
      "href",
      "/careers/full-stack-engineer",
    );
    expect(
      screen.getByRole("link", { name: "Apply for Full-Stack Engineer" }),
    ).toHaveAttribute("href", "/careers/full-stack-engineer/apply");
  });
});