import type { Metadata } from "next";
import Link from "next/link";
import { JobCard } from "@/components/careers/job-card";
import { ProgressSteps } from "@/components/careers/progress-steps";
import { jobs } from "@/lib/jobs/jobs";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore open roles and apply through an accessible candidate flow.",
};

const benefits = [
  {
    title: "Meaningful ownership",
    body: "Take ideas from an early conversation through a thoughtful production release.",
  },
  {
    title: "Focused collaboration",
    body: "Work with a small cross-functional team that values clarity over ceremony.",
  },
  {
    title: "Room to do your best work",
    body: "Flexible work, practical support, and protected time for deep problem-solving.",
  },
];

export default function CareersPage() {
  return (
    <main id="main-content">
      <section className="container-shell grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div>
          <p className="eyebrow">Careers at Grok Labs</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.04] font-black tracking-[-0.045em] text-balance sm:text-7xl">
            Build useful AI with people who care about the details.
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Join a small team turning ambitious research into dependable,
            human-centered products.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className="button-primary" href="#open-positions">
              Explore open positions
            </a>
            <a className="button-secondary" href="#general-interest">
              Send your resume
            </a>
          </div>
        </div>
        <aside className="surface-card self-end p-6 sm:p-8" aria-label="Our approach">
          <p className="eyebrow">How we work</p>
          <p className="mt-4 text-2xl leading-snug font-bold text-white">
            Curious, candid, and committed to shipping work that earns trust.
          </p>
          <p className="mt-4 text-slate-300">
            We value clear thinking, low-ego collaboration, and engineering
            decisions that hold up beyond the demo.
          </p>
        </aside>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="container-shell">
          <p className="eyebrow">Why join</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            A place to make your work count
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <article className="surface-card p-6" key={benefit.title}>
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-full bg-orange-400/15 font-black text-orange-200"
                >
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold">{benefit.title}</h3>
                <p className="mt-2 text-slate-300">{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell scroll-mt-8 py-20" id="open-positions">
        <ProgressSteps current="Role" />
        <div className="mt-10 max-w-3xl">
          <p className="eyebrow">Open positions</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next challenge
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Every role has a direct details page and a working application path.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      </section>

      <section className="container-shell scroll-mt-8" id="general-interest">
        <div className="surface-card flex flex-col items-start justify-between gap-7 p-7 sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">General interest</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Don’t see the right role?
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Tell us where you could contribute. This prototype routes general
              interest through the featured engineering application while keeping
              the selected role visible.
            </p>
          </div>
          <Link
            className="button-secondary shrink-0"
            href="/careers/full-stack-engineer/apply"
          >
            Send your resume
          </Link>
        </div>
      </section>
    </main>
  );
}