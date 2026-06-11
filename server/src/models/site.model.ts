import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISite extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  location: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  distance?: string;
  price: string;
  mustVisit: boolean;
  isHiddenGem: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  images: string[];
  summary: string;
  longDescription?: string;
  history?: string;
  myth?: string;
  archeology?: string;
  didYouKnow?: string;
  quizzes?: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
  translations?: {
    nepali: string;
    chinese: string;
    japanese: string;
    korean: string;
    spanish: string;
  };
  openingHours?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const siteSchema = new Schema<ISite>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    distance: { type: String },
    price: { type: String, default: "Free Entry" },
    mustVisit: { type: Boolean, default: false },
    isHiddenGem: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    summary: { type: String, required: true },
    longDescription: { type: String },
    history: { type: String },
    myth: { type: String },
    archeology: { type: String },
    didYouKnow: { type: String },
    quizzes: [
      {
        question: { type: String },
        options: [{ type: String }],
        correct: { type: Number },
      },
    ],
    translations: {
      nepali: { type: String },
      chinese: { type: String },
      japanese: { type: String },
      korean: { type: String },
      spanish: { type: String },
    },
    openingHours: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

siteSchema.index({ name: "text", location: "text", city: "text" });

export const SiteModel: Model<ISite> = mongoose.model<ISite>(
  "Site",
  siteSchema,
);
