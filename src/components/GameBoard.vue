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
            :class="{ 'game-board__tile-image--highlighted': tile.highlighted }"
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
      default: true
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
          active: false,
          highlighted: false
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
    canMoveTile(currentTile, newTile) {
      if (Math.abs(newTile.col - currentTile.col) > 1) {
          // trying to move more than 1 space
          return false
        } else if (Math.abs(newTile.row - currentTile.row) > 1) {
          // trying to move more than 1 space
          return false
        } else if (newTile.col != currentTile.col && newTile.row != currentTile.row) {
          // trying to move diagonally
          return false
        } else if (newTile.col === currentTile.col && newTile.row === currentTile.row) {
          // this is where you are already!
          return false
        }
        return true
    },
    selectTile(currentTile) {
      currentTile.active = true

      // highlight available spaces to drag to
      this.tiles.filter((newTile) => this.canMoveTile(currentTile, newTile)).forEach(newTile => newTile.highlighted = true)
    },
    unselectTile(tile) {
      tile.active = false

      this.tiles.forEach(tile => tile.highlighted = false)
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
      if (!this.canMoveTile(currentTile, newTile)) {
        return
      }

      const newType = newTile.type
      const currentType = currentTile.type

      currentTile.type = newType
      newTile.type = currentType

      // TODO: check if swap is makes a match - if not, revert
      const matches = this.detectMatches(currentTile)
      if (matches.length < 2) {
        console.log(`[CERA DEBUG] Matches length is: ${matches.length}, reverting`)
        newTile.type = newType
        currentTile.type = currentType
      }
    },
    detectMatches(startTile) {
      const matchedTiles = []

      console.log('[CERA DEBUG] detectMatches > startTile:', startTile)

      // get upward matches
      console.log('[CERA DEBUG] Getting upward matches...')
      for (let i = startTile.row - 1; i >= 0; i--) {
        console.log('[CERA DEBUG] current index:', i)
        const tileToCompare = this.tiles.find((tile) => tile.row === i && tile.col === startTile.col)
        console.log('[CERA DEBUG] tileToCompare:', tileToCompare)
        if (this.isMatch(startTile, tileToCompare)) {
          console.log('[CERA DEBUG] Tiles are a match!')
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          console.log('[CERA DEBUG] Tiles are NOT a match')
          break
        }
      }

      // get downward matches
      console.log('[CERA DEBUG] Getting downward matches...')
      for (let i = startTile.row + 1; i <= this.rows; i++) {
        console.log('[CERA DEBUG] current index:', i)
        const tileToCompare = this.tiles.find((tile) => tile.row === i && tile.col === startTile.col)
        console.log('[CERA DEBUG] tileToCompare:', tileToCompare)
        if (this.isMatch(startTile, tileToCompare)) {
          console.log('[CERA DEBUG] Tiles are a match!')
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          console.log('[CERA DEBUG] Tiles are NOT a match')
          break
        }
      }

      // get left matches
      console.log('[CERA DEBUG] Getting left matches...')
      for (let i = startTile.col - 1; i >= 0; i--) {
        console.log('[CERA DEBUG] current index:', i)
        const tileToCompare = this.tiles.find((tile) => tile.col === i && tile.row === startTile.row)
        console.log('[CERA DEBUG] tileToCompare:', tileToCompare)
        if (this.isMatch(startTile, tileToCompare)) {
          console.log('[CERA DEBUG] Tiles are a match!')
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          console.log('[CERA DEBUG] Tiles are NOT a match')
          break
        }
      }

      // get right matches
      console.log('[CERA DEBUG] Getting left matches...')
      for (let i = startTile.col + 1; i <= this.columns; i++) {
        console.log('[CERA DEBUG] current index:', i)
        const tileToCompare = this.tiles.find((tile) => tile.col === i && tile.row === startTile.row)
        console.log('[CERA DEBUG] tileToCompare:', tileToCompare)
        if (this.isMatch(startTile, tileToCompare)) {
          console.log('[CERA DEBUG] Tiles are a match!')
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          console.log('[CERA DEBUG] Tiles are NOT a match')
          break
        }
      }

      console.log('[CERA DEBUG] detectMatches > matchedTiles:', matchedTiles)

      return matchedTiles
    },
    isMatch(startTile, tileToCompare) {
      console.log(`[CERA DEBUG] isMatch > startTile.type: ${startTile.type}, tileToCompare.type: ${tileToCompare.type}`)
      return startTile.type === tileToCompare.type
    }
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

  .game-board__tile-image--highlighted {
    background-image: url('~@/assets/tiles/active.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .game-board__tile span {
    position: absolute;
    display: block;
    font-size: 12px;
    line-height: normal;
  }
</style>
