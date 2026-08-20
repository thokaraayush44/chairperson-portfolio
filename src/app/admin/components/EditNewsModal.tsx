"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type NewsTranslation = {
  locale: "en" | "ne";
  title: string;
  description: string;
};

type News = {
  _id: string;
  translations: NewsTranslation[];
  image?: string;
  date?: string;
};

type EditNewsModalProps = {
  news: News;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditNewsModal({
  news,
  onClose,
  onSuccess,
}: EditNewsModalProps) {
  // ============================================
  // ENGLISH
  // ============================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ============================================
  // NEPALI
  // ============================================

  const [nepaliTitle, setNepaliTitle] = useState("");
  const [nepaliDescription, setNepaliDescription] = useState("");

  // ============================================
  // IMAGE
  // ============================================

  const [image, setImage] = useState(news.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");

  // ============================================
  // DATE
  // ============================================

  const [date, setDate] = useState(
    formatDateForInput(news.date),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // KEEP FORM UPDATED
  // ============================================

  useEffect(() => {
    const english = news.translations?.find(
      (translation) => translation.locale === "en",
    );

    const nepali = news.translations?.find(
      (translation) => translation.locale === "ne",
    );

    setTitle(english?.title || "");
    setDescription(english?.description || "");

    setNepaliTitle(nepali?.title || "");
    setNepaliDescription(nepali?.description || "");

    setImage(news.image || "");
    setImageFile(null);
    setImageName("");

    setDate(formatDateForInput(news.date));
    setError("");
  }, [news]);

  // ============================================
  // IMAGE CHANGE
  // ============================================

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");

    setImageFile(file);
    setImageName(file.name);

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
  }

  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setError("");

    // English validation
    if (!title.trim()) {
      setError("English title cannot be empty.");
      return;
    }

    if (!description.trim()) {
      setError("English description cannot be empty.");
      return;
    }

    // Nepali validation
    if (!nepaliTitle.trim()) {
      setError("Nepali title cannot be empty.");
      return;
    }

    if (!nepaliDescription.trim()) {
      setError("Nepali description cannot be empty.");
      return;
    }

    // Date validation
    if (!date) {
      setError("Date cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = news.image || "";

      // =====================================================
      // STEP 1: Upload NEW image if selected
      // =====================================================

      if (imageFile) {
        const formData = new FormData();

        formData.append("image", imageFile);
        formData.append("folder", "news");

        const uploadResponse = await fetch(
          "/api/cloudinary/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadData.success
        ) {
          throw new Error(
            uploadData.error ||
              "Failed to upload new image",
          );
        }

        imageUrl = uploadData.url;

        if (!imageUrl) {
          throw new Error(
            "Cloudinary did not return an image URL",
          );
        }
      }

      // =====================================================
      // STEP 2: Update News
      // =====================================================

      const response = await fetch(
        `/api/news/${news._id}`,
        {
          method: "PATCH",
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
        },
      );

      const data = await response.json();

      console.log("Update news response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update news",
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      alert("News updated successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Update news error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update news",
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // RETURN
  // ============================================

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
        py-4
      "
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[16px]
          bg-white
          shadow-[0px_12px_32px_0px_rgba(0,0,0,0.18)]
        "
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="max-h-[90vh] overflow-y-auto px-[40px] py-[36px]">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">
              <h2
                className="
                  font-['Libre_Baskerville']
                  text-[22px]
                  font-bold
                  text-[#221f1a]
                "
              >
                Edit News Entry
              </h2>

              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="
                  cursor-pointer
                  text-[25px]
                  leading-none
                  text-[#4a483f]
                  transition
                  hover:text-[#221f1a]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* ERROR */}

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

            {/* ================================================= */}
            {/* ENGLISH */}
            {/* ================================================= */}

            <div className="mb-6 border-b border-[#e1d0cf] pb-6">
              <h3 className="mb-4 text-[16px] font-bold text-[#8a1538]">
                English
              </h3>

              {/* English Title */}

              <div className="mb-5 flex flex-col gap-[6px]">
                <label
                  htmlFor="edit-news-title-en"
                  className="
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  Title
                </label>

                <input
                  id="edit-news-title-en"
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  disabled={saving}
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
                    focus:border-[#8a1538]
                    disabled:bg-[#f7f6f3]
                  "
                />
              </div>

              {/* English Description */}

              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="edit-news-description-en"
                  className="
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  Description
                </label>

                <textarea
                  id="edit-news-description-en"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  disabled={saving}
                  className="
                    h-[110px]
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
                    focus:border-[#8a1538]
                    disabled:bg-[#f7f6f3]
                  "
                />
              </div>
            </div>

            {/* ================================================= */}
            {/* NEPALI */}
            {/* ================================================= */}

            <div className="mb-6 border-b border-[#e1d0cf] pb-6">
              <h3 className="mb-4 text-[16px] font-bold text-[#8a1538]">
                नेपाली
              </h3>

              {/* Nepali Title */}

              <div className="mb-5 flex flex-col gap-[6px]">
                <label
                  htmlFor="edit-news-title-ne"
                  className="
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  शीर्षक
                </label>

                <input
                  id="edit-news-title-ne"
                  type="text"
                  value={nepaliTitle}
                  onChange={(e) =>
                    setNepaliTitle(e.target.value)
                  }
                  disabled={saving}
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
                    focus:border-[#8a1538]
                    disabled:bg-[#f7f6f3]
                  "
                />
              </div>

              {/* Nepali Description */}

              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="edit-news-description-ne"
                  className="
                    text-[13px]
                    font-semibold
                    text-[#221f1a]
                  "
                >
                  विवरण
                </label>

                <textarea
                  id="edit-news-description-ne"
                  value={nepaliDescription}
                  onChange={(e) =>
                    setNepaliDescription(e.target.value)
                  }
                  disabled={saving}
                  className="
                    h-[110px]
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
                    focus:border-[#8a1538]
                    disabled:bg-[#f7f6f3]
                  "
                />
              </div>
            </div>

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <div className="mb-5 flex flex-col gap-[6px]">
              <label
                htmlFor="edit-news-image"
                className="
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Image
              </label>

              <label
                htmlFor="edit-news-image"
                className="
                  flex
                  h-[140px]
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
                {image ? (
                  <img
                    src={image}
                    alt="News preview"
                    className="h-full w-full object-cover"
                  />
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

              {imageName && (
                <p className="text-[12px] text-[#4a483f]">
                  Selected: {imageName}
                </p>
              )}

              <input
                id="edit-news-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="hidden"
              />
            </div>

            {/* ================================================= */}
            {/* DATE */}
            {/* ================================================= */}

            <div className="mb-6 flex flex-col gap-[6px]">
              <label
                htmlFor="edit-news-date"
                className="
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Date
              </label>

              <input
                id="edit-news-date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                disabled={saving}
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
                  disabled:bg-[#f7f6f3]
                "
              />
            </div>

            {/* FOOTER */}

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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================
   FORMAT DATE FOR INPUT
============================================ */

function formatDateForInput(date?: string) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
}