export interface FileRecord {
  id: string;
  original_name: string;
  file_name: string;
  uri: string;
  width: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface FileEntityInterface {
  id: string;
  originalName: string;
  fileName: string;
  uri: string;
  width: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface FileCreateDTO {
  originalName: string;
  fileName: string;
  uri: string;
  width?: number | null;
}

export interface FileUpdateDTO {
  id: string;
  originalName?: string;
  fileName?: string;
  uri?: string;
  width?: number | null;
}
