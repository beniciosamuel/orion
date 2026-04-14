"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
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
];
async function seed(knex) {
    await knex("movie_rating").del();
    await knex("user_settings").del();
    await knex("user").del();
    await knex("user").insert(usersSeedData);
    const insertedUsers = await knex("user")
        .select("id")
        .whereIn("email", usersSeedData.map((user) => user.email));
    await knex("user_settings")
        .insert(insertedUsers.map((user) => ({ user_id: user.id })))
        .onConflict("user_id")
        .ignore();
}
