"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntity = void 0;
class FileEntity {
    id;
    originalName;
    fileName;
    uri;
    width;
    createdAt;
    updatedAt;
    deletedAt;
    constructor(data) {
        this.id = data.id;
        this.originalName = data.originalName;
        this.fileName = data.fileName;
        this.uri = data.uri;
        this.width = data.width;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
    static fromRecord(record) {
        return new FileEntity({
            id: record.id,
            originalName: record.original_name,
            fileName: record.file_name,
            uri: record.uri,
            width: record.width,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
            deletedAt: record.deleted_at,
        });
    }
}
exports.FileEntity = FileEntity;
