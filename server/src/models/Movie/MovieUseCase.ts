import { Context } from "../../services/Context";
import { MovieCreateDTO, MovieUpdateDTO } from "./MovieDTO";
import { MovieEntity } from "./MovieEntity";
import { MovieRepository } from "./MovieRepository";

export class MovieUseCase {
  static async create(
    args: MovieCreateDTO,
    context: Context,
  ): Promise<MovieEntity> {
    const movie = await MovieRepository.create(args, context);
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
}
