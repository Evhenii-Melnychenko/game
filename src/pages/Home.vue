<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import Filters from '../components/Filters.vue'
import GameCard from '../components/GameCard.vue'
import SearchBar from '../components/SearchBar.vue'
import { useGamesStore } from '../store/games'

const route = useRoute()
const router = useRouter()
const gamesStore = useGamesStore()
const { loading, providers, searchQuery, filters, filteredSortedGames } = storeToRefs(gamesStore)

const perPage = 24
const isSyncingFromRoute = ref(false)

const defaultState = {
  q: '',
  provider: 'all',
  page: 1
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseQuery(query) {
  const q = typeof query.q === 'string' ? query.q : defaultState.q
  const provider = typeof query.provider === 'string' ? query.provider : defaultState.provider
  const pageQuery = parsePositiveInt(query.page, defaultState.page)

  return {
    q,
    provider,
    page: pageQuery
  }
}

function buildQueryFromState() {
  const query = {}

  if (searchQuery.value.trim()) {
    query.q = searchQuery.value.trim()
  }

  if (filters.value.provider !== defaultState.provider) {
    query.provider = filters.value.provider
  }

  if (currentPage.value > defaultState.page) {
    query.page = String(currentPage.value)
  }

  return query
}

function applyQueryToState(query) {
  const parsed = parseQuery(query)

  isSyncingFromRoute.value = true

  if (searchQuery.value !== parsed.q) {
    gamesStore.setSearchQuery(parsed.q)
  }

  if (filters.value.provider !== parsed.provider) {
    gamesStore.setFilters({
      provider: parsed.provider
    })
  }

  isSyncingFromRoute.value = false
}

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSortedGames.value.length / perPage)))

const currentPage = computed(() => {
  const parsed = parseQuery(route.query)
  return Math.min(parsed.page, totalPages.value)
})

const pagedGames = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredSortedGames.value.slice(start, end)
})

watch([searchQuery, filters], () => {
  if (isSyncingFromRoute.value) {
    return
  }

  void router.replace({
    query: {
      ...buildQueryFromState(),
      page: undefined
    }
  })
})

watch(
  () => route.query,
  (query) => {
    applyQueryToState(query)
  },
  { deep: true }
)

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    void router.replace({
      query: {
        ...buildQueryFromState(),
        page: nextTotal > defaultState.page ? String(nextTotal) : undefined
      }
    })
  }
})

onMounted(async () => {
  applyQueryToState(route.query)

  if (!gamesStore.games.length) {
    await gamesStore.loadGames()
  }
})

function setSearchQuery(value) {
  gamesStore.setSearchQuery(value)
}

function setFilters(nextFilters) {
  gamesStore.setFilters(nextFilters)
}

async function goToPrevPage() {
  const prevPage = Math.max(1, currentPage.value - 1)
  await router.replace({
    query: {
      ...buildQueryFromState(),
      page: prevPage > defaultState.page ? String(prevPage) : undefined
    }
  })
}

async function goToNextPage() {
  const nextPage = Math.min(totalPages.value, currentPage.value + 1)
  await router.replace({
    query: {
      ...buildQueryFromState(),
      page: nextPage > defaultState.page ? String(nextPage) : undefined
    }
  })
}
</script>

<template>
  <main class="home-page container">
    <header class="hero">
      <p class="eyebrow">Arcade Catalog</p>
      <h1>Browse, filter and launch your next game</h1>
      <p class="hero-copy">Fast discovery for a large game library with client-side search, sorting and details views.</p>
    </header>

    <section class="toolbar" aria-label="Search and filters">
      <SearchBar :model-value="searchQuery" @update:model-value="setSearchQuery" />

      <Filters
        :providers="providers"
        :filters="filters"
        @update:filters="setFilters"
      />
    </section>

    <section v-if="loading" class="games-grid" aria-label="Loading games">
      <article v-for="index in 8" :key="index" class="game-card skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </article>
    </section>

    <section v-else-if="pagedGames.length" class="games-grid" aria-label="Games list">
      <GameCard v-for="game in pagedGames" :key="game.id" :game="game" />
    </section>

    <section v-else class="empty-state" aria-live="polite">
      <h2>No games found</h2>
      <p>Try another search query or adjust your filters.</p>
    </section>

    <nav v-if="!loading && filteredSortedGames.length" class="pagination" aria-label="Pagination">
      <button type="button" :disabled="currentPage <= 1" @click="goToPrevPage">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button type="button" :disabled="currentPage >= totalPages" @click="goToNextPage">Next</button>
    </nav>
  </main>
</template>
