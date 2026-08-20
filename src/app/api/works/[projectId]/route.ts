import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";
import cloudinary from "@/lib/cloudinary";
import {
  SUPPORTED_LOCALES,
  Locale,
} from "@/lib/localization";

// =====================================================
// GET SINGLE WORK
// =====================================================

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string }>;
  },
) {
  try {
    await connectDB();

    const { projectId } = await params;

    const work = await Work.findOne({
      projectId,
    });

    if (!work) {
      return NextResponse.json(
        {
          success: false,
          message: "Work not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: work,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/works/[projectId] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch work",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// PATCH SINGLE WORK
// =====================================================

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string }>;
  },
) {
  try {
    await connectDB();

    const { projectId } = await params;

    const body = await request.json();

    // =================================================
    // PROJECT ID CANNOT BE CHANGED
    // =================================================

    delete body.projectId;

    const updates: Record<string, unknown> = {};

    // =================================================
    // TRANSLATIONS
    // =================================================

    if (body.translations !== undefined) {
      // -------------------------------------------------
      // Validate translations array
      // -------------------------------------------------

      if (
        !Array.isArray(body.translations) ||
        body.translations.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "At least one translation is required",
          },
          { status: 400 },
        );
      }

      const translations = body.translations;

      // -------------------------------------------------
      // Check duplicate locales
      // -------------------------------------------------

      const locales = translations.map(
        (translation: { locale: Locale }) =>
          translation.locale,
      );

      if (
        new Set(locales).size !== locales.length
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Duplicate locales are not allowed",
          },
          { status: 400 },
        );
      }

      // -------------------------------------------------
      // Require English
      // -------------------------------------------------

      if (!locales.includes("en")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "English translation is required",
          },
          { status: 400 },
        );
      }

      // -------------------------------------------------
      // Require Nepali
      // -------------------------------------------------

      if (!locales.includes("ne")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Nepali translation is required",
          },
          { status: 400 },
        );
      }

      // -------------------------------------------------
      // Required translation fields
      // -------------------------------------------------

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

      // -------------------------------------------------
      // Validate each translation
      // -------------------------------------------------

      for (const translation of translations) {
        const locale =
          translation.locale as Locale;

        // Check locale
        if (
          !SUPPORTED_LOCALES.includes(locale)
        ) {
          return NextResponse.json(
            {
              success: false,
              message: `Unsupported locale: ${translation.locale}`,
            },
            { status: 400 },
          );
        }

        // Check required fields
        for (const field of requiredFields) {
          if (
            typeof translation[field] !==
              "string" ||
            !translation[field].trim()
          ) {
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

      // -------------------------------------------------
      // Clean translations
      // -------------------------------------------------

      const cleanTranslations =
        translations.map(
          (translation: any) => ({
            locale: translation.locale,
            title: translation.title.trim(),
            description:
              translation.description.trim(),
            category:
              translation.category.trim(),
            location:
              translation.location.trim(),
            eventTypes:
              translation.eventTypes.trim(),
            eventCategory:
              translation.eventCategory.trim(),
            problem:
              translation.problem.trim(),
            action:
              translation.action.trim(),
            outcome:
              translation.outcome.trim(),
          }),
        );

      updates.translations =
        cleanTranslations;
    }

    // =================================================
    // WARD
    // =================================================

    if (body.ward !== undefined) {
      if (
        typeof body.ward !== "string" ||
        !body.ward.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Ward is required",
          },
          { status: 400 },
        );
      }

      updates.ward = body.ward.trim();
    }

    // =================================================
    // STATUS
    // =================================================

    if (body.status !== undefined) {
      if (
        body.status !== "Ongoing" &&
        body.status !== "Completed"
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

      updates.status = body.status;
    }

    // =================================================
    // COMPLETED DATE
    // =================================================

    if (body.completedDate !== undefined) {
      if (body.completedDate === null) {
        updates.completedDate = null;
      } else {
        const completedDate = new Date(
          body.completedDate,
        );

        if (
          Number.isNaN(
            completedDate.getTime(),
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Invalid completed date",
            },
            { status: 400 },
          );
        }

        updates.completedDate =
          completedDate;
      }
    }

    // =================================================
    // GALLERY IMAGES
    // =================================================

    if (body.galleryImages !== undefined) {
      if (!Array.isArray(body.galleryImages)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "galleryImages must be an array",
          },
          { status: 400 },
        );
      }

      const cleanImages =
        body.galleryImages
          .filter(
            (url: unknown): url is string =>
              typeof url === "string" &&
              url.trim().length > 0,
          )
          .map((url: string) =>
            url.trim(),
          );

      // Maximum 3
      if (cleanImages.length > 3) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A maximum of 3 images is allowed",
          },
          { status: 400 },
        );
      }

      // At least 1
      if (cleanImages.length < 1) {
        return NextResponse.json(
          {
            success: false,
            message:
              "At least one image is required",
          },
          { status: 400 },
        );
      }

      // First image becomes main image
      updates.galleryImages =
        cleanImages;

      updates.image =
        cleanImages[0];
    }

    // =================================================
    // SINGLE IMAGE
    // =================================================

    if (
      body.image !== undefined &&
      body.galleryImages === undefined
    ) {
      if (
        typeof body.image !== "string" ||
        !body.image.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Image must be a valid URL",
          },
          { status: 400 },
        );
      }

      updates.image =
        body.image.trim();
    }

    // =================================================
    // NOTHING TO UPDATE
    // =================================================

    if (
      Object.keys(updates).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No fields provided for update",
        },
        { status: 400 },
      );
    }

    // =================================================
    // FIND EXISTING WORK
    // =================================================

    const existingWork =
      await Work.findOne({
        projectId,
      });

    if (!existingWork) {
      return NextResponse.json(
        {
          success: false,
          message: "Work not found",
        },
        { status: 404 },
      );
    }

    // =================================================
    // UPDATE WORK
    // =================================================

    const updatedWork =
      await Work.findOneAndUpdate(
        {
          projectId,
        },
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!updatedWork) {
      return NextResponse.json(
        {
          success: false,
          message: "Work not found",
        },
        { status: 404 },
      );
    }

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Work updated successfully",
        data: updatedWork,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/works/[projectId] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update work",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// DELETE SINGLE WORK + CLOUDINARY IMAGES
