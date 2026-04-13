import type { Knex } from "knex";
import * as utils from "../helpers/utils";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("auth_token", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.string("token").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });

  await knex.raw(utils.createOnUpdateTrigger("auth_token"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(utils.deleteOnUpdateTrigger("auth_token"));
  await knex.schema.dropTableIfExists("auth_token");
}
