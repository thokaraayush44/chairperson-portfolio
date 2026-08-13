import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import mongoose from "mongoose";

// GET one gallery photo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery photo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: gallery,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/gallery/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery photo",
      },
      { status: 500 }
    );
  }
}

// PUT update gallery photo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { title, image } = body;

    if (!title || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and image are required",
        },
        { status: 400 }
      );
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        title,
        image,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery photo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery photo updated successfully",
        data: updatedGallery,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/gallery/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update gallery photo",
      },
      { status: 500 }
    );
  }
}

// DELETE gallery photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 }
      );
    }

    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery photo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery photo deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery photo",
      },
      { status: 500 }
    );
  }
}