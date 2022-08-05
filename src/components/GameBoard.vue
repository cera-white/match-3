<template>
  <div class="game-board">
    <div class="game-board__row" v-for="(row, rowIndex) in tiles" :key="`row-${rowIndex}`">
      <div class="game-board__tile" v-for="(tile, tileIndex) in row" :key="`tile-${tileIndex}`">
        {{ tile.type }}
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
    const tile = {
      type: null
    }

    // for each row
    for (let r = 0; r < this.rows; r++) {
      const row = []

      for (let c = 0; c < this.columns; c++) {
        const newTile = Object.assign({}, tile, { type: tileTypes[Math.floor(Math.random() * tileTypes.length)] })
        row.push(newTile)
      }

      tiles.push(row)
    }

    return {
      tiles,
      tileTypes
    }
  }
}
</script>

<style scoped>
  .game-board__tile {
    display: inline-block;
    width: 75px;
    height: 75px;
    border: 1px solid black;
  }
</style>
