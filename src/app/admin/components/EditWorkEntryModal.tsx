"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Work = {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  image?: string;
  galleryImages?: string[];
  category?: string;
  ward?: string;
  status: "Ongoing" | "Completed";
  completedDate?: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
};

type EditWorkEntryModalProps = {
  work: Work;
  onClose: () => void;
  onSave: (work: Work) => void;
};

export default function EditWorkEntryModal({
  work,
  onClose,
  onSave,
}: EditWorkEntryModalProps) {
  const [form, setForm] = useState<Work>(work);

  const [imagePreview, setImagePreview] = useState<string | null>(
    work.image || null,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // KEEP FORM UPDATED
  // =====================================================

  useEffect(() => {
    setForm(work);
    setImagePreview(work.image || null);
    setError("");
  }, [work]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result as string;

      setImagePreview(base64Image);

      setForm((prev) => ({
        ...prev,
        image: base64Image,
      }));
    };

    reader.readAsDataURL(file);
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    try {
      setSaving(true);

      /*
       * IMPORTANT:
       *
       * We use the ORIGINAL projectId in the URL.
       *
       * projectId cannot be changed.
       */
      const originalProjectId = work.projectId;

      /*
       * Build only the fields that are allowed
       * to be updated.
       *
       * We DO NOT send projectId.
       */
      const updates: Record<string, unknown> = {};

      /*
       * Compare current form values with the
       * original work values.
       *
       * Only changed values will be sent.
       */

      if (form.title !== work.title) {
        updates.title = form.title;
      }

      if (form.description !== work.description) {
        updates.description = form.description || "";
      }

      if (form.image !== work.image) {
        updates.image = form.image || "";
      }

      if (
        JSON.stringify(form.galleryImages || []) !==
        JSON.stringify(work.galleryImages || [])
      ) {
        updates.galleryImages = form.galleryImages || [];
      }

      if (form.category !== work.category) {
        updates.category = form.category || "";
      }

      if (form.ward !== work.ward) {
        updates.ward = form.ward || "";
      }

      if (form.status !== work.status) {
        updates.status = form.status;
      }

      if (form.completedDate !== work.completedDate) {
        updates.completedDate = form.completedDate || "";
      }

      if (form.location !== work.location) {
        updates.location = form.location;
      }

      if (form.eventTypes !== work.eventTypes) {
        updates.eventTypes = form.eventTypes;
      }

      if (form.eventCategory !== work.eventCategory) {
        updates.eventCategory = form.eventCategory;
      }

      if (form.problem !== work.problem) {
        updates.problem = form.problem;
      }

      if (form.action !== work.action) {
        updates.action = form.action;
      }

      if (form.outcome !== work.outcome) {
        updates.outcome = form.outcome;
      }

      // =====================================================
      // NOTHING CHANGED
      // =====================================================

      if (Object.keys(updates).length === 0) {
        setError("No changes were made.");
        setSaving(false);
        return;
      }

      console.log("Fields being updated:", updates);

      // =====================================================
      // PATCH REQUEST
      // =====================================================

      const response = await fetch(
        `/api/works/${encodeURIComponent(originalProjectId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        },
      );

      const data = await response.json();

      console.log("Update work response:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update work");
      }

      // =====================================================
      // UPDATED WORK
      // =====================================================

      const updatedWork: Work = data.data;

      onSave(updatedWork);

      onClose();
    } catch (error) {
      console.error("Update work error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to update work",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[16px]
          bg-white
          shadow-[0px_12px_32px_rgba(0,0,0,0.18)]
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="max-h-[90vh] overflow-y-auto px-10 py-9">
            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="mb-5 flex items-center justify-between">
              <h2
                className="
                  font-serif
                  text-[22px]
                  font-bold
                  leading-normal
                  text-[#221f1a]
                "
              >
                Edit Work Entry
              </h2>

              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="
                  cursor-pointer
                  text-[25px]
                  font-semibold
                  leading-none
                  text-[#4a483f]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-[8px]
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-[13px]
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* =====================================================
                PROJECT ID
                READ ONLY
            ===================================================== */}

            <div className="mb-5">
              <label
                htmlFor="projectId"
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Project ID
              </label>

              <input
                id="projectId"
                value={work.projectId}
                readOnly
                className="
                  h-11
                  w-full
                  rounded-[8px]
                  border
                  border-[#e1d0cf]
                  bg-[#f7f6f3]
                  px-[14px]
                  text-[14px]
                  text-[#4a483f]
                  outline-none
                  cursor-not-allowed
                "
              />

              <p className="mt-1 text-[11px] text-[#77736a]">
                Project ID cannot be changed.
              </p>
            </div>

            {/* =====================================================
                TITLE
            ===================================================== */}

            <div className="mb-5">
              <label
                htmlFor="title"
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-[8px]
                  border
                  border-[#e1d0cf]
                  bg-white
                  px-[14px]
                  text-[14px]
                  text-[#4a483f]
                  outline-none
                  focus:border-[#8a1538]
                "
              />
            </div>

            {/* =====================================================
                STATUS
            ===================================================== */}

            <div className="mb-5">
              <label
                htmlFor="status"
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-[8px]
                  border
                  border-[#e1d0cf]
                  bg-white
                  px-[14px]
                  text-[14px]
                  text-[#4a483f]
                  outline-none
                  focus:border-[#8a1538]
                "
              >
                <option value="Ongoing">Ongoing</option>

                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* =====================================================
                EVENT TYPE + CATEGORY
            ===================================================== */}

            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="eventTypes"
                  className="
                    mb-[6px]
                    block
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  Event Type
                </label>

                <select
                  id="eventTypes"
                  name="eventTypes"
                  value={form.eventTypes}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-[8px]
                    border
                    border-[#e1d0cf]
                    bg-white
                    px-[14px]
                    text-[14px]
                    text-[#4a483f]
                    outline-none
                    focus:border-[#8a1538]
                  "
                >
                  <option value="">Select type</option>

                  <option value="Project">Project</option>

                  <option value="Event">Event</option>

                  <option value="Program">Program</option>

                  <option value="Visit">Visit</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="eventCategory"
                  className="
                    mb-[6px]
                    block
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  Event Category
                </label>

                <select
                  id="eventCategory"
                  name="eventCategory"
                  value={form.eventCategory}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-[8px]
                    border
                    border-[#e1d0cf]
                    bg-white
                    px-[14px]
                    text-[14px]
                    text-[#4a483f]
                    outline-none
                    focus:border-[#8a1538]
                  "
                >
                  <option value="">Select category</option>

                  <option value="Infrastructure">Infrastructure</option>

                  <option value="Education">Education</option>

                  <option value="Health">Health</option>

                  <option value="Agriculture">Agriculture</option>

                  <option value="Disaster Relief">Disaster Relief</option>

                  <option value="Youth Programs">Youth Programs</option>
                </select>
              </div>
            </div>

            {/* =====================================================
                LOCATION
            ===================================================== */}

            <div className="mb-5">
              <label
                htmlFor="location"
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-[8px]
                  border
                  border-[#e1d0cf]
                  bg-white
                  px-[14px]
                  text-[14px]
                  text-[#4a483f]
                  outline-none
                  focus:border-[#8a1538]
                "
              />
            </div>

            {/* =====================================================
                PROBLEM
            ===================================================== */}

            <div className="mb-5">
              <label
                htmlFor="problem"
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Problem
              </label>

              <textarea
                id="problem"
                name="problem"
                value={form.problem}
                onChange={handleChange}
                rows={4}
                className="
                  w-full
                  resize-none
                  rounded-[8px]
                  border
                  border-[#e1d0cf]
                  bg-white
                  px-[14px]
                  py-3
                  text-[14px]
                  text-[#4a483f]
                  outline-none
                  focus:border-[#8a1538]
                "
              />
            </div>

            {/* =====================================================
                ACTION + OUTCOME
            ===================================================== */}

            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="action"
                  className="
                    mb-[6px]
                    block
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  Action
                </label>

                <input
                  id="action"
                  name="action"
                  value={form.action}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-[8px]
                    border
                    border-[#e1d0cf]
                    bg-white
                    px-[14px]
                    text-[14px]
                    text-[#4a483f]
                    outline-none
                    focus:border-[#8a1538]
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="outcome"
                  className="
                    mb-[6px]
                    block
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  Outcome
                </label>

                <input
                  id="outcome"
                  name="outcome"
                  value={form.outcome}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-[8px]
                    border
                    border-[#e1d0cf]
                    bg-white
                    px-[14px]
                    text-[14px]
                    text-[#4a483f]
                    outline-none
                    focus:border-[#8a1538]
                  "
                />
              </div>
            </div>

            {/* =====================================================
                DATE
            ===================================================== */}

            <div className="mb-5">
              <label
                htmlFor="completedDate"
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Date
              </label>

              <input
                id="completedDate"
                name="completedDate"
                type="date"
                value={form.completedDate || ""}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-[8px]
                  border
                  border-[#e1d0cf]
                  bg-white
                  px-[14px]
                  text-[14px]
                  text-[#4a483f]
                  outline-none
                  focus:border-[#8a1538]
                "
              />
            </div>

            {/* =====================================================
                IMAGE
            ===================================================== */}

            <div className="mb-6">
              <label
                className="
                  mb-[6px]
                  block
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Image
              </label>

              <label
                htmlFor="edit-work-image"
                className="
                  flex
                  h-[120px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[8px]
                  border
                  border-dashed
                  border-[#e1d0cf]
                  bg-[#f7f6f3]
                  text-[#4a483f]
                "
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Work preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <span className="mb-1 text-[20px]">⬆</span>

                    <span className="text-[13px]">Click to upload image</span>
                  </>
                )}
              </label>

              <input
                id="edit-work-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="
                  rounded-[8px]
                  border-[1.5px]
                  border-[#0b1f3a]
                  bg-white
                  px-6
                  py-[14px]
                  text-[16px]
                  font-semibold
                  text-[#0b1f3a]
                  transition
                  hover:bg-[#0b1f3a]/5
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-[8px]
                  bg-[#8a1538]
                  px-6
                  py-[14px]
                  text-[16px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#72112f]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
