/**
 * useContacts.ts — TanStack Query hooks per contatti
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getContacts, getContact, getContactActivities,
  createContact, updateContact, deleteContact, addActivity
} from './contactService'
import type { Contact, Activity } from '@/types'

export function useContacts(params?: { search?: string; tags?: string[]; score?: string }) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => getContacts(params),
  })
}

export function useContact(id: string | null) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id!),
    enabled: !!id,
  })
}

export function useContactActivities(contactId: string | null) {
  return useQuery({
    queryKey: ['contact-activities', contactId],
    queryFn: () => getContactActivities(contactId!),
    enabled: !!contactId,
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Contact>) =>
      updateContact(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contacts'] })
      qc.invalidateQueries({ queryKey: ['contact'] })
    },
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export function useAddActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addActivity,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['contact-activities', variables.contact_id] })
    },
  })
}
