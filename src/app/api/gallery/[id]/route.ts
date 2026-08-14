import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

// ========================================
// GET SINGLE GALLERY
// ========================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid gallery ID" },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery, { status: 200 });
  } catch (error) {
    console.error("GET gallery error:", error);

    return NextResponse.json(
      { message: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

// ========================================
// PATCH GALLERY
// ========================================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid gallery ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Only allow gallery fields to be updated
    const updateData: {
      title?: string;
      image?: string;
      category?: string;
      date?: string;
    } = {};

    if (body.title !== undefined) {
      updateData.title = body.title;
    }

    if (body.image !== undefined) {
      updateData.image = body.image;
    }

    if (body.category !== undefined) {
      updateData.category = body.category;
    }

    if (body.date !== undefined) {
      updateData.date = body.date;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGallery, { status: 200 });
  } catch (error) {
    console.error("PATCH gallery error:", error);

    return NextResponse.json(
      { message: "Failed to update gallery" },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE GALLERY
// ========================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid gallery ID" },
        { status: 400 }
      );
    }

    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gallery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE gallery error:", error);

    return NextResponse.json(
      { message: "Failed to delete gallery" },
      { status: 500 }
    );
  }
}