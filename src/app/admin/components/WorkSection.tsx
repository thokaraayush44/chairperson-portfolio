"use client";

import { useEffect, useMemo, useState } from "react";
import AddWorkModal from "./AddWorkModal";
import EditWorkEntryModal from "./EditWorkEntryModal";

type Work = {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  image?: string;
  galleryImages?: string[];
  category?: string;
  ward?: string;
  status: "Ongoing" | "Completed";
  completedDate?: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
};

export default function WorkSection() {
  const [works, setWorks] = useState<Work[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);

  // =====================================================
  // ADD MODAL
  // =====================================================

  const [showAddModal, setShowAddModal] = useState(false);

  // =====================================================
  // EDIT MODAL
  // =====================================================

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  // =====================================================
  // FETCH WORKS
  // =====================================================

  async function fetchWorks() {
    try {
      setLoading(true);

      const response = await fetch("/api/works");

      if (!response.ok) {
        throw new Error("Failed to fetch works");
      }

      const data = await response.json();

      console.log("Works API response:", data);

      if (Array.isArray(data)) {
        setWorks(data);
      } else if (Array.isArray(data.data)) {
        setWorks(data.data);
      } else {
        setWorks([]);
      }
    } catch (error) {
      console.error("Error fetching works:", error);
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorks();
  }, []);

  // =====================================================
  // FILTER WORKS
  // =====================================================

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const searchValue = search.toLowerCase();

      const searchMatch =
        work.title.toLowerCase().includes(searchValue) ||
        work.projectId.toLowerCase().includes(searchValue);

      const statusMatch =
        status === "All" || work.status === status;

      return searchMatch && statusMatch;
    });
  }, [works, search, status]);

  // =====================================================
  // ADD WORK
  // =====================================================

  async function handleAddWork(work: any) {
    try {
      const response = await fetch("/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(work),
      });

      const data = await response.json();

      console.log("Create work response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create work",
        );
      }

      setShowAddModal(false);

      await fetchWorks();

      alert("Work created successfully!");
    } catch (error) {
      console.error("Create work error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create work",
      );
    }
  }

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  function handleEdit(work: Work) {
    setSelectedWork(work);
    setShowEditModal(true);
  }

  // =====================================================
  // UPDATE WORK
  // =====================================================

  async function handleUpdateWork(updatedWork: Partial<Work>) {
    if (!selectedWork) return;

    try {
      /*
       * Remove projectId and undefined values.
       *
       * This allows partial updates:
       *
       * {
       *   image: "new-image.jpg"
       * }
       *
       * or:
       *
       * {
       *   title: "New title",
       *   status: "Completed"
       * }
       */

      const updates = Object.fromEntries(
        Object.entries(updatedWork).filter(
          ([key, value]) =>
            key !== "projectId" &&
            key !== "_id" &&
            value !== undefined,
        ),
      );

      // Make sure something is actually being updated
      if (Object.keys(updates).length === 0) {
        alert("No changes were made.");
        return;
      }

      console.log("Sending PATCH update:", updates);

      /*
       * IMPORTANT:
       *
       * The API route is:
       *
       * /api/works/[projectId]
       *
       * Therefore we use selectedWork.projectId,
       * NOT selectedWork._id.
       */

      const response = await fetch(
        `/api/works/${selectedWork.projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        },
      );

      const data = await response.json();

      console.log("Update work response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update work",
        );
      }

      // =================================================
      // UPDATE TABLE IMMEDIATELY
      // =================================================

      if (data.data) {
        setWorks((prev) =>
          prev.map((work) =>
            work._id === selectedWork._id
              ? data.data
              : work,
          ),
        );
      } else {
        await fetchWorks();
      }

      // =================================================
      // CLOSE MODAL
      // =================================================

      setShowEditModal(false);
      setSelectedWork(null);

      alert("Work updated successfully!");
    } catch (error) {
      console.error("Update work error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update work",
      );
    }
  }

  // =====================================================
  // DELETE WORK
  // =====================================================

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this work?",
    );

    if (!confirmed) return;

    try {
      /*
       * The table gives us MongoDB _id,
       * but the API route expects projectId.
       */

      const workToDelete = works.find(
        (work) => work._id === id,
      );

      if (!workToDelete) {
        throw new Error("Work not found");
      }

      const response = await fetch(
        `/api/works/${workToDelete.projectId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      console.log("Delete work response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete work",
        );
      }

      // Remove from table immediately
      setWorks((prev) =>
        prev.filter((work) => work._id !== id),
      );

      alert("Work deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete work",
      );
    }
  }

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  function handleCloseEditModal() {
    setShowEditModal(false);
    setSelectedWork(null);
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section className="flex flex-col gap-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-['Libre_Baskerville'] text-[28px] font-bold text-[#221f1a]">
            Manage Work
          </h2>

          <p className="mt-1 text-[14px] text-[#4a483f]">
            Create, edit, and remove development project entries
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
            transition
            hover:bg-[#72112f]
          "
        >
          + Add Work
        </button>
      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}

        <input
          type="text"
          placeholder="Search work by title or project ID..."
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
            sm:w-[320px]
          "
        />

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            h-[44px]
            w-full
            rounded-[8px]
            border
            border-[#e1d0cf]
            bg-white
            px-4
            text-[14px]
            text-[#221f1a]
            outline-none
            focus:border-[#8a1538]
            sm:w-[180px]
          "
        >
          <option value="All">Status: All</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-[12px] border border-[#e1d0cf] bg-white">
        {/* Table Header */}

        <div
          className="
            hidden
            h-[44px]
            items-center
            bg-[#f7f6f3]
            px-4
            md:grid
            md:grid-cols-[64px_76px_260px_108px_160px_108px_176px]
            md:gap-[10px]
          "
        >
          <div />

          <Heading>PROJECT ID</Heading>

          <Heading>TITLE</Heading>

          <Heading>STATUS</Heading>

          <Heading>LOCATION</Heading>

          <Heading>DATE</Heading>

          <Heading>ACTIONS</Heading>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="p-8 text-center text-sm text-[#4a483f]">
            Loading works...
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#4a483f]">
            No works found.
          </div>
        ) : (
          filteredWorks.map((work) => (
            <div
              key={work._id}
              className="
                border-t
                border-[#e1d0cf]
                px-4
                py-4
                md:grid
                md:min-h-[88px]
                md:grid-cols-[64px_76px_260px_108px_160px_108px_176px]
                md:items-center
                md:gap-[10px]
              "
            >
              {/* Image */}

              {work.image ? (
                <img
                  src={work.image}
                  alt={work.title}
                  className="
                    mb-3
                    h-14
                    w-14
                    rounded-[8px]
                    object-cover
                    md:mb-0
                  "
                />
              ) : (
                <div
                  className="
                    mb-3
                    h-14
                    w-14
                    rounded-[8px]
                    bg-[#c8c6bf]
                    md:mb-0
                  "
                />
              )}

              {/* Project ID */}

              <p className="text-[13px] text-[#4a483f]">
                {work.projectId}
              </p>

              {/* Title */}

              <p className="text-[14px] font-semibold text-[#221f1a]">
                {work.title}
              </p>

              {/* Status */}

              <div className="my-2 md:my-0">
                <StatusBadge status={work.status} />
              </div>

              {/* Location */}

              <p className="text-[13px] text-[#4a483f]">
                {work.location}
              </p>

              {/* Date */}

              <p className="text-[13px] text-[#4a483f]">
                {formatMonth(work.completedDate)}
              </p>

              {/* Actions */}

              <div className="mt-3 flex gap-2 md:mt-0">
                {/* EDIT */}

                <button
                  type="button"
                  onClick={() => handleEdit(work)}
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
                    hover:bg-[#0b1f3a]/5
                  "
                >
                  Edit
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() => handleDelete(work._id)}
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
                    hover:bg-[#b3261e]/5
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =====================================================
          ADD WORK MODAL
      ===================================================== */}

      {showAddModal && (
        <AddWorkModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddWork}
        />
      )}

      {/* =====================================================
          EDIT WORK MODAL
      ===================================================== */}

      {showEditModal && selectedWork && (
        <EditWorkEntryModal
          work={selectedWork}
          onClose={handleCloseEditModal}
          onSave={handleUpdateWork}
        />
      )}
    </section>
  );
}

/* =====================================================
   TABLE HEADING
===================================================== */

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

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status,
}: {
  status: "Ongoing" | "Completed";
}) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-[5px]
        text-[12px]
        font-semibold
        text-white
        ${
          status === "Completed"
            ? "bg-[#2f7d4f]"
            : "bg-[#c9992a]"
        }
      `}
    >
      {status}
    </span>
  );
}

/* =====================================================
   FORMAT DATE
===================================================== */

function formatMonth(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}