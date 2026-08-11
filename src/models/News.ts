import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  description: string;
  image?: string;
  date: Date;
}

const NewsSchema = new Schema<INews>(
  {
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
  mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default News;