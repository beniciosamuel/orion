import { FileEntityInterface, FileRecord } from "./FileDTO";

export class FileEntity implements FileEntityInterface {
  id: string;
  originalName: string;
  fileName: string;
  uri: string;
  width: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: FileEntityInterface) {
    this.id = data.id;
    this.originalName = data.originalName;
    this.fileName = data.fileName;
    this.uri = data.uri;
    this.width = data.width;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  static fromRecord(record: FileRecord): FileEntity {
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
