"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="container-shell grid min-h-[60vh] place-items-center py-20 text-center"
      id="main-content"
    >
      <div className="surface-card max-w-xl p-8">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-black">This page couldn’t load</h1>
        <p className="mt-4 text-slate-300">
          Your application has not been confirmed from this screen. Try loading
          the page again.
        </p>
        <button className="button-primary mt-7" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </main>
  );
}