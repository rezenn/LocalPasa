import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISiteArtisan extends Document {
  siteId: mongoose.Types.ObjectId;
  artisanId: mongoose.Types.ObjectId;
}

const siteArtisanSchema = new Schema<ISiteArtisan>({
  siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
  artisanId: { type: Schema.Types.ObjectId, ref: "Artisan", required: true },
});

siteArtisanSchema.index({ siteId: 1, artisanId: 1 }, { unique: true });

export const SiteArtisanModel: Model<ISiteArtisan> =
  mongoose.model<ISiteArtisan>("SiteArtisan", siteArtisanSchema);
