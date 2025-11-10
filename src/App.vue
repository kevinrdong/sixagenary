<template>
  <div id="app">
   <div class="site">
    <sixagenary />
   </div>
   </div>
</template>

<script>
import sixagenary from './components/sixagenary.vue'

export default {
  name: 'App',
  components: {
    sixagenary
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
  min-height: 100vh;
  overflow-y: auto;    /* 允許垂直捲軸 */
  overflow-x: auto;    /* 允許水平捲軸 */
  background: #000;
}

/* 主容器固定/最小尺寸 */
.site {
  min-width: 1200px;
  min-height: 900px;   /* 強制最小高度 */
  background: #f7f7f7;
  box-sizing: border-box;
}

* {
  font-family: 'Swei B2 Sugar CJK TC', Avenir, Helvetica, Arial, sans-serif;
  touch-action: manipulation;
}

#app {
  font-family: 'Swei B2 Sugar CJK TC', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}
</style>
