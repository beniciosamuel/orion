import { Context } from "../../services/Context";
import {
  UserCreateDTO,
  UserSettingsRecord,
  UserThemeUpdateDTO,
  UserUpdateDTO,
} from "./UserDTO";
import { UserEntity } from "./UserEntity";

export class UserRepository {
  static async fromId(
    id: string,
    context: Context,
  ): Promise<UserEntity | null> {
    const result = await context.database("user").where({ id }).first();

    if (!result) {
      return null;
    }

    return UserEntity.fromRecord(result);
  }

  static async fromEmail(
    email: string,
    context: Context,
  ): Promise<UserEntity | null> {
    const result = await context.database("user").where({ email }).first();

    if (!result) {
      return null;
    }

    return UserEntity.fromRecord(result);
  }

  static async fromFullName(
    fullName: string,
    context: Context,
  ): Promise<UserEntity[]> {
    const results = await context
      .database("user")
      .where("full_name", "like", `%${fullName}%`);

    return results.map((result) => UserEntity.fromRecord(result));
  }

  static async create(
    args: UserCreateDTO,
    context: Context,
  ): Promise<UserEntity> {
    const passwordHash = await context.password.encrypt(args.password);

    const result = await context.database.transaction(async (trx) => {
      const [createdUser] = await trx("user")
        .insert({
          full_name: args.fullName,
          email: args.email,
          password: passwordHash,
        })
        .returning("*");

      await trx("user_settings")
        .insert({ user_id: createdUser.id })
        .onConflict("user_id")
        .ignore();

      return createdUser;
    });

    return UserEntity.fromRecord(result);
  }

  static async update(
    id: string,
    data: UserUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    const updated = await context
      .database("user")
      .where("id", id)
      .whereNull("deleted_at")
      .update({
        ...data,
        password: data.password
          ? await context.password.encrypt(data.password)
          : undefined,
        updated_at: new Date().toISOString(),
      });

    return updated > 0;
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    const result = await context
      .database("user")
      .where("id", id)
      .whereNull("deleted_at")
      .update({ deleted_at: new Date().toISOString() });

    if (result === 0) {
      throw new Error(`User with id ${id} not found or already deleted`);
    }

    return true;
  }

  static async settingsFromUserId(
    userId: string,
    context: Context,
  ): Promise<UserSettingsRecord | null> {
    const result = await context
      .database("user_settings")
      .where({ user_id: userId })
      .first();

    return result ?? null;
  }

  static async updateTheme(
    args: UserThemeUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    const updated = await context
      .database("user_settings")
      .where("user_id", args.userId)
      .update({
        theme: args.theme,
        updated_at: context.database.fn.now(),
      });

    return updated > 0;
  }

  static async createUserCode(
    userId: string,
    context: Context,
  ): Promise<string> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await context.database("user_code").insert({
      user_id: userId,
      code,
    });

    return code;
  }

  static async verifyUserCode(
    userId: string,
    code: string,
    context: Context,
  ): Promise<boolean> {
    const record = await context
      .database("user_code")
      .where({ user_id: userId, code })
      .first();

    if (!record) {
      return false;
    }

    await context.database("user_code").where({ id: record.id }).delete();
    return true;
  }
}
