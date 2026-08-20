import mongoose, { Schema, Document } from "mongoose";
import {
  SUPPORTED_LOCALES,
  Locale,
} from "@/lib/localization";

export interface IWorkTranslation {
  locale: Locale;
  title: string;
  description: string;
  category: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
}

export interface IWork extends Document {
  projectId: string;

  translations: IWorkTranslation[];

  image: string;
  galleryImages: string[];

  ward: string;
  status: "Ongoing" | "Completed";
  completedDate?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const WorkTranslationSchema =
  new Schema<IWorkTranslation>(
    {
      locale: {
        type: String,
        required: true,
        enum: SUPPORTED_LOCALES,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      eventTypes: {
        type: String,
        required: true,
        trim: true,
      },

      eventCategory: {
        type: String,
        required: true,
        trim: true,
      },

      problem: {
        type: String,
        required: true,
        trim: true,
      },

      action: {
        type: String,
        required: true,
        trim: true,
      },

      outcome: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const WorkSchema = new Schema<IWork>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    translations: {
      type: [WorkTranslationSchema],
      required: true,

      validate: {
        validator: function (
          translations: IWorkTranslation[]
        ) {
          const locales = translations.map(
            (translation) => translation.locale
          );

          return new Set(locales).size === locales.length;
        },

        message: "Duplicate locales are not allowed.",
      },
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    galleryImages: {
      type: [String],
      required: true,
      default: [],

      validate: {
        validator: function (images: string[]) {
          return images.length >= 1 && images.length <= 3;
        },

        message:
          "A work must have between 1 and 3 images.",
      },
    },

    ward: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Ongoing", "Completed"],
      required: true,
    },

    completedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Work =
  mongoose.models.Work ||
  mongoose.model<IWork>("Work", WorkSchema);

export default Work;