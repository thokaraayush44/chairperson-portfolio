import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IContact extends Document {
  name: string;
  ward: number;
  category: string;
  message: string;
  status: "unread" | "read";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ward: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

const Contact: Model<IContact> =
  mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;