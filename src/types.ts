export type UpdateStatus = 'changed' | 'invalid' | 'recalculate'

export interface Update {
  id: string
  title: string
  type: UpdateStatus
  status_label: string
  original_text: string
  current_text: string
  summary_old: string
  summary_new: string
  inline_old?: string
  impact: string
  source_type: string
  source_name: string
  source_date: string
  source_reason: string
  confidence: 'high' | 'medium'
  target_paragraph_id: string
  highlight_text: string
  source_comment_id?: string
}

export interface CaseData {
  post: {
    id: string
    author: string
    title: string
    cover_image: string
    body: { id: string; text: string }[]
    topics: string[]
    published_at?: string
    location?: string
    publish_meta?: string
    comments_preview: { id: string; author: string; avatar?: string; badge?: string; text: string; date: string; likes?: number }[]
    stats: { likes: number; favorites: number; comments: number }
  }
  freshness_summary: {
    hasRisk: boolean
    riskCount: number
    title: string
    subtitle: string
    alert_description?: string
  }
  updates: Update[]
}
