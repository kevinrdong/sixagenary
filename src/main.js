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

// 使用 Web Audio API 預載音效（更低延遲）
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let clickBuffer = null

// 載入並解碼點擊音效
fetch(clickSound)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    clickBuffer = audioBuffer
    console.log('點擊音效已載入')
  })
  .catch(err => {
    console.error('載入點擊音效失敗:', err)
  })

// 播放點擊音效函數
function playClickSound() {
  if (!clickBuffer) {
    console.log('音效尚未載入')
    return
  }

  try {
    const source = audioContext.createBufferSource()
    source.buffer = clickBuffer

    // 創建音量控制節點
    const gainNode = audioContext.createGain()
    gainNode.gain.value = 0.6 // 設置音量 (0.0 到 1.0)

    // 連接：source -> gainNode -> destination
    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    source.start(0)
  } catch (err) {
    console.error('播放音效失敗:', err)
  }
}

// Add click event listener to play background music on first click
document.addEventListener('click', () => {
  // 恢復 AudioContext（某些瀏覽器需要用戶交互）
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  if (sessionStorage.getItem('bgMusicSet') == null) {
    audio.play()
      .catch(err => console.log('Background music error:', err))
    sessionStorage.setItem('bgMusicSet', 'true')
  }

  // 使用 Web Audio API 播放點擊音效
  playClickSound()
})

window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('bgMusicSet')
  sessionStorage.removeItem('soundEffectSet')
})
window.addEventListener('unload', () => {
  sessionStorage.removeItem('bgMusicSet')
  sessionStorage.removeItem('soundEffectSet')
})