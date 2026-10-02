const steps = ["Role", "Details", "Application", "Submitted"] as const;

export function ProgressSteps({
  current,
}: {
  current: (typeof steps)[number];
}) {
  const activeIndex = steps.indexOf(current);
  return (
    <nav aria-label="Application progress" className="overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 text-sm">
        {steps.map((step, index) => (
          <li className="flex items-center gap-2" key={step}>
            <span
              aria-current={step === current ? "step" : undefined}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 font-bold ${
                index <= activeIndex
                  ? "border-orange-300/70 bg-orange-400/15 text-orange-100"
                  : "border-white/10 text-slate-500"
              }`}
            >
              <span className="sr-only">Step {index + 1}: </span>
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="text-slate-600">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}