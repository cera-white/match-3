<template>
  <div class="game-board" ref="gameBoard">
    <div class="game-board__wrapper">
      <div class="game-board__row" v-for="row in rows" :key="`row-${row}`">
        <div class="game-board__tile" :class="{ 'game-board__tile--active': tile.active }"
          v-for="tile in tiles.slice((row - 1) * columns, row * columns)"
          :key="tile.id"
          :style="tileStyle"
          @drop="onDrop($event, tile)"
          @dragover.prevent
          @dragenter.prevent
        >
          <span v-if="debug">
            Row: {{ tile.row }} <br/>
            Col: {{ tile.col }} <br/>
            ID: {{ tile.id }}
          </span>
          <img class="game-board__tile-image" 
            :src="require(`@/assets/tiles/${tile.type}.png`)" 
            :alt="tile.type" 
            draggable="true"
            @dragstart="startDrag($event, tile)"
            @dragend="endDrag($event, tile)" />
        </div>
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
        return ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
      }
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const tiles = []
    let tileId = 0

    // for each row
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const tile = {
          id: tileId,
          row: r,
          col: c,
          type: this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)],
          active: false
        }
        tiles.push(tile)
        tileId++
      }
    }

    return {
      tiles,
      tileSize: 5
    }
  },
  computed: {
    tileStyle() {
      return {
        width: `${this.tileSize}px`,
        height: `${this.tileSize}px`
      };
    }
  },
  methods: {
    calculateTileSize() {
      const boardSize = Math.min(this.$refs.gameBoard.clientHeight, this.$refs.gameBoard.clientWidth) - 24 // padding on game-board__wrapper x 2 (top & bottom)
      const tileSize = Math.floor(boardSize / this.rows)

      this.tileSize = tileSize
    },
    selectTile(tile) {
      tile.active = true
    },
    unselectTile(tile) {
      tile.active = false
    },
    startDrag(evt, tile) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('tileID', tile.id)
      this.selectTile(tile)
    },
    endDrag(evt, tile) {
      this.unselectTile(tile)
    },
    onDrop(evt, currentTile) {
      const tileID = evt.dataTransfer.getData('tileID')
      const newTile = this.tiles.find((tile) => tile.id == tileID)

      // only allow swapping of tiles next to each other
      if (Math.abs(newTile.col - currentTile.col) > 1) {
        // trying to move more than 1 space
        return
      } else if (Math.abs(newTile.row - currentTile.row) > 1) {
        // trying to move more than 1 space
        return
      } else if (newTile.col != currentTile.col && newTile.row != currentTile.row) {
        // trying to move diagonally
        return
      }

      // TODO: check if swap is possible

      const newType = newTile.type
      const currentType = currentTile.type

      currentTile.type = newType
      newTile.type = currentType
    },
  },
  mounted() {
    this.calculateTileSize()
  }
}
</script>

<style scoped>
  .game-board {
    text-align: center;
  }

  .game-board__wrapper {
    background: rgba(0,0,0,0.8);
    border-radius: 12px;
    display: inline-block;
    padding: 12px;
  }

  .game-board__row {
    line-height: 0;
  }

  .game-board__tile {
    display: inline-block;
    line-height: 0;
    padding: 4px;
    position: relative;
  }

  .game-board__tile-image {
    width: 100%;
    height: 100%;
  }

  .game-board__tile span {
    position: absolute;
    display: block;
    font-size: 12px;
    line-height: normal;
  }
</style>
