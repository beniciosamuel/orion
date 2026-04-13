import { Context } from "../../services/Context";
import { FileCreateDTO, FileUpdateDTO } from "./FileDTO";
import { FileEntity } from "./FileEntity";

export class FileRepository {
  static async fromId(
    id: string,
    context: Context,
  ): Promise<FileEntity | null> {
    const result = await context
      .database("file")
      .where({ id })
      .whereNull("deleted_at")
      .first();

    if (!result) {
      return null;
    }

    return FileEntity.fromRecord(result);
  }

  static async fromFileName(
    fileName: string,
    context: Context,
  ): Promise<FileEntity[]> {
    const results = await context
      .database("file")
      .where("file_name", "like", `%${fileName}%`)
      .whereNull("deleted_at");

    return results.map((result) => FileEntity.fromRecord(result));
  }

  static async create(
    args: FileCreateDTO,
    context: Context,
  ): Promise<FileEntity> {
    const [result] = await context
      .database("file")
      .insert({
        original_name: args.originalName,
        file_name: args.fileName,
        uri: args.uri,
        width: args.width,
      })
      .returning("*");

    return FileEntity.fromRecord(result);
  }

  static async update(
    id: string,
    data: FileUpdateDTO,
    context: Context,
  ): Promise<boolean> {
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

  static async delete(id: string, context: Context): Promise<boolean> {
    const deleted = await context
      .database("file")
      .where("id", id)
      .whereNull("deleted_at")
      .update({ deleted_at: new Date().toISOString() });

    return deleted > 0;
  }
}
