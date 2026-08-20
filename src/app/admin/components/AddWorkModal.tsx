"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

// =====================================================
// TYPES
// =====================================================

export type WorkTranslation = {
  locale: "en" | "ne";

  title: string;
  description: string;

  category: string;
  location: string;
  eventTypes: string;
  eventCategory: string;

  problem: string;
  action: string;
  outcome: string;
};

export type WorkEntry = {
  projectId: string;

  translations: WorkTranslation[];

  // Images
  image: string;
  galleryImages: string[];

  // Common information
  ward: string;
  status: "Ongoing" | "Completed" | "";
  completedDate: string;
};

type AddWorkModalProps = {
  onClose: () => void;
  onSave?: (work: WorkEntry) => void;
};

// =====================================================
// EMPTY TRANSLATION
// =====================================================

function createEmptyTranslation(
  locale: "en" | "ne",
): WorkTranslation {
  return {
    locale,

    title: "",
    description: "",

    category: "",
    location: "",
    eventTypes: "",
    eventCategory: "",

    problem: "",
    action: "",
    outcome: "",
  };
}

// =====================================================
// CONSTANT OPTIONS
// =====================================================

const CATEGORY_OPTIONS = [
  "Infrastructure",
  "Education",
  "Health",
  "Agriculture",
  "Disaster Relief",
  "Youth Programs",
];

const EVENT_TYPE_OPTIONS = [
  "Project",
  "Event",
  "Program",
  "Visit",
];

// =====================================================
// COMPONENT
// =====================================================

