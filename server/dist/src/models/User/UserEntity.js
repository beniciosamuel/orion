"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    id;
    fullName;
    email;
    password;
    scope;
    createdAt;
    updatedAt;
    deletedAt;
    constructor(data) {
        this.id = data.id;
        this.fullName = data.fullName;
        this.email = data.email;
        this.password = data.password;
        this.scope = data.scope;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
    static fromRecord(record) {
        return new UserEntity({
            id: record.id,
            fullName: record.full_name,
            email: record.email,
            password: record.password,
            scope: record.scope,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
            deletedAt: record.deleted_at,
        });
    }
}
exports.UserEntity = UserEntity;
