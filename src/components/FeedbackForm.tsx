"use client";

import React, { FormEvent, useState } from "react";

type FeedbackFormProps = {
  className?: string;
  title?: string;
  issueCategories?: string[];
};

export function FeedbackForm({
  className = "border-slate-200 bg-[#F5F2EC] p-8 shadow-sm",
  title = "Public Feedback Form",
  issueCategories = [
    "Select an issue category",
    "Infrastructure",
    "Public Services",
    "Education",
    "Health",
    "Agriculture",
    "Environment",
    "Other",
  ],
}: FeedbackFormProps) {
  const [name, setName] = useState("");
  const [ward, setWard] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // -----------------------------
    // Validate name
    // -----------------------------
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    // -----------------------------
    // Validate ward
    // -----------------------------
    const wardNumber = Number(ward);

    if (
      !ward.trim() ||
      !Number.isInteger(wardNumber) ||
      wardNumber < 1
    ) {
      alert("Please enter a valid ward number.");
      return;
    }

    // -----------------------------
    // Validate category
    // -----------------------------
    if (!category) {
      alert("Please select an issue category.");
      return;
    }

    // -----------------------------
    // Validate message
    // -----------------------------
    if (!message.trim()) {
      alert("Please enter your message.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          ward: wardNumber,
          category,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit feedback."
        );
      }

      alert(
        "Thank you! Your feedback has been submitted successfully."
      );

      // Reset form
      setName("");
      setWard("");
      setCategory("");
      setMessage("");
    } catch (error) {
      console.error(
        "Feedback submission error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={className}>
      <div className="mx-auto flex max-w-3xl flex-col rounded-[2rem] bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            {title}
          </h2>
        </div>

        {/* Form */}
        <form
          className="mt-10 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Full Name */}
          <label className="block">
            <span className="text-sm font-bold">
              Full Name
            </span>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
              disabled={submitting}
              className="
                mt-2
                h-12
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-rose-600
                focus:bg-white
                focus:ring-2
                focus:ring-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </label>

          {/* Ward Number */}
          <label className="block">
            <span className="text-sm font-bold">
              Ward Number
            </span>

            <input
              type="number"
              min={1}
              step={1}
              value={ward}
              onChange={(e) =>
                setWard(e.target.value)
              }
              placeholder="Enter your ward number"
              disabled={submitting}
              className="
                mt-2
                h-12
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-rose-600
                focus:bg-white
                focus:ring-2
                focus:ring-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </label>

          {/* Issue Category */}
          <label className="block">
            <span className="text-sm font-bold">
              Issue Category
            </span>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              disabled={submitting}
              className="
                mt-2
                h-12
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-rose-600
                focus:bg-white
                focus:ring-2
                focus:ring-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {issueCategories.map(
                (option, index) => {
                  const isPlaceholder = index === 0;

                  return (
                    <option
                      key={option}
                      value={
                        isPlaceholder
                          ? ""
                          : option
                      }
                      disabled={
                        isPlaceholder
                      }
                    >
                      {option}
                    </option>
                  );
                }
              )}
            </select>
          </label>

          {/* Message */}
          <label className="block">
            <span className="text-sm font-bold">
              Message
            </span>

            <textarea
              rows={6}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Describe your issue, feedback, or request in detail..."
              disabled={submitting}
              className="
                mt-2
                w-full
                rounded-3xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-rose-600
                focus:bg-white
                focus:ring-2
                focus:ring-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="
              inline-flex
              h-12
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-rose-900
              px-6
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-rose-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {submitting
              ? "Submitting..."
              : "Submit Feedback"}
          </button>
        </form>
      </div>
    </section>
  );
}