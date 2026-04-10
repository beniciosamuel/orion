import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("movie_rating", (table) => {
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
    table.integer("rating").notNullable();
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.primary(["movie_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("movie_rating");
}
