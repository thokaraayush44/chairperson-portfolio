import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";
import {
  SUPPORTED_LOCALES,
  Locale,
} from "@/lib/localization";

// =====================================================
// GET - Get all works
// =====================================================

export async function GET() {
  try {
    await connectDB();

    const works = await Work.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        data: works,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/works error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch works",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// POST - Create work
// =====================================================

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log(
  "========== API RECEIVED WORK =========="
);

console.log(
  JSON.stringify(body, null, 2)
);

console.log(
  "EN CATEGORY:",
  body.translations?.find(
    (t: any) => t.locale === "en"
  )?.category
);

console.log(
  "NE CATEGORY:",
  body.translations?.find(
    (t: any) => t.locale === "ne"
  )?.category
);

console.log(
  "======================================="
);

    const {
      projectId,
      translations,
      image,
      galleryImages,
      ward,
      status,
      completedDate,
    } = body;

    // =================================================
    // Validate projectId
    // =================================================

    if (!projectId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Validate translations array
    // =================================================

    if (
      !Array.isArray(translations) ||
      translations.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one translation is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Validate each translation
    // =================================================

    const requiredFields = [
      "title",
      "description",
      "category",
      "location",
      "eventTypes",
      "eventCategory",
      "problem",
      "action",
      "outcome",
    ];

    for (const translation of translations) {
      const locale = translation.locale as Locale;

      // -----------------------------------------------
      // Check locale
      // -----------------------------------------------

      if (!SUPPORTED_LOCALES.includes(locale)) {
        return NextResponse.json(
          {
            success: false,
            message: `Unsupported locale: ${translation.locale}`,
          },
          { status: 400 },
        );
      }

      // -----------------------------------------------
      // Check required fields
      // -----------------------------------------------

      for (const field of requiredFields) {
        if (!translation[field]?.trim()) {
          return NextResponse.json(
            {
              success: false,
              message: `${field} is required for locale: ${locale}`,
            },
            { status: 400 },
          );
        }
      }
    }

    // =================================================
    // Prevent duplicate locales
    // =================================================

    const locales = translations.map(
      (translation: { locale: Locale }) =>
        translation.locale,
    );

    if (new Set(locales).size !== locales.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate locales are not allowed",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Require English
    // =================================================

    if (!locales.includes("en")) {
      return NextResponse.json(
        {
          success: false,
          message: "English translation is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Require Nepali
    // =================================================

    if (!locales.includes("ne")) {
      return NextResponse.json(
        {
          success: false,
          message: "Nepali translation is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Validate ward
    // =================================================

    if (!ward?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Ward is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Validate status
    // =================================================

    if (
      status !== "Ongoing" &&
      status !== "Completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status must be either Ongoing or Completed",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Validate images
    // =================================================

    const images: string[] = Array.isArray(galleryImages)
      ? galleryImages
          .filter(
            (url: unknown): url is string =>
              typeof url === "string" &&
              url.trim() !== "",
          )
          .map((url: string) => url.trim())
      : [];

    // -------------------------------------------------
    // Support single image
    // -------------------------------------------------

    if (
      images.length === 0 &&
      typeof image === "string" &&
      image.trim()
    ) {
      images.push(image.trim());
    }

    // -------------------------------------------------
    // At least one image
    // -------------------------------------------------

    if (images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one image is required",
        },
        { status: 400 },
      );
    }

    // -------------------------------------------------
    // Maximum 3 images
    // -------------------------------------------------

    if (images.length > 3) {
      return NextResponse.json(
        {
          success: false,
          message: "A maximum of 3 images is allowed",
        },
        { status: 400 },
      );
    }

    // =================================================
    // Check duplicate project ID
    // =================================================

    const existingWork = await Work.findOne({
      projectId: projectId.trim(),
    });

    if (existingWork) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID already exists",
        },
        { status: 409 },
      );
    }

    // =================================================
    // Main image
    // =================================================

    const mainImage = images[0];

    // =================================================
    // Clean translations
    // =================================================

    const cleanTranslations = translations.map(
      (translation: any) => ({
        locale: translation.locale,
        title: translation.title.trim(),
        description:
          translation.description.trim(),
        category: translation.category.trim(),
        location: translation.location.trim(),
        eventTypes:
          translation.eventTypes.trim(),
        eventCategory:
          translation.eventCategory.trim(),
        problem: translation.problem.trim(),
        action: translation.action.trim(),
        outcome: translation.outcome.trim(),
      }),
    );

    // =================================================
    // Create Work
    // =================================================

    const work = await Work.create({
      projectId: projectId.trim(),

      translations: cleanTranslations,

      image: mainImage,

      galleryImages: images,

      ward: ward.trim(),

      status,

      completedDate: completedDate
        ? new Date(completedDate)
        : null,
    });

    console.log(
      "Work created successfully:",
      {
        projectId: work.projectId,

        locales: work.translations.map(
          (translation) =>
            translation.locale,
        ),

        imageCount:
          work.galleryImages.length,
      },
    );

    // =================================================
    // Response
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message: "Work created successfully",
        data: work,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(
      "POST /api/works error:",
      error,
    );

    // =================================================
    // MongoDB duplicate key
    // =================================================

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create work",
      },
      { status: 500 },
    );
  }
}