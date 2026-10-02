export default function Loading() {
  return (
    <main
      className="container-shell animate-pulse py-16"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div className="h-5 w-48 rounded bg-white/10" />
      <div className="mt-8 h-14 max-w-2xl rounded bg-white/10" />
      <div className="mt-5 h-6 max-w-xl rounded bg-white/10" />
      <div className="surface-card mt-10 h-72 max-w-4xl" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}