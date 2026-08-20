import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import cloudinary from "@/lib/cloudinary";

// GET - Get one news
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("GET news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
      },
      { status: 500 },
    );
  }
}

// PATCH - Partially update news
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      "title",
      "description",
      "image",
      "date",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields provided for update",
        },
        { status: 400 },
      );
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "News updated successfully",
        data: updatedNews,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/news/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update news",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete news + Cloudinary image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    // ============================================
    // STEP 1: Find the news first
    // ============================================

    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 },
      );
    }

    // ============================================
    // STEP 2: Delete Cloudinary image
    // ============================================

    if (news.image) {
      try {
        const publicId = getCloudinaryPublicId(
          news.image,
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
        /*
         * Don't stop the MongoDB deletion if
         * Cloudinary deletion fails.
         *
         * We log the error so it can be cleaned
         * up later if necessary.
         */

        console.error(
          "Cloudinary image deletion failed:",
          cloudinaryError,
        );
      }
    }

    // ============================================
    // STEP 3: Delete MongoDB document
    // ============================================

    await News.findByIdAndDelete(id);

    // ============================================
    // STEP 4: Return success
    // ============================================

    return NextResponse.json({
      success: true,
      message:
        "News and image deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE news error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete news",
      },
      { status: 500 },
    );
  }
}

// ============================================
// EXTRACT CLOUDINARY PUBLIC ID
// ============================================

function getCloudinaryPublicId(
  imageUrl: string,
): string | null {
  try {
    const url = new URL(imageUrl);

    /*
     * Example URL:
     *
     * https://res.cloudinary.com/dh3bco58v/
     * image/upload/v1787054695/
     * chairperson/news/image.jpg
     *
     * pathname:
     *
     * /dh3bco58v/image/upload/v1787054695/
     * chairperson/news/image.jpg
     */

    const parts = url.pathname.split("/");

    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    let publicIdParts = parts.slice(
      uploadIndex + 1,
    );

    /*
     * Remove version:
     *
     * v1787054695
     */

    if (
      publicIdParts[0] &&
      /^v\d+$/.test(publicIdParts[0])
    ) {
      publicIdParts.shift();
    }

    if (publicIdParts.length === 0) {
      return null;
    }

    const publicIdWithExtension =
      publicIdParts.join("/");

    /*
     * Remove file extension.
     *
     * chairperson/news/image.jpg
     *
     * becomes:
     *
     * chairperson/news/image
     */

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