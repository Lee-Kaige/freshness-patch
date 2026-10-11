import { useEffect, useState } from 'react'
import BottomSheet from './BottomSheet'
import { CompactCompare } from './PatchParts'
import StatusBar from './StatusBar'
import type { CaseData, Update } from '../types'

const iconPaths = {
  back: <path d="m15 18-6-6 6-6" />,
  share: <><path d="M12 16V3m0 0-4 4m4-4 4 4" /><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  star: <path d="m12 2 3.1 6.3 7 .9-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-.9L12 2Z" />,
  comment: <path d="M20.5 16.5a8.5 8.5 0 0 0 1-4 9.5 9.5 0 1 0-9.5 9.5 8.5 8.5 0 0 0 4-.9l5 1.2-.5-5.7Z" />,
  pen: <><path d="m4 17 9.8-9.8 3 3L7 20H4v-3Z" /><path d="m15.5 5.5 1.4-1.4a2 2 0 0 1 2.8 2.8l-1.4 1.4" /></>,
}

function Icon({ name, size = 24 }: { name: keyof typeof iconPaths; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function PostHeader({ author, onBack }: { author: string; onBack: () => void }) {
  return (
    <header className="app-header">
      <StatusBar />
      <div className="nav-bar">
        <button className="nav-back" type="button" onClick={onBack} aria-label="返回首页"><Icon name="back" size={27} /></button>
        <span className="avatar avatar-author" aria-hidden="true">{author.slice(0, 1)}</span>
        <strong className="nav-username">{author}</strong>
        <span className="follow-pill">关注</span>
        <span className="nav-share"><Icon name="share" size={23} /></span>
      </div>
    </header>
  )
}

function PostImageCarousel({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="post-cover">
      <div className="cover-image-wrap">
        <img src={src} alt={alt} />
        <span className="image-count">1/1</span>
      </div>
      <figcaption className="image-dots"><span /></figcaption>
    </figure>
  )
}

function FreshnessAlertBar({ count, description, onClick }: { count: number; description?: string; onClick: () => void }) {
  return (
    <button className="freshness-alert" type="button" onClick={onClick}>
      <span className="alert-icon" aria-hidden="true">!</span>
      <span className="alert-copy"><strong>时效提醒</strong><span>{description ?? `检测到${count}项时效变化`}</span></span>
      <span className="alert-action">查看 <span aria-hidden="true">›</span></span>
    </button>
  )
}

function InlinePatchCard({ update, onViewDetail, onClose }: { update: Update; onViewDetail: (id: string) => void; onClose: () => void }) {
  return (
    <aside className={`inline-patch patch-${update.type}`} aria-label={`${update.title}的时效补丁`}>
      <button className="inline-patch-main" type="button" onClick={() => onViewDetail(update.id)} aria-label={`查看${update.title}详情`}>
        <CompactCompare update={update} oldText={update.inline_old} />
        <span className="inline-separator" aria-hidden="true"> · </span>
        <span className="inline-status">{update.status_label}</span>
        <span className="inline-separator" aria-hidden="true"> · </span>
        <span className="inline-detail-text">查看详情</span>
      </button>
      <button className="inline-close" type="button" onClick={onClose} aria-label={`关闭${update.title}补丁并取消原文高亮`}><span aria-hidden="true">×</span></button>
    </aside>
  )
}

function PostBody({ post, selected, flashToken, onViewDetail, onClearSelected }: {
  post: CaseData['post']
  selected: Update | undefined
  flashToken: number
  onViewDetail: (id: string) => void
  onClearSelected: () => void
}) {
  return (
    <article className="post-body">
      <h1>{post.title}</h1>
      <div className="post-copy">
        {post.body.map(paragraph => {
          const highlight = selected?.target_paragraph_id === paragraph.id ? selected.highlight_text : null
          const index = highlight ? paragraph.text.indexOf(highlight) : -1
          return (
            <div className="paragraph-wrap" key={paragraph.id}>
              <p id={paragraph.id} className="post-paragraph" tabIndex={-1}>
                {index >= 0 && highlight ? <>
                  {paragraph.text.slice(0, index)}
                  <mark key={`${selected?.id}-${flashToken}`} className={`target-mark mark-${selected?.type} is-flashing`}>{highlight}</mark>
                  {paragraph.text.slice(index + highlight.length)}
                </> : paragraph.text}
              </p>
              {index >= 0 && selected && <InlinePatchCard update={selected} onViewDetail={onViewDetail} onClose={onClearSelected} />}
            </div>
          )
        })}
      </div>
      <div className="post-topics">{post.topics.map(topic => <span key={topic}>{topic}</span>)}</div>
      <p className="post-meta">{post.publish_meta ?? (post.published_at && post.location ? `发布于 ${post.published_at} · ${post.location}` : '')}</p>
      <section className="comments-preview" aria-label="评论预览">
        <h2>共{post.stats.comments}条评论</h2>
        {post.comments_preview.map((comment, index) => (
          <div className="comment-row" key={comment.id}>
            {comment.avatar
              ? <img className="avatar comment-avatar comment-avatar-image" src={comment.avatar} alt="" />
              : <span className={`avatar comment-avatar avatar-${index}`} aria-hidden="true">{comment.author.slice(0, 1)}</span>}
            <div className="comment-text"><span className="comment-author">{comment.author}</span>{comment.badge && <span className="comment-author-badge">{comment.badge}</span>}<p>{comment.text}</p><span className="comment-date">{comment.date}</span></div>
          </div>
        ))}
      </section>
    </article>
  )
}

function BottomActionBar({ stats }: { stats: CaseData['post']['stats'] }) {
  return (
    <div className="bottom-actions" aria-label="帖子互动数据">
      <span className="comment-placeholder"><Icon name="pen" size={18} />说点什么...</span>
      <span className="action-stat"><Icon name="heart" /><span>{stats.likes}</span></span>
      <span className="action-stat"><Icon name="star" /><span>{stats.favorites}</span></span>
      <span className="action-stat"><Icon name="comment" /><span>{stats.comments}</span></span>
    </div>
  )
}

export default function PostDetailPage({ data, zoomFromFeed, onBack }: { data: CaseData; zoomFromFeed: boolean; onBack: () => void }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [focusUpdateId, setFocusUpdateId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [flashToken, setFlashToken] = useState(0)
  const selected = data.updates.find(update => update.id === selectedId)

  useEffect(() => {
    if (!selected || !flashToken) return
    // Let the sheet leave before scrolling, so the highlighted text is visible on arrival.
    const timer = window.setTimeout(() => {
      const target = document.getElementById(selected.target_paragraph_id)
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
    }, 250)
    return () => window.clearTimeout(timer)
  }, [selected, flashToken])

  function selectUpdate(id: string) {
    setSelectedId(id)
    setFlashToken(value => value + 1)
    setSheetOpen(false)
  }

  return (
    <div className="app-shell">
      <main className={`phone-frame ${zoomFromFeed ? 'is-transition-target' : ''}`}>
        <PostHeader author={data.post.author} onBack={onBack} />
        <div className="post-scroll">
          <PostImageCarousel src={data.post.cover_image} alt={`${data.post.title}封面图`} />
          {data.freshness_summary.hasRisk && <FreshnessAlertBar count={data.freshness_summary.riskCount} description={data.freshness_summary.alert_description} onClick={() => { setFocusUpdateId(null); setSheetOpen(true) }} />}
          <PostBody post={data.post} selected={selected} flashToken={flashToken} onViewDetail={id => { setFocusUpdateId(id); setSheetOpen(true) }} onClearSelected={() => setSelectedId(null)} />
        </div>
        <BottomActionBar stats={data.post.stats} />
        {sheetOpen && <BottomSheet data={data} focusUpdateId={focusUpdateId} onClose={() => setSheetOpen(false)} onSelect={selectUpdate} />}
      </main>
    </div>
  )
}
