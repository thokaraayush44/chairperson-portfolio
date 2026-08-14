import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH - Update feedback status
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid feedback ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { status } = body;

    if (!["read", "unread"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status." },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Feedback status updated.",
        data: contact,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/contact/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update feedback." },
      { status: 500 }
    );
  }
}

// DELETE - Delete feedback
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid feedback ID." },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        { message: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Feedback deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/contact/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete feedback." },
      { status: 500 }
    );
  }
}