import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyApplicationId } from "@/components/application/copy-application-id";
import { ProgressSteps } from "@/components/careers/progress-steps";
import { getJobBySlug } from "@/lib/jobs/jobs";

export const metadata: Metadata = {
  title: "Application submitted",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string; at?: string; demo?: string }>;
};

export default async function SubmittedPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const job = getJobBySlug(slug);
  if (!job || !query.id || !query.at) notFound();

  const submittedDate = new Date(query.at);
  if (Number.isNaN(submittedDate.getTime())) notFound();
  const demo = query.demo === "true";

  return (
    <main id="main-content" className="container-shell py-12 sm:py-16">
      <ProgressSteps current="Submitted" />
      <section className="surface-card mt-10 max-w-3xl p-7 sm:p-12">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-full bg-emerald-300/15 text-2xl text-emerald-200"
        >
          ✓
        </span>
        <p className="eyebrow mt-7">
          {demo ? "Demo flow complete" : "Submission received"}
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Application submitted
        </h1>
        {demo ? (
          <div className="mt-6 rounded-xl border border-amber-300/40 bg-amber-200/10 p-4 text-amber-100">
            <strong>This was a demo submission.</strong> No resume was uploaded
            and no application record was persisted.
          </div>
        ) : (
          <p className="mt-5 text-lg text-slate-300">
            Your application has been securely recorded. Keep the confirmation
            ID below for your records.
          </p>
        )}

        <dl className="mt-8 grid gap-5 rounded-xl border border-white/10 bg-black/10 p-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold text-slate-400">Role</dt>
            <dd className="mt-1 text-white">{job.title}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-slate-400">Submitted</dt>
            <dd className="mt-1 text-white">
              <time dateTime={submittedDate.toISOString()}>
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "UTC",
                }).format(submittedDate)}{" "}
                UTC
              </time>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold text-slate-400">
              {demo ? "Demo reference" : "Application ID"}
            </dt>
            <dd className="mt-1 break-all font-mono text-sm text-white">
              {query.id}
            </dd>
          </div>
        </dl>

        <p className="mt-7 text-slate-300">
          The hiring team can review the submitted materials. This confirmation
          does not make a promise about timing or an outcome.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <CopyApplicationId value={query.id} />
          <Link className="button-primary h-fit" href="/careers">
            Return to careers
          </Link>
        </div>
      </section>
    </main>
  );
}