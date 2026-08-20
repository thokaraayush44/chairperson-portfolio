import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import {
  SUPPORTED_LOCALES,
  Locale,
} from "@/lib/localization";

// GET - Get all news
export async function GET() {
  try {
    await connectDB();

    const news = await News.find().sort({ date: -1 });

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
      },
      { status: 500 }
    );
  }
}

// POST - Create news
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const { translations, image, date } = body;

    // -------------------------------------------------------
    // Validate translations array
    // -------------------------------------------------------

    if (!Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one translation is required",
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // Validate each translation
    // -------------------------------------------------------

    for (const translation of translations) {
      const locale = translation.locale as Locale;

      // Check locale
      if (!SUPPORTED_LOCALES.includes(locale)) {
        return NextResponse.json(
          {
            success: false,
            message: `Unsupported locale: ${translation.locale}`,
          },
          { status: 400 }
        );
      }

      // Check title
      if (!translation.title?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Title is required for locale: ${locale}`,
          },
          { status: 400 }
        );
      }

      // Check description
      if (!translation.description?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Description is required for locale: ${locale}`,
          },
          { status: 400 }
        );
      }
    }

    // -------------------------------------------------------
    // Prevent duplicate locales
    // -------------------------------------------------------

    const locales = translations.map(
      (translation: { locale: Locale }) => translation.locale
    );

    if (new Set(locales).size !== locales.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate locales are not allowed",
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // Create News
    // -------------------------------------------------------

    const news = await News.create({
      translations,
      image,
      date,
    });

    return NextResponse.json(
      {
        success: true,
        message: "News created successfully",
        data: news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create news",
      },
      { status: 500 }
    );
  }
}