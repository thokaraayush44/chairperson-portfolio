import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

// GET all gallery photos
export async function GET() {
  try {
    await connectDB();

    const gallery = await Gallery.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: gallery,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/gallery error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery",
      },
      { status: 500 }
    );
  }
}

// POST new gallery photo
export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    const gallery = await Gallery.create({
      title,
      image,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Gallery photo created successfully",
        data: gallery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/gallery error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create gallery photo",
      },
      { status: 500 }
    );
  }
}