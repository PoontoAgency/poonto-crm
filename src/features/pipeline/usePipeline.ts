import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPipelines, getStages, getDeals, createDeal, updateDeal, moveDeal, deleteDeal } from './pipelineService'
import type { Deal } from '@/types'

export function usePipelines() {
  return useQuery({ queryKey: ['pipelines'], queryFn: getPipelines })
}

export function useStages(pipelineId: string | null) {
  return useQuery({ queryKey: ['stages', pipelineId], queryFn: () => getStages(pipelineId!), enabled: !!pipelineId })
}

export function useDeals(pipelineId: string | null) {
  return useQuery({ queryKey: ['deals', pipelineId], queryFn: () => getDeals(pipelineId!), enabled: !!pipelineId })
}

export function useCreateDeal() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createDeal, onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }) })
}

export function useUpdateDeal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Deal>) => updateDeal(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
  })
}

export function useMoveDeal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stageId, position }: { id: string; stageId: string; position: number }) => moveDeal(id, stageId, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
  })
}
