import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Careers Flow Prototype",
    template: "%s | Careers Flow Prototype",
  },
  description:
    "Independent prototype inspired by the publicly observable Hey Grok Careers experience. Not affiliated with or endorsed by Hey Grok.",
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
        <div className="border-b border-orange-500/20 bg-orange-950/40 px-4 py-2 text-center text-xs text-orange-200">
          Independent prototype inspired by the publicly observable Hey Grok Careers experience. Not affiliated with or endorsed by Hey Grok.
        </div>
        <header className="border-b border-white/10">
          <div className="container-shell flex min-h-20 items-center justify-between gap-4">
            <Link
              className="flex min-h-11 items-center gap-3 font-bold tracking-tight"
              href="/careers"
              aria-label="Careers Flow Prototype home"
            >
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl bg-orange-400 font-black text-slate-950 text-xs tracking-wider"
              >
                CFP
              </span>
              <span className="text-white text-lg">Careers Flow Prototype</span>
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
          <div className="container-shell flex flex-col justify-between gap-4 text-sm text-slate-400 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-slate-300">Careers Flow Prototype</p>
              <p className="mt-1 text-xs text-slate-400">
                Independent prototype inspired by the publicly observable Hey Grok Careers experience. Not affiliated with or endorsed by Hey Grok.
              </p>
            </div>
            <p className="text-xs text-slate-500 shrink-0">Built for a clear, keyboard-friendly candidate journey.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}