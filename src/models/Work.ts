import mongoose, { Document, Schema } from "mongoose";

export interface IWork extends Document {
  projectId: string;
  title: string;
  description: string;
  image: string;
  galleryImages: string[];
  category: string;
  ward: string;
  status: "Ongoing" | "Completed";
  completedDate?: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
}

const WorkSchema = new Schema<IWork>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

    image: {
      type: String,
      required: true,
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      required: true,
      trim: true,
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
      type: String,
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
    timestamps: true,
  }
);

const Work =
  mongoose.models.Work || mongoose.model<IWork>("Work", WorkSchema);

export default Work;