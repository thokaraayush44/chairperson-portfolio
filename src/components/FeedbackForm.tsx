"use client";

import React from "react";

type FeedbackFormProps = {
  className?: string;
  title?: string;
  wardOptions?: string[];
  issueCategories?: string[];
};

export function FeedbackForm({
  className = "border-slate-200 bg-[#F5F2EC] p-8 shadow-sm",
  title = "Public Feedback Form",
  wardOptions = ["Select your ward (1–9)", "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9"],
  issueCategories = ["Select an issue category", "Infrastructure", "Public Services", "Other"],
}: FeedbackFormProps) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-3xl flex flex-col bg-white rounded-[2rem] p-8 shadow-sm">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        </div>

        <form className="mt-10 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <div className="gap-6 space-y-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold">Full Name</span>
              <input
                type="text"
                placeholder="Enter your full name"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-600 focus:bg-white focus:ring-2 focus:ring-rose-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold">Ward Number</span>
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-600 focus:bg-white focus:ring-2 focus:ring-rose-100"
              >
                {wardOptions.map((option) => (
                  <option key={option} value={option === wardOptions[0] ? "" : option} disabled={option === wardOptions[0]}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold">Issue Category</span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-600 focus:bg-white focus:ring-2 focus:ring-rose-100"
            >
              {issueCategories.map((option) => (
                <option key={option} value={option === issueCategories[0] ? "" : option} disabled={option === issueCategories[0]}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold">Message</span>
            <textarea
              rows={6}
              placeholder="Describe your issue, feedback, or request in detail..."
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-600 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-rose-900 px-6 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </section>
  );
}
