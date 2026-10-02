import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="container-shell grid min-h-[60vh] place-items-center py-20 text-center"
      id="main-content"
    >
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          We couldn’t find that role
        </h1>
        <p className="mt-4 text-slate-300">
          It may have moved or is no longer part of this prototype.
        </p>
        <Link className="button-primary mt-7" href="/careers#open-positions">
          View open positions
        </Link>
      </div>
    </main>
  );
}