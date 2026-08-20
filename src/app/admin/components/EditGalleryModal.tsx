"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type GalleryTranslation = {
  locale: "en" | "ne";
  title: string;
  category: string;
};

type Gallery = {
  _id: string;
  translations: GalleryTranslation[];
  image: string;
  date: string;
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
  // =====================================================
  // FORM STATE
  // =====================================================

  const [englishTitle, setEnglishTitle] = useState("");
  const [nepaliTitle, setNepaliTitle] = useState("");

  const [englishCategory, setEnglishCategory] = useState("");
  const [nepaliCategory, setNepaliCategory] = useState("");

  const [date, setDate] = useState("");

  // Current Cloudinary URL
  const [image, setImage] = useState("");

  // Image preview
  const [imagePreview, setImagePreview] = useState("");

  // Newly selected image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // LOAD GALLERY DATA
  // =====================================================

  useEffect(() => {
    if (!gallery) {
      return;
    }

    const english = gallery.translations?.find(
      (translation) => translation.locale === "en",
    );

    const nepali = gallery.translations?.find(
      (translation) => translation.locale === "ne",
    );

    // English
    setEnglishTitle(english?.title || "");
    setEnglishCategory(english?.category || "");

    // Nepali
    setNepaliTitle(nepali?.title || "");
    setNepaliCategory(nepali?.category || "");

    // Date
    if (gallery.date) {
      const galleryDate = new Date(gallery.date);

      if (!Number.isNaN(galleryDate.getTime())) {
        setDate(galleryDate.toISOString().split("T")[0]);
      } else {
        setDate("");
      }
    } else {
      setDate("");
    }

    // Image
    setImage(gallery.image || "");
    setImagePreview(gallery.image || "");

    // Reset selected image
    setSelectedImage(null);

    // Reset error
    setError("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [gallery]);

  // =====================================================
  // CLEANUP PREVIEW URL
  // =====================================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  function handleClose() {
    if (loading) {
      return;
    }

    setError("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  }

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    // Validate image size
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setSelectedImage(file);

    // Revoke previous temporary preview
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  // =====================================================
  // UPLOAD IMAGE TO CLOUDINARY
  // =====================================================

  async function uploadImageToCloudinary(
    file: File,
  ): Promise<string> {
    const formData = new FormData();

    formData.append("image", file);
    formData.append("folder", "gallery");

    const response = await fetch(
      "/api/cloudinary/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data?.error ||
          data?.message ||
          "Failed to upload image.",
      );
    }

    if (!data.url) {
      throw new Error(
        "Cloudinary did not return an image URL.",
      );
    }

    return data.url;
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!gallery) {
      return;
    }

    setError("");

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!englishTitle.trim()) {
      setError("English title is required.");
      return;
    }

    if (!nepaliTitle.trim()) {
      setError("Nepali title is required.");
      return;
    }

    if (!englishCategory.trim()) {
      setError("English category is required.");
      return;
    }

    if (!nepaliCategory.trim()) {
      setError("Nepali category is required.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // KEEP CURRENT IMAGE
      // =================================================

      let imageUrl = image;

      // =================================================
      // UPLOAD NEW IMAGE
      // =================================================

      if (selectedImage) {
        setUploading(true);

        imageUrl =
          await uploadImageToCloudinary(
            selectedImage,
          );

        setUploading(false);
      }

      // =================================================
      // UPDATE GALLERY
      // =================================================

      const response = await fetch(
        `/api/gallery/${gallery._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            translations: [
              {
                locale: "en",
                title: englishTitle.trim(),
                category: englishCategory.trim(),
              },
              {
                locale: "ne",
                title: nepaliTitle.trim(),
                category: nepaliCategory.trim(),
              },
            ],
            image: imageUrl,
            date: date || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update gallery.",
        );
      }

      if (!data.data) {
        throw new Error(
          "Gallery was updated but no updated data was returned.",
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert("Gallery updated successfully!");

      onUpdated(data.data);

      onClose();
    } catch (error) {
      console.error(
        "Update gallery error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the gallery.",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  // =====================================================
  // DON'T RENDER
  // =====================================================

  if (!isOpen || !gallery) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-[600px]
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-xl
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-5
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-semibold
                text-gray-900
              "
            >
              Edit Gallery
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Update English and Nepali
              gallery information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close modal"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-2xl
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            ×
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div
            className="
              max-h-[70vh]
              space-y-5
              overflow-y-auto
              px-6
              py-6
            "
          >
            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            {/* =================================================
                ENGLISH TITLE
            ================================================= */}

            <div>
              <label
                htmlFor="gallery-title-en"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                English Title
              </label>

              <input
                id="gallery-title-en"
                type="text"
                value={englishTitle}
                onChange={(e) =>
                  setEnglishTitle(
                    e.target.value,
                  )
                }
                disabled={loading}
                placeholder="Enter English title"
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-[#8A1538]
                  focus:ring-1
                  focus:ring-[#8A1538]
                  disabled:bg-gray-100
                "
              />
            </div>

            {/* =================================================
                NEPALI TITLE
            ================================================= */}

            <div>
              <label
                htmlFor="gallery-title-ne"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Nepali Title
              </label>

              <input
                id="gallery-title-ne"
                type="text"
                value={nepaliTitle}
                onChange={(e) =>
                  setNepaliTitle(
                    e.target.value,
                  )
                }
                disabled={loading}
                placeholder="नेपाली शीर्षक लेख्नुहोस्"
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-[#8A1538]
                  focus:ring-1
                  focus:ring-[#8A1538]
                  disabled:bg-gray-100
                "
              />
            </div>

            {/* =================================================
                ENGLISH CATEGORY
            ================================================= */}

            <div>
              <label
                htmlFor="gallery-category-en"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                English Category
              </label>

              <select
                id="gallery-category-en"
                value={englishCategory}
                onChange={(e) =>
                  setEnglishCategory(
                    e.target.value,
                  )
                }
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-[#8A1538]
                  focus:ring-1
                  focus:ring-[#8A1538]
                  disabled:bg-gray-100
                "
              >
                <option value="">
                  Select category
                </option>

                <option value="Events">
                  Events
                </option>

                <option value="Development">
                  Development
                </option>

                <option value="Meetings">
                  Meetings
                </option>

                <option value="Community">
                  Community
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* =================================================
                NEPALI CATEGORY
            ================================================= */}

            <div>
              <label
                htmlFor="gallery-category-ne"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Nepali Category
              </label>

              <select
                id="gallery-category-ne"
                value={nepaliCategory}
                onChange={(e) =>
                  setNepaliCategory(
                    e.target.value,
                  )
                }
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-[#8A1538]
                  focus:ring-1
                  focus:ring-[#8A1538]
                  disabled:bg-gray-100
                "
              >
                <option value="">
                  श्रेणी चयन गर्नुहोस्
                </option>

                <option value="कार्यक्रम">
                  कार्यक्रम
                </option>

                <option value="विकास">
                  विकास
                </option>

                <option value="बैठक">
                  बैठक
                </option>

                <option value="समुदाय">
                  समुदाय
                </option>

                <option value="अन्य">
                  अन्य
                </option>
              </select>
            </div>

            {/* =================================================
                DATE
            ================================================= */}

            <div>
              <label
                htmlFor="gallery-date"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Date
              </label>

              <input
                id="gallery-date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-[#8A1538]
                  focus:ring-1
                  focus:ring-[#8A1538]
                  disabled:bg-gray-100
                "
              />
            </div>

            {/* =================================================
                IMAGE
            ================================================= */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={loading}
                className="
                  flex
                  h-48
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-dashed
                  border-gray-300
                  bg-gray-50
                  transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={
                      englishTitle ||
                      "Gallery preview"
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-xl">
                      ⬆
                    </div>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                      "
                    >
                      Click to upload image
                    </p>
                  </div>
                )}
              </button>

              <p
                className="
                  mt-2
                  text-xs
                  text-gray-500
                "
              >
                Select a new image only if
                you want to replace the current
                one. Maximum 5MB.
              </p>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              border-t
              px-6
              py-4
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                rounded-lg
                border
                border-gray-300
                px-5
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-lg
                bg-[#8A1538]
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#74122f]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {uploading
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}