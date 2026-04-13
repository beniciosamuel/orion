import { AuthTokenEntityInterface, AuthTokenRecord } from "./AuthTokenDTO";

export class AuthTokenEntity implements AuthTokenEntityInterface {
  public id: string;
  public userId: string;
  public token: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(args: AuthTokenRecord) {
    this.id = args.id;
    this.userId = args.user_id;
    this.token = args.token;
    this.createdAt = args.created_at;
    this.updatedAt = args.updated_at;
    this.deletedAt = args.deleted_at;
  }

  static fromRecord(record: AuthTokenRecord): AuthTokenEntity {
    return new AuthTokenEntity(record);
  }
}
