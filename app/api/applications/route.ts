import { NextResponse } from "next/server";
import { submitApplication } from "@/lib/applications/submit-application";
import { getJobById } from "@/lib/jobs/jobs";
import {
  applicationFieldsSchema,
  formDataToApplicationFields,
  validateResume,
} from "@/lib/validation/application";
import type { SubmissionFailure } from "@/types/application";

export const runtime = "nodejs";

function failure(body: SubmissionFailure, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return failure(
      {
        ok: false,
        code: "INVALID_INPUT",
        message: "The submitted form could not be read.",
      },
      400,
    );
  }

  const parsed = applicationFieldsSchema.safeParse(
    formDataToApplicationFields(formData),
  );
  if (!parsed.success) {
    return failure(
      {
        ok: false,
        code: "INVALID_INPUT",
        message: "Review the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }

  const resumeValue = formData.get("resume");
  const resume = resumeValue instanceof File ? resumeValue : undefined;
  const resumeResult = validateResume(resume);
  if (resumeResult !== true) {
    return failure(
      {
        ok: false,
        code: "INVALID_INPUT",
        message: resumeResult,
        fieldErrors: { resume: [resumeResult] },
      },
      400,
    );
  }

  const job = getJobById(parsed.data.jobId);
  if (!job || job.slug !== parsed.data.jobSlug) {
    return failure(
      {
        ok: false,
        code: "INVALID_INPUT",
        message: "The selected role is invalid or no longer available.",
      },
      400,
    );
  }

  try {
    const result = await submitApplication({
      fields: parsed.data,
      resume: resume!,
      job,
    });
    const status = result.ok
      ? 201
      : result.code === "DUPLICATE_APPLICATION"
        ? 409
        : result.code === "CONFIGURATION_ERROR"
          ? 503
          : 500;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("Unexpected application submission error", error);
    return failure(
      {
        ok: false,
        code: "UNKNOWN_ERROR",
        message:
          "An unexpected error prevented submission. No confirmation was created.",
      },
      500,
    );
  }
}