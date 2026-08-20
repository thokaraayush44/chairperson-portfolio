import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

// =====================================================
// GET ALL GALLERY
// =====================================================

export async function GET() {
  try {
    await connectDB();

    const gallery = await Gallery.find()
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: gallery,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/gallery error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// CREATE GALLERY
// =====================================================

export async function POST(
  request: NextRequest,
) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      translations,
      image,
      date,
    } = body;

    // =================================================
    // VALIDATE TRANSLATIONS
    // =================================================

    if (
      !Array.isArray(translations)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Translations are required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // FIND ENGLISH TRANSLATION
    // =================================================

    const english = translations.find(
      (translation: {
        locale: string;
      }) => translation.locale === "en",
    );

    // =================================================
    // FIND NEPALI TRANSLATION
    // =================================================

    const nepali = translations.find(
      (translation: {
        locale: string;
      }) => translation.locale === "ne",
    );

    // =================================================
    // VALIDATE ENGLISH
    // =================================================

    if (!english) {
      return NextResponse.json(
        {
          success: false,
          message:
            "English translation is required",
        },
        { status: 400 },
      );
    }

    if (
      typeof english.title !== "string" ||
      !english.title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "English title is required",
        },
        { status: 400 },
      );
    }

    if (
      typeof english.category !== "string" ||
      !english.category.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "English category is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // VALIDATE NEPALI
    // =================================================

    if (!nepali) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nepali translation is required",
        },
        { status: 400 },
      );
    }

    if (
      typeof nepali.title !== "string" ||
      !nepali.title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nepali title is required",
        },
        { status: 400 },
      );
    }

    if (
      typeof nepali.category !== "string" ||
      !nepali.category.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nepali category is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // VALIDATE IMAGE
    // =================================================

    if (
      typeof image !== "string" ||
      !image.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is required",
        },
        { status: 400 },
      );
    }

    // =================================================
    // PREPARE TRANSLATIONS
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
    // CREATE GALLERY
    // =================================================

    const gallery =
      await Gallery.create({
        translations: finalTranslations,

        image: image.trim(),

        date: date
          ? new Date(date)
          : new Date(),
      });

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Gallery photo created successfully",
        data: gallery,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/gallery error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create gallery photo",
      },
      { status: 500 },
    );
  }
}