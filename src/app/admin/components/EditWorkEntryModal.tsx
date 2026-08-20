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
  // =====================================================
  // ENGLISH
  // =====================================================

  const [englishTitle, setEnglishTitle] = useState("");
  const [englishCategory, setEnglishCategory] =
    useState("");

  // =====================================================
  // NEPALI
  // =====================================================

  const [nepaliTitle, setNepaliTitle] = useState("");
  const [nepaliCategory, setNepaliCategory] =
    useState("");

  // =====================================================
  // IMAGE
  // =====================================================

  // Current Cloudinary URL
  const [image, setImage] = useState("");

  // Preview URL
  const [imagePreview, setImagePreview] =
    useState("");

  // New selected image
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  // =====================================================
  // DATE
  // =====================================================

  const [date, setDate] = useState("");

  // =====================================================
  // STATUS
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // LOAD GALLERY DATA
  // =====================================================

  useEffect(() => {
    if (!gallery) return;

    // ---------------------------------------------------
    // FIND ENGLISH TRANSLATION
    // ---------------------------------------------------

    const english =
      gallery.translations?.find(
        (translation) =>
          translation.locale === "en",
      );

    // ---------------------------------------------------
    // FIND NEPALI TRANSLATION
    // ---------------------------------------------------

    const nepali =
      gallery.translations?.find(
        (translation) =>
          translation.locale === "ne",
      );

    // ---------------------------------------------------
    // ENGLISH
    // ---------------------------------------------------

    setEnglishTitle(
      english?.title || "",
    );

    setEnglishCategory(
      english?.category || "",
    );

    // ---------------------------------------------------
    // NEPALI
    // ---------------------------------------------------

    setNepaliTitle(
      nepali?.title || "",
    );

    setNepaliCategory(
      nepali?.category || "",
    );

    // ---------------------------------------------------
    // DATE
    // ---------------------------------------------------

    if (gallery.date) {
      const parsedDate = new Date(
        gallery.date,
      );

      if (
        !Number.isNaN(
          parsedDate.getTime(),
        )
      ) {
        setDate(
          parsedDate
            .toISOString()
            .split("T")[0],
        );
      } else {
        setDate("");
      }
    } else {
      setDate("");
    }

    // ---------------------------------------------------
    // IMAGE
    // ---------------------------------------------------

    setImage(gallery.image || "");

    setImagePreview(
      gallery.image || "",
    );

    setSelectedImage(null);

    setError("");
  }, [gallery]);

  // =====================================================
  // CLOSE IF NOT OPEN
  // =====================================================

  if (!isOpen || !gallery) {
    return null;
  }

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    // ---------------------------------------------------
    // VALIDATE TYPE
    // ---------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setError(
        "Only image files are allowed.",
      );
      return;
    }

    // ---------------------------------------------------
    // VALIDATE SIZE
    // ---------------------------------------------------

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image must be smaller than 5MB.",
      );
      return;
    }

    setError("");

    // Store selected file
    setSelectedImage(file);

    // Create preview
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  // =====================================================
  // UPLOAD IMAGE TO CLOUDINARY
  // =====================================================

  async function uploadImageToCloudinary(
    file: File,
  ): Promise<string> {
    const formData = new FormData();

    formData.append(
      "image",
      file,
    );

    formData.append(
      "folder",
      "gallery",
    );

    const response =
      await fetch(
        "/api/cloudinary/upload",
        {
          method: "POST",
          body: formData,
        },
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data?.error ||
          "Failed to upload image",
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

    setError("");

    // ===================================================
    // VALIDATE ENGLISH
    // ===================================================

    if (!englishTitle.trim()) {
      setError(
        "English title is required.",
      );
      return;
    }

    if (!englishCategory.trim()) {
      setError(
        "English category is required.",
      );
      return;
    }

    // ===================================================
    // VALIDATE NEPALI
    // ===================================================

    if (!nepaliTitle.trim()) {
      setError(
        "Nepali title is required.",
      );
      return;
    }

    if (!nepaliCategory.trim()) {
      setError(
        "Nepali category is required.",
      );
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // KEEP CURRENT IMAGE
      // =================================================

      let imageUrl = image;

      // =================================================
      // UPLOAD NEW IMAGE IF SELECTED
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
      // PATCH GALLERY
      // =================================================

      const response =
        await fetch(
          `/api/gallery/${gallery._id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              translations: [
                {
                  locale: "en",
                  title:
                    englishTitle.trim(),
                  category:
                    englishCategory.trim(),
                },
                {
                  locale: "ne",
                  title:
                    nepaliTitle.trim(),
                  category:
                    nepaliCategory.trim(),
                },
              ],

              image: imageUrl,

              date:
                date || undefined,
            }),
          },
        );

      const data =
        await response.json();

      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data?.message ||
            "Failed to update gallery",
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Gallery updated successfully!",
      );

      // API returns:
      //
      // {
      //   success: true,
      //   message: "...",
      //   data: updatedGallery
      // }

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
          : "Something went wrong while updating.",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
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
        py-6
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
                font-['Libre_Baskerville']
                text-xl
                font-semibold
                text-[#221f1a]
              "
            >
              Edit Gallery
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[#4a483f]
              "
            >
              Update gallery information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-2xl
              text-[#4a483f]
              transition
              hover:bg-gray-100
              hover:text-[#221f1a]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close modal"
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
                ENGLISH SECTION
            ================================================= */}

            <div
              className="
                rounded-xl
                border
                border-[#e1d0cf]
                bg-[#faf9f7]
                p-4
              "
            >
              <h3
                className="
                  mb-4
                  text-sm
                  font-semibold
                  text-[#8A1538]
                "
              >
                English
              </h3>

              {/* ENGLISH TITLE */}

              <div className="mb-4">
                <label
                  htmlFor="gallery-english-title"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#221f1a]
                  "
                >
                  Title
                </label>

                <input
                  id="gallery-english-title"
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
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#221f1a]
                    outline-none
                    transition
                    focus:border-[#8A1538]
                    focus:ring-1
                    focus:ring-[#8A1538]
                    disabled:opacity-50
                  "
                />
              </div>

              {/* ENGLISH CATEGORY */}

              <div>
                <label
                  htmlFor="gallery-english-category"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#221f1a]
                  "
                >
                  Category
                </label>

                <select
                  id="gallery-english-category"
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
                    text-[#221f1a]
                    outline-none
                    transition
                    focus:border-[#8A1538]
                    focus:ring-1
                    focus:ring-[#8A1538]
                    disabled:opacity-50
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
            </div>

            {/* =================================================
                NEPALI SECTION
            ================================================= */}

            <div
              className="
                rounded-xl
                border
                border-[#e1d0cf]
                bg-[#faf9f7]
                p-4
              "
            >
              <h3
                className="
                  mb-4
                  text-sm
                  font-semibold
                  text-[#8A1538]
                "
              >
                नेपाली
              </h3>

              {/* NEPALI TITLE */}

              <div className="mb-4">
                <label
                  htmlFor="gallery-nepali-title"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#221f1a]
                  "
                >
                  शीर्षक
                </label>

                <input
                  id="gallery-nepali-title"
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
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#221f1a]
                    outline-none
                    transition
                    focus:border-[#8A1538]
                    focus:ring-1
                    focus:ring-[#8A1538]
                    disabled:opacity-50
                  "
                />
              </div>

              {/* NEPALI CATEGORY */}

              <div>
                <label
                  htmlFor="gallery-nepali-category"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-[#221f1a]
                  "
                >
                  वर्ग
                </label>

                <select
                  id="gallery-nepali-category"
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
                    text-[#221f1a]
                    outline-none
                    transition
                    focus:border-[#8A1538]
                    focus:ring-1
                    focus:ring-[#8A1538]
                    disabled:opacity-50
                  "
                >
                  <option value="">
                    वर्ग चयन गर्नुहोस्
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
                  text-[#221f1a]
                "
              >
                Date
              </label>

              <input
                id="gallery-date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
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
                  text-[#221f1a]
                  outline-none
                  transition
                  focus:border-[#8A1538]
                  focus:ring-1
                  focus:ring-[#8A1538]
                  disabled:opacity-50
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
                  text-[#221f1a]
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
                  disabled:opacity-50
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
                Select a new image only if you
                want to replace the current one.
                Maximum 5MB.
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
              onClick={onClose}
              disabled={loading}
              className="
                rounded-lg
                border
                border-[#0b1f3a]
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
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