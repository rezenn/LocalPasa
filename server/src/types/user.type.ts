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

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: UserRole;
  provider: AuthProvider;
  googleId?: string;
  avatar?: string;
  touristPreferences?: TouristPreferences;
  artisanProfile?: ArtisanProfile;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorVerified: boolean;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
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
  touristPreferences?: TouristPreferences;
  artisanProfile?: Omit<ArtisanProfile, "verificationDocuments">;
  lastLogin?: Date;
  createdAt: Date;
}

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  tokenVersion: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenFamily: string;
}

export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface LoginBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export interface OnboardingTouristBody {
  interests: string[];
  preferredLocations: string[];
  preferredLanguage: PreferredLanguage;
}

export interface OnboardingArtisanBody {
  category: ArtisanCategory;
  bio: string;
  specializations: string[];
  location: string;
  yearsOfExperience: number;
  shopName?: string;
  contactNumber?: string;
}

export interface TwoFactorVerifyBody {
  token: string;
}

export interface AuthRequest extends Request {
  currentUser?: {
    toPublicJSON(): PublicUser;
  };
  tokenPayload?: AccessTokenPayload;
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
