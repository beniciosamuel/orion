import { ApiService } from "./Api";

export interface AuthenticatePayload {
  email: string;
  password: string;
}

export interface CreateUserCodePayload {
  email?: string;
  userId?: string;
}

export interface CreateUserCodeResponse {
  message: string;
  userId: string;
}

export interface UpdateUserPasswordPayload {
  userId: string;
  code: string;
  newPassword: string;
}

export interface UpdateUserPasswordResponse {
  message: string;
  result: boolean;
}

export interface AuthenticateResponse {
  id: string;
  scope: "viewer" | "editor" | "admin";
  authToken?: string;
}

const apiService = new ApiService();

export class AuthService {
  static async authenticate(payload: AuthenticatePayload) {
    return apiService.post<AuthenticateResponse, AuthenticatePayload>(
      "/authenticate",
      payload,
    );
  }

  static async createUserCode(payload: CreateUserCodePayload) {
    return apiService.post<CreateUserCodeResponse, CreateUserCodePayload>(
      "/createUserCode",
      payload,
    );
  }

  static async updateUserPassword(payload: UpdateUserPasswordPayload) {
    return apiService.post<
      UpdateUserPasswordResponse,
      UpdateUserPasswordPayload
    >("/updateUserPassword", payload);
  }
}
