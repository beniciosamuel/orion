export interface AuthTokenRecord {
  id: string;
  user_id: string;
  token: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface AuthTokenEntityInterface {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface AuthTokenCreateDTO {
  userId: string;
  token: string;
}

export interface AuthTokenUpdateDTO {
  id: string;
  userId?: string;
  token?: string;
}
