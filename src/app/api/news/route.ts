import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

// GET - Get all news
export async function GET() {
  try {
    await connectDB();

    const news = await News.find().sort({ date: -1 });

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
      },
      { status: 500 }
    );
  }
}

// POST - Create news
export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    const news = await News.create({
      title,
      description,
      image,
      date,
    });

    return NextResponse.json(
      {
        success: true,
        message: "News created successfully",
        data: news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create news",
      },
      { status: 500 }
    );
  }
}