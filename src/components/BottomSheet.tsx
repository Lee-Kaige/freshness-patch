import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { CompactCompare, SourceDetail, StatusBadge } from './PatchParts'
import type { CaseData, Update } from '../types'

function FreshnessSummary({ summary }: { summary: CaseData['freshness_summary'] }) {
  return (
    <div className="sheet-summary">
      <span className="sheet-eyebrow"><span className="eyebrow-dot" /> 时效补丁</span>
      <h2 id="sheet-title">{summary.title}</h2>
      <p>{summary.subtitle}</p>
    </div>
  )
}

function UpdateCard({ update, sourceComment, onSelect }: { update: Update; sourceComment?: CaseData['post']['comments_preview'][number]; onSelect: (id: string) => void }) {
  const [sourceOpen, setSourceOpen] = useState(false)

  return (
    <article className={`update-card update-${update.type}`} data-update-id={update.id}>
      <button className="update-card-main" type="button" onClick={() => onSelect(update.id)} aria-label={`定位原文：${update.title}`}>
        <span className="update-card-heading">
          <strong>{update.title}</strong>
          <StatusBadge update={update} />
        </span>
        <CompactCompare update={update} />
        <span className="impact"><span>影响</span>{update.impact}</span>
        <span className="locate-hint">定位原文 <span aria-hidden="true">↗</span></span>
      </button>
      <button
        className="source-toggle"
        type="button"
        aria-expanded={sourceOpen}
        onClick={() => setSourceOpen(value => !value)}
      >
        {sourceOpen ? '收起来源' : update.type === 'recalculate' ? '查看原因' : '查看来源'} <span aria-hidden="true">{sourceOpen ? '⌃' : '⌄'}</span>
      </button>
      {sourceOpen && <SourceDetail update={update} sourceComment={sourceComment} />}
    </article>
  )
}

export default function BottomSheet({ data, focusUpdateId, onClose, onSelect }: {
  data: CaseData
  focusUpdateId: string | null
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const sheetRef = useRef<HTMLElement>(null)
  const dragStart = useRef<number | null>(null)
  const [exitAction, setExitAction] = useState<string | null | undefined>(undefined)
  const closing = exitAction !== undefined

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const cards = Array.from(sheetRef.current?.querySelectorAll<HTMLElement>('.update-card') ?? [])
    const card = cards.find(item => item.dataset.updateId === focusUpdateId) ?? cards[0]
    if (focusUpdateId && card) {
      const scroller = sheetRef.current?.querySelector<HTMLElement>('.sheet-scroll')
      if (scroller) scroller.scrollTop += card.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 8
    }
    card?.querySelector('button')?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [focusUpdateId])

  function dismiss(updateId: string | null = null) {
    if (!closing) setExitAction(updateId)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      dismiss()
    }
    if (event.key !== 'Tab') return
    const buttons = sheetRef.current?.querySelectorAll<HTMLButtonElement>('button')
    if (!buttons?.length) return
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div className={`sheet-backdrop ${closing ? 'closing' : ''}`} onClick={event => { if (event.target === event.currentTarget) dismiss() }}>
      <section
        ref={sheetRef}
        className={`bottom-sheet ${closing ? 'closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onKeyDown={onKeyDown}
        onAnimationEnd={event => {
          if (event.target !== event.currentTarget || !closing) return
          if (exitAction) onSelect(exitAction)
          else onClose()
        }}
      >
        <div
          className="sheet-drag-zone"
          aria-hidden="true"
          onPointerDown={event => {
            dragStart.current = event.clientY
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerUp={event => {
            if (dragStart.current !== null && event.clientY - dragStart.current > 70) dismiss()
            dragStart.current = null
          }}
        ><span className="sheet-handle" /></div>
        <button className="sheet-close" type="button" onClick={() => dismiss()} aria-label="关闭时效补丁">×</button>
        <div className="sheet-scroll">
          <FreshnessSummary summary={data.freshness_summary} />
          <div className="updates-heading"><span>变化明细</span><span>01 — 0{data.updates.length}</span></div>
          <div className="updates-list">
            {data.updates.map(update => <UpdateCard key={update.id} update={update} sourceComment={data.post.comments_preview.find(comment => comment.id === update.source_comment_id)} onSelect={dismiss} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
