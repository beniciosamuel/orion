"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthContextMiddleware = void 0;
const Context_1 = require("../services/Context");
const UserEntity_1 = require("../models/User/UserEntity");
class AuthContextMiddleware {
    static isPublicRoute(req) {
        return req.method === "POST" && req.path === "/createUser";
    }
    static extractAuthToken(authorizationHeader) {
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
    static async getUserFromAuthToken(token, context) {
        const result = await context
            .database("auth_token")
            .join("user", "auth_token.user_id", "user.id")
            .where("auth_token.token", token)
            .select("user.id", "user.full_name", "user.email", "user.password", "user.scope", "user.created_at", "user.updated_at", "user.deleted_at")
            .first();
        if (!result) {
            return null;
        }
        return new UserEntity_1.UserEntity({
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
    static handler = async (req, _res, next) => {
        try {
            const context = await Context_1.Context.initialize();
            if (this.isPublicRoute(req)) {
                req.context = context;
                next();
                return;
            }
            const authToken = this.extractAuthToken(req.get("authorization"));
            if (authToken) {
                context.models.user = await this.getUserFromAuthToken(authToken, context);
            }
            else {
                throw new Error("No authentication token provided");
            }
            req.context = context;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthContextMiddleware = AuthContextMiddleware;
