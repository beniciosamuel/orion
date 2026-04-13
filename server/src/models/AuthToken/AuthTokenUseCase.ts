import { Context } from "../../services/Context";
import { AuthTokenRepository } from "./AuthTokenRepository";
import { AuthTokenEntity } from "./AuthTokenEntity";

export class AuthTokenUseCase {
  static async create(
    userId: string,
    context: Context,
  ): Promise<AuthTokenEntity> {
    const token = AuthTokenRepository.generateToken();
    return await AuthTokenRepository.create(
      {
        userId,
        token,
      },
      context,
    );
  }

  static async refresh(id: string, context: Context): Promise<boolean> {
    return await AuthTokenRepository.update(id, context);
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    return await AuthTokenRepository.delete(id, context);
  }

  static async findById(
    id: string,
    context: Context,
  ): Promise<AuthTokenEntity | null> {
    return await AuthTokenRepository.findById(id, context);
  }

  static async findByToken(
    token: string,
    context: Context,
  ): Promise<AuthTokenEntity | null> {
    return await AuthTokenRepository.findByToken(token, context);
  }

  static async findByUserId(
    userId: string,
    context: Context,
  ): Promise<AuthTokenEntity[]> {
    return await AuthTokenRepository.findByUserId(userId, context);
  }
}
