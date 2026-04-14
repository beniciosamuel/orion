"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const schema_1 = require("./schema");
const UserUseCase_1 = require("../../models/User/UserUseCase");
const Context_1 = require("../../services/Context");
class CreateUserController {
    static async handler(req, res) {
        try {
            const { fullName, email, password, scope } = schema_1.CreateUserRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const user = await UserUseCase_1.UserUseCase.create({ fullName, email, password, scope }, context);
            return res.status(201).json({ user });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("already exists")) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
exports.CreateUserController = CreateUserController;
