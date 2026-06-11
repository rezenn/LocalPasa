import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  date: string;
  month: string;
  fullDate: Date;
  location: string;
  city: string;
  distance?: string;
  type: string;
  price: string;
  image?: string;
  images?: string[];
  description?: string;
  longDescription?: string;
  organizer?: string;
  contact?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    month: { type: String, required: true },
    fullDate: { type: Date, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    distance: { type: String },
    type: { type: String, required: true },
    price: { type: String, default: "Free Entry" },
    image: { type: String },
    images: [{ type: String }],
    description: { type: String },
    longDescription: { type: String },
    organizer: { type: String },
    contact: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

eventSchema.index({ title: "text", location: "text", city: "text" });

export const EventModel: Model<IEvent> = mongoose.model<IEvent>(
  "Event",
  eventSchema,
);
