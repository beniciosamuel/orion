import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("full_name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.date("birth_date").notNullable();
    table.string("scope").notNullable().defaultTo("viewer");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });

  await knex.raw(utils.createOnUpdateTrigger("user"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("user"));

  await knex.schema.dropTableIfExists("user");
}
