<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="game-card">
    <div class="media-wrap">
      <img :src="game.image" :alt="game.name" loading="lazy" />
    </div>

    <div class="game-card__content">
      <h3>{{ game.name }}</h3>
      <p class="provider">{{ game.provider }}</p>
      <p class="players">{{ game.players.toLocaleString() }} players</p>

      <RouterLink class="details-link" :to="`/game/${game.id}`">Open details</RouterLink>
    </div>
  </article>
</template>
