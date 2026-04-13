import { Context } from "../../services/Context";
import { FileCreateDTO, FileUpdateDTO } from "./FileDTO";
import { FileEntity } from "./FileEntity";
import { FileRepository } from "./FileRepository";

export class FileUseCase {
  static async create(
    args: FileCreateDTO,
    context: Context,
  ): Promise<FileEntity> {
    const file = await FileRepository.create(args, context);
    return file;
  }

  static async update(
    id: string,
    data: FileUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    return FileRepository.update(id, data, context);
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    return FileRepository.delete(id, context);
  }
}
