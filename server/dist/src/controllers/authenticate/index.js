"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateController = void 0;
const UserUseCase_1 = require("../../models/User/UserUseCase");
const AuthTokenUseCase_1 = require("../../models/AuthToken/AuthTokenUseCase");
const schema_1 = require("./schema");
const Context_1 = require("../../services/Context");
class AuthenticateController {
    static async handler(req, res) {
        try {
            const { email, password } = schema_1.AuthenticateRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const user = await UserUseCase_1.UserUseCase.authenticate({ email, password }, context);
            if (!user) {
                throw new Error("User not found");
            }
            const authToken = await AuthTokenUseCase_1.AuthTokenUseCase.findByUserId(user?.id ?? "", context);
            if (authToken.length === 0) {
                await AuthTokenUseCase_1.AuthTokenUseCase.create(user.id, context);
            }
            return res.status(200).json({ user, authToken: authToken[0]?.token });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("not found")) {
                return res.status(404).json({ error: error.message });
            }
            if (error instanceof Error &&
                error.message.includes("Invalid password")) {
                return res.status(401).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
exports.AuthenticateController = AuthenticateController;
