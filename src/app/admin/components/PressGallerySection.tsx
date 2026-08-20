"use client";

import { useEffect, useMemo, useState } from "react";
import AddGalleryModal from "./AddGalleryModal";
import EditGalleryModal from "./EditGalleryModal";

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

export default function PressGallerySection() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // ADD MODAL
  // =====================================================

  const [showAddModal, setShowAddModal] = useState(false);

  // =====================================================
  // EDIT MODAL
  // =====================================================

  const [editingGallery, setEditingGallery] =
    useState<Gallery | null>(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  // =====================================================
  // GET ENGLISH TRANSLATION
  // =====================================================

  function getEnglishTranslation(item: Gallery) {
    return item.translations?.find(
      (translation) =>
        translation.locale === "en",
    );
  }

  // =====================================================
  // GET NEPALI TRANSLATION
  // =====================================================

  function getNepaliTranslation(item: Gallery) {
    return item.translations?.find(
      (translation) =>
        translation.locale === "ne",
    );
  }

  // =====================================================
  // GET ENGLISH TITLE
  // =====================================================

  function getEnglishTitle(item: Gallery) {
    return (
      getEnglishTranslation(item)?.title || ""
    );
  }

  // =====================================================
  // GET NEPALI TITLE
  // =====================================================

  function getNepaliTitle(item: Gallery) {
    return (
      getNepaliTranslation(item)?.title || ""
    );
  }

  // =====================================================
  // GET ENGLISH CATEGORY
  // =====================================================

  function getEnglishCategory(item: Gallery) {
    return (
      getEnglishTranslation(item)?.category ||
      ""
    );
  }

  // =====================================================
  // GET NEPALI CATEGORY
  // =====================================================

  function getNepaliCategory(item: Gallery) {
    return (
      getNepaliTranslation(item)?.category ||
      ""
    );
  }

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  async function fetchGallery() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/gallery",
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch gallery",
        );
      }

      const data = await response.json();

      console.log(
        "Gallery API response:",
        data,
      );

      if (Array.isArray(data)) {
        setGallery(data);
      } else if (
        Array.isArray(data.data)
      ) {
        setGallery(data.data);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error(
        "Error fetching gallery:",
        error,
      );

      setGallery([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredGallery = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return gallery.filter((item) => {
      const englishTitle =
        getEnglishTitle(item).toLowerCase();

      const nepaliTitle =
        getNepaliTitle(item).toLowerCase();

      const englishCategory =
        getEnglishCategory(item).toLowerCase();

      const nepaliCategory =
        getNepaliCategory(item).toLowerCase();

      return (
        englishTitle.includes(query) ||
        nepaliTitle.includes(query) ||
        englishCategory.includes(query) ||
        nepaliCategory.includes(query)
      );
    });
  }, [gallery, search]);

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  function handleEdit(item: Gallery) {
    setEditingGallery(item);
    setShowEditModal(true);
  }

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  function handleCloseEdit() {
    setShowEditModal(false);
    setEditingGallery(null);
  }

  // =====================================================
  // AFTER GALLERY UPDATED
  // =====================================================

  function handleGalleryUpdated(
    updatedGallery: Gallery,
  ) {
    setGallery((prev) =>
      prev.map((item) =>
        item._id === updatedGallery._id
          ? updatedGallery
          : item,
      ),
    );

    handleCloseEdit();
  }

  // =====================================================
  // DELETE GALLERY PHOTO
  // =====================================================

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this photo?",
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/gallery/${id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data?.message ||
            "Failed to delete photo",
        );
      }

      setGallery((prev) =>
        prev.filter(
          (item) => item._id !== id,
        ),
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error,
      );

      alert(
        "Failed to delete photo.",
      );
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <section className="flex flex-col gap-7">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-['Libre_Baskerville'] text-[28px] font-bold text-[#221f1a]">
              Manage Press Gallery
            </h2>

            <p className="mt-1 text-[14px] text-[#4a483f]">
              Create, edit, and remove press
              photos shown on the public site
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowAddModal(true)
            }
            className="
              rounded-[8px]
              bg-[#8a1538]
              px-6
              py-[14px]
              text-[16px]
              font-semibold
              text-white
              hover:bg-[#72112f]
            "
          >
            + Add Photo
          </button>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <input
          type="text"
          placeholder="Search press photos by caption or category..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            h-[44px]
            w-full
            rounded-[8px]
            border
            border-[#e1d0cf]
            bg-white
            px-4
            text-[14px]
            outline-none
            placeholder:text-[#4a483f]
            focus:border-[#8a1538]
            sm:w-[360px]
          "
        />

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-[12px] border border-[#e1d0cf] bg-white">
          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <div
            className="
              hidden
              h-[44px]
              items-center
              bg-[#f7f6f3]
              px-5
              md:grid
              md:grid-cols-[64px_280px_1fr_120px_176px]
              md:gap-3
            "
          >
            <div />

            <Heading>
              CAPTION
            </Heading>

            <Heading>
              EVENT / CATEGORY
            </Heading>

            <Heading>
              DATE
            </Heading>

            <Heading>
              ACTIONS
            </Heading>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="p-8 text-center text-sm text-[#4a483f]">
              Loading gallery...
            </div>
          ) : filteredGallery.length ===
            0 ? (
            /* =================================================
                EMPTY
            ================================================= */

            <div className="p-8 text-center text-sm text-[#4a483f]">
              No photos found.
            </div>
          ) : (
            /* =================================================
                ROWS
            ================================================= */

            filteredGallery.map((item) => {
              const englishTitle =
                getEnglishTitle(item);

              const nepaliTitle =
                getNepaliTitle(item);

              const englishCategory =
                getEnglishCategory(item);

              const nepaliCategory =
                getNepaliCategory(item);

              return (
                <div
                  key={item._id}
                  className="
                    border-t
                    border-[#e1d0cf]
                    px-5
                    py-4
                    md:grid
                    md:min-h-[88px]
                    md:grid-cols-[64px_280px_1fr_120px_176px]
                    md:items-center
                    md:gap-3
                  "
                >
                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <img
                    src={item.image}
                    alt={
                      englishTitle ||
                      "Gallery photo"
                    }
                    className="
                      mb-3
                      h-14
                      w-14
                      rounded-[8px]
                      object-cover
                      md:mb-0
                    "
                  />

                  {/* =================================================
                      CAPTION
                  ================================================= */}

                  <div>
                    <p className="text-[14px] font-semibold text-[#221f1a]">
                      {englishTitle ||
                        "No English title"}
                    </p>

                    {nepaliTitle && (
                      <p className="mt-1 text-[13px] text-[#77736a]">
                        {nepaliTitle}
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      CATEGORY
                  ================================================= */}

                  <div>
                    <p className="text-[13px] font-medium text-[#4a483f]">
                      {englishCategory ||
                        "No English category"}
                    </p>

                    {nepaliCategory && (
                      <p className="mt-1 text-[12px] text-[#77736a]">
                        {nepaliCategory}
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      DATE
                  ================================================= */}

                  <p className="text-[13px] text-[#4a483f]">
                    {formatDate(
                      item.date,
                    )}
                  </p>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="mt-3 flex gap-2 md:mt-0">
                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="
                        rounded-[6px]
                        border
                        border-[#0b1f3a]
                        px-[14px]
                        py-2
                        text-[13px]
                        font-semibold
                        text-[#0b1f3a]
                        transition
                        hover:bg-[#0b1f3a]
                        hover:text-white
                      "
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item._id,
                        )
                      }
                      className="
                        rounded-[6px]
                        border
                        border-[#b3261e]
                        px-[14px]
                        py-2
                        text-[13px]
                        font-semibold
                        text-[#b3261e]
                        transition
                        hover:bg-[#b3261e]
                        hover:text-white
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* =================================================
          ADD GALLERY MODAL
      ================================================= */}

      {showAddModal && (
        <AddGalleryModal
          onClose={() =>
            setShowAddModal(false)
          }
          onSuccess={() => {
            setShowAddModal(false);
            fetchGallery();
          }}
        />
      )}

      {/* =================================================
          EDIT GALLERY MODAL
      ================================================= */}

      {showEditModal &&
        editingGallery && (
          <EditGalleryModal
            gallery={editingGallery}
            isOpen={showEditModal}
            onClose={handleCloseEdit}
            onUpdated={
              handleGalleryUpdated
            }
          />
        )}
    </>
  );
}

// =====================================================
// TABLE HEADING
// =====================================================

function Heading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[12px] font-semibold tracking-[0.4px] text-[#4a483f]">
      {children}
    </p>
  );
}

// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(date?: string) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}