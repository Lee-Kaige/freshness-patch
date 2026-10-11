import type { MouseEvent } from 'react'
import StatusBar from './StatusBar'
import type { CaseData } from '../types'

type FeedItem = {
  id: string
  title: string
  author: string
  likes: number
  ratio: 'square' | 'portrait' | 'tall'
  image?: string
  caseId?: string
  variant?: string
}

const iconPaths = {
  message: <path d="M20 11.5a8 8 0 0 1-8 8 8.8 8.8 0 0 1-3.4-.7L4 20l1.2-4.5A8 8 0 1 1 20 11.5Z" />,
  search: <><circle cx="10.8" cy="10.8" r="7.2" /><path d="m16 16 5 5" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  plus: <path d="M12 4v16M4 12h16" />,
}

function Icon({ name, size = 23 }: { name: keyof typeof iconPaths; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function HomeHeader() {
  return <header className="home-header">
    <StatusBar />
    <div className="home-top-bar">
      <span className="home-top-icon" aria-hidden="true"><Icon name="message" size={22} /></span>
      <div className="home-main-tabs" aria-label="内容频道">
        <span>关注</span><strong className="active">发现</strong><span>米兰</span>
      </div>
      <span className="home-top-icon" aria-hidden="true"><Icon name="search" size={24} /></span>
    </div>
  </header>
}

function CategoryTabs() {
  return <nav className="home-categories" aria-label="内容分类">
    {['推荐', '旅行', '生活', '艺术', '穿搭', '经验'].map((label, index) => <span className={index === 0 ? 'active' : ''} key={label}>{label}</span>)}
  </nav>
}

function FeedCard({ item, activeCase, onOpen }: { item: FeedItem; activeCase: string | null; onOpen: (id: string) => void }) {
  const content = <>
    <div className={`feed-cover feed-cover-${item.ratio} ${item.variant ?? ''}`}>
      {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" />}
    </div>
    <div className="feed-card-copy">
      <strong className="feed-card-title">{item.title}</strong>
      <div className="feed-card-meta">
        <span className={`feed-avatar ${item.caseId ? `feed-avatar-${item.caseId}` : ''}`} aria-hidden="true">{item.author.slice(0, 1)}</span>
        <span className="feed-card-author">{item.author}</span>
        <span className="feed-card-likes"><Icon name="heart" size={15} />{item.likes}</span>
      </div>
    </div>
  </>

  if (!item.caseId) return <article className="feed-card" key={item.id}>{content}</article>
  return <a className={`feed-card feed-card-link ${activeCase === item.caseId ? 'is-transition-target' : ''}`} href={`/post/${item.caseId}`} onClick={(event: MouseEvent<HTMLAnchorElement>) => { if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onOpen(item.caseId!) }} key={item.id}>{content}</a>
}

function MasonryFeed({ items, activeCase, onOpen }: { items: FeedItem[]; activeCase: string | null; onOpen: (id: string) => void }) {
  return <div className="feed-columns">
    {[0, 1].map(column => <div className="feed-column" key={column}>
      {items.filter((_, index) => index % 2 === column).map(item => <FeedCard item={item} activeCase={activeCase} onOpen={onOpen} key={item.id} />)}
    </div>)}
  </div>
}

function BottomNav() {
  return <nav className="home-bottom-nav" aria-label="底部导航">
    <span className="active">首页</span>
    <span>市集</span>
    <span className="home-nav-plus" aria-label="发布"><Icon name="plus" size={27} /></span>
    <span>消息</span>
    <span>我</span>
  </nav>
}

export default function HomeFeed({ cases, hidden, activeCase, onOpen }: { cases: Record<string, CaseData>; hidden: boolean; activeCase: string | null; onOpen: (id: string) => void }) {
  const items: FeedItem[] = [
    { id: 'mock-001', title: '秋天在米兰这样穿真的很舒服', author: 'Mia的衣橱', likes: 243, ratio: 'square', variant: 'mock-fashion' },
    { id: 'feed-paris', caseId: 'paris', title: '巴黎博物馆48H通票真的能回本吗？', author: cases.paris.post.author, likes: cases.paris.post.stats.likes, image: cases.paris.post.cover_image, ratio: 'portrait' },
    { id: 'feed-athens', caseId: 'athens', title: cases.athens.post.title, author: cases.athens.post.author, likes: cases.athens.post.stats.likes, image: cases.athens.post.cover_image, ratio: 'tall' },
    { id: 'mock-002', title: '周末散步发现一家很舒服的小店', author: '慢慢逛', likes: 118, ratio: 'square', variant: 'mock-shop' },
    { id: 'mock-003', title: '旅行前我会做的5件准备', author: '今天也想出发', likes: 356, ratio: 'portrait', variant: 'mock-travel' },
    { id: 'feed-teamlab', caseId: 'teamlab', title: cases.teamlab.post.title, author: cases.teamlab.post.author, likes: cases.teamlab.post.stats.likes, image: cases.teamlab.post.cover_image, ratio: 'portrait' },
    { id: 'mock-004', title: '最近很喜欢这种安静的展览空间', author: '艺术散步', likes: 87, ratio: 'portrait', variant: 'mock-art' },
  ]

  return <div className="app-shell home-shell" hidden={hidden}>
    <main className="phone-frame home-frame">
      <HomeHeader />
      <div className="home-scroll">
        <CategoryTabs />
        <MasonryFeed items={items} activeCase={activeCase} onOpen={onOpen} />
      </div>
      <BottomNav />
    </main>
  </div>
}
