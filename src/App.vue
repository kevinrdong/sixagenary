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
  height: 100%;
  background: #000;
  overflow-x: auto;   /* 視窗太窄 → 出現水平捲軸 */
  overflow-y: auto;   /* 視窗太矮 → 出現垂直捲軸 */
  overscroll-behavior: none;
  touch-action: manipulation;
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

  /* 主容器固定/最小尺寸 */
.site {
  min-width: 1200px;      /* 限定最小寬度 */
  min-height: 900px;      /* 限定最小高度 */
  box-sizing: border-box;
  background: #f7f7f7;
  margin: 0 auto;         /* 視窗大時置中 */
}

  
</style>
