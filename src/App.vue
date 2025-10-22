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
@font-face {
  font-family: 'Swei B2 Sugar CJK TC';
  src: url('./assets/font/SweiB2SugarCJKtc-Bold.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
  overscroll-behavior: none;
}

* {
  font-family: 'Swei B2 Sugar CJK TC', Avenir, Helvetica, Arial, sans-serif;
}

#app {
  font-family: 'Swei B2 Sugar CJK TC', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #000;
  overflow: hidden;
  overscroll-behavior: none;
}
</style>
