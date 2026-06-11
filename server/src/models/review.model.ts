import mongoose, { Document, Model, Schema } from "mongoose";

export type ReviewTargetType = "site" | "artisan";

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: ReviewTargetType;
  author: string;
  rating: number;
  text: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetType: { type: String, enum: ["site", "artisan"], required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    date: { type: String },
  },
  { timestamps: true },
);

reviewSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export const ReviewModel: Model<IReview> = mongoose.model<IReview>(
  "Review",
  reviewSchema,
);
