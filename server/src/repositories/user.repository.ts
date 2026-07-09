import { RegisterUserDto, UpdateUserDto } from "../dtos/user.dto";
import { IUser, UserModel } from "../models/user.model";

export class UserRepository {
  create(data: RegisterUserDto): Promise<IUser> {
    return UserModel.create(data);
  }

  findByEmail(email: string, includeSecrets = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (includeSecrets) {
      query.select("+password +refreshTokens +loginAttempts +lockUntil");
    }

    return query.exec();
  }

  findById(id: string, includeSecrets = false): Promise<IUser | null> {
    const query = UserModel.findById(id);
    if (includeSecrets) {
      query.select("+refreshTokens");
    }

    return query.exec();
  }

  exists(filter: Record<string, unknown>): Promise<boolean> {
    return UserModel.exists(filter).then(Boolean);
  }

  findByIdWithPassword(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("+password +refreshTokens").exec();
  }

  findByResetToken(hashedToken: string): Promise<IUser | null> {
    return UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    })
      .select(
        "+password +passwordResetToken +passwordResetExpires +refreshTokens",
      )
      .exec();
  }

  updateById(id: string, data: UpdateUserDto): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }
}

export const userRepository = new UserRepository();
