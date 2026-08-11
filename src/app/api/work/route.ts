import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";

// GET - Get all work
export async function GET() {
  try {
    await connectDB();

    const work = await Work.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: work,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/work error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch work",
      },
      { status: 500 }
    );
  }
}

// POST - Create work
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      projectId,
      title,
      description,
      image,
      galleryImages,
      category,
      ward,
      status,
      completedDate,
      location,
      eventTypes,
      eventCategory,
      problem,
      action,
      outcome,
    } = body;

    // Validate required fields
    if (
      !projectId ||
      !title ||
      !description ||
      !image ||
      !category ||
      !ward ||
      !status ||
      !location ||
      !eventTypes ||
      !eventCategory ||
      !problem ||
      !action ||
      !outcome
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
        },
        { status: 400 }
      );
    }

    // Check duplicate projectId
    const existingWork = await Work.findOne({ projectId });

    if (existingWork) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID already exists",
        },
        { status: 409 }
      );
    }

    // Create work
    const work = await Work.create({
      projectId,
      title,
      description,
      image,
      galleryImages: galleryImages || [],
      category,
      ward,
      status,
      completedDate,
      location,
      eventTypes,
      eventCategory,
      problem,
      action,
      outcome,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Work created successfully",
        data: work,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/work error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create work",
      },
      { status: 500 }
    );
  }
}