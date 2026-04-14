"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOnUpdateTrigger = exports.createOnUpdateTrigger = void 0;
const createOnUpdateTrigger = (tableName) => `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
  
  CREATE TRIGGER "${tableName}_updated_at"
  BEFORE UPDATE ON "${tableName}"
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();`;
exports.createOnUpdateTrigger = createOnUpdateTrigger;
const deleteOnUpdateTrigger = (tableName) => `
  DROP TRIGGER "${tableName}_updated_at" ON "${tableName}";
`;
exports.deleteOnUpdateTrigger = deleteOnUpdateTrigger;
