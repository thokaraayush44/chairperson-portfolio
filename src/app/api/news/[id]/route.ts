import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

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
    console.error("PATCH /api/news/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update news",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
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
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("DELETE news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete news",
      },
      { status: 500 },
    );
  }
}