import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import bgMusic from './assets/audios/bg.mp3'
import clickSound from './assets/audios/click.mp3'


createApp(App).mount('#app')

// Create audio object with JavaScript
const audio = new Audio(bgMusic)
// Enable looping
audio.loop = true
// Set volume (0.0 to 1.0)
audio.volume = 0.5
// 將背景音樂暴露到全局，以便組件控制
window.bgAudio = audio

// 音頻池類別：用於管理多個音頻實例以減少延遲
class AudioPool {
  constructor(src, poolSize = 5) {
    this.pool = []
    this.currentIndex = 0
    this.poolSize = poolSize

    // 創建音頻池
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(src)
      audio.volume = 0.6
      audio.preload = 'auto'
      // 預加載音頻
      audio.load()
      this.pool.push(audio)
    }
  }

  play() {
    // 獲取當前可用的音頻實例
    const audio = this.pool[this.currentIndex]

    // 重置音頻到開始位置並播放
    audio.currentTime = 0
    audio.play().catch(err => {
      console.log('音效播放失敗:', err)
    })

    // 移動到下一個音頻實例（循環使用）
    this.currentIndex = (this.currentIndex + 1) % this.poolSize
  }
}

// 創建點擊音效池（5 個實例）
const clickAudioPool = new AudioPool(clickSound, 5)

// Add click event listener to play background music on first click
document.addEventListener('click', () => {
  if (sessionStorage.getItem('bgMusicSet') == null) {
    audio.play()
      .catch(err => console.log('Background music error:', err))
    sessionStorage.setItem('bgMusicSet', 'true')
  }

  // 使用音頻池播放點擊音效
  clickAudioPool.play()
})

window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('bgMusicSet')
  sessionStorage.removeItem('soundEffectSet')
})
window.addEventListener('unload', () => {
  sessionStorage.removeItem('bgMusicSet')
  sessionStorage.removeItem('soundEffectSet')
})