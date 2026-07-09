import { Request } from "express";
import { Document, Types } from "mongoose";

export enum UserRole {
  TOURIST = "tourist",
  ARTISAN = "artisan",
  ADMIN = "admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

export enum AuthStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

export enum ArtisanCategory {
  THANGKA_PAINTING = "thangka_painting",
  POTTERY = "pottery",
  WOODCARVING = "woodcarving",
  METALWORK = "metalwork",
  WEAVING = "weaving",
  SCULPTURE = "sculpture",
  JEWELRY = "jewelry",
  OTHER = "other",
}

export enum PreferredLanguage {
  ENGLISH = "en",
  NEPALI = "ne",
  HINDI = "hi",
  CHINESE = "zh",
  JAPANESE = "ja",
  DEUTSCH = "de",
}

export interface TouristPreferences {
  interests: string[];
  preferredLocations: string[];
  preferredLanguage: PreferredLanguage;
}

export interface ArtisanProfile {
  category: ArtisanCategory;
  bio: string;
  specializations: string[];
  location: string;
  yearsOfExperience: number;
  isVerified: boolean;
  verificationDocuments: string[];
  portfolioImages: string[];
  shopName?: string;
  contactNumber?: string;
}

// ─── Core IUser (used by both user.type.ts and user.model.ts) ────────────────
// This is the FULL interface exposed on req.currentUser so controllers
// can access _id, role, fullName, etc. without casting.
export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password?: string;
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

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  provider: AuthProvider;
  avatar?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  tokenFamily: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenFamily: string;
}

export interface RegisterBody {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginBody {
  email: string;
  password: string;
}

// ─── AuthRequest ─────────────────────────────────────────────────────────────
// currentUser is typed as full IUser so controllers can access
// _id, role, fullName, save(), toPublicJSON() without any casting.
export interface AuthRequest extends Request {
  currentUser?: IUser;
  tokenPayload?: AccessTokenPayload;
  user?: IUser; // alias used in some controllers via (req as any).user
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>[];
  meta?: Record<string, unknown>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
