"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const UserEntity_1 = require("./UserEntity");
class UserRepository {
    static async fromId(id, context) {
        const result = await context.database("users").where({ id }).first();
        if (!result) {
            return null;
        }
        return UserEntity_1.UserEntity.fromRecord(result);
    }
    static async fromEmail(email, context) {
        const result = await context.database("users").where({ email }).first();
        if (!result) {
            return null;
        }
        return UserEntity_1.UserEntity.fromRecord(result);
    }
    static async fromFullName(fullName, context) {
        const results = await context
            .database("users")
            .where("full_name", "like", `%${fullName}%`);
        return results.map((result) => UserEntity_1.UserEntity.fromRecord(result));
    }
    static async create(args, context) {
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
        return UserEntity_1.UserEntity.fromRecord(result);
    }
    static async update(id, data, context) {
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
    static async delete(id, context) {
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
    static async settingsFromUserId(userId, context) {
        const result = await context
            .database("user_settings")
            .where({ user_id: userId })
            .first();
        return result ?? null;
    }
    static async updateTheme(args, context) {
        const updated = await context
            .database("user_settings")
            .where("user_id", args.userId)
            .update({
            theme: args.theme,
            updated_at: context.database.fn.now(),
        });
        return updated > 0;
    }
}
exports.UserRepository = UserRepository;
