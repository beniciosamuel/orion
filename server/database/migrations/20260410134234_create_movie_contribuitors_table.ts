import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("movie_contributors", (table) => {
    table
      .uuid("movie_id")
      .notNullable()
      .references("id")
      .inTable("movie")
      .onDelete("CASCADE");
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.primary(["movie_id", "user_id"]);
  });

  await knex.raw(utils.createOnUpdateTrigger("movie_contributors"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("movie_contributors"));
  await knex.schema.dropTableIfExists("movie_contributors");
}
