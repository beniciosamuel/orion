import { Context } from "../../services/Context";
import { UserCreateDTO, UserUpdateDTO } from "./UserDTO";
import { UserEntity } from "./UserEntity";

export class UserRepository {
  static async fromId(
    id: string,
    context: Context,
  ): Promise<UserEntity | null> {
    const result = await context.database("users").where({ id }).first();

    if (!result) {
      return null;
    }

    return new UserEntity({
      id: result.id,
      fullName: result.full_name,
      email: result.email,
      password: result.password_hash,
      scope: result.scope,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    });
  }

  static async fromEmail(
    email: string,
    context: Context,
  ): Promise<UserEntity | null> {
    const result = await context.database("users").where({ email }).first();

    if (!result) {
      return null;
    }

    return new UserEntity({
      id: result.id,
      fullName: result.full_name,
      email: result.email,
      password: result.password_hash,
      scope: result.scope,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    });
  }

  static async fromFullName(
    fullName: string,
    context: Context,
  ): Promise<UserEntity[]> {
    const results = await context
      .database("users")
      .where("full_name", "like", `%${fullName}%`);

    return results.map(
      (result) =>
        new UserEntity({
          id: result.id,
          fullName: result.full_name,
          email: result.email,
          password: result.password_hash,
          scope: result.scope,
          createdAt: result.created_at,
          updatedAt: result.updated_at,
          deletedAt: result.deleted_at,
        }),
    );
  }

  static async create(
    args: UserCreateDTO,
    context: Context,
  ): Promise<UserEntity> {
    const passwordHash = await context.password.encrypt(args.password);

    const [result] = await context
      .database("users")
      .insert({
        full_name: args.fullName,
        email: args.email,
        password_hash: passwordHash,
      })
      .returning("*");

    return new UserEntity({
      id: result.id,
      fullName: result.full_name,
      email: result.email,
      password: result.password,
      scope: result.scope,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    });
  }

  static async update(
    id: string,
    data: UserUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    const updated = await context
      .database("users")
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
      .database("users")
      .where("id", id)
      .whereNull("deleted_at")
      .update({ deleted_at: new Date().toISOString() });

    if (result === 0) {
      throw new Error(`User with id ${id} not found or already deleted`);
    }

    return true;
  }
}
