import type { NextFunction, Request, RequestHandler, Response } from "express";

import { Context } from "../services/Context";
import { UserEntity } from "../models/User/UserEntity";

export class AuthContextMiddleware {
  private static extractAuthToken(
    authorizationHeader: string | undefined,
  ): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const trimmedAuthorization = authorizationHeader.trim();

    if (!trimmedAuthorization) {
      return null;
    }

    const bearerPrefix = "Bearer ";

    if (trimmedAuthorization.startsWith(bearerPrefix)) {
      const token = trimmedAuthorization.slice(bearerPrefix.length).trim();
      return token || null;
    }

    return trimmedAuthorization;
  }

  private static async getUserFromAuthToken(
    token: string,
    context: Context,
  ): Promise<UserEntity | null> {
    const result = await context
      .database("auth_token")
      .join("user", "auth_token.user_id", "user.id")
      .where("auth_token.token", token)
      .select(
        "user.id",
        "user.full_name",
        "user.email",
        "user.password",
        "user.scope",
        "user.created_at",
        "user.updated_at",
        "user.deleted_at",
      )
      .first();

    if (!result) {
      return null;
    }

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

  public static readonly handler: RequestHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const context = await Context.initialize();
      const authToken = this.extractAuthToken(req.get("authorization"));

      if (authToken) {
        context.model.user = await this.getUserFromAuthToken(
          authToken,
          context,
        );
      } else {
        throw new Error("No authentication token provided");
      }

      req.context = context;
      next();
    } catch (error) {
      next(error);
    }
  };
}
