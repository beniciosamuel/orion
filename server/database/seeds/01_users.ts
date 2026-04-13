import type { Knex } from "knex";

const usersSeedData = [
  {
    full_name: "Orion Admin",
    email: "admin@orion.local",
    password: "admin1234",
    scope: "admin",
  },
  {
    full_name: "Orion Reviewer",
    email: "reviewer@orion.local",
    password: "reviewer1234",
    scope: "editor",
  },
  {
    full_name: "Orion Viewer",
    email: "viewer@orion.local",
    password: "viewer1234",
    scope: "viewer",
  },
] as const;

export async function seed(knex: Knex): Promise<void> {
  await knex("movie_rating").del();
  await knex("user").del();

  await knex("user").insert(usersSeedData);
}
