import { mockPlayers } from '@/data/players'

const SLOTS = [
  { slot: 'GK', pos: 'GK' },
  { slot: 'B_GK', pos: 'GK' },
  { slot: 'DEF', pos: 'DEF' }, { slot: 'DEF', pos: 'DEF' }, { slot: 'DEF', pos: 'DEF' }, { slot: 'DEF', pos: 'DEF' },
  { slot: 'B_DEF', pos: 'DEF' },
  { slot: 'MID', pos: 'MID' }, { slot: 'MID', pos: 'MID' }, { slot: 'MID', pos: 'MID' }, { slot: 'MID', pos: 'MID' },
  { slot: 'B_MID', pos: 'MID' },
  { slot: 'FWD', pos: 'FWD' }, { slot: 'FWD', pos: 'FWD' },
  { slot: 'B_FWD', pos: 'FWD' },
]

function seededRandom(seed) {
  return () => {
    seed = (seed * 1103515245 + 12345) >>> 0
    return seed / 0xffffffff
  }
}

/** Deterministic mock squad for a manager (for viewing someone's team). */
export function getMockTeamForManager(managerId) {
  const seed = (managerId + '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 1
  const rand = seededRandom(seed)

  const byPos = { GK: [], DEF: [], MID: [], FWD: [] }
  mockPlayers.forEach((p) => {
    if (byPos[p.position]) byPos[p.position].push({ ...p })
  })

  const shuffle = (arr, r) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  Object.keys(byPos).forEach((pos) => { byPos[pos] = shuffle(byPos[pos], rand) })

  const BUDGET = 100
  const MAX_PER_COUNTRY = 3
  let spent = 0
  const usedIds = new Set()
  const teamCounts = {}
  const picks = []

  for (const { slot, pos } of SLOTS) {
    const pool = byPos[pos].filter((p) => {
      if (usedIds.has(p.id) || spent + p.price > BUDGET) return false
      return (teamCounts[p.team] || 0) < MAX_PER_COUNTRY
    })
    if (pool.length === 0) break
    const idx = Math.floor(rand() * pool.length)
    const pick = pool[idx]
    usedIds.add(pick.id)
    spent += pick.price
    teamCounts[pick.team] = (teamCounts[pick.team] || 0) + 1
    picks.push({
      player: { ...pick },
      slot,
      isCaptain: picks.length === 0,
      isViceCaptain: picks.length === 1,
    })
  }

  return picks
}
