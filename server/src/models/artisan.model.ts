import mongoose, { Document, Model, Schema } from "mongoose";

export interface IArtisanProduct {
  name: string;
  price: string;
  description: string;
  image?: string;
  inStock?: boolean;
}

export interface IArtisanWorkshop {
  name: string;
  duration: string;
  price: string;
  maxParticipants: number;
  description?: string;
}

export interface IArtisanContact {
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface IArtisan extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  craft: string;
  location: string;
  city: string;
  distance?: string;
  image: string;
  images?: string[];
  bio?: string;
  longBio?: string;
  contact?: IArtisanContact;
  products?: IArtisanProduct[];
  workshops?: IArtisanWorkshop[];
  rating: number;
  ratingCount: number;
  experience?: number;
  priceRange?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const artisanProductSchema = new Schema<IArtisanProduct>({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  inStock: { type: Boolean, default: true },
});

const artisanWorkshopSchema = new Schema<IArtisanWorkshop>({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  description: { type: String },
});

const artisanContactSchema = new Schema<IArtisanContact>({
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  whatsapp: { type: String },
});

const artisanSchema = new Schema<IArtisan>(
  {
    name: { type: String, required: true, trim: true },
    craft: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    distance: { type: String },
    image: { type: String, required: true },
    images: [{ type: String }],
    bio: { type: String },
    longBio: { type: String },
    contact: { type: artisanContactSchema },
    products: [artisanProductSchema],
    workshops: [artisanWorkshopSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    experience: { type: Number },
    priceRange: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

artisanSchema.index({ name: "text", craft: "text", city: "text" });

export const ArtisanModel: Model<IArtisan> = mongoose.model<IArtisan>(
  "Artisan",
  artisanSchema,
);
