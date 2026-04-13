import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("full_name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("scope").notNullable().defaultTo("viewer");
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.datetime("deleted_at").nullable();

    table.index(["full_name"]);
    table.index(["email"]);
    table.index(["scope"]);
  });

  await knex.raw(utils.createOnUpdateTrigger("user"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("user"));

  await knex.schema.dropTableIfExists("user");
}
