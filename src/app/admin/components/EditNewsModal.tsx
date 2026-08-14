"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type News = {
  _id: string;
  title: string;
  description: string;
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
  const [title, setTitle] = useState(news.title || "");
  const [description, setDescription] = useState(news.description || "");
  const [image, setImage] = useState(news.image || "");
  const [imageName, setImageName] = useState("");
  const [date, setDate] = useState(formatDateForInput(news.date));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // KEEP FORM UPDATED WHEN NEWS CHANGES
  // ============================================

  useEffect(() => {
    setTitle(news.title || "");
    setDescription(news.description || "");
    setImage(news.image || "");
    setImageName("");
    setDate(formatDateForInput(news.date));
    setError("");
  }, [news]);

  // ============================================
  // IMAGE CHANGE
  // ============================================

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setImageName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    /*
     * PATCH allows partial updates.
     *
     * Therefore the user does NOT have to change
     * every field.
     *
     * However, if a field is intentionally cleared,
     * we still validate the required fields below.
     */

    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    if (!date) {
      setError("Date cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      /*
       * PATCH instead of PUT.
       *
       * The API will update only the fields we send.
       */

      const response = await fetch(`/api/news/${news._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          image: image || "",
          date,
        }),
      });

      const data = await response.json();

      console.log("Update news response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update news",
        );
      }

      alert("News updated successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update news error:", error);

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
        if (e.target === e.currentTarget && !saving) {
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
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="max-h-[90vh] overflow-y-auto px-[40px] py-[36px]">

            {/* ========================================
                HEADER
            ======================================== */}

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

            {/* ========================================
                ERROR
            ======================================== */}

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

            {/* ========================================
                TITLE
            ======================================== */}

            <div className="mb-5 flex flex-col gap-[6px]">
              <label
                htmlFor="edit-news-title"
                className="
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Title
              </label>

              <input
                id="edit-news-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

            {/* ========================================
                DESCRIPTION
            ======================================== */}

            <div className="mb-5 flex flex-col gap-[6px]">
              <label
                htmlFor="edit-news-description"
                className="
                  text-[13px]
                  font-semibold
                  text-[#221f1a]
                "
              >
                Description
              </label>

              <textarea
                id="edit-news-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

            {/* ========================================
                IMAGE
            ======================================== */}

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

            {/* ========================================
                DATE
            ======================================== */}

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
                onChange={(e) => setDate(e.target.value)}
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

            {/* ========================================
                FOOTER
            ======================================== */}

            <div className="flex w-full justify-end gap-3">
              {/* Cancel */}

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

              {/* Save */}

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