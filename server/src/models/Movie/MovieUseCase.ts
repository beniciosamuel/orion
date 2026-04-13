import { Context } from "../../services/Context";
import { MovieCreateDTO, MovieUpdateDTO } from "./MovieDTO";
import { MovieEntity } from "./MovieEntity";
import { MovieRepository } from "./MovieRepository";

export class MovieUseCase {
  static async list(
    pagination: {
      page: number;
      pageSize: number;
    },
    context: Context,
  ): Promise<{ data: MovieEntity[]; total: number }> {
    return MovieRepository.list(pagination, context);
  }

  static async fromId(
    id: string,
    context: Context,
  ): Promise<MovieEntity | null> {
    return MovieRepository.fromId(id, context);
  }

  static async create(
    args: MovieCreateDTO,
    context: Context,
  ): Promise<MovieEntity> {
    const movie = await MovieRepository.create(args, createdByUserId, context);
    return movie;
  }

  static async update(
    id: string,
    data: MovieUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    return MovieRepository.update(id, data, context);
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    return MovieRepository.delete(id, context);
  }

  static async search(
    filters: {
      title?: string;
      genres?: string[];
      pagination: {
        page: number;
        pageSize: number;
      };
    },
    context: Context,
  ): Promise<{ data: MovieEntity[]; total: number }> {
    return MovieRepository.search(
      {
        title: filters.title,
        genres: filters.genres,
      },
      filters.pagination,
      context,
    );
  }
}
