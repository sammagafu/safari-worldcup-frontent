// Mock gameweek and fixtures for transfers view
export const currentGameweek = 27
export const gameweekDeadline = 'Sat 21 Feb, 16:30'

export const mockFixtures = [
  { id: 'f1', date: 'Sat 21 Feb', time: '18:00', home: 'United States', away: 'Mexico' },
  { id: 'f2', date: 'Sat 21 Feb', time: '20:00', home: 'Brazil', away: 'Argentina' },
  { id: 'f3', date: 'Sun 22 Feb', time: '15:00', home: 'France', away: 'Germany' },
  { id: 'f4', date: 'Sun 22 Feb', time: '17:00', home: 'Spain', away: 'England' },
  { id: 'f5', date: 'Mon 23 Feb', time: '19:00', home: 'Portugal', away: 'Netherlands' },
]

/** Deterministic simulated result for a fixture (for MOTM and correct score display). */
export function getSimulatedResult(fixtureId, playerIdsInMatch) {
  if (!playerIdsInMatch?.length) {
    return { homeScore: 1, awayScore: 0, motmPlayerId: null }
  }
  const seed = (fixtureId + '').split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const homeScore = (seed * 1103515245 + 12345) >>> 0
  const awayScore = (seed * 1103515245 + 54321) >>> 0
  const home = (homeScore % 5)
  const away = (awayScore % 5)
  const motmIndex = ((seed * 7919 + 1) >>> 0) % playerIdsInMatch.length
  return {
    homeScore: home,
    awayScore: away,
    motmPlayerId: playerIdsInMatch[motmIndex],
  }
}

export const gameweekLabel = (gw) => `Gameweek ${gw}`
export const gameweekRange = (gw) => {
  const ranges = {
    27: 'Sat 21 Feb - Mon 23 Feb',
    26: 'Sat 14 Feb - Mon 16 Feb',
    28: 'Sat 28 Feb - Mon 2 Mar',
  }
  return ranges[gw] || `Gameweek ${gw}`
}
