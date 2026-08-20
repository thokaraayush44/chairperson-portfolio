import mongoose, { Schema, Document } from "mongoose";
import {
  SUPPORTED_LOCALES,
  Locale,
} from "@/lib/localization";

export interface INewsTranslation {
  locale: Locale;
  title: string;
  description: string;
}

export interface INews extends Document {
  translations: INewsTranslation[];
  image?: string;
  date: Date;
}

const NewsTranslationSchema = new Schema<INewsTranslation>(
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
  },
  {
    _id: false,
  }
);

const NewsSchema = new Schema<INews>(
  {
    translations: {
      type: [NewsTranslationSchema],
      required: true,

      validate: {
        validator: function (translations: INewsTranslation[]) {
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
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const News =
  mongoose.models.News ||
  mongoose.model<INews>("News", NewsSchema);

export default News;