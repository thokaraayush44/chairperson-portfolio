import mongoose, { Schema, Document, Model } from "mongoose";

// =====================================================
// GALLERY TRANSLATION
// =====================================================

export interface IGalleryTranslation {
  locale: "en" | "ne";
  title: string;
  category: string;
}

// =====================================================
// GALLERY
// =====================================================

export interface IGallery extends Document {
  translations: IGalleryTranslation[];

  image: string;
  date: Date;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// TRANSLATION SCHEMA
// =====================================================

const GalleryTranslationSchema =
  new Schema<IGalleryTranslation>(
    {
      locale: {
        type: String,
        enum: ["en", "ne"],
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    },
  );

// =====================================================
// GALLERY SCHEMA
// =====================================================

const GallerySchema = new Schema<IGallery>(
  {
    translations: {
      type: [GalleryTranslationSchema],
      required: true,
      validate: {
        validator: function (
          translations: IGalleryTranslation[],
        ) {
          const locales = translations.map(
            (translation) => translation.locale,
          );

          return (
            locales.includes("en") &&
            locales.includes("ne")
          );
        },

        message:
          "Both English and Nepali translations are required.",
      },
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// MODEL
// =====================================================

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ||
  mongoose.model<IGallery>(
    "Gallery",
    GallerySchema,
  );

export default Gallery;