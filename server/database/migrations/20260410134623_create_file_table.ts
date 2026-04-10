import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("file", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("original_name").notNullable();
    table.string("file_name").notNullable();
    table.string("uri").notNullable();
    table.integer("width").nullable();
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("deleted_at").nullable();
  });

  await knex.raw(utils.createOnUpdateTrigger("file"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("file"));

  await knex.schema.dropTableIfExists("file");
}
