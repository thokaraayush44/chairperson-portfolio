import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";

// GET - Get one work by projectId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectDB();

    const { projectId } = await params;

    const work = await Work.findOne({ projectId });

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
    console.error("GET /api/work/[projectId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch work",
      },
      { status: 500 },
    );
  }
}

// PUT - Update one work by projectId
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectDB();

    const { projectId } = await params;
    const body = await request.json();

    const {
      projectId: newProjectId,
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
      !newProjectId ||
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
        { status: 400 },
      );
    }

    // Check if the new projectId already belongs to another project
    if (newProjectId !== projectId) {
      const existingWork = await Work.findOne({
        projectId: newProjectId,
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
    }

    const updatedWork = await Work.findOneAndUpdate(
      { projectId },
      {
        projectId: newProjectId,
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

    return NextResponse.json(
      {
        success: true,
        message: "Work updated successfully",
        data: updatedWork,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/work/[projectId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update work",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete one work by projectId
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectDB();

    const { projectId } = await params;

    const deletedWork = await Work.findOneAndDelete({ projectId });

    if (!deletedWork) {
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
        message: "Work deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/work/[projectId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete work",
      },
      { status: 500 },
    );
  }
}
