<template>
  <div class="game-board">
    <div class="game-board__row" v-for="(row, rowIndex) in tiles" :key="`row-${rowIndex}`">
      <div class="game-board__tile" v-for="(tile, tileIndex) in row" :key="`tile-${tileIndex}`">
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
    }
  },
  data() {
    const tiles = []
    const tileTypes = ['Heart', 'Star', 'Rainbow', 'Horseshoe', 'Balloon']
    const emptyTile = {
      row: null,
      col: null,
      type: null
    }

    // for each row
    for (let r = 0; r < this.rows; r++) {
      const row = []

      for (let c = 0; c < this.columns; c++) {
        const newTile = Object.assign({}, emptyTile, { row: r, col: c, type: tileTypes[Math.floor(Math.random() * tileTypes.length)] })
        row.push(newTile)
      }

      tiles.push(row)
    }

    return {
      tiles,
      tileTypes,
      emptyTile
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
