import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("movie_file", (table) => {
    table
      .uuid("movie_id")
      .notNullable()
      .references("id")
      .inTable("movie")
      .onDelete("CASCADE");
    table
      .uuid("file_id")
      .notNullable()
      .references("id")
      .inTable("file")
      .onDelete("CASCADE");
    table.boolean("is_cover").notNullable().defaultTo(false);
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.primary(["movie_id", "file_id"]);
  });

  await knex.raw(utils.createOnUpdateTrigger("movie_file"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("movie_file"));
  await knex.schema.dropTableIfExists("movie_file");
}
