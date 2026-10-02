import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressSteps } from "@/components/careers/progress-steps";
import { getJobBySlug, jobs } from "@/lib/jobs/jobs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  return job
    ? {
        title: job.title,
        description: `${job.title} — ${job.description}`,
      }
    : { title: "Role not found" };
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  return (
    <main id="main-content" className="container-shell py-12 sm:py-16">
      <ProgressSteps current="Details" />
      <Link
        className="mt-9 inline-flex min-h-11 items-center font-bold text-slate-300 hover:text-white"
        href="/careers#open-positions"
      >
        ← Back to open positions
      </Link>

      <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_20rem]">
        <article className="surface-card p-6 sm:p-10">
          <p className="eyebrow">{job.department}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-balance sm:text-6xl">
            {job.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            {job.description}
          </p>

          <dl className="mt-8 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-bold text-slate-400">Location</dt>
              <dd className="mt-1 text-white">{job.location}</dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-slate-400">Employment</dt>
              <dd className="mt-1 text-white">{job.employmentType}</dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-slate-400">Salary range</dt>
              <dd className="mt-1 text-white">{job.salaryRange}</dd>
            </div>
          </dl>

          {job.isPubliclyObserved ? (
            <div className="mt-8 rounded-xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-200">
              <p className="font-semibold text-sky-100">Publicly Observed Opening</p>
              <p className="mt-1 text-xs text-sky-200/90">
                Opening details matched directly to the public Hey Grok Careers page listing (Remote, Full-time, $150k-$200k).
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="text-xs text-slate-400">
                Illustrative prototype job details, not an official Hey Grok job description.
              </p>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 ? (
            <section className="mt-9" aria-labelledby="responsibilities-heading">
              <h2
                className="text-2xl font-bold"
                id="responsibilities-heading"
              >
                What you’ll do
              </h2>
              <ul className="mt-4 grid gap-3 text-slate-300">
                {job.responsibilities.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span aria-hidden="true" className="text-orange-300">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {job.requirements && job.requirements.length > 0 ? (
            <section className="mt-9" aria-labelledby="requirements-heading">
              <h2 className="text-2xl font-bold" id="requirements-heading">
                What you bring
              </h2>
              <ul className="mt-4 grid gap-3 text-slate-300">
                {job.requirements.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span aria-hidden="true" className="text-orange-300">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {job.skills && job.skills.length > 0 ? (
            <section className="mt-9" aria-labelledby="skills-heading">
              <h2 className="text-2xl font-bold" id="skills-heading">
                Useful skills
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <li
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200"
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside className="surface-card h-fit p-6 lg:sticky lg:top-6">
          <p className="font-bold text-white">Interested in this role?</p>
          <p className="mt-2 text-sm text-slate-300">
            The application takes only the information needed for an initial
            review.
          </p>
          <Link
            className="button-primary mt-6 w-full"
            href={`/careers/${job.slug}/apply`}
          >
            Apply now
          </Link>
          <p className="mt-4 text-center text-xs text-slate-400">
            Applying for {job.title}
          </p>
        </aside>
      </div>
    </main>
  );
}