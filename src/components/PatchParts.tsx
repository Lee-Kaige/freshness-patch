import type { CaseData, Update } from '../types'

export function StatusBadge({ update }: { update: Update }) {
  return <span className={`status-badge status-${update.type}`}>{update.status_label}</span>
}

export function CompactCompare({ update, oldText }: { update: Update; oldText?: string }) {
  return (
    <span className="compact-compare">
      <span className="compare-old">{oldText ?? update.summary_old}</span>
      <span className="compare-arrow" aria-label="更新为">→</span>
      <strong className="compare-new">{update.summary_new}</strong>
    </span>
  )
}

export function SourceDetail({ update, sourceComment }: { update: Update; sourceComment?: CaseData['post']['comments_preview'][number] }) {
  return (
    <div className="source-detail">
      <dl>
        <div><dt>信息来源</dt><dd>{update.source_name}{update.source_type === '官方信息' ? ' 官方' : ''}</dd></div>
        <div><dt>信息更新时间</dt><dd>{update.source_date}</dd></div>
        <div><dt>判断依据</dt><dd>{update.source_reason}</dd></div>
      </dl>
      {sourceComment && <div className="source-comment">
        {sourceComment.avatar && <img className="avatar comment-avatar comment-avatar-image" src={sourceComment.avatar} alt="" />}
        <div><span className="comment-author">{sourceComment.author}</span>{sourceComment.badge && <span className="comment-author-badge">{sourceComment.badge}</span>}<p>{sourceComment.text}</p></div>
      </div>}
    </div>
  )
}
