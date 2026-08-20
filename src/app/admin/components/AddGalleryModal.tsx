"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";

// =====================================================
// TRANSLATION TYPE
// =====================================================

type GalleryTranslation = {
  locale: "en" | "ne";
  title: string;
  category: string;
};

// =====================================================
// PROPS
// =====================================================

type AddGalleryModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

// =====================================================
// EMPTY TRANSLATION
// =====================================================

const emptyTranslation = (
  locale: "en" | "ne",
): GalleryTranslation => ({
  locale,
  title: "",
  category: "",
});

// =====================================================
// COMPONENT
// =====================================================

export default function AddGalleryModal({
  onClose,
  onSuccess,
}: AddGalleryModalProps) {
  // ===================================================
  // LANGUAGE
  // ===================================================

  const [activeLanguage, setActiveLanguage] =
    useState<"en" | "ne">("en");

  // ===================================================
  // TRANSLATIONS
  // ===================================================

  const [translations, setTranslations] =
    useState<GalleryTranslation[]>([
      emptyTranslation("en"),
      emptyTranslation("ne"),
    ]);

  // ===================================================
  // COMMON FIELDS
  // ===================================================

  const [date, setDate] = useState("");

  // Cloudinary URL
  const [image, setImage] = useState("");

  // Local preview URL
  const [imagePreview, setImagePreview] =
    useState("");

  const [imageName, setImageName] =
    useState("");

  // ===================================================
  // STATES
  // ===================================================

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // GET CURRENT TRANSLATION
  // =====================================================

  function getTranslation(
    locale: "en" | "ne",
  ): GalleryTranslation {
    return (
      translations.find(
        (translation) =>
          translation.locale === locale,
      ) ||
      emptyTranslation(locale)
    );
  }

  // =====================================================
  // UPDATE TRANSLATION
  // =====================================================

  function handleTranslationChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setTranslations((prev) =>
      prev.map((translation) =>
        translation.locale === activeLanguage
          ? {
              ...translation,
              [name]: value,
            }
          : translation,
      ),
    );
  }

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate type

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");

      e.target.value = "";

      return;
    }

    // Validate size

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");

      e.target.value = "";

      return;
    }

    setImageName(file.name);

    // Local preview only

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
          "Failed to upload image to Cloudinary",
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

    const english = getTranslation("en");
    const nepali = getTranslation("ne");

    // =================================================
    // ENGLISH VALIDATION
    // =================================================

    if (!english.title.trim()) {
      alert("English caption is required.");

      setActiveLanguage("en");

      return;
    }

    if (!english.category.trim()) {
      alert("English category is required.");

      setActiveLanguage("en");

      return;
    }

    // =================================================
    // NEPALI VALIDATION
    // =================================================

    if (!nepali.title.trim()) {
      alert("Nepali caption is required.");

      setActiveLanguage("ne");

      return;
    }

    if (!nepali.category.trim()) {
      alert("Nepali category is required.");

      setActiveLanguage("ne");

      return;
    }

    // =================================================
    // IMAGE VALIDATION
    // =================================================

    const file =
      fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Please upload a photo.");

      return;
    }

    try {
      setSaving(true);

      // =================================================
      // UPLOAD IMAGE
      // =================================================

      setUploading(true);

      const cloudinaryUrl =
        await uploadImageToCloudinary(file);

      setUploading(false);

      // =================================================
      // FINAL TRANSLATIONS
      // =================================================

      const finalTranslations = [
        {
          locale: "en" as const,
          title: english.title.trim(),
          category: english.category.trim(),
        },
        {
          locale: "ne" as const,
          title: nepali.title.trim(),
          category: nepali.category.trim(),
        },
      ];

      // =================================================
      // SAVE GALLERY
      // =================================================

      const response = await fetch(
        "/api/gallery",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            translations:
              finalTranslations,

            image: cloudinaryUrl,

            date: date || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to save gallery photo",
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Gallery photo added successfully!",
      );

      // Reset

      setTranslations([
        emptyTranslation("en"),
        emptyTranslation("ne"),
      ]);

      setDate("");

      setImage("");

      setImagePreview("");

      setImageName("");

      setActiveLanguage("en");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();

      onClose();
    } catch (error) {
      console.error(
        "Error saving gallery photo:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save photo.",
      );
    } finally {
      setSaving(false);

      setUploading(false);
    }
  }

  // =====================================================
  // CURRENT TRANSLATION
  // =====================================================

  const currentTranslation =
    getTranslation(activeLanguage);

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
        bg-black/20
        px-4
        py-6
      "
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
      >
        <form
          onSubmit={handleSubmit}
          className="
            max-h-[90vh]
            overflow-y-auto
            px-10
            py-9
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-5 flex w-full items-center justify-between">
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
              disabled={saving}
              className="
                cursor-pointer
                text-[24px]
                font-semibold
                leading-none
                text-[#4a483f]
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
              LANGUAGE TABS
          ================================================= */}

          <div className="mb-6 border-b border-[#e1d0cf]">
            <div className="flex gap-8">

              {/* ENGLISH */}

              <button
                type="button"
                onClick={() => {
                  setActiveLanguage("en");
                }}
                className={`
                  relative
                  pb-3
                  text-[14px]
                  font-semibold
                  ${
                    activeLanguage === "en"
                      ? "text-[#8a1538]"
                      : "text-[#77736a]"
                  }
                `}
              >
                English

                {activeLanguage === "en" && (
                  <span
                    className="
                      absolute
                      bottom-[-1px]
                      left-0
                      right-0
                      h-[2px]
                      bg-[#8a1538]
                    "
                  />
                )}
              </button>

              {/* NEPALI */}

              <button
                type="button"
                onClick={() => {
                  setActiveLanguage("ne");
                }}
                className={`
                  relative
                  pb-3
                  text-[14px]
                  font-semibold
                  ${
                    activeLanguage === "ne"
                      ? "text-[#8a1538]"
                      : "text-[#77736a]"
                  }
                `}
              >
                नेपाली

                {activeLanguage === "ne" && (
                  <span
                    className="
                      absolute
                      bottom-[-1px]
                      left-0
                      right-0
                      h-[2px]
                      bg-[#8a1538]
                    "
                  />
                )}
              </button>

            </div>
          </div>

          {/* =================================================
              LANGUAGE INFORMATION
          ================================================= */}

          <div className="mb-6 rounded-[8px] bg-[#f7f6f3] px-4 py-3">

            <p className="text-[12px] font-semibold text-[#8a1538]">
              {activeLanguage === "en"
                ? "English Content"
                : "नेपाली सामग्री"}
            </p>

            <p className="mt-1 text-[11px] text-[#77736a]">
              {activeLanguage === "en"
                ? "Enter the press photo information in English."
                : "प्रेस फोटो सम्बन्धी जानकारी नेपालीमा लेख्नुहोस्।"}
            </p>

          </div>

          {/* =================================================
              CAPTION
          ================================================= */}

          <div className="mb-5 flex w-full flex-col gap-[6px]">

            <label
              htmlFor="gallery-title"
              className="
                text-[13px]
                font-semibold
                text-[#221f1a]
              "
            >
              {activeLanguage === "en"
                ? "Caption"
                : "क्याप्सन"}
            </label>

            <input
              id="gallery-title"
              name="title"
              type="text"
              value={currentTranslation.title}
              onChange={handleTranslationChange}
              placeholder={
                activeLanguage === "en"
                  ? "e.g. Health Post Inauguration, Ward 9"
                  : "उदाहरण: वडा ९ स्वास्थ्य चौकी उद्घाटन"
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
                placeholder:text-[#4a483f]
                focus:border-[#8a1538]
              "
            />

          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="mb-5 flex w-full flex-col gap-[6px]">

            <label
              htmlFor="gallery-category"
              className="
                text-[13px]
                font-semibold
                text-[#221f1a]
              "
            >
              {activeLanguage === "en"
                ? "Event / Category"
                : "कार्यक्रम / वर्ग"}
            </label>

            <select
              id="gallery-category"
              name="category"
              value={currentTranslation.category}
              onChange={handleTranslationChange}
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
              "
            >
              <option value="">
                {activeLanguage === "en"
                  ? "Select category"
                  : "वर्ग चयन गर्नुहोस्"}
              </option>

              {activeLanguage === "en" ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </select>

          </div>

          {/* =================================================
              PHOTO
          ================================================= */}

          <div className="mb-5 flex w-full flex-col gap-[6px]">

            <label
              htmlFor="photo"
              className="
                text-[13px]
                font-semibold
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
              disabled={saving}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={saving}
              className="
                flex
                h-[180px]
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <>
                  <span className="text-[20px]">
                    ⬆
                  </span>

                  <span className="text-[13px]">
                    Click to upload image
                  </span>
                </>
              )}
            </button>

            {imageName && (
              <p className="truncate text-[12px] text-[#4a483f]">
                {imageName}
              </p>
            )}

            <p className="text-[11px] text-[#77736a]">
              Maximum size: 5MB. Image will be
              uploaded to Cloudinary.
            </p>

          </div>

          {/* =================================================
              DATE
          ================================================= */}

          <div className="mb-6 flex w-full flex-col gap-[6px]">

            <label
              htmlFor="gallery-date"
              className="
                text-[13px]
                font-semibold
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
              "
            />

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

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
              {uploading
                ? "Uploading..."
                : saving
                  ? "Saving..."
                  : "Save Photo"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}