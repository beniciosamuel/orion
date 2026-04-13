import crypto from "crypto";

import { AuthTokenCreateDTO } from "./AuthTokenDTO";
import { AuthTokenEntity } from "./AuthTokenEntity";
import { Context } from "../../services/Context";

export class AuthTokenRepository {
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static async create(
    data: AuthTokenCreateDTO,
    context: Context,
  ): Promise<AuthTokenEntity> {
    const record = await context
      .database("auth_token")
      .insert({
        user_id: data.userId,
        token: data.token,
      })
      .returning("*")
      .then((rows) => rows[0]);

    return AuthTokenEntity.fromRecord(record);
  }

  static async update(id: string, context: Context): Promise<boolean> {
    const newToken = AuthTokenRepository.generateToken();
    const updated = await context
      .database("auth_token")
      .where({ id })
      .update({ token: newToken });

    return !!updated;
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    const deleted = await context.database("auth_token").where({ id }).del();

    return !!deleted;
  }

  static async findById(
    id: string,
    context: Context,
  ): Promise<AuthTokenEntity | null> {
    const record = await context.database("auth_token").where({ id }).first();

    return record ? AuthTokenEntity.fromRecord(record) : null;
  }

  static async findByToken(
    token: string,
    context: Context,
  ): Promise<AuthTokenEntity | null> {
    const record = await context
      .database("auth_token")
      .where({ token })
      .first();

    return record ? AuthTokenEntity.fromRecord(record) : null;
  }

  static async findByUserId(
    userId: string,
    context: Context,
  ): Promise<AuthTokenEntity[]> {
    const records = await context
      .database("auth_token")
      .where({ user_id: userId });

    return records.map(AuthTokenEntity.fromRecord);
  }
}
