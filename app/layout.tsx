import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Careers flow prototype",
    template: "%s | Careers flow prototype",
  },
  description:
    "An independently built prototype of a functional, accessible careers application journey.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="border-b border-white/10">
          <div className="container-shell flex min-h-20 items-center justify-between gap-4">
            <Link
              className="flex min-h-11 items-center gap-3 font-bold tracking-tight"
              href="/careers"
              aria-label="Grok Labs careers prototype home"
            >
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl bg-orange-400 font-black text-slate-950"
              >
                G
              </span>
              <span>Grok Labs</span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-bold text-slate-200 hover:text-white"
                href="/careers#open-positions"
              >
                Open roles
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t border-white/10 py-10">
          <div className="container-shell flex flex-col justify-between gap-4 text-sm text-slate-400 sm:flex-row">
            <p>Independent careers-flow prototype.</p>
            <p>Built for a clear, keyboard-friendly candidate journey.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}