import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

// Create a new store instance.
const store = createStore({
    state () {
      return {
        score: 0
      }
    },
    mutations: {
      addToScore (state, value) {
        state.score += value
      }
    }
  })

const app = createApp(App)

// Install the store instance as a plugin
app.use(store)

app.mount('#app')