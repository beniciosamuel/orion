import axios from "axios";

import { Secrets } from "./Secrets";

export class ApiService {
  private serverUrl: string | null = null;
  private initializationPromise: Promise<void>;

  constructor() {
    this.initializationPromise = this.initialize();
  }

  private async initialize() {
    const secrets = new Secrets();
    this.serverUrl = await secrets.getApiUrl();
  }

  private async ensureInitialized() {
    await this.initializationPromise;

    if (!this.serverUrl) {
      throw new Error("API service failed to initialize.");
    }
  }

  private getAuthHeaders() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${authToken}`,
    };
  }

  async post<TResponse, TRequest = unknown>(url: string, data: TRequest) {
    await this.ensureInitialized();

    const response = await axios.post<TResponse>(
      `${this.serverUrl}${url}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      },
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`,
      );
    }

    return response.data;
  }

  async postFormData<TResponse>(url: string, data: FormData) {
    await this.ensureInitialized();

    const response = await axios.post<TResponse>(
      `${this.serverUrl}${url}`,
      data,
      {
        headers: {
          ...this.getAuthHeaders(),
        },
      },
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`,
      );
    }

    return response.data;
  }

  async get<TResponse, TParams = unknown>(url: string, params?: TParams) {
    await this.ensureInitialized();

    const response = await axios.get<TResponse>(`${this.serverUrl}${url}`, {
      params,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
    });

    console.log(`GET ${url} with params:`, params);
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, response.data);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`,
      );
    }

    return response.data;
  }
}
