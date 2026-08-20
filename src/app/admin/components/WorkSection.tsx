"use client";

import { useEffect, useMemo, useState } from "react";

import AddWorkModal, {
  WorkEntry,
} from "./AddWorkModal";

import EditWorkEntryModal from "./EditWorkEntryModal";

// =====================================================
// TYPES
// =====================================================

type Locale = "en" | "ne";

type WorkTranslation = {
  locale: Locale;

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

type Work = {
  _id: string;

  projectId: string;

  translations: WorkTranslation[];

  image: string;
  galleryImages: string[];

  ward: string;

  status: "Ongoing" | "Completed";

  completedDate?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

// =====================================================
// COMPONENT
// =====================================================

export default function WorkSection() {
  const [works, setWorks] = useState<Work[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedWork, setSelectedWork] =
    useState<Work | null>(null);

  // =====================================================
  // FETCH WORKS
  // =====================================================

  async function fetchWorks() {
    try {
      setLoading(true);

      const response = await fetch("/api/works", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch works",
        );
      }

      const result = await response.json();

      console.log(
        "Works API response:",
        result,
      );

      if (Array.isArray(result)) {
        setWorks(result);
      } else if (Array.isArray(result.data)) {
        setWorks(result.data);
      } else {
        setWorks([]);
      }
    } catch (error) {
      console.error(
        "Error fetching works:",
        error,
      );

      setWorks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorks();
  }, []);

  // =====================================================
  // GET TRANSLATION
  // =====================================================

  function getTranslation(
    work: Work,
    locale: Locale,
  ): WorkTranslation | undefined {
    return work.translations?.find(
      (translation) =>
        translation.locale === locale,
    );
  }

  // =====================================================
  // GET ENGLISH
  // =====================================================

  function getEnglishTranslation(
    work: Work,
  ): WorkTranslation | undefined {
    return getTranslation(work, "en");
  }

  // =====================================================
  // GET NEPALI
  // =====================================================

  function getNepaliTranslation(
    work: Work,
  ): WorkTranslation | undefined {
    return getTranslation(work, "ne");
  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const searchValue =
        search.toLowerCase().trim();

      const english =
        getEnglishTranslation(work);

      const title =
        english?.title?.toLowerCase() || "";

      const projectId =
        work.projectId?.toLowerCase() || "";

      const location =
        english?.location?.toLowerCase() || "";

      const category =
        english?.category?.toLowerCase() || "";

      const eventType =
        english?.eventTypes?.toLowerCase() || "";

      const eventCategory =
        english?.eventCategory?.toLowerCase() ||
        "";

      const ward =
        work.ward?.toLowerCase() || "";

      const searchMatch =
        !searchValue ||
        title.includes(searchValue) ||
        projectId.includes(searchValue) ||
        location.includes(searchValue) ||
        category.includes(searchValue) ||
        eventType.includes(searchValue) ||
        eventCategory.includes(searchValue) ||
        ward.includes(searchValue);

      const statusMatch =
        status === "All" ||
        work.status === status;

      return searchMatch && statusMatch;
    });
  }, [works, search, status]);

  // =====================================================
  // ADD WORK
  // =====================================================

  async function handleAddWork(
    work: WorkEntry,
  ) {
    try {
      // =================================================
      // GET ENGLISH + NEPALI TRANSLATIONS
      // =================================================

      const english =
        work.translations.find(
          (translation) =>
            translation.locale === "en",
        );

      const nepali =
        work.translations.find(
          (translation) =>
            translation.locale === "ne",
        );

      if (!english || !nepali) {
        throw new Error(
          "Both English and Nepali translations are required.",
        );
      }

      // =================================================
      // PREPARE API DATA
      // =================================================

      const apiWork = {
        projectId: work.projectId,

        translations: [
          // =============================================
          // ENGLISH
          // =============================================

          {
            locale: "en",

            title: english.title,
            description: english.description,

            // These belong to English translation
            category: english.category,
            location: english.location,
            eventTypes: english.eventTypes,
            eventCategory:
              english.eventCategory,

            problem: english.problem,
            action: english.action,
            outcome: english.outcome,
          },

          // =============================================
          // NEPALI
          // =============================================

          {
            locale: "ne",

            title: nepali.title,
            description: nepali.description,

            // These belong to Nepali translation
            category: nepali.category,
            location: nepali.location,
            eventTypes: nepali.eventTypes,
            eventCategory:
              nepali.eventCategory,

            problem: nepali.problem,
            action: nepali.action,
            outcome: nepali.outcome,
          },
        ],

        // =============================================
        // COMMON INFORMATION
        // =============================================

        image: work.image,

        galleryImages:
          work.galleryImages,

        ward: work.ward,

        status: work.status,

        completedDate:
          work.completedDate || null,
      };

      // =================================================
      // DEBUG - DATA ACTUALLY SENT TO API
      // =================================================

      console.log(
        "SENDING WORK TO API:",
        JSON.stringify(
          apiWork,
          null,
          2,
        ),
      );

      // =================================================
      // SEND TO API
      // =================================================

      const response = await fetch(
        "/api/works",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(apiWork),
        },
      );

      // =================================================
      // API RESPONSE
      // =================================================

      const data =
        await response.json();

      console.log(
        "Create work response:",
        data,
      );

      // =================================================
      // HANDLE API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create work",
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setShowAddModal(false);

      await fetchWorks();

      alert(
        "Work created successfully!",
      );
    } catch (error) {
      console.error(
        "Create work error:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create work",
      );
    }
  }

  // =====================================================
  // OPEN EDIT
  // =====================================================

  function handleEdit(work: Work) {
    setSelectedWork(work);

    setShowEditModal(true);
  }

  // =====================================================
  // UPDATE WORK
  // =====================================================

  async function handleUpdateWork(
    updatedWork: Work,
  ) {
    if (!selectedWork) return;

    try {
      // =================================================
      // ORIGINAL PROJECT ID
      // =================================================

      const originalProjectId =
        selectedWork.projectId;

      // =================================================
      // UPDATE API
      // =================================================

      const response = await fetch(
        `/api/works/${encodeURIComponent(
          originalProjectId,
        )}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedWork,
          ),
        },
      );

      // =================================================
      // RESPONSE
      // =================================================

      const data =
        await response.json();

      console.log(
        "Update work response:",
        data,
      );

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update work",
        );
      }

      // =================================================
      // REFRESH
      // =================================================

      setShowEditModal(false);

      setSelectedWork(null);

      await fetchWorks();

      alert(
        "Work updated successfully!",
      );
    } catch (error) {
      console.error(
        "Update work error:",
        error,
      );

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

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this work?",
      );

    if (!confirmed) return;

    try {
      // =================================================
      // FIND WORK
      // =================================================

      const workToDelete =
        works.find(
          (work) =>
            work._id === id,
        );

      if (!workToDelete) {
        throw new Error(
          "Work not found",
        );
      }

      // =================================================
      // DELETE
      // =================================================

      const response =
        await fetch(
          `/api/works/${encodeURIComponent(
            workToDelete.projectId,
          )}`,
          {
            method: "DELETE",
          },
        );

      // =================================================
      // RESPONSE
      // =================================================

      const data =
        await response.json();

      console.log(
        "Delete work response:",
        data,
      );

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete work",
        );
      }

      // =================================================
      // UPDATE STATE
      // =================================================

      setWorks(
        (previousWorks) =>
          previousWorks.filter(
            (work) =>
              work._id !== id,
          ),
      );

      alert(
        "Work deleted successfully!",
      );
    } catch (error) {
      console.error(
        "Delete work error:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete work",
      );
    }
  }

  // =====================================================
  // CLOSE EDIT
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

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

        <div>
          <h2 className="font-['Libre_Baskerville'] text-[28px] font-bold text-[#221f1a]">
            Manage Work
          </h2>

          <p className="mt-1 text-[14px] text-[#4a483f]">
            Create, edit, and remove
            development project entries
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
            transition
            hover:bg-[#72112f]
          "
        >
          + Add Work
        </button>
      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row">

        <input
          type="text"
          placeholder="Search work by title, location, category or project ID..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
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
            sm:w-[400px]
          "
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value,
            )
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
            text-[#221f1a]
            outline-none
            focus:border-[#8a1538]
            sm:w-[180px]
          "
        >
          <option value="All">
            Status: All
          </option>

          <option value="Ongoing">
            Ongoing
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-[12px] border border-[#e1d0cf] bg-white">

        {/* TABLE HEADER */}

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

          <Heading>
            PROJECT ID
          </Heading>

          <Heading>
            TITLE
          </Heading>

          <Heading>
            STATUS
          </Heading>

          <Heading>
            LOCATION
          </Heading>

          <Heading>
            DATE
          </Heading>

          <Heading>
            ACTIONS
          </Heading>
        </div>

        {/* =================================================
            LOADING / EMPTY / DATA
        ================================================= */}

        {loading ? (
          <div className="p-8 text-center text-sm text-[#4a483f]">
            Loading works...
          </div>
        ) : filteredWorks.length ===
          0 ? (
          <div className="p-8 text-center text-sm text-[#4a483f]">
            No works found.
          </div>
        ) : (
          filteredWorks.map(
            (work) => {
              const english =
                getEnglishTranslation(
                  work,
                );

              return (
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

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  {work.image ? (
                    <img
                      src={work.image}
                      alt={
                        english?.title ||
                        "Work"
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

                  {/* =================================================
                      PROJECT ID
                  ================================================= */}

                  <p className="text-[13px] text-[#4a483f]">
                    {work.projectId}
                  </p>

                  {/* =================================================
                      TITLE
                  ================================================= */}

                  <div>
                    <p className="text-[14px] font-semibold text-[#221f1a]">
                      {english?.title ||
                        "Untitled work"}
                    </p>

                    <p className="mt-1 text-[11px] text-[#8a1538]">
                      {
                        work
                          .translations
                          ?.length
                      }{" "}
                      languages
                    </p>

                    {english?.category && (
                      <p className="mt-1 text-[11px] text-[#77736a]">
                        {
                          english.category
                        }
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div className="my-2 md:my-0">
                    <StatusBadge
                      status={
                        work.status
                      }
                    />
                  </div>

                  {/* =================================================
                      LOCATION
                  ================================================= */}

                  <div>
                    <p className="text-[13px] text-[#4a483f]">
                      {english?.location ||
                        "-"}
                    </p>

                    {work.ward && (
                      <p className="mt-1 text-[11px] text-[#77736a]">
                        {
                          work.ward
                        }
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      DATE
                  ================================================= */}

                  <p className="text-[13px] text-[#4a483f]">
                    {formatMonth(
                      work.completedDate,
                    )}
                  </p>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="mt-3 flex gap-2 md:mt-0">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          work,
                        )
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
                        hover:bg-[#0b1f3a]/5
                      "
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          work._id,
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
                        hover:bg-[#b3261e]/5
                      "
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            },
          )
        )}
      </div>

      {/* =================================================
          ADD MODAL
      ================================================= */}

      {showAddModal && (
        <AddWorkModal
          onClose={() =>
            setShowAddModal(false)
          }
          onSave={
            handleAddWork
          }
        />
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {showEditModal &&
        selectedWork && (
          <EditWorkEntryModal
            work={selectedWork}
            onClose={
              handleCloseEditModal
            }
            onSave={
              handleUpdateWork
            }
          />
        )}
    </section>
  );
}

// =====================================================
// HEADING
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
// STATUS
// =====================================================

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

// =====================================================
// DATE
// =====================================================

function formatMonth(
  date?: string | null,
) {
  if (!date) return "-";

  const parsedDate =
    new Date(date);

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
      year: "numeric",
    },
  );
}