"use client";

import { useEffect, useState } from "react";

type Feedback = {
  _id: string;
  name: string;
  ward: string;
  category: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
};

export default function ContactSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] =
    useState<Feedback | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch feedback");
      }

      setFeedbacks(data.data || []);
    } catch (error) {
      console.error("Fetch feedback error:", error);
      alert("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    feedback: Feedback,
    status: "read" | "unread"
  ) {
    try {
      setUpdatingStatus(true);

      const response = await fetch(`/api/contact/${feedback._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      const updatedFeedback = data.data;

      setFeedbacks((prev) =>
        prev.map((item) =>
          item._id === feedback._id ? updatedFeedback : item
        )
      );

      setSelectedFeedback(updatedFeedback);
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update feedback status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function deleteFeedback(feedback: Feedback) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/contact/${feedback._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete feedback");
      }

      setFeedbacks((prev) =>
        prev.filter((item) => item._id !== feedback._id)
      );

      setSelectedFeedback(null);
    } catch (error) {
      console.error("Delete feedback error:", error);
      alert("Failed to delete feedback.");
    } finally {
      setDeleting(false);
    }
  }

  function openFeedback(feedback: Feedback) {
    setSelectedFeedback(feedback);

    // Automatically mark unread feedback as read
    if (feedback.status === "unread") {
      updateStatus(feedback, "read");
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const unreadCount = feedbacks.filter(
    (item) => item.status === "unread"
  ).length;

  return (
    <>
      <section className="w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-['Libre_Baskerville'] text-[28px] font-bold text-[#221f1a]">
              Public Feedback
            </h2>

            <p className="mt-2 text-[14px] text-[#6b6861]">
              View and manage feedback submitted by citizens.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f4e8eb] px-4 py-2 text-[13px] font-semibold text-[#8a1538]">
              {feedbacks.length} Total
            </div>

            {unreadCount > 0 && (
              <div className="rounded-full bg-[#fff1f1] px-4 py-2 text-[13px] font-semibold text-[#d4171d]">
                {unreadCount} Unread
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-[14px] border border-[#e1d0cf] bg-white shadow-sm">
          {/* Table Header */}
          <div className="hidden grid-cols-[1.5fr_0.8fr_1fr_1fr_0.7fr_0.7fr] gap-4 border-b border-[#e9dfdc] bg-[#faf9f7] px-6 py-4 md:grid">
            <span className="text-[12px] font-bold uppercase tracking-wide text-[#6b6861]">
              Citizen
            </span>

            <span className="text-[12px] font-bold uppercase tracking-wide text-[#6b6861]">
              Ward
            </span>

            <span className="text-[12px] font-bold uppercase tracking-wide text-[#6b6861]">
              Category
            </span>

            <span className="text-[12px] font-bold uppercase tracking-wide text-[#6b6861]">
              Date
            </span>

            <span className="text-[12px] font-bold uppercase tracking-wide text-[#6b6861]">
              Status
            </span>

            <span className="text-right text-[12px] font-bold uppercase tracking-wide text-[#6b6861]">
              Action
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center px-6 py-20">
              <div className="text-[14px] text-[#6b6861]">
                Loading feedback...
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && feedbacks.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f3f0] text-2xl">
                💬
              </div>

              <h3 className="text-[16px] font-semibold text-[#221f1a]">
                No feedback yet
              </h3>

              <p className="mt-2 text-[13px] text-[#77736c]">
                Feedback submitted from the contact page will appear here.
              </p>
            </div>
          )}

          {/* Feedback */}
          {!loading &&
            feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className={`border-b border-[#eee6e3] px-6 py-5 transition last:border-b-0 ${
                  feedback.status === "unread"
                    ? "bg-[#fffaf9]"
                    : "bg-white"
                }`}
              >
                {/* Desktop */}
                <div className="hidden grid-cols-[1.5fr_0.8fr_1fr_1fr_0.7fr_0.7fr] items-center gap-4 md:grid">
                  {/* Citizen */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {feedback.status === "unread" && (
                        <span className="h-2 w-2 rounded-full bg-[#8a1538]" />
                      )}

                      <p className="truncate text-[14px] font-semibold text-[#221f1a]">
                        {feedback.name}
                      </p>
                    </div>

                    <p className="mt-1 truncate text-[12px] text-[#77736c]">
                      {feedback.message}
                    </p>
                  </div>

                  {/* Ward */}
                  <span className="text-[13px] text-[#4a483f]">
                    {feedback.ward}
                  </span>

                  {/* Category */}
                  <span className="truncate text-[13px] text-[#4a483f]">
                    {feedback.category}
                  </span>

                  {/* Date */}
                  <span className="text-[13px] text-[#6b6861]">
                    {formatDate(feedback.createdAt)}
                  </span>

                  {/* Status */}
                  <div>
                    {feedback.status === "unread" ? (
                      <span className="inline-flex rounded-full bg-[#fff0f0] px-3 py-1 text-[11px] font-bold text-[#d4171d]">
                        Unread
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-[#edf7ef] px-3 py-1 text-[11px] font-bold text-[#28753d]">
                        Read
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openFeedback(feedback)}
                      className="rounded-[7px] border border-[#8a1538] px-3 py-2 text-[12px] font-semibold text-[#8a1538] transition hover:bg-[#8a1538] hover:text-white"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {feedback.status === "unread" && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#8a1538]" />
                        )}

                        <h3 className="truncate text-[15px] font-semibold text-[#221f1a]">
                          {feedback.name}
                        </h3>
                      </div>

                      <p className="mt-1 text-[12px] text-[#77736c]">
                        {feedback.ward} • {feedback.category}
                      </p>
                    </div>

                    {feedback.status === "unread" ? (
                      <span className="shrink-0 rounded-full bg-[#fff0f0] px-3 py-1 text-[10px] font-bold text-[#d4171d]">
                        Unread
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-[#edf7ef] px-3 py-1 text-[10px] font-bold text-[#28753d]">
                        Read
                      </span>
                    )}
                  </div>

                  <p className="mt-4 line-clamp-2 text-[13px] leading-5 text-[#5f5b55]">
                    {feedback.message}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12px] text-[#77736c]">
                      {formatDate(feedback.createdAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => openFeedback(feedback)}
                      className="rounded-[7px] border border-[#8a1538] px-4 py-2 text-[12px] font-semibold text-[#8a1538]"
                    >
                      View Feedback
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedFeedback(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-[620px] overflow-hidden rounded-[18px] bg-white shadow-[0px_20px_60px_rgba(0,0,0,0.25)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eee6e3] px-7 py-5">
              <div>
                <h2 className="font-['Libre_Baskerville'] text-[20px] font-bold text-[#221f1a]">
                  Feedback Details
                </h2>

                <p className="mt-1 text-[12px] text-[#77736c]">
                  Submitted {formatDateTime(selectedFeedback.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[24px] text-[#6b6861] transition hover:bg-[#f5f2ee] hover:text-[#221f1a]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[65vh] overflow-y-auto px-7 py-6">
              {/* Person */}
              <div className="mb-6 flex items-center gap-4 rounded-[12px] bg-[#faf8f5] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8a1538] text-[16px] font-bold text-white">
                  {selectedFeedback.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-[16px] font-bold text-[#221f1a]">
                    {selectedFeedback.name}
                  </h3>

                  <p className="mt-1 text-[13px] text-[#77736c]">
                    {selectedFeedback.ward}
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoBox
                  label="Ward"
                  value={selectedFeedback.ward}
                />

                <InfoBox
                  label="Issue Category"
                  value={selectedFeedback.category}
                />

                <InfoBox
                  label="Submitted"
                  value={formatDateTime(
                    selectedFeedback.createdAt
                  )}
                />

                <InfoBox
                  label="Status"
                  value={
                    selectedFeedback.status === "unread"
                      ? "Unread"
                      : "Read"
                  }
                />
              </div>

              {/* Message */}
              <div className="mt-5">
                <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#77736c]">
                  Message
                </p>

                <div className="rounded-[12px] border border-[#e9dfdc] bg-white p-5">
                  <p className="whitespace-pre-wrap text-[14px] leading-7 text-[#3f3b36]">
                    {selectedFeedback.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#eee6e3] bg-[#faf9f7] px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => deleteFeedback(selectedFeedback)}
                disabled={deleting}
                className="rounded-[8px] border border-[#d4171d] px-5 py-3 text-[13px] font-semibold text-[#d4171d] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Feedback"}
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      selectedFeedback,
                      selectedFeedback.status === "read"
                        ? "unread"
                        : "read"
                    )
                  }
                  disabled={updatingStatus}
                  className="rounded-[8px] border border-[#0b1f3a] bg-white px-5 py-3 text-[13px] font-semibold text-[#0b1f3a] transition hover:bg-[#0b1f3a] hover:text-white disabled:opacity-50"
                >
                  {updatingStatus
                    ? "Updating..."
                    : selectedFeedback.status === "read"
                    ? "Mark Unread"
                    : "Mark Read"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="rounded-[8px] bg-[#8a1538] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#72112f]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- INFO BOX ---------------- */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#eee6e3] bg-[#faf9f7] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#77736c]">
        {label}
      </p>

      <p className="mt-1 text-[14px] font-semibold text-[#221f1a]">
        {value}
      </p>
    </div>
  );
}