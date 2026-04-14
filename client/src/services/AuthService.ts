import { ApiService } from "./Api";

export interface AuthenticatePayload {
  email: string;
  password: string;
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
}
