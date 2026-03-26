/**
 * useWorkspaces.ts — Hook TanStack Query per workspace
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getWorkspaces,
  getChildWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from './workspaceService'

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    staleTime: 5 * 60 * 1000, // 5 minuti
  })
}

export function useChildWorkspaces(parentId: string | null) {
  return useQuery({
    queryKey: ['workspaces', 'children', parentId],
    queryFn: () => getChildWorkspaces(parentId!),
    enabled: !!parentId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Parameters<typeof updateWorkspace>[1]) =>
      updateWorkspace(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}
