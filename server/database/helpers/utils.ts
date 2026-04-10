export const createOnUpdateTrigger = (tableName: string) => `
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

export const deleteOnUpdateTrigger = (tableName: string) => `
  DROP TRIGGER "${tableName}_updated_at" ON "${tableName}";
`;
