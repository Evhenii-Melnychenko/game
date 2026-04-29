import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchGames, fetchGameById } from '../services/api'

export const useGamesStore = defineStore('games', () => {
  const games = ref([])
  const loading = ref(false)
  const detailsLoading = ref(false)
  const searchQuery = ref('')

  const filters = ref({
    provider: 'all'
  })

  const providers = computed(() => {
    const list = new Set(games.value.map((game) => game.provider))
    return ['all', ...list]
  })

  const filteredSortedGames = computed(() => {
    const term = searchQuery.value.trim().toLowerCase()

    const filtered = games.value.filter((game) => {
      const byName = term ? game.name.toLowerCase().includes(term) : true
      const byProvider =
        filters.value.provider === 'all' || game.provider === filters.value.provider

      return byName && byProvider
    })

    return filtered
  })

  async function loadGames() {
    loading.value = true

    try {
      games.value = await fetchGames()
    } finally {
      loading.value = false
    }
  }

  async function loadGameDetails(id) {
    detailsLoading.value = true

    try {
      return await fetchGameById(id)
    } finally {
      detailsLoading.value = false
    }
  }

  function setSearchQuery(value) {
    searchQuery.value = value
  }

  function setFilters(nextFilters) {
    filters.value = {
      ...filters.value,
      ...nextFilters
    }
  }

  return {
    games,
    loading,
    detailsLoading,
    searchQuery,
    filters,
    providers,
    filteredSortedGames,
    loadGames,
    loadGameDetails,
    setSearchQuery,
    setFilters
  }
})
