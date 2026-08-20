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
  // English
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Nepali
  const [nepaliTitle, setNepaliTitle] = useState("");
  const [nepaliDescription, setNepaliDescription] = useState("");

  // Cloudinary URL
  const [image, setImage] = useState("");

  // Selected file before uploading
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imageName, setImageName] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setImageFile(file);
    setImageName(file.name);

    // Reset previous Cloudinary URL if user changes image
    setImage("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate all required fields
    if (
      !title.trim() ||
      !description.trim() ||
      !nepaliTitle.trim() ||
      !nepaliDescription.trim() ||
      !imageFile ||
      !date
    ) {
      alert("Please fill in all fields in both languages.");
      return;
    }

    try {
      setSaving(true);

      // =====================================================
      // STEP 1: Upload image to Cloudinary
      // =====================================================

      const formData = new FormData();

      formData.append("image", imageFile);
      formData.append("folder", "news");

      const uploadResponse = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      const imageUrl = uploadData.url;

      if (!imageUrl) {
        throw new Error("Cloudinary did not return an image URL");
      }

      setImage(imageUrl);

      console.log("Cloudinary image uploaded:", imageUrl);

      // =====================================================
      // STEP 2: Create News
      // =====================================================

      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          translations: [
            {
              locale: "en",
              title: title.trim(),
              description: description.trim(),
            },
            {
              locale: "ne",
              title: nepaliTitle.trim(),
              description: nepaliDescription.trim(),
            },
          ],
          image: imageUrl,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create news");
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      alert("News created successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Create news error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create news",
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
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[16px] bg-white px-[40px] py-[36px] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.18)]">
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

          {/* ================================================= */}
          {/* ENGLISH */}
          {/* ================================================= */}

          <div className="border-b border-[#e1d0cf] pb-5">
            <h3 className="mb-4 text-[16px] font-bold text-[#8a1538]">
              English
            </h3>

            {/* English Title */}
            <div className="mb-4 flex flex-col gap-[6px]">
              <label
                htmlFor="news-title-en"
                className="text-[13px] font-semibold text-[#221f1a]"
              >
                Title
              </label>

              <input
                id="news-title-en"
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

            {/* English Description */}
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="news-description-en"
                className="text-[13px] font-semibold text-[#221f1a]"
              >
                Description
              </label>

              <textarea
                id="news-description-en"
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
          </div>

          {/* ================================================= */}
          {/* NEPALI */}
          {/* ================================================= */}

          <div className="border-b border-[#e1d0cf] pb-5">
            <h3 className="mb-4 text-[16px] font-bold text-[#8a1538]">
              नेपाली
            </h3>

            {/* Nepali Title */}
            <div className="mb-4 flex flex-col gap-[6px]">
              <label
                htmlFor="news-title-ne"
                className="text-[13px] font-semibold text-[#221f1a]"
              >
                शीर्षक
              </label>

              <input
                id="news-title-ne"
                type="text"
                value={nepaliTitle}
                onChange={(e) => setNepaliTitle(e.target.value)}
                placeholder="समाचारको शीर्षक लेख्नुहोस्"
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

            {/* Nepali Description */}
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="news-description-ne"
                className="text-[13px] font-semibold text-[#221f1a]"
              >
                विवरण
              </label>

              <textarea
                id="news-description-ne"
                value={nepaliDescription}
                onChange={(e) => setNepaliDescription(e.target.value)}
                placeholder="समाचारको छोटो विवरण लेख्नुहोस्"
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
          </div>

          {/* ================================================= */}
          {/* IMAGE */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* DATE */}
          {/* ================================================= */}

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