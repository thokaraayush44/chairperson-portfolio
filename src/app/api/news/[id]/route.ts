import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

// GET - Get one news
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news ID",
        },
        { status: 400 }
      );
    }

    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/news/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
      },
      { status: 500 }
    );
  }
}

// PUT - Update one news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { title, description, image, date } = body;

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and description are required",
        },
        { status: 400 }
      );
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        date,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "News updated successfully",
        data: updatedNews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/news/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update news",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete one news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news ID",
        },
        { status: 400 }
      );
    }

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "News deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/news/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete news",
      },
      { status: 500 }
    );
  }
}