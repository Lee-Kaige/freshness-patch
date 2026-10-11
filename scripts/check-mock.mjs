import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

for (const name of ['parisMuseumPass', 'athensAcropolis', 'teamLabShanghai']) {
  const data = JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url)))
  assert.equal(data.freshness_summary.riskCount, data.updates.length)
  assert.equal(new Set(data.updates.map(update => update.id)).size, data.updates.length)
  assert.ok(existsSync(new URL(`../public${data.post.cover_image}`, import.meta.url)), `${name}: cover image missing`)
  for (const comment of data.post.comments_preview) {
    if (comment.avatar) assert.ok(existsSync(new URL(`../public${comment.avatar}`, import.meta.url)), `${comment.id}: avatar missing`)
  }
  for (const update of data.updates) {
    const paragraph = data.post.body.find(item => item.id === update.target_paragraph_id)
    assert.ok(paragraph?.text.includes(update.highlight_text), `${update.id}: highlight missing from target paragraph`)
    assert.ok(update.summary_old && update.summary_new, `${update.id}: compact comparison missing`)
    assert.ok(update.source_type && update.source_name && update.source_date && update.source_reason)
    if (update.source_comment_id) assert.ok(data.post.comments_preview.some(comment => comment.id === update.source_comment_id), `${update.id}: source comment missing`)
  }
  if (name === 'athensAcropolis') {
    assert.equal(data.updates.length, 2)
    assert.equal(data.updates[0].type, 'invalid')
    assert.equal(data.updates[1].type, 'changed')
  }
  if (name === 'teamLabShanghai') {
    assert.equal(data.updates.length, 1)
    assert.equal(data.updates[0].type, 'invalid')
    assert.equal(data.post.comments_preview.length, 1)
  }
}
console.log('Paris, Athens, and teamLab mock data links and sources are valid.')
