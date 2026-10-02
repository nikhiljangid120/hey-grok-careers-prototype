"use client";

import { useState } from "react";

export function CopyApplicationId({ value }: { value: string }) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Application ID copied.");
    } catch {
      setStatus("Could not copy automatically. Select the ID to copy it.");
    }
  }

  return (
    <div>
      <button className="button-secondary w-full" onClick={copy} type="button">
        Copy application ID
      </button>
      <p className="mt-2 min-h-6 text-sm text-slate-300" aria-live="polite">
        {status}
      </p>
    </div>
  );
}