// =====================================================

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string }>;
  },
) {
  try {
    await connectDB();

    const { projectId } = await params;

    // =================================================
    // STEP 1: Find work first
    // =================================================

    const work = await Work.findOne({
      projectId,
    });

    if (!work) {
      return NextResponse.json(
        {
          success: false,
          message: "Work not found",
        },
        { status: 404 },
      );
    }

    // =================================================
    // STEP 2: Delete Cloudinary images
    // =================================================

    const images = Array.isArray(
      work.galleryImages,
    )
      ? work.galleryImages
      : [];

    for (const imageUrl of images) {
      if (!imageUrl) continue;

      try {
        const publicId =
          getCloudinaryPublicId(
            imageUrl,
          );

        if (publicId) {
          console.log(
            "Deleting Cloudinary image:",
            publicId,
          );

          const cloudinaryResult =
            await cloudinary.uploader.destroy(
              publicId,
              {
                resource_type: "image",
              },
            );

          console.log(
            "Cloudinary delete result:",
            cloudinaryResult,
          );
        }
      } catch (cloudinaryError) {
        // Do not stop MongoDB deletion
        console.error(
          "Cloudinary image deletion failed:",
          cloudinaryError,
        );
      }
    }

    // =================================================
    // STEP 3: Delete MongoDB document
    // =================================================

    await Work.findOneAndDelete({
      projectId,
    });

    // =================================================
    // STEP 4: Success
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Work and images deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/works/[projectId] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete work",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// EXTRACT CLOUDINARY PUBLIC ID
// =====================================================

function getCloudinaryPublicId(
  imageUrl: string,
): string | null {
  try {
    const url = new URL(imageUrl);

    const parts =
      url.pathname.split("/");

    const uploadIndex =
      parts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    let publicIdParts =
      parts.slice(uploadIndex + 1);

    // -------------------------------------------------
    // Remove Cloudinary version
    // Example: v1787054695
    // -------------------------------------------------

    if (
      publicIdParts[0] &&
      /^v\d+$/.test(
        publicIdParts[0],
      )
    ) {
      publicIdParts.shift();
    }

    if (
      publicIdParts.length === 0
    ) {
      return null;
    }

    const publicIdWithExtension =
      publicIdParts.join("/");

    // -------------------------------------------------
    // Remove extension
    // image.jpg -> image
    // -------------------------------------------------

    return publicIdWithExtension.replace(
      /\.[^/.]+$/,
      "",
    );
  } catch (error) {
    console.error(
      "Failed to extract Cloudinary public ID:",
      error,
    );

    return null;
  }
}