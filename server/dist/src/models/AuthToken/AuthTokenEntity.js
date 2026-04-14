"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenEntity = void 0;
class AuthTokenEntity {
    id;
    userId;
    token;
    createdAt;
    updatedAt;
    deletedAt;
    constructor(args) {
        this.id = args.id;
        this.userId = args.user_id;
        this.token = args.token;
        this.createdAt = args.created_at;
        this.updatedAt = args.updated_at;
        this.deletedAt = args.deleted_at;
    }
    static fromRecord(record) {
        return new AuthTokenEntity(record);
    }
}
exports.AuthTokenEntity = AuthTokenEntity;
