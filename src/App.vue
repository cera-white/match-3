<template>
  <div class="match-3-app">
    <h1>Match 3</h1>

    <game-board></game-board>
  </div>
</template>

<script>
import GameBoard from './components/GameBoard.vue'

export default {
  name: 'App',
  components: {
    GameBoard
  }
}
</script>

<style>
</style>
