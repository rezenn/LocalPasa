import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  artisanId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | null;
  authorName?: string;
  text: string;
  createdAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    artisanId: { type: Schema.Types.ObjectId, ref: "Artisan", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    authorName: { type: String },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ChatModel = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatSchema,
);
