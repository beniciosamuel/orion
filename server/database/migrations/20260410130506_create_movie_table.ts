import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("movie", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.string("director").notNullable();
    table.integer("duration").notNullable();
    table.string("genres").notNullable();
    table.string("language").notNullable();
    table.string("age_rating").notNullable();
    table.decimal("budget", 10, 2).nullable();
    table.decimal("revenue", 10, 2).nullable();
    table.decimal("profit", 10, 2).nullable();
    table.string("production_company").nullable();
    table.string("trailer_url").nullable();
    table.date("release_date").notNullable();
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(utils.createOnUpdateTrigger("movie"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("movie"));
  await knex.schema.dropTableIfExists("movie");
}
