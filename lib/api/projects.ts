/**
 * Projects API Service
 */

import { apiClient } from "./client";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  ProjectResponse,
} from "@/types/projects";

const PROJECTS_BASE = "/api/projects";

export const projectsService = {
  /**
   * Get all projects
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<ProjectsResponse> => {
    const queryParams: Record<string, string> = {};
    
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    
    return apiClient.get<ProjectsResponse>(
      PROJECTS_BASE, 
      Object.keys(queryParams).length > 0 ? { params: queryParams } : {}
    );
  },

  /**
   * Get project by ID
   */
  getById: async (id: string): Promise<ProjectResponse> => {
    return apiClient.get(`${PROJECTS_BASE}/${id}`);
  },

  /**
   * Create a new project
   */
  create: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    return apiClient.post<ProjectResponse>(PROJECTS_BASE, data);
  },

  /**
   * Update a project
   */
  update: async (
    projectId: string,
    data: UpdateProjectRequest
  ): Promise<ProjectResponse> => {
    return apiClient.put<ProjectResponse>(`${PROJECTS_BASE}/${projectId}`, data);
  },

  /**
   * Delete a project
   */
  delete: async (projectId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`${PROJECTS_BASE}/${projectId}`);
  },
};
