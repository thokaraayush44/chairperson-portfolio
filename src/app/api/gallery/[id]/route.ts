import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

// =====================================================
// GET SINGLE GALLERY
// =====================================================

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    // =================================================
    // VALIDATE ID
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 },
      );
    }

    // =================================================
    // FIND GALLERY
    // =================================================

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: gallery,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/gallery/[id] error:",
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
// PATCH GALLERY
// =====================================================

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    // =================================================
    // VALIDATE ID
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const {
      translations,
      image,
      date,
    } = body;

    // =================================================
    // UPDATE DATA
    // =================================================

    const updateData: {
      translations?: {
        locale: "en" | "ne";
        title: string;
        category: string;
      }[];

      image?: string;

      date?: Date;
    } = {};

    // =================================================
    // VALIDATE TRANSLATIONS
    // =================================================

    if (translations !== undefined) {
      if (!Array.isArray(translations)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Translations must be an array",
          },
          { status: 400 },
        );
      }

      // ===============================================
      // ENGLISH
      // ===============================================

      const english = translations.find(
        (translation: {
          locale: string;
        }) => translation.locale === "en",
      );

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

      // ===============================================
      // NEPALI
      // ===============================================

      const nepali = translations.find(
        (translation: {
          locale: string;
        }) => translation.locale === "ne",
      );

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

      // ===============================================
      // FINAL TRANSLATIONS
      // ===============================================

      updateData.translations = [
        {
          locale: "en",
          title: english.title.trim(),
          category: english.category.trim(),
        },
        {
          locale: "ne",
          title: nepali.title.trim(),
          category: nepali.category.trim(),
        },
      ];
    }

    // =================================================
    // IMAGE
    // =================================================

    if (image !== undefined) {
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

      updateData.image = image.trim();
    }

    // =================================================
    // DATE
    // =================================================

    if (date !== undefined) {
      const parsedDate = date
        ? new Date(date)
        : new Date();

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid date",
          },
          { status: 400 },
        );
      }

      updateData.date = parsedDate;
    }

    // =================================================
    // UPDATE GALLERY
    // =================================================

    const updatedGallery =
      await Gallery.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        },
      );

    // =================================================
    // NOT FOUND
    // =================================================

    if (!updatedGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery not found",
        },
        { status: 404 },
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Gallery updated successfully",
        data: updatedGallery,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/gallery/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update gallery",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// DELETE GALLERY
// =====================================================

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    // =================================================
    // VALIDATE ID
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 },
      );
    }

    // =================================================
    // DELETE
    // =================================================

    const deletedGallery =
      await Gallery.findByIdAndDelete(id);

    // =================================================
    // NOT FOUND
    // =================================================

    if (!deletedGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery not found",
        },
        { status: 404 },
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Gallery deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/gallery/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete gallery",
      },
      { status: 500 },
    );
  }
}