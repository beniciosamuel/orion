"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const Notifier_1 = require("../../services/Notifier");
const UserRepository_1 = require("./UserRepository");
class UserUseCase {
    static async authenticate(args, context) {
        const user = await UserRepository_1.UserRepository.fromEmail(args.email, context);
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await context.password.verify(args.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        return user;
    }
    static async create(args, context) {
        const user = await UserRepository_1.UserRepository.create(args, context);
        return user;
    }
    static async update(id, data, context) {
        return UserRepository_1.UserRepository.update(id, data, context);
    }
    static async delete(id, context) {
        return UserRepository_1.UserRepository.delete(id, context);
    }
    static async updateTheme(args, context) {
        const currentSettings = await UserRepository_1.UserRepository.settingsFromUserId(args.userId, context);
        if (!currentSettings) {
            throw new Error("User settings not found");
        }
        return UserRepository_1.UserRepository.updateTheme(args, context);
    }
    static async sendEmailByUserId(args, context) {
        const user = await UserRepository_1.UserRepository.fromId(args.userId, context);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.email) {
            throw new Error("User email not found");
        }
        const emailService = await Notifier_1.EmailService.initialize();
        return emailService.sendEmail(user.email, args.subject, args.html, args.text);
    }
}
exports.UserUseCase = UserUseCase;
