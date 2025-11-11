/**
 * Projects Hooks
 * React Query hooks for projects management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsService } from "@/lib/api/projects";
import type { CreateProjectRequest, UpdateProjectRequest, Project } from "@/types/projects";

// Query keys for caching
export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  detail: (id: string) => [...projectsKeys.all, "detail", id] as const,
};

/**
 * Hook to get all projects
 */
export function useProjects(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...projectsKeys.lists(), params],
    queryFn: () => projectsService.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single project
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => projectsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new project with optimistic updates
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsService.create(data),
    
    // Optimistic update
    onMutate: async (newProject) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: projectsKeys.lists() });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(projectsKeys.lists());

      // Optimistically update
      queryClient.setQueryData(projectsKeys.lists(), (old: any) => {
        if (!old) return old;
        
        const optimisticProject: Project = {
          id: `temp-${Date.now()}`,
          name: newProject.name,
          location: newProject.location,
          description: newProject.description || null,
          status: (newProject.status as any) || "planning",
          totalUnits: newProject.totalUnits,
          availableUnits: newProject.availableUnits,
          priceRangeMin: newProject.priceRangeMin || null,
          priceRangeMax: newProject.priceRangeMax || null,
          images: newProject.images || null,
          documents: newProject.documents || null,
          amenities: newProject.amenities || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...old,
          data: [optimisticProject, ...(old.data || [])],
        };
      });

      return { previousProjects };
    },

    onSuccess: (response) => {
      toast.success("Project created successfully!");
      
      // Invalidate to refetch with real data
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },

    onError: (error: Error, newProject, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(projectsKeys.lists(), context.previousProjects);
      }

      toast.error("Failed to create project", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectRequest }) =>
      projectsService.update(projectId, data),
    
    onSuccess: (response, variables) => {
      toast.success("Project updated successfully!");

      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectsKeys.detail(variables.projectId) });
    },

    onError: (error: Error) => {
      toast.error("Failed to update project", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsService.delete(projectId),
    
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },

    onError: (error: Error) => {
      toast.error("Failed to delete project", {
        description: error.message,
      });
    },
  });
}
