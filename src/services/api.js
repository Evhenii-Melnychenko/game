let gamesCache = null

const envGamesApiUrl = import.meta.env.VITE_GAMES_API_URL?.trim()

const mockUrlCandidates =
  typeof window !== 'undefined' && window.location.protocol === 'file:'
    ? ['./mock-games.json', '/mock-games.json']
    : ['/mock-games.json', './mock-games.json']

const gamesApiCandidates = envGamesApiUrl ? [envGamesApiUrl] : mockUrlCandidates

function normalizeGames(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.games)) {
    return payload.games
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  throw new Error('Unsupported games API response format')
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchGames() {
  if (gamesApiCandidates.some((url) => url.endsWith('mock-games.json'))) {
    await wait(700)
  }

  if (!gamesCache) {
    let lastStatus = 'unknown'

    for (const url of gamesApiCandidates) {
      try {
        const response = await fetch(url)

        if (!response.ok) {
          lastStatus = String(response.status)
          continue
        }

        gamesCache = normalizeGames(await response.json())
        break
      } catch {
        lastStatus = 'network-error'
      }
    }

    if (!gamesCache) {
      throw new Error(`Failed to load games: ${lastStatus}`)
    }
  }

  return gamesCache
}

export async function fetchGameById(id) {
  if (gamesApiCandidates.some((url) => url.endsWith('mock-games.json'))) {
    await wait(350)
  }

  const games = await fetchGames()
  return games.find((game) => game.id === Number(id)) || null
}
