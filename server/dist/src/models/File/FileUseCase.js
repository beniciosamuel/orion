"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUseCase = void 0;
const FileRepository_1 = require("./FileRepository");
class FileUseCase {
    static async create(args, context) {
        const file = await FileRepository_1.FileRepository.create(args, context);
        return file;
    }
    static async update(id, data, context) {
        return FileRepository_1.FileRepository.update(id, data, context);
    }
    static async delete(id, context) {
        return FileRepository_1.FileRepository.delete(id, context);
    }
}
exports.FileUseCase = FileUseCase;
