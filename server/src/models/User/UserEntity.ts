import { UserEntityInterface, UserRecord } from "./UserDTO";

export class UserEntity implements UserEntityInterface {
  id: string;
  fullName: string;
  email: string;
  password: string;
  scope: "viewer" | "editor" | "admin";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: UserEntityInterface) {
    this.id = data.id;
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.scope = data.scope;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  static fromRecord(record: UserRecord): UserEntity {
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
