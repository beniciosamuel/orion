import { Context } from "../../services/Context";
import { FileCreateDTO, FileUpdateDTO } from "./FileDTO";
import { FileEntity } from "./FileEntity";

export interface MovieMediaUris {
  posterUri: string | null;
  backdropUri: string | null;
}

interface MovieMediaRow {
  movie_id: string;
  is_poster: boolean;
  is_cover: boolean;
  uri: string;
}

export class FileRepository {
  static async listMediaByMovieIds(
    movieIds: string[],
    context: Context,
  ): Promise<Record<string, MovieMediaUris>> {
    if (movieIds.length === 0) {
      return {};
    }

    const results = await context
      .database("movie_file as movieFile")
      .innerJoin("file", "movieFile.file_id", "file.id")
      .whereIn("movieFile.movie_id", movieIds)
      .whereNull("file.deleted_at")
      .select(
        "movieFile.movie_id as movie_id",
        "movieFile.is_poster as is_poster",
        "movieFile.is_cover as is_cover",
        "file.uri as uri",
      );

    const mediaByMovieId: Record<string, MovieMediaUris> = {};

    (results as MovieMediaRow[]).forEach((result) => {
      const currentMedia = mediaByMovieId[result.movie_id] ?? {
        posterUri: null,
        backdropUri: null,
      };

      if (result.is_poster) {
        currentMedia.posterUri = result.uri;
      }

      if (result.is_cover) {
        currentMedia.backdropUri = result.uri;
      }

      mediaByMovieId[result.movie_id] = currentMedia;
    });

    return mediaByMovieId;
  }

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
