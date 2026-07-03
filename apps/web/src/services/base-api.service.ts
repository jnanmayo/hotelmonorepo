/**
 * Base API service class.
 * Feature services extend this for consistent error handling and typing.
 */
import type { AxiosRequestConfig } from 'axios';

import type { ApiResponse, PaginatedResponse } from '@tungaos/shared/types';

import { apiClient } from '@/services/api-client';

export abstract class BaseApiService {
  protected readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  protected async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<ApiResponse<T>>(`${this.basePath}${path}`, config);
    return response.data.data;
  }

  protected async getPaginated<T>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<T>>>(
      `${this.basePath}${path}`,
      config,
    );
    return response.data.data;
  }

  protected async post<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<ApiResponse<T>>(
      `${this.basePath}${path}`,
      body,
      config,
    );
    return response.data.data;
  }

  protected async put<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<ApiResponse<T>>(`${this.basePath}${path}`, body, config);
    return response.data.data;
  }

  protected async patch<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<ApiResponse<T>>(`${this.basePath}${path}`, body, config);
    return response.data.data;
  }

  protected async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<ApiResponse<T>>(`${this.basePath}${path}`, config);
    return response.data.data;
  }
}
