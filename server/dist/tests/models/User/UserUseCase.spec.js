"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserUseCase_1 = require("../../../src/models/User/UserUseCase");
const UserRepository_1 = require("../../../src/models/User/UserRepository");
const Notifier_1 = require("../../../src/services/Notifier");
describe("UserUseCase.updateTheme", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("updates theme when user settings exist", async () => {
        const context = {};
        const settingsFromUserIdSpy = jest
            .spyOn(UserRepository_1.UserRepository, "settingsFromUserId")
            .mockResolvedValue({
            user_id: "user-1",
            language: "pt",
            theme: "dark",
            timezone: "America/Sao_Paulo",
            notify: true,
            created_at: new Date(),
            updated_at: new Date(),
        });
        const updateThemeSpy = jest
            .spyOn(UserRepository_1.UserRepository, "updateTheme")
            .mockResolvedValue(true);
        const result = await UserUseCase_1.UserUseCase.updateTheme({
            userId: "user-1",
            theme: "light",
        }, context);
        expect(settingsFromUserIdSpy).toHaveBeenCalledWith("user-1", context);
        expect(updateThemeSpy).toHaveBeenCalledWith({ userId: "user-1", theme: "light" }, context);
        expect(result).toBe(true);
    });
    it("throws error when user settings do not exist", async () => {
        const context = {};
        const settingsFromUserIdSpy = jest
            .spyOn(UserRepository_1.UserRepository, "settingsFromUserId")
            .mockResolvedValue(null);
        const updateThemeSpy = jest.spyOn(UserRepository_1.UserRepository, "updateTheme");
        const processPromise = UserUseCase_1.UserUseCase.updateTheme({
            userId: "missing-user",
            theme: "dark",
        }, context);
        await expect(processPromise).rejects.toThrow("User settings not found");
        expect(settingsFromUserIdSpy).toHaveBeenCalledWith("missing-user", context);
        expect(updateThemeSpy).not.toHaveBeenCalled();
    });
});
describe("UserUseCase.sendEmailByUserId", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("sends email when user exists", async () => {
        const context = {};
        const fromIdSpy = jest.spyOn(UserRepository_1.UserRepository, "fromId").mockResolvedValue({
            id: "user-1",
            fullName: "User One",
            email: "user-1@example.com",
            password: "hashed-password",
            scope: "viewer",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        const sendEmailMock = jest
            .fn()
            .mockResolvedValue({ id: "email-1", success: true });
        const initializeSpy = jest
            .spyOn(Notifier_1.EmailService, "initialize")
            .mockResolvedValue({
            sendEmail: sendEmailMock,
        });
        const result = await UserUseCase_1.UserUseCase.sendEmailByUserId({
            userId: "user-1",
            subject: "Movie released",
            html: "<p>Movie released</p>",
            text: "Movie released",
        }, context);
        expect(fromIdSpy).toHaveBeenCalledWith("user-1", context);
        expect(initializeSpy).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).toHaveBeenCalledWith("user-1@example.com", "Movie released", "<p>Movie released</p>", "Movie released");
        expect(result).toEqual({ id: "email-1", success: true });
    });
    it("throws error when user does not exist", async () => {
        const context = {};
        const fromIdSpy = jest
            .spyOn(UserRepository_1.UserRepository, "fromId")
            .mockResolvedValue(null);
        const initializeSpy = jest.spyOn(Notifier_1.EmailService, "initialize");
        const processPromise = UserUseCase_1.UserUseCase.sendEmailByUserId({
            userId: "missing-user",
            subject: "Movie released",
            html: "<p>Movie released</p>",
        }, context);
        await expect(processPromise).rejects.toThrow("User not found");
        expect(fromIdSpy).toHaveBeenCalledWith("missing-user", context);
        expect(initializeSpy).not.toHaveBeenCalled();
    });
});
