"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserThemeController = void 0;
const Context_1 = require("../../services/Context");
const UserUseCase_1 = require("../../models/User/UserUseCase");
const schema_1 = require("./schema");
class UpdateUserThemeController {
    static async handler(req, res) {
        try {
            const { theme } = schema_1.UpdateUserThemeRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const authenticatedUser = context.model?.user;
            if (!authenticatedUser) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const wasUpdated = await UserUseCase_1.UserUseCase.updateTheme({
                userId: authenticatedUser.id,
                theme,
            }, context);
            if (!wasUpdated) {
                return res.status(404).json({ error: "User settings not found" });
            }
            return res.status(200).json({
                status: 200,
                data: {
                    userId: authenticatedUser.id,
                    theme,
                },
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                return res.status(400).json({ error: "Invalid request payload" });
            }
            if (error instanceof Error &&
                error.message.includes("User settings not found")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
exports.UpdateUserThemeController = UpdateUserThemeController;
