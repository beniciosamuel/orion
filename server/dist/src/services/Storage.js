"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
class StorageService {
    static instance;
    generateFileName() {
        return (0, uuid_1.v4)();
    }
    static getInstance() {
        return new storage_1.Storage();
    }
    async uploadFile(file, fileName, context) {
        const storage = StorageService.getInstance();
        const bucketName = await context.secrets.getGCSBucketName();
        const blob = storage.bucket(bucketName).file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
        });
        blobStream.on("error", (err) => {
            console.error("Error uploading file to GCS:", err);
            throw err;
        });
        blobStream.end(file.buffer);
        return `${bucketName}/${fileName}`;
    }
}
exports.StorageService = StorageService;
