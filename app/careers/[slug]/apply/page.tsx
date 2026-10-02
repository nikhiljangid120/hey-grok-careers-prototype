import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/application/application-form";
import { ProgressSteps } from "@/components/careers/progress-steps";
import { serverEnv } from "@/lib/env";
import { getJobBySlug } from "@/lib/jobs/jobs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  return {
    title: job ? `Apply — ${job.title}` : "Role not found",
  };
}

export default async function ApplyPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const configured = serverEnv.hasSupabase || serverEnv.demoMode;

  return (
    <main id="main-content" className="container-shell py-12 sm:py-16">
      <ProgressSteps current="Application" />
      <Link
        className="mt-9 inline-flex min-h-11 items-center font-bold text-slate-300 hover:text-white"
        href={`/careers/${job.slug}`}
      >
        ← Back to job details
      </Link>
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">Candidate application</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Applying for: {job.title}
        </h1>
        <p className="mt-4 text-slate-300">
          Required fields are marked with an asterisk. Your selected role is
          already included.
        </p>
      </header>
      <div className="mt-9 max-w-4xl">
        <ApplicationForm
          configured={configured}
          demoMode={serverEnv.demoMode}
          job={job}
        />
      </div>
    </main>
  );
}