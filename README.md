# Workshop: Create a Match 3 Game

## About the Project

Something _like_ https://en.wikipedia.org/wiki/Bejeweled

8x8 grid composed of multi-value tiles

actions:
- click on two adjacent tiles to swap
- swap horizontal neighbors
- swap vertical neighbors
- can only swap if the result makes a match

goals:
- make connecting lines (horizontal or vertical) of 3 or more matching tiles

mutations:
- matches disappear
- tiles "fall" to fill gaps
- new tiles fill from the top to fill up the grid

lose condition:
- can make no further moves

score:
- score increases for:
    - each match made
    - each match composed of more than 3 items

milestones:
- board displays
- can swap tiles
- matches are detected
- matches are removed
- board falls into gaps
- board fills in top
- lose condition checked
- points
- bonus items?


## Project Setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
