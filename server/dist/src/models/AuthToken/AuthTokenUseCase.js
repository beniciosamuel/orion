"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenUseCase = void 0;
const AuthTokenRepository_1 = require("./AuthTokenRepository");
class AuthTokenUseCase {
    static async create(userId, context) {
        const token = AuthTokenRepository_1.AuthTokenRepository.generateToken();
        return await AuthTokenRepository_1.AuthTokenRepository.create({
            userId,
            token,
        }, context);
    }
    static async refresh(id, context) {
        return await AuthTokenRepository_1.AuthTokenRepository.update(id, context);
    }
    static async delete(id, context) {
        return await AuthTokenRepository_1.AuthTokenRepository.delete(id, context);
    }
    static async findById(id, context) {
        return await AuthTokenRepository_1.AuthTokenRepository.findById(id, context);
    }
    static async findByToken(token, context) {
        return await AuthTokenRepository_1.AuthTokenRepository.findByToken(token, context);
    }
    static async findByUserId(userId, context) {
        return await AuthTokenRepository_1.AuthTokenRepository.findByUserId(userId, context);
    }
}
exports.AuthTokenUseCase = AuthTokenUseCase;
