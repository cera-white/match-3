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
          <Transition name="tile">
            <img v-if="tile.type"
              class="game-board__tile-image"
              :class="{ 'game-board__tile-image--highlighted': tile.highlighted }"
              :src="require(`@/assets/tiles/${tile.type}.png`)"
              :alt="tile.type"
              :draggable="!gridRefilling"
              @dragstart="startDrag($event, tile)"
              @dragend="endDrag($event, tile)" />
          </Transition>
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
          type: this.getRandomType(),
          active: false,
          highlighted: false
        }
        tiles.push(tile)
        tileId++
      }
    }

    return {
      tiles,
      tileSize: 5,
      gridRefilling: false
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
    getRandomType() {
      return this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)]
    },
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

      // check if swap is makes a match - if not, revert
      const matches = this.detectMatches(currentTile)
      if (matches.length < 2) {
        newTile.type = newType
        currentTile.type = currentType
      }

      this.$nextTick(() => {
        this.clearMatches()
      })
    },
    detectMatches(startTile) {
      const matchedTiles = []

      // get upward matches
      for (let i = startTile.row - 1; i >= 0; i--) {
        const tileToCompare = this.tiles.find((tile) => tile.row === i && tile.col === startTile.col)
        if (this.isMatch(startTile, tileToCompare)) {
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          break
        }
      }

      // get downward matches
      for (let i = startTile.row + 1; i < this.rows; i++) {
        const tileToCompare = this.tiles.find((tile) => tile.row === i && tile.col === startTile.col)
        if (this.isMatch(startTile, tileToCompare)) {
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          break
        }
      }

      // get left matches
      for (let i = startTile.col - 1; i >= 0; i--) {
        const tileToCompare = this.tiles.find((tile) => tile.col === i && tile.row === startTile.row)
        if (this.isMatch(startTile, tileToCompare)) {
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          break
        }
      }

      // get right matches
      for (let i = startTile.col + 1; i < this.columns; i++) {
        const tileToCompare = this.tiles.find((tile) => tile.col === i && tile.row === startTile.row)
        if (this.isMatch(startTile, tileToCompare)) {
          matchedTiles.push(tileToCompare)
        } else {
          // as soon as we find a non-match, break out of the loop
          break
        }
      }

      return matchedTiles
    },
    isMatch(startTile, tileToCompare) {
      return startTile.type && tileToCompare.type && startTile.type === tileToCompare.type
    },
    clearMatches() {
      // for each tile on the board, check for matches
      this.tiles.forEach((currentTile) => {
        const matches = this.detectMatches(currentTile)
        if (matches.length >= 2) {
          // matches found, removing matched tiles
          currentTile.type = null
          matches.forEach((matchedTile) => {
            matchedTile.type = null
          })

          // add points to score
          this.$nextTick(() => {
            this.$store.commit('addToScore', matches.length + 1)
          })
        }
      })

      this.$nextTick(() => {
        this.refillBoard()
      })
    },
    refillBoard() {
      this.gridRefilling = true

      // if no empty tiles in the board, skip this step
      if (this.tiles.filter((tile) => tile.type === null).length < 1) {
        this.gridRefilling = false
        return;
      }

      // for each column, for each non-empty tile starting from the bottom, check if the tile under it is empty
      // if so, swap the tiles, else leave it alone
      // once all non-empty tiles have been moved, then fill in remaining spaces

      // for each column...
      for (let c = 0; c < this.columns; c++) {
        // for each row starting from the bottom...
        for (let r = (this.rows - 1); r > 0; r--) {
          // get tile
          const currentTile = this.tiles.find((tile) => tile.col === c && tile.row === r)

          // if tile is empty...
          if (!currentTile.type) {
            // get next non-empty tile
            const nonEmptyTiles = this.tiles.filter((tile) => tile.col === c && tile.row < r && tile.type !== null).sort((a, b) => (a.row < b.row) ? 1 : -1)

            if (nonEmptyTiles.length > 0) {
              const newTile = nonEmptyTiles[0]

              const currentType = currentTile.type
              const newType = newTile.type

              // swap tiles
              currentTile.type = newType
              newTile.type = currentType
            }
          }
        }

        // fill in remaining empty spaces
        this.$nextTick(() => {
          this.tiles.filter((tile) => tile.col === c && tile.type === null).forEach(tile => {
            tile.type = this.getRandomType()
          })
        })
      }

      // clear matches again, which will call this method again, until all tiles are filled
      this.$nextTick(() => {
        this.clearMatches()
      })
    }
  },
  mounted() {
    this.calculateTileSize()
    this.clearMatches()
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

  .tile-enter-active,
  .tile-leave-active {
    transition: opacity 0.2s ease;
  }

  .tile-enter-from,
  .tile-leave-to {
    opacity: 0;
  }
</style>
