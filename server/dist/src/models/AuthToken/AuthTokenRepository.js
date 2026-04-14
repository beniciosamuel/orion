"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenRepository = void 0;
const crypto_1 = __importDefault(require("crypto"));
const AuthTokenEntity_1 = require("./AuthTokenEntity");
class AuthTokenRepository {
    static generateToken() {
        return crypto_1.default.randomBytes(32).toString("hex");
    }
    static async create(data, context) {
        const record = await context
            .database("auth_token")
            .insert({
            user_id: data.userId,
            token: data.token,
        })
            .returning("*")
            .then((rows) => rows[0]);
        return AuthTokenEntity_1.AuthTokenEntity.fromRecord(record);
    }
    static async update(id, context) {
        const newToken = AuthTokenRepository.generateToken();
        const updated = await context
            .database("auth_token")
            .where({ id })
            .update({ token: newToken });
        return !!updated;
    }
    static async delete(id, context) {
        const deleted = await context.database("auth_token").where({ id }).del();
        return !!deleted;
    }
    static async findById(id, context) {
        const record = await context.database("auth_token").where({ id }).first();
        return record ? AuthTokenEntity_1.AuthTokenEntity.fromRecord(record) : null;
    }
    static async findByToken(token, context) {
        const record = await context
            .database("auth_token")
            .where({ token })
            .first();
        return record ? AuthTokenEntity_1.AuthTokenEntity.fromRecord(record) : null;
    }
    static async findByUserId(userId, context) {
        const records = await context
            .database("auth_token")
            .where({ user_id: userId });
        return records.map(AuthTokenEntity_1.AuthTokenEntity.fromRecord);
    }
}
exports.AuthTokenRepository = AuthTokenRepository;
