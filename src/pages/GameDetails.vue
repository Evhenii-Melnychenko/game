<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGamesStore } from '../store/games'

const route = useRoute()
const router = useRouter()
const gamesStore = useGamesStore()

const game = ref(null)

const notFound = computed(() => !gamesStore.detailsLoading && !game.value)

onMounted(async () => {
  game.value = await gamesStore.loadGameDetails(route.params.id)
})

function goBack() {
  router.back()
}

function playGame() {
  if (game.value) {
    alert(`Launching ${game.value.name}... (mock)`)
  }
}
</script>

<template>
  <main class="details-page container">
    <button class="back-button" type="button" @click="goBack">Back</button>

    <section v-if="gamesStore.detailsLoading" class="details-loading" aria-label="Loading game details">
      <div class="spinner"></div>
    </section>

    <section v-else-if="game" class="details-card">
      <img :src="game.image" :alt="game.name" loading="lazy" />

      <div>
        <p class="eyebrow">{{ game.provider }}</p>
        <h1>{{ game.name }}</h1>
        <p class="meta">{{ game.players.toLocaleString() }} active players</p>
        <p class="description">{{ game.description }}</p>
        <button class="play-button" type="button" @click="playGame">Play</button>
      </div>
    </section>

    <section v-else-if="notFound" class="empty-state">
      <h2>Game not found</h2>
      <p>The requested game does not exist in the mock catalog.</p>
    </section>
  </main>
</template>
