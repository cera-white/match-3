<template>
  <div class="game-board">
    <div class="game-board__row" v-for="row in rows" :key="`row-${row}`">
      <div class="game-board__tile" v-for="tile in tiles.slice((row - 1) * columns, row * columns)" :key="`tile-r${tile.row}-c${tile.col}`">
        <span>Row: {{ tile.row }}</span>
        <span>Col: {{ tile.col }}</span>
        <span>{{ tile.type }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',
  props: {
    rows: {
      type: Number,
      default: 8
    },
    columns: {
      type: Number,
      default: 8
    },
    tileTypes: {
      type: Array,
      default() {
        return ['heart', 'star', 'rainbow', 'horseshoe', 'balloon']
      }
    }
  },
  data() {
    const tiles = []

    // for each row
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const tile = {
          row: r,
          col: c,
          type: this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)]
        }
        tiles.push(tile)
      }
    }

    return {
      tiles
    }
  }
}
</script>

<style scoped>
  .game-board__tile {
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid black;
  }

  .game-board__tile span {
    display: block;
    margin: 0;
    padding: 0;
  }
</style>
