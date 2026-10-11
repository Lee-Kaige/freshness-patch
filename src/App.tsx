import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import PostDetailPage from './components/PostDetailPage'
import HomeFeed from './components/HomeFeed'
import paris from './data/parisMuseumPass.json'
import athens from './data/athensAcropolis.json'
import teamlab from './data/teamLabShanghai.json'
import type { CaseData } from './types'

const cases = { paris, athens, teamlab } as Record<string, CaseData>

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [activeCase, setActiveCase] = useState<string | null>(null)
  const caseId = path.split('/')[2]
  const data = cases[caseId]
  const isHome = !data

  useEffect(() => {
    const onPopState = () => {
      const nextPath = window.location.pathname
      if (activeCase && path !== nextPath && (path === '/' || nextPath === '/')) {
        transition(() => setPath(nextPath), nextPath === '/' ? 'close' : 'open')
      } else {
        setPath(nextPath)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [path, activeCase])
  useEffect(() => { document.title = isHome ? '发现 · 时效补丁' : `${data.post.title} · 时效补丁` }, [data, isHome])

  function transition(changePage: () => void, direction: 'open' | 'close') {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      changePage()
      return
    }
    document.documentElement.dataset.pageTransition = direction
    const clearDirection = () => { delete document.documentElement.dataset.pageTransition }
    document.startViewTransition(() => flushSync(changePage)).finished.then(clearDirection, clearDirection)
  }

  function openPost(id: string) {
    flushSync(() => setActiveCase(id))
    transition(() => {
      window.history.pushState({ fromHome: true }, '', `/post/${id}`)
      setPath(`/post/${id}`)
    }, 'open')
  }

  function backHome() {
    if (window.history.state?.fromHome) {
      window.history.back()
    } else {
      flushSync(() => setActiveCase(caseId))
      transition(() => {
        window.history.pushState(null, '', '/')
        setPath('/')
      }, 'close')
    }
  }

  return <>
    <HomeFeed cases={cases} hidden={!isHome} activeCase={activeCase} onOpen={openPost} />
    {!isHome && <PostDetailPage key={data.post.id} data={data} zoomFromFeed={activeCase === caseId} onBack={backHome} />}
  </>
}
