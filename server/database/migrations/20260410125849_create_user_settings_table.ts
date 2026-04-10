import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_settings", (table) => {
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.string("language").notNullable().defaultTo("pt");
    table.string("theme").notNullable().defaultTo("dark");
    table.string("timezone").notNullable().defaultTo("America/Sao_Paulo");
    table.boolean("notify").notNullable().defaultTo(true);
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.primary(["user_id"]);
  });

  await knex.raw(utils.createOnUpdateTrigger("user_settings"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("user_settings"));
  await knex.schema.dropTableIfExists("user_settings");
}