export default function AddWorkModal({
  onClose,
  onSave,
}: AddWorkModalProps) {
  // ===================================================
  // LANGUAGE
  // ===================================================

  const [activeLanguage, setActiveLanguage] =
    useState<"en" | "ne">("en");

  // ===================================================
  // FORM
  // ===================================================

  const [form, setForm] = useState<WorkEntry>({
    projectId: "",

    translations: [
      createEmptyTranslation("en"),
      createEmptyTranslation("ne"),
    ],

    image: "",
    galleryImages: [],

    ward: "",
    status: "",
    completedDate: "",
  });

  // ===================================================
  // IMAGE STATE
  // ===================================================

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  // ===================================================
  // ERROR
  // ===================================================

  const [error, setError] = useState("");

  // =====================================================
  // GET TRANSLATION
  // =====================================================

  function getTranslation(
    locale: "en" | "ne",
  ): WorkTranslation {
    return (
      form.translations.find(
        (translation) =>
          translation.locale === locale,
      ) ||
      createEmptyTranslation(locale)
    );
  }

  // =====================================================
  // UPDATE TRANSLATION
  // =====================================================

  function handleTranslationChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      translations: prev.translations.map(
        (translation) =>
          translation.locale === activeLanguage
            ? {
                ...translation,
                [name]: value,
              }
            : translation,
      ),
    }));
  }

  // =====================================================
  // UPDATE COMMON FIELD
  // =====================================================

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  async function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      e.target.files || [],
    );

    if (files.length === 0) {
      return;
    }

    const currentCount =
      form.galleryImages.length;

    // -------------------------------------------------
    // MAXIMUM 3 IMAGES
    // -------------------------------------------------

    if (currentCount + files.length > 3) {
      setError(
        "You can upload a maximum of 3 images.",
      );

      e.target.value = "";

      return;
    }

    // -------------------------------------------------
    // VALIDATE FILES
    // -------------------------------------------------

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(
          "Only image files are allowed.",
        );

        e.target.value = "";

        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          `"${file.name}" is larger than 5MB.`,
        );

        e.target.value = "";

        return;
      }
    }

    // -------------------------------------------------
    // UPLOAD
    // -------------------------------------------------

    try {
      setError("");
      setUploadingImage(true);

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();

        formData.append("image", file);
        formData.append("folder", "works");

        const response = await fetch(
          "/api/cloudinary/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        console.log(
          "Cloudinary upload response:",
          data,
        );

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to upload image.",
          );
        }

        if (!data?.url) {
          throw new Error(
            "Cloudinary did not return an image URL.",
          );
        }

        uploadedUrls.push(data.url);
      }

      // -------------------------------------------------
      // UPDATE FORM
      // -------------------------------------------------

      setForm((prev) => {
        const newImages = [
          ...prev.galleryImages,
          ...uploadedUrls,
        ].slice(0, 3);

        return {
          ...prev,

          // First image = main image
          image: newImages[0] || "",

          galleryImages: newImages,
        };
      });

      // Select first newly uploaded image
      setSelectedImage(
        currentCount < 3
          ? currentCount
          : 0,
      );
    } catch (error) {
      console.error(
        "Work image upload error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image.",
      );
    } finally {
      setUploadingImage(false);

      e.target.value = "";
    }
  }

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  function removeImage(index: number) {
    setForm((prev) => {
      const newImages =
        prev.galleryImages.filter(
          (_, imageIndex) =>
            imageIndex !== index,
        );

      return {
        ...prev,

        galleryImages: newImages,

        // First image is always main
        image: newImages[0] || "",
      };
    });

    setSelectedImage((current) => {
      if (index === current) {
        return 0;
      }

      if (index < current) {
        return current - 1;
      }

      return current;
    });
  }

  // =====================================================
  // SELECT IMAGE
  // =====================================================

  function selectImage(index: number) {
    setSelectedImage(index);
  }

  // =====================================================
  // VALIDATE TRANSLATION
  // =====================================================

  function validateTranslation(
    translation: WorkTranslation,
    languageName: string,
  ): string | null {
    if (!translation.title.trim()) {
      return `${languageName} title is required.`;
    }

    if (!translation.description.trim()) {
      return `${languageName} description is required.`;
    }

    if (!translation.category.trim()) {
      return `${languageName} category is required.`;
    }

    if (!translation.location.trim()) {
      return `${languageName} location is required.`;
    }

    if (!translation.eventTypes.trim()) {
      return `${languageName} event type is required.`;
    }

    if (!translation.eventCategory.trim()) {
      return `${languageName} event category is required.`;
    }

    if (!translation.problem.trim()) {
      return `${languageName} problem is required.`;
    }

    if (!translation.action.trim()) {
      return `${languageName} action is required.`;
    }

    if (!translation.outcome.trim()) {
      return `${languageName} outcome is required.`;
    }

    return null;
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  function handleSubmit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setError("");

    // ---------------------------------------------------
    // IMAGE UPLOAD CHECK
    // ---------------------------------------------------

    if (uploadingImage) {
      setError(
        "Please wait until image upload finishes.",
      );

      return;
    }

    // ---------------------------------------------------
    // GET TRANSLATIONS
    // ---------------------------------------------------

    const english = getTranslation("en");
    const nepali = getTranslation("ne");

    // ===================================================
    // COMMON VALIDATION
    // ===================================================

    if (!form.projectId.trim()) {
      setError("Project ID is required.");

      return;
    }

    if (!form.ward.trim()) {
      setError("Ward is required.");

      return;
    }

    if (!form.status) {
      setError("Status is required.");

      return;
    }

    // ===================================================
    // ENGLISH VALIDATION
    // ===================================================

    const englishError =
      validateTranslation(
        english,
        "English",
      );

    if (englishError) {
      setError(englishError);

      setActiveLanguage("en");

      return;
    }

    // ===================================================
    // NEPALI VALIDATION
    // ===================================================

    const nepaliError =
      validateTranslation(
        nepali,
        "Nepali",
      );

    if (nepaliError) {
      setError(nepaliError);

      setActiveLanguage("ne");

      return;
    }

    // ===================================================
    // IMAGE VALIDATION
    // ===================================================

    if (form.galleryImages.length === 0) {
      setError(
        "Please upload at least one image.",
      );

      return;
    }

    if (form.galleryImages.length > 3) {
      setError(
        "Maximum 3 images are allowed.",
      );

      return;
    }

    // ===================================================
    // FINAL FORM
    // ===================================================

    const finalForm: WorkEntry = {
      projectId: form.projectId.trim(),

      translations: [
        {
          locale: "en",

          title: english.title.trim(),

          description:
            english.description.trim(),

          category:
            english.category.trim(),

          location:
            english.location.trim(),

          eventTypes:
            english.eventTypes.trim(),

          eventCategory:
            english.eventCategory.trim(),

          problem:
            english.problem.trim(),

          action:
            english.action.trim(),

          outcome:
            english.outcome.trim(),
        },

        {
          locale: "ne",

          title: nepali.title.trim(),

          description:
            nepali.description.trim(),

          category:
            nepali.category.trim(),

          location:
            nepali.location.trim(),

          eventTypes:
            nepali.eventTypes.trim(),

          eventCategory:
            nepali.eventCategory.trim(),

          problem:
            nepali.problem.trim(),

          action:
            nepali.action.trim(),

          outcome:
            nepali.outcome.trim(),
        },
      ],

      image:
        form.galleryImages[0],

      galleryImages:
        form.galleryImages,

      ward:
        form.ward.trim(),

      status:
        form.status,

      completedDate:
        form.completedDate,
    };

   console.log(
  "FINAL WORK DATA:",
  JSON.stringify(finalForm, null, 2),
);

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    onSave?.(finalForm);
  }

  // =====================================================
  // CURRENT TRANSLATION
  // =====================================================

  const currentTranslation =
    getTranslation(activeLanguage);

  // =====================================================
  // CURRENT IMAGE PREVIEW
  // =====================================================

  const currentPreview =
    form.galleryImages[selectedImage] ||
    form.galleryImages[0] ||
    "";

  // =====================================================
  // RENDER
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
        bg-black/30
        p-4
      "
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !uploadingImage
        ) {
          onClose();
        }
      }}
    >
      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[16px]
          bg-white
          shadow-[0px_12px_32px_rgba(0,0,0,0.18)]
        "
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="max-h-[90vh] overflow-y-auto px-10 py-9">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-[22px] font-bold text-[#221F1A]">
                Add Work Entry
              </h2>

              <button
                type="button"
                onClick={onClose}
                disabled={uploadingImage}
                className="
                  cursor-pointer
                  text-[25px]
                  font-semibold
                  leading-none
                  text-[#4A483F]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                ×
              </button>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

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

            {/* =================================================
                LANGUAGE TABS
            ================================================= */}

            <div className="mb-6 border-b border-[#E1D0CF]">
              <div className="flex gap-8">

                {/* ENGLISH */}

                <button
                  type="button"
                  onClick={() => {
                    setActiveLanguage("en");
                    setError("");
                  }}
                  className={`
                    relative
                    pb-3
                    text-[14px]
                    font-semibold
                    ${
                      activeLanguage === "en"
                        ? "text-[#8A1538]"
                        : "text-[#77736A]"
                    }
                  `}
                >
                  English

                  {activeLanguage === "en" && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#8A1538]" />
                  )}
                </button>

                {/* NEPALI */}

                <button
                  type="button"
                  onClick={() => {
                    setActiveLanguage("ne");
                    setError("");
                  }}
                  className={`
                    relative
                    pb-3
                    text-[14px]
                    font-semibold
                    ${
                      activeLanguage === "ne"
                        ? "text-[#8A1538]"
                        : "text-[#77736A]"
                    }
                  `}
                >
                  नेपाली

                  {activeLanguage === "ne" && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#8A1538]" />
                  )}
                </button>

              </div>
            </div>

            {/* =================================================
                TRANSLATED CONTENT
            ================================================= */}

            <div className="mb-6">

              {/* LANGUAGE INFO */}

              <div className="mb-4 rounded-[8px] bg-[#F7F6F3] px-4 py-3">
                <p className="text-[12px] font-semibold text-[#8A1538]">
                  {activeLanguage === "en"
                    ? "English Content"
                    : "नेपाली सामग्री"}
                </p>

                <p className="mt-1 text-[11px] text-[#77736A]">
                  {activeLanguage === "en"
                    ? "Enter the work information in English."
                    : "काम सम्बन्धी जानकारी नेपालीमा लेख्नुहोस्।"}
                </p>
              </div>

              {/* TITLE */}

              <Field
                label={
                  activeLanguage === "en"
                    ? "Title"
                    : "शीर्षक"
                }
                name="title"
                value={
                  currentTranslation.title
                }
                onChange={
                  handleTranslationChange
                }
                placeholder={
                  activeLanguage === "en"
                    ? "e.g. Rural Road Blacktopping Project"
                    : "उदाहरण: ग्रामीण सडक कालोपत्रे आयोजना"
                }
              />

              {/* DESCRIPTION */}

              <TextAreaField
                label={
                  activeLanguage === "en"
                    ? "Description"
                    : "विवरण"
                }
                name="description"
                value={
                  currentTranslation.description
                }
                onChange={
                  handleTranslationChange
                }
                placeholder={
                  activeLanguage === "en"
                    ? "Enter project description"
                    : "आयोजनाको विवरण लेख्नुहोस्"
                }
                rows={4}
              />

              {/* CATEGORY + EVENT TYPE */}

              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                <SelectField
                  label={
                    activeLanguage === "en"
                      ? "Category"
                      : "श्रेणी"
                  }
                  name="category"
                  value={
                    currentTranslation.category
                  }
                  onChange={
                    handleTranslationChange
                  }
                  options={
                    CATEGORY_OPTIONS
                  }
                  placeholder={
                    activeLanguage === "en"
                      ? "Select category"
                      : "श्रेणी छान्नुहोस्"
                  }
                />

                <SelectField
                  label={
                    activeLanguage === "en"
                      ? "Event Type"
                      : "कार्यक्रमको प्रकार"
                  }
                  name="eventTypes"
                  value={
                    currentTranslation.eventTypes
                  }
                  onChange={
                    handleTranslationChange
                  }
                  options={
                    EVENT_TYPE_OPTIONS
                  }
                  placeholder={
                    activeLanguage === "en"
                      ? "Select type"
                      : "प्रकार छान्नुहोस्"
                  }
                />

              </div>

              {/* EVENT CATEGORY + LOCATION */}

              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                <SelectField
                  label={
                    activeLanguage === "en"
                      ? "Event Category"
                      : "कार्यक्रमको श्रेणी"
                  }
                  name="eventCategory"
                  value={
                    currentTranslation.eventCategory
                  }
                  onChange={
                    handleTranslationChange
                  }
                  options={
                    CATEGORY_OPTIONS
                  }
                  placeholder={
                    activeLanguage === "en"
                      ? "Select category"
                      : "श्रेणी छान्नुहोस्"
                  }
                />

                <Field
                  label={
                    activeLanguage === "en"
                      ? "Location"
                      : "स्थान"
                  }
                  name="location"
                  value={
                    currentTranslation.location
                  }
                  onChange={
                    handleTranslationChange
                  }
                  placeholder={
                    activeLanguage === "en"
                      ? "e.g. Ward 4, Deurali"
                      : "उदाहरण: वडा ४, देउराली"
                  }
                />

              </div>

              {/* PROBLEM */}

              <TextAreaField
                label={
                  activeLanguage === "en"
                    ? "Problem"
                    : "समस्या"
                }
                name="problem"
                value={
                  currentTranslation.problem
                }
                onChange={
                  handleTranslationChange
                }
                placeholder={
                  activeLanguage === "en"
                    ? "Enter problem description"
                    : "समस्याको विवरण लेख्नुहोस्"
                }
                rows={4}
              />

              {/* ACTION + OUTCOME */}

              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Field
                  label={
                    activeLanguage === "en"
                      ? "Action"
                      : "कार्य"
                  }
                  name="action"
                  value={
                    currentTranslation.action
                  }
                  onChange={
                    handleTranslationChange
                  }
                  placeholder={
                    activeLanguage === "en"
                      ? "Enter action"
                      : "गरिएको कार्य लेख्नुहोस्"
                  }
                />

                <Field
                  label={
                    activeLanguage === "en"
                      ? "Outcome"
                      : "नतिजा"
                  }
                  name="outcome"
                  value={
                    currentTranslation.outcome
                  }
                  onChange={
                    handleTranslationChange
                  }
                  placeholder={
                    activeLanguage === "en"
                      ? "Enter outcome"
                      : "नतिजा लेख्नुहोस्"
                  }
                />

              </div>

            </div>

            {/* =================================================
                COMMON INFORMATION
            ================================================= */}

            <div className="mb-5 border-t border-[#E1D0CF] pt-6">

              <div className="mb-5">
                <h3 className="font-serif text-[17px] font-bold text-[#221F1A]">
                  Project Information
                </h3>

                <p className="mt-1 text-[11px] text-[#77736A]">
                  These details are shared between
                  English and Nepali.
                </p>
              </div>

              {/* PROJECT ID */}

              <Field
                label="Project ID"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                placeholder="e.g. WRK-014"
              />

              {/* STATUS */}

              <div className="mb-5">
                <label className="mb-[6px] block text-[13px] font-semibold text-[#221F1A]">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-[8px]
                    border
                    border-[#E1D0CF]
                    px-[14px]
                    text-[14px]
                    outline-none
                    focus:border-[#8A1538]
                  "
                >
                  <option value="">
                    Select status
                  </option>

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>

              {/* WARD */}

              <Field
                label="Ward"
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="e.g. Ward 4"
              />

              {/* COMPLETED DATE */}

              <Field
                label="Completed Date"
                name="completedDate"
                type="date"
                value={
                  form.completedDate
                }
                onChange={handleChange}
              />

            </div>

            {/* =================================================
                IMAGE GALLERY
            ================================================= */}

            <div className="mb-6">

              {/* HEADER */}

              <div className="mb-[6px] flex items-center justify-between">

                <label className="block text-[13px] font-semibold text-[#221F1A]">
                  Photos
                </label>

                <span className="text-[11px] text-[#77736A]">
                  {form.galleryImages.length}
                  /3
                </span>

              </div>

              {/* MAIN PREVIEW */}

              <div
                className="
                  mb-3
                  flex
                  h-[220px]
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[8px]
                  border
                  border-[#E1D0CF]
                  bg-[#F7F6F3]
                "
              >

                {uploadingImage ? (
                  <span className="text-[13px] text-[#4A483F]">
                    Uploading image...
                  </span>
                ) : currentPreview ? (
                  <img
                    src={currentPreview}
                    alt="Work preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-[#4A483F]">

                    <div className="mb-2 text-[24px]">
                      🖼
                    </div>

                    <p className="text-[13px]">
                      No image selected
                    </p>

                  </div>
                )}

              </div>

              {/* THUMBNAILS */}

              {form.galleryImages.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-3">

                  {form.galleryImages.map(
                    (url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="relative"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            selectImage(index)
                          }
                          className={`
                            relative
                            h-[80px]
                            w-full
                            overflow-hidden
                            rounded-[8px]
                            border-2
                            ${
                              selectedImage ===
                              index
                                ? "border-[#8A1538]"
                                : "border-[#E1D0CF]"
                            }
                          `}
                        >

                          <img
                            src={url}
                            alt={`Work image ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />

                          {/* MAIN LABEL */}

                          {index === 0 && (
                            <span
                              className="
                                absolute
                                bottom-1
                                left-1
                                rounded
                                bg-black/60
                                px-1.5
                                py-0.5
                                text-[9px]
                                text-white
                              "
                            >
                              Main
                            </span>
                          )}

                        </button>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          disabled={
                            uploadingImage
                          }
                          className="
                            absolute
                            -right-1.5
                            -top-1.5
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-red-600
                            text-[12px]
                            font-bold
                            text-white
                            shadow
                            hover:bg-red-700
                            disabled:opacity-50
                          "
                        >
                          ×
                        </button>

                      </div>
                    ),
                  )}

                </div>
              )}

              {/* UPLOAD */}

              {form.galleryImages.length < 3 && (
                <>
                  <label
                    htmlFor="add-work-images"
                    className={`
                      flex
                      h-[90px]
                      w-full
                      flex-col
                      items-center
                      justify-center
                      rounded-[8px]
                      border
                      border-dashed
                      border-[#E1D0CF]
                      bg-[#F7F6F3]
                      text-[#4A483F]
                      ${
                        uploadingImage
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-[#F1EFEB]"
                      }
                    `}
                  >

                    <span className="mb-1 text-[20px]">
                      ⬆
                    </span>

                    <span className="text-[13px]">
                      {uploadingImage
                        ? "Uploading..."
                        : "Click to upload photos"}
                    </span>

                    <span className="mt-1 text-[11px] text-[#77736A]">
                      JPG, PNG • Max 5MB each •
                      Up to 3 photos
                    </span>

                  </label>

                  <input
                    id="add-work-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleImageChange
                    }
                    disabled={
                      uploadingImage
                    }
                    className="hidden"
                  />
                </>
              )}

              {/* MAXIMUM MESSAGE */}

              {form.galleryImages.length === 3 && (
                <p className="text-[11px] text-[#77736A]">
                  Maximum of 3 photos reached.
                </p>
              )}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex justify-end gap-3">

              {/* CANCEL */}

              <button
                type="button"
                onClick={onClose}
                disabled={uploadingImage}
                className="
                  rounded-[8px]
                  border-[1.5px]
                  border-[#0B1F3A]
                  bg-white
                  px-6
                  py-[14px]
                  text-[16px]
                  font-semibold
                  text-[#0B1F3A]
                  hover:bg-[#0B1F3A]/5
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* SAVE */}

              <button
                type="submit"
                disabled={uploadingImage}
                className="
                  rounded-[8px]
                  bg-[#8A1538]
                  px-6
                  py-[14px]
                  text-[16px]
                  font-semibold
                  text-white
                  hover:bg-[#72112F]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {uploadingImage
                  ? "Uploading..."
                  : "Save Work"}
              </button>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================
// FIELD
// =====================================================

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
    e: ChangeEvent<HTMLInputElement>,
  ) => void;

  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="mb-5">

      <label
        htmlFor={name}
        className="
          mb-[6px]
          block
          text-[13px]
          font-semibold
          text-[#221F1A]
        "
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
        className="
          h-11
          w-full
          rounded-[8px]
          border
          border-[#E1D0CF]
          px-[14px]
          text-[14px]
          outline-none
          placeholder:text-[#4A483F]
          focus:border-[#8A1538]
        "
      />

    </div>
  );
}

// =====================================================
// TEXTAREA
// =====================================================

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;

  onChange: (
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => void;

  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="mb-5">

      <label
        htmlFor={name}
        className="
          mb-[6px]
          block
          text-[13px]
          font-semibold
          text-[#221F1A]
        "
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full
          resize-none
          rounded-[8px]
          border
          border-[#E1D0CF]
          px-[14px]
          py-3
          text-[14px]
          outline-none
          focus:border-[#8A1538]
        "
      />

    </div>
  );
}

// =====================================================
// SELECT
// =====================================================

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
    e: ChangeEvent<HTMLSelectElement>,
  ) => void;

  options: string[];
  placeholder: string;
}) {
  return (
    <div className="mb-5">

      <label
        htmlFor={name}
        className="
          mb-[6px]
          block
          text-[13px]
          font-semibold
          text-[#221F1A]
        "
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="
          h-11
          w-full
          rounded-[8px]
          border
          border-[#E1D0CF]
          px-[14px]
          text-[14px]
          outline-none
          focus:border-[#8A1538]
        "
      >

        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}