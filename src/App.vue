<template>
  <div class="match-3-app">
    <header class="match-3-app__header">
      <h1>Ophelia's Potion Shop</h1>
    </header>
    
    <aside class="match-3-app__left">
      <p>Score: {{ score }}</p>
    </aside>

    <game-board class="match-3-app__main"></game-board>

    <aside class="match-3-app__right">
      <!-- Right -->
    </aside>

    <footer class="match-3-app__footer">
      <p>&copy; Anigrams Productions 2022</p>
    </footer>
  </div>
</template>

<script>
import GameBoard from './components/GameBoard.vue'

export default {
  name: 'App',
  components: {
    GameBoard
  },
  computed: {
    score() {
      return this.$store.state.score
    }
  }
}
</script>

<style>
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  img { 
    display: block; 
  }

  body {
    font-family: 'Quicksand', sans-serif;
    background-image: url('~@/assets/bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    color: #ffffff;
    height: 100vh;
  }

  #app,
  .match-3-app {
    height: 100%;
  }

  h1 {
    font-family: 'Indie Flower', cursive;
    font-size: 54px;
  }

  .match-3-app {
    padding: 20px;
    display: grid;
    grid-template-rows: auto auto auto 1fr auto;
    gap: 20px;
    grid-template-areas:
      "header"
      "leftside"
      "rightside"
      "main"
      "footer";
  }

  .match-3-app__header {
    grid-area: header;
  }

  .match-3-app__left {
    grid-area: leftside;
  }

  .match-3-app__main {
    grid-area: main;
  }

  .match-3-app__right {
    grid-area: rightside;
  }

  .match-3-app__footer {
    grid-area: footer;
    text-align: center;
  }

  /* 2-column layout */
  @media (min-width: 700px) {
    .match-3-app {
      grid-template-columns: 2fr 2fr;
      grid-template-rows: auto auto 1fr auto;
      grid-template-areas:
        "header header"
        "leftside rightside"
        "main main"
        "footer footer";
    }
  }

    /* 3-column layout */
  @media (min-width: 1000px) {
    .match-3-app {
      grid-template-columns: 1fr 3fr 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        "header header header"
        "leftside main rightside"
        "footer footer footer";
    }
  }

</style>
