import "server-only";
import { randomUUID } from "node:crypto";
import { serverEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApplicationFields } from "@/lib/validation/application";
import type { Job } from "@/types/job";
import type { SubmissionResponse } from "@/types/application";

export type SubmissionInput = {
  fields: ApplicationFields;
  resume: File;
  job: Job;
};

export async function submitApplication({
  fields,
  resume,
  job,
}: SubmissionInput): Promise<SubmissionResponse> {
  const submittedAt = new Date().toISOString();

  if (serverEnv.demoMode) {
    return {
      ok: true,
      demo: true,
      applicationId: `DEMO-${randomUUID()}`,
      jobSlug: job.slug,
      jobTitle: job.title,
      submittedAt,
    };
  }

  if (!serverEnv.hasSupabase) {
    return {
      ok: false,
      code: "CONFIGURATION_ERROR",
      message:
        "Application persistence is not configured. Please contact the site owner.",
    };
  }

  const supabase = createServerSupabaseClient();
  const extension = resume.name.split(".").pop()!.toLowerCase();
  const storagePath = `${job.id}/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await resume.arrayBuffer());

  const upload = await supabase.storage
    .from(serverEnv.resumeBucket)
    .upload(storagePath, bytes, {
      contentType: resume.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (upload.error) {
    console.error("Resume upload failed", {
      message: upload.error.message,
      jobId: job.id,
    });
    return {
      ok: false,
      code: "UPLOAD_FAILED",
      message:
        "We couldn’t securely upload your resume. Your application was not saved. Please try again.",
    };
  }

  const insert = await supabase
    .from("applications")
    .insert({
      job_id: job.id,
      full_name: fields.fullName,
      email: fields.email.toLowerCase(),
      phone: fields.phone || null,
      github_url: fields.githubUrl || null,
      linkedin_url: fields.linkedinUrl || null,
      portfolio_url: fields.portfolioUrl || null,
      cover_note: fields.coverNote || null,
      resume_path: storagePath,
      status: "SUBMITTED",
    })
    .select("id, created_at")
    .single();

  if (insert.error) {
    const cleanup = await supabase.storage
      .from(serverEnv.resumeBucket)
      .remove([storagePath]);
    if (cleanup.error) {
      console.error("Failed to clean up orphaned resume", {
        path: storagePath,
        message: cleanup.error.message,
      });
    }

    if (insert.error.code === "23505") {
      return {
        ok: false,
        code: "DUPLICATE_APPLICATION",
        message:
          "An application for this role already exists for that email address.",
      };
    }

    console.error("Application database insert failed", {
      code: insert.error.code,
      message: insert.error.message,
      jobId: job.id,
    });
    return {
      ok: false,
      code: "DATABASE_FAILED",
      message:
        "We uploaded your resume but couldn’t save the application. The upload was removed. Please try again.",
    };
  }

  return {
    ok: true,
    demo: false,
    applicationId: insert.data.id,
    jobSlug: job.slug,
    jobTitle: job.title,
    submittedAt: insert.data.created_at,
  };
}