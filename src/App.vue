<template>
  <div id="app">
    <sexagenary />
  </div>
</template>

<script>
import sexagenary from './components/sexagenary.vue'

export default {
  name: 'App',
  components: {
    sexagenary
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
</style>
