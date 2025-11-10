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
  background-color: #000;
  overscroll-behavior: none;
  touch-action: manipulation;
  overflow: auto; /* 若要固定畫面改成 hidden */
}

/* 主容器固定/最小尺寸 */
  .site {
  min-width: 900px;     /* 限定最小寬度 */
  min-height: 900px;     /* 限定最小高度 */
  margin: 0 auto;        /* 視窗大時置中 */
  box-sizing: border-box;
  background: #f7f7f7;
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
  height: 100%;
  background-color: #000;
}
</style>
