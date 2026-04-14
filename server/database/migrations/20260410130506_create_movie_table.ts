import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("movie", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("resume_title").notNullable();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("user_comment").nullable();
    table.string("director").notNullable();
    table.integer("duration").notNullable();
    table.string("genres").notNullable();
    table.string("language").notNullable();
    table.string("age_rating").notNullable();
    table.string("budget").nullable();
    table.string("revenue").nullable();
    table.string("profit").nullable();
    table.string("production_company").nullable();
    table.string("trailer_url").nullable();
    table.date("release_date").notNullable();
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("deleted_at").nullable();

    table.index(["resume_title"]);
    table.index(["title"]);
    table.index(["director"]);
    table.index(["genres"]);
    table.index(["release_date"]);
  });

  await knex.raw(utils.createOnUpdateTrigger("movie"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("movie"));
  await knex.schema.dropTableIfExists("movie");
}
