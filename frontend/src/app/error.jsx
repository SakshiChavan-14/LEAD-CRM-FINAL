"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to client console or monitoring service
    console.error("Application error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";
  const displayMessage =
    isDev && error?.message
      ? error.message
      : "An unexpected error occurred while loading this page. Please try again or refresh the page.";

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md text-center p-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {displayMessage}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            fullWidth={false}
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
