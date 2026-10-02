"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  applicationFieldsSchema,
  type ApplicationFields,
  validateResume,
} from "@/lib/validation/application";
import type { Job } from "@/types/job";
import type { SubmissionResponse } from "@/types/application";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="form-error" id={id} role="alert">
      <span aria-hidden="true">!</span>
      <span>{message}</span>
    </p>
  );
}

type FormProps = {
  job: Job;
  demoMode: boolean;
  configured: boolean;
};

export function ApplicationForm({
  job,
  demoMode,
  configured,
}: FormProps) {
  const router = useRouter();
  const [resume, setResume] = useState<File>();
  const [resumeError, setResumeError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionState, setSubmissionState] = useState<
    "idle" | "uploading" | "submitting"
  >("idle");
  const [coverNoteLength, setCoverNoteLength] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFields>({
    resolver: zodResolver(applicationFieldsSchema),
    mode: "onBlur",
    defaultValues: {
      jobId: job.id,
      jobSlug: job.slug,
      fullName: "",
      email: "",
      phone: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
      coverNote: "",
    },
  });

  const coverNoteRegistration = register("coverNote");
  const busy = submissionState !== "idle";

  function removeResume() {
    setResume(undefined);
    setResumeError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.focus();
  }

  async function onValid(fields: ApplicationFields) {
    if (inFlight.current) return;
    const fileResult = validateResume(resume);
    if (fileResult !== true) {
      setResumeError(fileResult);
      fileInputRef.current?.focus();
      return;
    }

    inFlight.current = true;
    setResumeError(undefined);
    setSubmitError(undefined);
    setUploadProgress(0);
    setSubmissionState("uploading");

    const body = new FormData();
    Object.entries(fields).forEach(([key, value]) => body.set(key, value));
    body.set("resume", resume!);

    const result = await new Promise<SubmissionResponse>((resolve) => {
      const request = new XMLHttpRequest();
      request.open("POST", "/api/applications");
      request.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
          if (event.loaded === event.total) setSubmissionState("submitting");
        }
      });
      request.addEventListener("load", () => {
        try {
          resolve(JSON.parse(request.responseText) as SubmissionResponse);
        } catch {
          resolve({
            ok: false,
            code: "UNKNOWN_ERROR",
            message: "The server returned an unexpected response.",
          });
        }
      });
      request.addEventListener("error", () =>
        resolve({
          ok: false,
          code: "UNKNOWN_ERROR",
          message:
            "A network error interrupted the submission. Please try again.",
        }),
      );
      request.send(body);
    });

    if (result.ok) {
      const query = new URLSearchParams({
        id: result.applicationId,
        at: result.submittedAt,
        demo: String(result.demo),
      });
      router.push(`/careers/${job.slug}/submitted?${query.toString()}`);
      return;
    }

    inFlight.current = false;
    setSubmissionState("idle");
    setSubmitError(result.message);
  }

  return (
    <form
      className="surface-card p-6 sm:p-9"
      noValidate
      onSubmit={(event) => {
        if (inFlight.current) {
          event.preventDefault();
          return;
        }
        void handleSubmit(onValid)(event);
      }}
    >
      <input type="hidden" {...register("jobId")} />
      <input type="hidden" {...register("jobSlug")} />

      {(demoMode || !configured) && (
        <div
          className="mb-8 rounded-xl border border-amber-300/40 bg-amber-200/10 p-4 text-sm text-amber-100"
          role="status"
        >
          <strong>Development demo mode.</strong>{" "}
          {demoMode
            ? "This flow validates the application but does not upload or persist candidate data."
            : "Supabase is not configured, so persistence is unavailable. Set DEMO_MODE=true to test the explicitly non-persistent flow."}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="fullName">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            {...register("fullName")}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            aria-invalid={Boolean(errors.fullName)}
            autoComplete="name"
            className="form-control"
            id="fullName"
          />
          <ErrorMessage
            id="fullName-error"
            message={errors.fullName?.message}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            {...register("email")}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="form-control"
            id="email"
            inputMode="email"
            type="email"
          />
          <ErrorMessage id="email-error" message={errors.email?.message} />
        </div>

        <div>
          <label className="form-label" htmlFor="phone">
            Phone <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            {...register("phone")}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            className="form-control"
            id="phone"
            inputMode="tel"
            type="tel"
          />
          <ErrorMessage id="phone-error" message={errors.phone?.message} />
        </div>

        {[
          ["githubUrl", "GitHub URL"],
          ["linkedinUrl", "LinkedIn URL"],
          ["portfolioUrl", "Portfolio URL"],
        ].map(([name, label]) => {
          const fieldName = name as
            | "githubUrl"
            | "linkedinUrl"
            | "portfolioUrl";
          return (
            <div key={name}>
              <label className="form-label" htmlFor={name}>
                {label}{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                {...register(fieldName)}
                aria-describedby={
                  errors[fieldName] ? `${name}-error` : undefined
                }
                aria-invalid={Boolean(errors[fieldName])}
                autoComplete="url"
                className="form-control"
                id={name}
                inputMode="url"
                placeholder="https://"
                type="url"
              />
              <ErrorMessage
                id={`${name}-error`}
                message={errors[fieldName]?.message}
              />
            </div>
          );
        })}

        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="resume">
            Resume <span aria-hidden="true">*</span>
          </label>
          <p className="form-hint" id="resume-hint">
            PDF, DOC, or DOCX. Maximum 5 MB.
          </p>
          <input
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-describedby={`resume-hint${resumeError ? " resume-error" : ""}`}
            aria-invalid={Boolean(resumeError)}
            className="form-control file:mr-4 file:rounded-full file:border-0 file:bg-orange-400 file:px-3 file:py-2 file:font-bold file:text-slate-950"
            id="resume"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setResume(file);
              const result = validateResume(file);
              setResumeError(result === true ? undefined : result);
            }}
            ref={fileInputRef}
            type="file"
          />
          <ErrorMessage id="resume-error" message={resumeError} />
          {resume ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
              <p>
                <strong>{resume.name}</strong>{" "}
                <span className="text-slate-400">
                  ({formatBytes(resume.size)})
                </span>
              </p>
              <button
                className="min-h-11 rounded-full px-3 font-bold text-orange-200 hover:bg-white/5"
                onClick={removeResume}
                type="button"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <label className="form-label" htmlFor="coverNote">
              Cover note{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <span className="text-xs text-slate-400" id="cover-count">
              {coverNoteLength}/2,000
            </span>
          </div>
          <textarea
            {...coverNoteRegistration}
            aria-describedby={`cover-count${
              errors.coverNote ? " coverNote-error" : ""
            }`}
            aria-invalid={Boolean(errors.coverNote)}
            className="form-control"
            id="coverNote"
            onChange={(event) => {
              void coverNoteRegistration.onChange(event);
              setCoverNoteLength(event.target.value.length);
            }}
          />
          <ErrorMessage
            id="coverNote-error"
            message={errors.coverNote?.message}
          />
        </div>
      </div>

      {busy ? (
        <div className="mt-7" role="status" aria-live="polite">
          <div className="flex justify-between gap-4 text-sm font-bold">
            <span>
              {submissionState === "uploading"
                ? "Uploading resume…"
                : "Saving application…"}
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div
            aria-hidden="true"
            className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-orange-400 transition-[width]"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : null}

      {submitError ? (
        <div
          className="mt-7 rounded-xl border border-red-300/40 bg-red-200/10 p-4 text-sm text-red-100"
          role="alert"
          tabIndex={-1}
        >
          <strong>Application not submitted.</strong> {submitError}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link className="button-secondary" href={`/careers/${job.slug}`}>
          Back to job
        </Link>
        <button
          className="button-primary"
          disabled={busy || !configured}
          type="submit"
        >
          {busy ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}