"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

type AddGalleryModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddGalleryModal({
  onClose,
  onSuccess,
}: AddGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a caption.");
      return;
    }

    if (!image) {
      alert("Please upload a photo.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image,
          category,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save photo");
      }

      setTitle("");
      setCategory("");
      setDate("");
      setImage("");
      setImageName("");

      onSuccess?.();
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Failed to save photo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/20
        px-4
        py-6
      "
    >
      <div
        className="
          w-full
          max-w-[560px]
          rounded-[16px]
          bg-white
          px-10
          py-9
          shadow-[0px_12px_32px_0px_rgba(0,0,0,0.18)]
        "
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex w-full items-center justify-between">
            <h2
              className="
                font-['Libre_Baskerville']
                text-[22px]
                font-bold
                leading-normal
                text-[#221f1a]
              "
            >
              Add Press Photo
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="
                cursor-pointer
                text-[24px]
                font-semibold
                leading-none
                text-[#4a483f]
                hover:text-[#221f1a]
              "
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Caption */}
          <div className="flex w-full flex-col gap-[6px]">
            <label
              htmlFor="caption"
              className="
                text-[13px]
                font-semibold
                leading-normal
                text-[#221f1a]
              "
            >
              Caption
            </label>

            <input
              id="caption"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Health Post Inauguration, Ward 9"
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

          {/* Event / Category */}
          <div className="flex w-full flex-col gap-[6px]">
            <label
              htmlFor="category"
              className="
                text-[13px]
                font-semibold
                leading-normal
                text-[#221f1a]
              "
            >
              Event / Category
            </label>

            <textarea
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Public Event, Site Visit, Ceremony"
              className="
                h-[96px]
                w-full
                resize-none
                rounded-[8px]
                border
                border-[#e1d0cf]
                bg-white
                px-[14px]
                py-3
                text-[14px]
                text-[#221f1a]
                outline-none
                placeholder:text-[#4a483f]
                focus:border-[#8a1538]
              "
            />
          </div>

          {/* Photo */}
          <div className="flex w-full flex-col gap-[6px]">
            <label
              htmlFor="photo"
              className="
                text-[13px]
                font-semibold
                leading-normal
                text-[#221f1a]
              "
            >
              Photo
            </label>

            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="
                flex
                h-[120px]
                w-full
                flex-col
                items-center
                justify-center
                gap-[4px]
                overflow-hidden
                rounded-[8px]
                border
                border-dashed
                border-[#e1d0cf]
                bg-[#f7f6f3]
                text-[#4a483f]
                transition
                hover:bg-[#f1efeb]
              "
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </>
              ) : (
                <>
                  <span className="text-[20px] font-medium">⬆</span>

                  <span className="text-[13px]">Click to upload image</span>
                </>
              )}
            </button>

            {imageName && (
              <p className="truncate text-[12px] text-[#4a483f]">{imageName}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex w-full flex-col gap-[6px]">
            <label
              htmlFor="date"
              className="
                text-[13px]
                font-semibold
                leading-normal
                text-[#221f1a]
              "
            >
              Date
            </label>

            <div className="relative">
              <input
                id="date"
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
                hover:bg-[#0b1f3a]
                hover:text-white
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
              {saving ? "Saving..." : "Save Photo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
