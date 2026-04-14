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
async function down(knex) {
    await knex.raw(utils.deleteOnUpdateTrigger("user_settings"));
    await knex.schema.dropTableIfExists("user_settings");
}
