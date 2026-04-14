import { ApiService } from "./Api";

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  scope: "viewer" | "editor" | "admin";
}

export interface CreateUserResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    scope: "viewer" | "editor" | "admin";
  };
  token: string;
}

const apiService = new ApiService();

export class UserService {
  static async createUser(payload: CreateUserPayload) {
    return apiService.post<CreateUserResponse, CreateUserPayload>(
      "/createUser",
      payload,
    );
  }
}
