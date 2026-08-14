"use client";

import { ChangeEvent, FormEvent, useState } from "react";

export type WorkEntry = {
  projectId: string;
  title: string;
  description: string;
  image: string;
  galleryImages: string[];
  category: string;
  ward: string;
  status: "Ongoing" | "Completed" | "";
  completedDate: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
};

type AddWorkModalProps = {
  onClose: () => void;
  onSave?: (work: WorkEntry) => void;
};

export default function AddWorkModal({
  onClose,
  onSave,
}: AddWorkModalProps) {
  const [form, setForm] = useState<WorkEntry>({
    projectId: "",
    title: "",
    description: "",
    image: "",
    galleryImages: [],
    category: "",
    ward: "",
    status: "",
    completedDate: "",
    location: "",
    eventTypes: "",
    eventCategory: "",
    problem: "",
    action: "",
    outcome: "",
  });

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.projectId ||
      !form.title ||
      !form.description ||
      !form.image ||
      !form.category ||
      !form.ward ||
      !form.status ||
      !form.location ||
      !form.eventTypes ||
      !form.eventCategory ||
      !form.problem ||
      !form.action ||
      !form.outcome
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSave?.(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative max-h-[90vh] w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-[0px_12px_32px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit}>
          <div className="max-h-[90vh] overflow-y-auto px-10 py-9">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-[22px] font-bold text-[#221F1A]">
                Add Work Entry
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-[25px] font-semibold leading-none text-[#4A483F]"
              >
                ×
              </button>
            </div>

            {/* Project ID */}
            <Field
              label="Project ID"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              placeholder="e.g. WRK-014"
            />

            {/* Title */}
            <Field
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rural Road Blacktopping Project"
            />

            {/* Description */}
            <div className="mb-5">
              <label
                htmlFor="description"
                className="mb-[6px] block text-[13px] font-semibold text-[#221F1A]"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows={4}
                className="w-full resize-none rounded-[8px] border border-[#E1D0CF] px-[14px] py-3 text-[14px] outline-none focus:border-[#8A1538]"
              />
            </div>

            {/* Status */}
            <div className="mb-5">
              <label
                htmlFor="status"
                className="mb-[6px] block text-[13px] font-semibold"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="h-11 w-full rounded-[8px] border border-[#E1D0CF] px-[14px] text-[14px] outline-none focus:border-[#8A1538]"
              >
                <option value="">Select status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Category + Ward */}
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                options={[
                  "Infrastructure",
                  "Education",
                  "Health",
                  "Agriculture",
                  "Disaster Relief",
                  "Youth Programs",
                ]}
                placeholder="Select category"
              />

              <Field
                label="Ward"
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="e.g. Ward 4"
              />
            </div>

            {/* Event Type + Category */}
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label="Event Type"
                name="eventTypes"
                value={form.eventTypes}
                onChange={handleChange}
                options={["Project", "Event", "Program", "Visit"]}
                placeholder="Select type"
              />

              <SelectField
                label="Event Category"
                name="eventCategory"
                value={form.eventCategory}
                onChange={handleChange}
                options={[
                  "Infrastructure",
                  "Education",
                  "Health",
                  "Agriculture",
                  "Disaster Relief",
                  "Youth Programs",
                ]}
                placeholder="Select category"
              />
            </div>

            {/* Location */}
            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Ward 4, Deurali"
            />

            {/* Problem */}
            <div className="mb-5">
              <label
                htmlFor="problem"
                className="mb-[6px] block text-[13px] font-semibold"
              >
                Problem
              </label>

              <textarea
                id="problem"
                name="problem"
                value={form.problem}
                onChange={handleChange}
                placeholder="Enter problem description"
                rows={4}
                className="w-full resize-none rounded-[8px] border border-[#E1D0CF] px-[14px] py-3 text-[14px] outline-none focus:border-[#8A1538]"
              />
            </div>

            {/* Action + Outcome */}
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Action"
                name="action"
                value={form.action}
                onChange={handleChange}
                placeholder="Enter action"
              />

              <Field
                label="Outcome"
                name="outcome"
                value={form.outcome}
                onChange={handleChange}
                placeholder="Enter outcome"
              />
            </div>

            {/* Date */}
            <Field
              label="Completed Date"
              name="completedDate"
              type="date"
              value={form.completedDate}
              onChange={handleChange}
            />

            {/* Image URL */}
            <Field
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[8px] border-[1.5px] border-[#0B1F3A] bg-white px-6 py-[14px] text-[16px] font-semibold text-[#0B1F3A]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-[8px] bg-[#8A1538] px-6 py-[14px] text-[16px] font-semibold text-white hover:bg-[#72112F]"
              >
                Save Work
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- FIELD ---------------- */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="mb-[6px] block text-[13px] font-semibold text-[#221F1A]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-[8px] border border-[#E1D0CF] px-[14px] text-[14px] outline-none placeholder:text-[#4A483F] focus:border-[#8A1538]"
      />
    </div>
  );
}

/* ---------------- SELECT ---------------- */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-[6px] block text-[13px] font-semibold text-[#221F1A]"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-[8px] border border-[#E1D0CF] px-[14px] text-[14px] outline-none focus:border-[#8A1538]"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}