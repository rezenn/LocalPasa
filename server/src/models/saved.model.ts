import mongoose, { Document, Model, Schema } from "mongoose";

export type SavedItemType = "site" | "artisan" | "event";

export interface ISaved extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemType: SavedItemType;
  createdAt: Date;
}

const savedSchema = new Schema<ISaved>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    itemType: {
      type: String,
      enum: ["site", "artisan", "event"],
      required: true,
    },
  },
  { timestamps: true },
);

savedSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

export const SavedModel: Model<ISaved> = mongoose.model<ISaved>(
  "Saved",
  savedSchema,
);
