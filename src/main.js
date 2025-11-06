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

// Create pop sound effect
const popSound = new Audio(clickSound)
popSound.volume = 0.5

// Add click event listener to play background music on first click
document.addEventListener('click', () => {
  if (sessionStorage.getItem('bgMusicSet') == null) {
    audio.play()
      .catch(err => console.log('Background music error:', err))
    sessionStorage.setItem('bgMusicSet', 'true')
  }

  // Play click sound on every click
  const sound = popSound.cloneNode()
  sound.play()
    .catch(err => console.log('Pop sound error:', err))
})

window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('bgMusicSet')
  sessionStorage.removeItem('soundEffectSet')
})
window.addEventListener('unload', () => {
  sessionStorage.removeItem('bgMusicSet')
  sessionStorage.removeItem('soundEffectSet')
})