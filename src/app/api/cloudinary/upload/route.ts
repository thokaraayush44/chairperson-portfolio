import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_FOLDERS = [
  "news",
  "works",
  "gallery",
  "profile",
] as const;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");
    const folder = formData.get("folder");

    // Validate image
    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No image provided",
        },
        { status: 400 }
      );
    }

    // Validate folder
    if (
      typeof folder !== "string" ||
      !ALLOWED_FOLDERS.includes(
        folder as (typeof ALLOWED_FOLDERS)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid folder",
        },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only image files are allowed",
        },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `chairperson/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    console.log("Cloudinary upload successful:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
    });

    return NextResponse.json({
      success: true,

      // This is what AddNewsModal expects
      url: result.secure_url,

      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message || "Image upload failed",
      },
      { status: 500 }
    );
  }
}