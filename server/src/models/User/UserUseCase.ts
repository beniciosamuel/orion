import { Context } from "../../services/Context";
import { UserCreateDTO, UserUpdateDTO } from "./UserDTO";
import { UserEntity } from "./UserEntity";
import { UserRepository } from "./UserRepository";

export class UserUseCase {
  static async authenticate(
    args: {
      email: string;
      password: string;
    },
    context: Context,
  ): Promise<UserEntity> {
    const user = await UserRepository.fromEmail(args.email, context);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await context.password.verify(
      args.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return user;
  }

  static async create(
    args: UserCreateDTO,
    context: Context,
  ): Promise<UserEntity> {
    const user = await UserRepository.create(args, context);
    return user;
  }

  static async update(
    id: string,
    data: UserUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    return UserRepository.update(id, data, context);
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    return UserRepository.delete(id, context);
  }
}
