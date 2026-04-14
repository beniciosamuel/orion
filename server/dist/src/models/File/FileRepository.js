"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = void 0;
const FileEntity_1 = require("./FileEntity");
class FileRepository {
    static async fromId(id, context) {
        const result = await context
            .database("file")
            .where({ id })
            .whereNull("deleted_at")
            .first();
        if (!result) {
            return null;
        }
        return FileEntity_1.FileEntity.fromRecord(result);
    }
    static async fromFileName(fileName, context) {
        const results = await context
            .database("file")
            .where("file_name", "like", `%${fileName}%`)
            .whereNull("deleted_at");
        return results.map((result) => FileEntity_1.FileEntity.fromRecord(result));
    }
    static async create(args, context) {
        const result = await context.database.transaction(async (trx) => {
            const [createdFile] = await trx("file")
                .insert({
                original_name: args.originalName,
                file_name: args.fileName,
                uri: args.uri,
                width: args.width,
            })
                .returning("*");
            await trx("movie_file").insert({
                movie_id: args.movieId,
                file_id: createdFile.id,
                is_poster: Boolean(args.isPoster),
                is_cover: Boolean(args.isCover),
            });
            return createdFile;
        });
        return FileEntity_1.FileEntity.fromRecord(result);
    }
    static async update(id, data, context) {
        const updated = await context
            .database("file")
            .where("id", id)
            .whereNull("deleted_at")
            .update({
            original_name: data.originalName,
            file_name: data.fileName,
            uri: data.uri,
            width: data.width,
            updated_at: new Date().toISOString(),
        });
        return updated > 0;
    }
    static async delete(id, context) {
        const deleted = await context
            .database("file")
            .where("id", id)
            .whereNull("deleted_at")
            .update({ deleted_at: new Date().toISOString() });
        return deleted > 0;
    }
}
exports.FileRepository = FileRepository;
