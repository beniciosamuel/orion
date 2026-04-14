"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const argon2_1 = __importDefault(require("argon2"));
class Password {
    async encrypt(plainPassword) {
        try {
            const hash = await argon2_1.default.hash(plainPassword, {
                type: argon2_1.default.argon2id,
                memoryCost: 65536,
                timeCost: 3,
                parallelism: 4,
            });
            return hash;
        }
        catch (error) {
            throw new Error(`Failed to encrypt password: ${error}`, {
                cause: error,
            });
        }
    }
    async verify(hash, plainPassword) {
        try {
            return await argon2_1.default.verify(hash, plainPassword);
        }
        catch (error) {
            throw new Error(`Failed to verify password: ${error}`, {
                cause: error,
            });
        }
    }
}
exports.Password = Password;
