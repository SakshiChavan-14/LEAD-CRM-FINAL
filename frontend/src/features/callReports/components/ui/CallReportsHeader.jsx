"use client";

import React from "react";

export default function CallReportsHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-vertical_gap mb-vertical_gap">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-background m-0 p-0">Call Reports</h1>
        <p className="font-body-lg text-secondary mt-1 m-0 p-0">
          Monitor telecaller activity and call performance across the university
        </p>
      </div>
      <div className="flex items-center gap-4"></div>
    </header>
  );
}
