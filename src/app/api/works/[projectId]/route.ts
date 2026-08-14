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
    console.error("GET /api/works/[projectId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch work",
      },
      { status: 500 },
    );
  }
}

// PATCH - Partially update one work by projectId
// projectId cannot be changed
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    await connectDB();

    const { projectId } = await params;
    const body = await request.json();

    /*
     * projectId is immutable.
     * Even if the frontend sends projectId,
     * we remove it before updating the database.
     */
    delete body.projectId;

    /*
     * Only these fields are allowed to be updated.
     * _id, projectId, createdAt, etc. cannot be changed.
     */
    const allowedFields = [
      "title",
      "description",
      "image",
      "galleryImages",
      "category",
      "ward",
      "status",
      "completedDate",
      "location",
      "eventTypes",
      "eventCategory",
      "problem",
      "action",
      "outcome",
    ];

    const updates: Record<string, unknown> = {};

    /*
     * Only add fields that were actually provided.
     *
     * Example:
     * {
     *   "image": "/images/new.jpg"
     * }
     *
     * Only image will be updated.
     */
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Nothing to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields provided for update",
        },
        { status: 400 },
      );
    }

    /*
     * Find the work using the ORIGINAL projectId
     * and update only the provided fields.
     */
    const updatedWork = await Work.findOneAndUpdate(
      { projectId },
      {
        $set: updates,
      },
      {
        returnDocument: "after",
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
    console.error("PATCH /api/works/[projectId] error:", error);

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
    console.error("DELETE /api/works/[projectId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete work",
      },
      { status: 500 },
    );
  }
}