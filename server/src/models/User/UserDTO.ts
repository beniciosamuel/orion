export interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  password: string;
  scope: "viewer" | "editor" | "admin";
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface UserEntityInterface {
  id: string;
  fullName: string;
  email: string;
  password: string;
  scope: "viewer" | "editor" | "admin";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserCreateDTO {
  fullName: string;
  email: string;
  password: string;
  scope?: "viewer" | "editor" | "admin";
}

export interface UserUpdateDTO {
  id: string;
  fullName?: string;
  email?: string;
  password?: string;
  scope?: "viewer" | "editor" | "admin";
}
