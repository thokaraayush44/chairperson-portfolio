"use client";

import { useEffect, useMemo, useState } from "react";
import AddGalleryModal from "./AddGalleryModal";
import EditGalleryModal from "./EditGalleryModal";

type Gallery = {
  _id: string;
  title: string;
  image: string;
  category: string;
  date: string;
};

export default function PressGallerySection() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit modal
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ================================
  // Fetch Gallery
  // ================================
  async function fetchGallery() {
    try {
      setLoading(true);

      const response = await fetch("/api/gallery");

      if (!response.ok) {
        throw new Error("Failed to fetch gallery");
      }

      const data = await response.json();

      console.log("Gallery API response:", data);

      if (Array.isArray(data)) {
        setGallery(data);
      } else if (Array.isArray(data.data)) {
        setGallery(data.data);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // Initial Fetch
  // ================================
  useEffect(() => {
    fetchGallery();
  }, []);

  // ================================
  // Search
  // ================================
  const filteredGallery = useMemo(() => {
    const query = search.toLowerCase().trim();

    return gallery.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [gallery, search]);

  // ================================
  // Open Edit Modal
  // ================================
  function handleEdit(item: Gallery) {
    setEditingGallery(item);
    setShowEditModal(true);
  }

  // ================================
  // Close Edit Modal
  // ================================
  function handleCloseEdit() {
    setShowEditModal(false);
    setEditingGallery(null);
  }

  // ================================
  // After Gallery Updated
  // ================================
  function handleGalleryUpdated(updatedGallery: Gallery) {
    setGallery((prev) =>
      prev.map((item) =>
        item._id === updatedGallery._id
          ? updatedGallery
          : item
      )
    );

    handleCloseEdit();
  }

  // ================================
  // Delete Gallery Photo
  // ================================
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      // Remove deleted item from UI
      setGallery((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete photo.");
    }
  }

  return (
    <>
      <section className="flex flex-col gap-7">
        {/* ================================
            Header
        ================================= */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-['Libre_Baskerville'] text-[28px] font-bold text-[#221f1a]">
              Manage Press Gallery
            </h2>

            <p className="mt-1 text-[14px] text-[#4a483f]">
              Create, edit, and remove press photos shown on the public site
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
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

        {/* ================================
            Search
        ================================= */}
        <input
          type="text"
          placeholder="Search press photos by caption or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        {/* ================================
            Table
        ================================= */}
        <div className="overflow-hidden rounded-[12px] border border-[#e1d0cf] bg-white">
          {/* Table Header */}
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

            <Heading>CAPTION</Heading>

            <Heading>EVENT / CATEGORY</Heading>

            <Heading>DATE</Heading>

            <Heading>ACTIONS</Heading>
          </div>

          {/* ================================
              Loading
          ================================= */}
          {loading ? (
            <div className="p-8 text-center text-sm text-[#4a483f]">
              Loading gallery...
            </div>
          ) : filteredGallery.length === 0 ? (
            /* ================================
               Empty State
            ================================= */
            <div className="p-8 text-center text-sm text-[#4a483f]">
              No photos found.
            </div>
          ) : (
            /* ================================
               Gallery Rows
            ================================= */
            filteredGallery.map((item) => (
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
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                    mb-3
                    h-14
                    w-14
                    rounded-[8px]
                    object-cover
                    md:mb-0
                  "
                />

                {/* Caption */}
                <p className="text-[14px] font-semibold text-[#221f1a]">
                  {item.title}
                </p>

                {/* Category */}
                <p className="text-[13px] text-[#4a483f]">
                  {item.category}
                </p>

                {/* Date */}
                <p className="text-[13px] text-[#4a483f]">
                  {formatDate(item.date)}
                </p>

                {/* Actions */}
                <div className="mt-3 flex gap-2 md:mt-0">
                  {/* ================================
                      EDIT
                  ================================= */}
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
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

                  {/* ================================
                      DELETE
                  ================================= */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
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
            ))
          )}
        </div>
      </section>

      {/* ================================
          Add Gallery Modal
      ================================= */}
      {showAddModal && (
        <AddGalleryModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchGallery();
          }}
        />
      )}

      {/* ================================
          Edit Gallery Modal
      ================================= */}
      {showEditModal && editingGallery && (
        <EditGalleryModal
          gallery={editingGallery}
          isOpen={showEditModal}
          onClose={handleCloseEdit}
          onUpdated={handleGalleryUpdated}
        />
      )}
    </>
  );
}

// ========================================
// Table Heading Component
// ========================================
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

// ========================================
// Format Date
// ========================================
function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}