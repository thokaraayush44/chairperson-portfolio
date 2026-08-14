"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type AddNewsModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddNewsModal({
  onClose,
  onSuccess,
}: AddNewsModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageName(file.name);

    // Convert image to base64 temporarily.
    // This works with your current image:string field.
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !image || !date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create news");
      }

      alert("News created successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Create news error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create news"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[560px] rounded-[16px] bg-white px-[40px] py-[36px] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.18)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-['Libre_Baskerville'] text-[22px] font-bold text-[#221f1a]">
              Add News Entry
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[24px] leading-none text-[#4a483f] transition hover:text-[#221f1a]"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="news-title"
              className="text-[13px] font-semibold text-[#221f1a]"
            >
              Title
            </label>

            <input
              id="news-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chairperson Inaugurates New Health Post"
              className="
                h-[44px]
                w-full
                rounded-[8px]
                border
                border-[#e1d0cf]
                bg-white
                px-[14px]
                text-[14px]
                text-[#221f1a]
                outline-none
                placeholder:text-[#4a483f]
                focus:border-[#8a1538]
              "
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="news-description"
              className="text-[13px] font-semibold text-[#221f1a]"
            >
              Description
            </label>

            <textarea
              id="news-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short summary of the news update..."
              className="
                h-[96px]
                w-full
                resize-none
                rounded-[8px]
                border
                border-[#e1d0cf]
                bg-white
                px-[14px]
                py-[12px]
                text-[14px]
                text-[#221f1a]
                outline-none
                placeholder:text-[#4a483f]
                focus:border-[#8a1538]
              "
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="news-image"
              className="text-[13px] font-semibold text-[#221f1a]"
            >
              Image
            </label>

            <label
              htmlFor="news-image"
              className="
                flex
                h-[120px]
                w-full
                cursor-pointer
                flex-col
                items-center
                justify-center
                gap-1
                overflow-hidden
                rounded-[8px]
                border
                border-dashed
                border-[#e1d0cf]
                bg-[#f7f6f3]
                text-[#4a483f]
                transition
                hover:border-[#8a1538]
              "
            >
              {imageName ? (
                <>
                  <span className="text-[14px] font-medium">
                    {imageName}
                  </span>

                  <span className="text-[12px]">
                    Click to change image
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[20px] font-medium">
                    ↑
                  </span>

                  <span className="text-[13px]">
                    Click to upload image
                  </span>
                </>
              )}
            </label>

            <input
              id="news-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="news-date"
              className="text-[13px] font-semibold text-[#221f1a]"
            >
              Date
            </label>

            <input
              id="news-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                h-[44px]
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

          {/* Footer */}
          <div className="flex w-full justify-end gap-3">
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
                hover:bg-[#f7f6f3]
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
                disabled:opacity-60
              "
            >
              {saving ? "Saving..." : "Save News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}