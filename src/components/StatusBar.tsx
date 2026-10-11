export default function StatusBar() {
  return <div className="status-bar" aria-hidden="true">
    <strong>22:47</strong>
    <div className="status-right">
      <span className="signal-bars"><i /><i /><i /><i /></span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></svg>
      <span className="battery"><span /></span>
    </div>
  </div>
}
