// === Poonto CRM — TypeScript Types ===
// Corrispondono allo schema Supabase (TDD §4)

// === Workspace & Auth ===

export type WorkspacePlan = 'free' | 'starter' | 'agency' | 'scale'
export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface Workspace {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  owner_id: string
  parent_workspace_id: string | null
  plan: WorkspacePlan
  plan_expires_at: string | null
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: WorkspaceRole
  invited_at: string
  accepted_at: string | null
}

// === Contacts ===

export type AiScore = 'hot' | 'warm' | 'cold' | 'unknown'

export interface Contact {
  id: string
  workspace_id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  position: string | null
  address: string | null
  city: string | null
  province: string | null
  zip_code: string | null
  avatar_url: string | null
  tags: string[]
  source: string | null
  ai_score: AiScore
  ai_summary: string | null
  ai_updated_at: string | null
  custom_fields: Record<string, unknown>
  owner_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// === Pipeline & Deals ===

export interface Pipeline {
  id: string
  workspace_id: string
  name: string
  is_default: boolean
  created_at: string
}

export interface PipelineStage {
  id: string
  pipeline_id: string
  name: string
  position: number
  probability: number
  color: string
  created_at: string
}

export type DealStatus = 'open' | 'won' | 'lost'

export interface Deal {
  id: string
  workspace_id: string
  pipeline_id: string
  stage_id: string
  contact_id: string | null
  name: string
  value: number
  currency: string
  expected_close_date: string | null
  owner_id: string | null
  status: DealStatus
  lost_reason: string | null
  custom_fields: Record<string, unknown>
  position: number
  created_at: string
  updated_at: string
  // Relations
  contact?: Contact
  stage?: PipelineStage
}

// === Tasks ===

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  workspace_id: string
  title: string
  description: string | null
  contact_id: string | null
  deal_id: string | null
  due_date: string | null
  due_time: string | null
  priority: TaskPriority
  assigned_to: string | null
  completed_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // Relations
  contact?: Contact
  deal?: Deal
}

// === Activities ===

export type ActivityType =
  | 'note' | 'email' | 'call' | 'meeting'
  | 'deal_move' | 'task_complete' | 'file'
  | 'ai_insight' | 'system'

export interface Activity {
  id: string
  workspace_id: string
  contact_id: string | null
  deal_id: string | null
  type: ActivityType
  content: string | null
  metadata: Record<string, unknown>
  created_by: string | null
  created_at: string
}

// === Attachments ===

export type EntityType = 'contact' | 'deal' | 'task'

export interface Attachment {
  id: string
  workspace_id: string
  entity_type: EntityType
  entity_id: string
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  uploaded_by: string | null
  created_at: string
}

// === Custom Fields ===

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url'

export interface CustomFieldDef {
  id: string
  workspace_id: string
  entity_type: EntityType
  field_name: string
  field_label: string
  field_type: FieldType
  options: string[] | null
  position: number
  required: boolean
  created_at: string
}

// === AI Cache ===

export type AiType = 'summary' | 'score' | 'suggestion' | 'draft'

export interface AiCache {
  id: string
  workspace_id: string
  entity_type: string
  entity_id: string
  ai_type: AiType
  content: string
  model: string
  tokens_used: number | null
  expires_at: string
  created_at: string
}
