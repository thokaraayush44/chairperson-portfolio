"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Gallery = {
  _id: string;
  title: string;
  image: string;
  category?: string;
  date?: string;
};

type EditGalleryModalProps = {
  gallery: Gallery | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedGallery: Gallery) => void;
};

export default function EditGalleryModal({
  gallery,
  isOpen,
  onClose,
  onUpdated,
}: EditGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load selected gallery data
  useEffect(() => {
    if (gallery) {
      setTitle(gallery.title || "");
      setCategory(gallery.category || "");

      // Format date for input[type="date"]
      if (gallery.date) {
        const formattedDate = new Date(gallery.date)
          .toISOString()
          .split("T")[0];

        setDate(formattedDate);
      } else {
        setDate("");
      }

      setImage(gallery.image || "");
      setImagePreview(gallery.image || "");
      setError("");
    }
  }, [gallery]);

  if (!isOpen || !gallery) {
    return null;
  }

  // Handle image URL
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setImage(value);
    setImagePreview(value);
  };

  // Submit PATCH request
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/gallery/${gallery._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          date: date || undefined,
          image: image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update gallery.");
      }

      onUpdated(data);

      onClose();
    } catch (error) {
      console.error("Update gallery error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Gallery
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update gallery information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="gallery-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title
              </label>

              <input
                id="gallery-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter gallery title"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="gallery-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="gallery-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
              >
                <option value="">Select category</option>
                <option value="Events">Events</option>
                <option value="Development">Development</option>
                <option value="Meetings">Meetings</option>
                <option value="Community">Community</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="gallery-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Date
              </label>

              <input
                id="gallery-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="gallery-image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>

              <input
                id="gallery-image"
                type="url"
                value={image}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Image Preview
                </p>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt={title || "Gallery preview"}
                    className="h-48 w-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#8A1538] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#74122f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}