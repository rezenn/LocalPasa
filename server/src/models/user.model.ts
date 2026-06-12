import bcrypt from "bcrypt";
import mongoose, { Model, Schema, Document } from "mongoose";
import { config } from "../configs/env";
import { AuthProvider, PublicUser, UserRole } from "../types/user.type";

// Define IUser locally to avoid circular dependency
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  nationality?: string;
  preferredLanguage: string;
  tourismPreferences: string[];
  refreshTokens: string[];
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  toPublicJSON(): PublicUser;
}

const userMongooseSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.TOURIST,
    },
    avatar: { type: String },
    phone: { type: String },
    nationality: { type: String },
    preferredLanguage: { type: String, default: "en" },
    tourismPreferences: [{ type: String }],
    refreshTokens: { type: [String], default: [], select: false },
    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

userMongooseSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password as string,
    config.bcrypt.rounds,
  );
});

userMongooseSchema.methods.comparePassword = function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

userMongooseSchema.methods.isLocked = function (): boolean {
  return !!this.lockUntil && this.lockUntil > new Date();
};

userMongooseSchema.methods.incrementLoginAttempts =
  async function (): Promise<void> {
    if (this.lockUntil && this.lockUntil < new Date()) {
      this.loginAttempts = 1;
      this.lockUntil = undefined;
    } else {
      this.loginAttempts += 1;
      if (this.loginAttempts >= config.security.maxLoginAttempts) {
        this.lockUntil = new Date(Date.now() + config.security.lockDurationMs);
      }
    }
    await this.save();
  };

userMongooseSchema.methods.toPublicJSON = function (): PublicUser {
  const [firstName = this.fullName, ...lastNameParts] =
    this.fullName.split(" ");

  return {
    id: this._id.toString(),
    firstName,
    lastName: lastNameParts.join(" "),
    email: this.email,
    phoneNumber: this.phone,
    role: this.role,
    provider: AuthProvider.LOCAL,
    avatar: this.avatar,
    emailVerified: true,
    twoFactorEnabled: false,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userMongooseSchema,
);
