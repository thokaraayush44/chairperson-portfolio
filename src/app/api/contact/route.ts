import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

// POST - Submit public feedback
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      ward,
      category,
      message,
    } = body;

    // -----------------------------
    // Validate name
    // -----------------------------
    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate ward
    // -----------------------------
    const wardNumber = Number(ward);

    if (
      !Number.isInteger(wardNumber) ||
      wardNumber < 1
    ) {
      return NextResponse.json(
        {
          message:
            "Ward number must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate category
    // -----------------------------
    if (
      typeof category !== "string" ||
      !category.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Issue category is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate message
    // -----------------------------
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          message: "Message is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Create feedback
    // -----------------------------
    const contact = await Contact.create({
      name: name.trim(),
      ward: wardNumber,
      category: category.trim(),
      message: message.trim(),
      status: "unread",
    });

    return NextResponse.json(
      {
        message:
          "Feedback submitted successfully.",
        data: contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/contact error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to submit feedback.",
      },
      { status: 500 }
    );
  }
}

// GET - Get all feedback
export async function GET() {
  try {
    await connectDB();

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        data: contacts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/contact error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch feedback.",
      },
      { status: 500 }
    );
  }
}