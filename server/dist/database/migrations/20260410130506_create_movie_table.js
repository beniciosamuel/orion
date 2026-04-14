"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const utils = __importStar(require("../helpers/utils"));
async function up(knex) {
    await knex.schema.createTable("movie", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("resume_title").notNullable();
        table.string("title").notNullable();
        table.string("description").notNullable();
        table.string("user_comment").nullable();
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
        table.datetime("deleted_at").nullable();
        table.index(["resume_title"]);
        table.index(["title"]);
        table.index(["director"]);
        table.index(["genres"]);
        table.index(["release_date"]);
    });
    await knex.raw(utils.createOnUpdateTrigger("movie"));
}
async function down(knex) {
    await knex.raw(utils.deleteOnUpdateTrigger("movie"));
    await knex.schema.dropTableIfExists("movie");
}
