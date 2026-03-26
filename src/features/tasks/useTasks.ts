import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, completeTask, updateTask, deleteTask } from './taskService'
import type { Task } from '@/types'

export function useTasks(filter?: string) {
  return useQuery({ queryKey: ['tasks', filter], queryFn: () => getTasks({ filter }) })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createTask, onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) })
}

export function useCompleteTask() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: completeTask, onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Task>) => updateTask(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
