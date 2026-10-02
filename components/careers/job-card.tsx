import Link from "next/link";
import type { Job } from "@/types/job";

export function JobCard({ job }: { job: Job }) {
  return (
    <article
      className={`surface-card flex h-full flex-col p-6 sm:p-7 ${
        job.featured ? "ring-1 ring-orange-400/50" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-white/7 px-3 py-1 text-slate-200">
          {job.department}
        </span>
        {job.featured ? (
          <span className="rounded-full bg-orange-400/15 px-3 py-1 font-bold text-orange-200">
            Featured role
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">
        {job.title}
      </h3>
      <p className="mt-3 flex-1 text-slate-300">{job.description}</p>
      <dl className="mt-6 grid gap-2 text-sm text-slate-300">
        <div className="flex gap-2">
          <dt className="font-bold text-slate-100">Location:</dt>
          <dd>{job.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold text-slate-100">Type:</dt>
          <dd>{job.employmentType}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold text-slate-100">Salary:</dt>
          <dd>{job.salaryRange}</dd>
        </div>
      </dl>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link className="button-secondary flex-1" href={`/careers/${job.slug}`}>
          View role
        </Link>
        <Link
          className="button-primary flex-1"
          href={`/careers/${job.slug}/apply`}
          aria-label={`Apply for ${job.title}`}
        >
          Apply
        </Link>
      </div>
    </article>
  );
}