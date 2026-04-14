"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFileController = void 0;
const schema_1 = require("./schema");
const Context_1 = require("../../services/Context");
const FileUseCase_1 = require("../../models/File/FileUseCase");
class UploadFileController {
    static async handler(req, res) {
        try {
            const context = req.context ?? (await Context_1.Context.initialize());
            const dataRequestParsed = schema_1.UploadFileRequestSchema.parse(req.body);
            const files = req.files;
            const poster = files?.poster?.[0];
            const backdrop = files?.backdrop?.[0];
            if (!poster || !backdrop) {
                return res.status(400).json({
                    error: "Both poster and backdrop files are required",
                });
            }
            const posterUri = await context.storage.uploadFile(poster, context.storage.generateFileName(), context);
            const backdropUri = await context.storage.uploadFile(backdrop, context.storage.generateFileName(), context);
            await FileUseCase_1.FileUseCase.create({
                ...dataRequestParsed.poster,
                movieId: dataRequestParsed.movieId,
                uri: posterUri || "",
                isPoster: true,
                isCover: false,
            }, context);
            await FileUseCase_1.FileUseCase.create({
                ...dataRequestParsed.backdrop,
                movieId: dataRequestParsed.movieId,
                uri: backdropUri || "",
                isPoster: false,
                isCover: true,
            }, context);
            res.status(201).json({ message: "File uploaded successfully" });
        }
        catch (error) {
            console.error("Error handling file upload:", error);
            res.status(500).json({ error: "Failed to upload file" });
        }
    }
}
exports.UploadFileController = UploadFileController;
