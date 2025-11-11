/**
 * Projects Types
 */

export interface Project {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  status: "planning" | "active" | "completed" | "on-hold";
  totalUnits: number;
  availableUnits: number;
  priceRangeMin?: string | null;
  priceRangeMax?: string | null;
  images?: string[] | null;
  documents?: any | null;
  amenities?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  location: string;
  description?: string;
  status?: string;
  totalUnits: number;
  availableUnits: number;
  priceRangeMin?: string;
  priceRangeMax?: string;
  images?: string[];
  documents?: any;
  amenities?: string[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  page?: number;
  limit?: number;
  total?: number;
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
}
