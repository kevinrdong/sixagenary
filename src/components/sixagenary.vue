<template>
    <div class="app-container">
        <transition name="fade" mode="out-in">
            <!-- 入口 -->
            <div class="p0-screen" v-if="step == 0" @click="step = 1" key="p0">

                <!-- 文本容器 -->
                <div class="p0-text-container" ref="textContainer">
                    <div class="p0-title-container">
                        <div class="p0-title" data-stroke="人生太難，不如躲進異世界中 !">人生太難，不如躲進異世界中 !</div>
                    </div>
                </div>

                <!-- 底部小图 -->
                <img :src="require('@/assets/images/p0-bottom-image.png')" alt="裝飾圖" class="p0-bottom-image" />

                <!-- 副標題 -->
                <div class="p0-subtitle-wrapper">
                    <div class="p0-subtitle">點擊測你的<span style="color: rgb(158 110 29);">靈魂逃跑</span>指數</div>
                </div>

                <!-- 贊助商圖片 -->
                <img :src="require('@/assets/images/p0-sponsor.png')" alt="贊助商" class="p0-sponsor-image" />

            </div>
            <!-- P1-1 劇情前導 -->
            <div class="p1-screen" v-else-if="step == 1" key="p1">
                <div class="p1-content" :class="{ 'p1-text-fade-out': p1TextHidden, 'p1-content-hidden': !p1ContentVisible }">
                    <!-- 上方文字说明 -->
                    <div class="p1-text-top">
                        <div class="p1-text-top-line1" v-html="p1TextTop1Display"></div>
                        <div class="p1-text-top-line2" v-html="p1TextTop2Display"></div>
                    </div>
                </div>

                <!-- 转场视频 -->
                <video
                    ref="p1Video"
                    class="p1-transition-video p1-video-show"
                    :src="require('@/assets/images/step1_bg.mp4')"
                    muted
                    playsinline
                    @ended="onP1VideoEnded"
                ></video>

                <!-- 下方内容 -->
                <div class="p1-bottom-section" :class="{ 'p1-text-fade-out': p1TextHidden, 'p1-content-hidden': !p1ContentVisible }">
                    <div class="p1-text-bottom">
                        <!-- <div class="p1-text-bottom-line1" v-html="p1TextBottom1Display"></div> -->
                        <div class="p1-text-bottom-line2" v-html="p1TextBottom2Display"></div>
                    </div>

                    <!-- 按钮 -->
                    <div class="p1-button" :class="{ 'p1-button-scale-up': p1ButtonClicked }" @click="startP1VideoAndTransition">
                        <img :src="require('@/assets/images/p1-button-bg.png')" alt="按鈕背景" class="p1-button-bg" />
                        <span class="p1-button-text">進入異世界冒險</span>
                    </div>

                    <!-- 聲音提示 -->
                    <div class="p1-sound-hint">（打開聲音獲得最佳體驗）</div>
                </div>

                <!-- Logo -->
                <img :src="require('@/assets/images/white_logo.png')" alt="Logo" class="p1-logo" />
            </div>

            <div class="question-screen" v-else-if="step == 3" key="p3">
                <div class="txt">
                    <p>選擇一幅畫</p>
                    <p>進入你的專屬結局</p>
                </div>
                <!-- 主内容 -->
                <div class="p3-main-content">
                    <!-- 图片容器 -->
                    <div class="p3-image-container">
                        <!-- 可滑动的卡片容器 -->
                        <div
                            class="p3-cards-wrapper"
                            ref="cardsWrapper"
                            @mousedown="startDrag"
                            @touchstart="startDrag"
                            @mousemove="onDrag"
                            @touchmove="onDrag"
                            @mouseup="endDrag"
                            @touchend="endDrag"
                            @mouseleave="endDrag"
                        >
                            <div
                                v-for="(card, index) in cards"
                                :key="`card-${index}`"
                                class="p3-card"
                                :class="{ 'p3-card-selected': getCardPosition(index) === 'center' && showGlow }"
                                :style="getCardStyle(index)"
                                @click="selectCard(index)"
                            >
                                <img :src="card.image" :alt="card.name" />
                            </div>
                        </div>

                        <!-- 渐变遮罩 -->
                        <!-- <div class="p3-gradient-overlay"></div> -->
                    </div>

                    <!-- 按钮组 -->
                    <div class="p3-button-group">
                        <!-- 确定按钮 -->
                        <div class="p3-button" :class="{ 'p3-button-scale-up': p3ButtonClicked }"  @click="confirmSelection">
                            <img :src="require('@/assets/images/p3-button-bg.png')" alt="按鈕背景" class="p3-button-bg" />
                            <span class="p3-button-text">確定</span>
                        </div>

                        <!-- 重新选择按钮 -->
                        <!-- <div class="p3-button" @click="resetSelection">
                            <img :src="require('@/assets/images/p1-button-bg.png')" alt="按鈕背景" class="p3-button-bg" />
                            <span class="p3-button-text">重新選擇</span>
                        </div> -->
                    </div>
                </div>

                <!-- Logo -->
                <img :src="require('@/assets/images/white_logo.png')" alt="Logo" class="p3-logo" />
            </div>
            <div id="question-container" class="question-screen" v-else-if="step == 4" key="p4">
                <transition name="fade" mode="out-in">
                    <div :key="questionNum">
                        <!-- 進度條 -->
                        <div class="progress-bar-container" :class="{ 'show': showProgressBar }">
                            <div class="progress-bar-background">
                                <div class="progress-bar-fill" :style="{ width: progressWidth + '%' }"></div>
                            </div>
                        </div>

                        <!-- 背景視頻 -->
                        <video
                            class="background-video"
                            :class="{ 'video-loaded': videoLoaded }"
                            :key="`video-${type}-${questionNum}`"
                            :src="currentBackgroundVideo"
                            autoplay
                            loop
                            muted
                            playsinline
                            @loadeddata="onVideoLoaded"
                        ></video>

                        <!-- 內容區 -->
                        <div class="content">
                            <!-- Logo -->
                            <img src="../assets/images/white_logo.png" alt="Logo" class="logo" />

                            <!-- 展覽資訊文字 -->
                            <div class="exhibition-text">
                                <p v-html="currentQuestion.t1"></p>
                                <p v-html="currentQuestion.t2"></p>
                            </div>

                            <!-- 選項按鈕 -->
                            <div class="options">
                                <!-- <div
                                    v-for="(option, index) in options['q' + type][questionNum]"
                                    :key="index"
                                    class="option-item"
                                    @click="selectOption(index)"
                                >
                                    <span class="option-text">{{ option.text }}</span>
                                </div> -->
                                <button
                                    v-for="(option, index) in options['q' + type][questionNum]"
                                    :key="index"
                                    class="option-item"
                                    @click="selectOption(index)"
                                    @touchstart="handleTouchStart"
                                    @touchend="handleTouchEnd"
                                    @touchcancel="handleTouchEnd"
                                >
                                    {{ option.text }}
                                    <div class="star-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            xml:space="preserve"
                                            version="1.1"
                                            style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                                            viewBox="0 0 784.11 815.53"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                        <defs></defs>
                                        <g id="Layer_x0020_1">
                                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                            <path
                                            class="fil0"
                                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                                            ></path>
                                        </g>
                                        </svg>
                                    </div>
                                    <div class="star-2">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xml:space="preserve"
                                        version="1.1"
                                        style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                                        viewBox="0 0 784.11 815.53"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                        <defs></defs>
                                        <g id="Layer_x0020_1">
                                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                            <path
                                            class="fil0"
                                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                                            ></path>
                                        </g>
                                        </svg>
                                    </div>
                                    <div class="star-3">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xml:space="preserve"
                                        version="1.1"
                                        style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                                        viewBox="0 0 784.11 815.53"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                        <defs></defs>
                                        <g id="Layer_x0020_1">
                                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                            <path
                                            class="fil0"
                                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                                            ></path>
                                        </g>
                                        </svg>
                                    </div>
                                    <div class="star-4">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xml:space="preserve"
                                        version="1.1"
                                        style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                                        viewBox="0 0 784.11 815.53"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                        <defs></defs>
                                        <g id="Layer_x0020_1">
                                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                            <path
                                            class="fil0"
                                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                                            ></path>
                                        </g>
                                        </svg>
                                    </div>
                                    <div class="star-5">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xml:space="preserve"
                                        version="1.1"
                                        style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                                        viewBox="0 0 784.11 815.53"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                        <defs></defs>
                                        <g id="Layer_x0020_1">
                                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                            <path
                                            class="fil0"
                                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                                            ></path>
                                        </g>
                                        </svg>
                                    </div>
                                    <div class="star-6">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xml:space="preserve"
                                        version="1.1"
                                        style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                                        viewBox="0 0 784.11 815.53"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                        <defs></defs>
                                        <g id="Layer_x0020_1">
                                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                            <path
                                            class="fil0"
                                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                                            ></path>
                                        </g>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>
                <!-- <img :src="require('@/assets/images/white_logo.png')" alt="Logo" class="p3-logo" /> -->
            </div>
            <div class="question-screen" v-else-if="step == 5" key="p5">
                <!-- 背景視頻 -->
                <video
                    ref="p5Video"
                    class="p5-background-video"
                    :src="require('@/assets/images/clacing.mp4')"
                    autoplay
                    loop
                    muted
                    playsinline
                ></video>

                <!-- 結尾 - 捲軸動畫 -->
                <div class="p5-container">

                    <!-- 內容容器 -->
                    <div class="p5-content">
                        <!-- 主標題 -->
                        <div class="p5-title">您已完成所有冒險！</div>

                        <!-- 副標題容器 -->
                        <div class="p5-subtitle-container">
                            <img :src="require('@/assets/images/p5-decoration.svg')" alt="裝飾" class="p5-decoration" />
                            <div class="p5-subtitle">靈魂逃跑指數 計算中<span class="p5-dots">{{ loadingDots }}</span></div>
                        </div>
                    </div>

                    <!-- Logo -->
                    <img :src="require('@/assets/images/white_logo.png')" alt="Logo" class="p5-logo" />
                </div>
            </div>
            <div class="question-screen p6-screen" v-else-if="step == 6" key="p6">
                <div class="p6-container">
                    <!-- 背景圖片 -->
                    <img :src="require('@/assets/images/resultBG.png')" alt="背景" class="p6-background-image" />

                    <!-- 內容容器 -->
                    <div class="p6-content">
                        <!-- 結果圖片容器：雙層圖片結構 -->
                        <div class="p6-image-wrapper">
                            <!-- 底層：顯示圖片 result_*.png -->
                            <img v-if="result" :src="require(`@/assets/images/result_${result}.png`)" alt="測驗結果" class="p6-result-image" />
                            <!-- 頂層：下載圖片 r_download_*.png (透明覆蓋層) -->
                            <img v-if="result" :src="require(`@/assets/images/r_download_${result}.png`)" alt="下載圖片" class="p6-download-image" />
                        </div>

                        <!-- 按鈕區 -->
                        <div class="p6-buttons">
                            <span class="p6-share-text" style="position: absolute; top: -34px;">▲ 長按圖片下載你的靈魂逃跑指南 ▲</span>
                            <button class="p6-btn" :class="{ 'p6-btn-scale-up': p6Button1Clicked }" @click="handleP6Button1Click">
                                <span class="p6-btn-text">點擊瞭解更多《甲子萬年特展》</span>
                            </button>
                            <button class="p6-btn" :class="{ 'p6-btn-scale-up': p6Button2Clicked }" @click="handleP6Button2Click">
                                <span class="p6-btn-text">再玩一次</span>
                            </button>

                            <!-- 分享提示區 -->
                            <div class="p6-share-section">
                                <div class="p6-share-link" :class="{ 'p6-share-link-scale-up': p6ShareClicked }" @click="handleP6ShareClick">
                                    <span class="p6-share-text" style="font-size: 15px;">分享心得拿故宮南院限量好禮！</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Logo -->
                    <img :src="require('@/assets/images/white_logo.png')" alt="Logo" class="p6-logo" />
                </div>
            </div>
        </transition>

        <!-- 隱藏的視頻預載入元素 -->
        <div style="position: absolute; width: 0; height: 0; overflow: hidden; opacity: 0; pointer-events: none;">
            <video
                v-for="(videoSrc, index) in preloadVideoList"
                :key="`preload-${index}`"
                :ref="el => { if (el) preloadVideoElements.value.push(el) }"
                :src="videoSrc"
                preload="auto"
                muted
                playsinline
                @loadeddata="() => console.log('視頻預載入完成:', videoSrc.substring(videoSrc.lastIndexOf('/') + 1))"
            ></video>
        </div>
    </div>

</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import calculatingSound from '@/assets/audios/calculating.mp3'
// 萬壑松風圖音效
import forestSound from '@/assets/audios/01_樹林環境音.mp3'
import streamSound from '@/assets/audios/02_溪流水聲轟鳴.mp3'
import mistSound from '@/assets/audios/03_雲霧繚繞.mp3'
import mistOpenSound from '@/assets/audios/04-1_雲霧散開.mp3'
import guzhengSound from '@/assets/audios/05_找到文字（古箏）.mp3'
// 谿山行旅圖音效
import waterfallFarSound from '@/assets/audios/01_瀑布聲（遠）.mp3'
import waterfallNearSound from '@/assets/audios/02_瀑布聲（近）.mp3'
import donkeySound from '@/assets/audios/03_驢隊.mp3'
import signatureSound from '@/assets/audios/05_找到簽名.mp3'
// 早春圖音效
import forestEnvSound from '@/assets/audios/02_林間環境音.mp3'
import poleBoatSound from '@/assets/audios/03_撐竿划水.mp3'
import woodCreakSound from '@/assets/audios/04_木板嘎吱聲_水聲_小狗叫聲.mp3'
import footstepsSound from '@/assets/audios/05_腳步聲_更新.mp3'

export default {
    name: 'sixagenary',
    setup() {

        const type = ref(1)
        const step = ref(0)
        const questionNum = ref(0)
        const textContainer = ref(null)
        const p1Video = ref(null)
        const p5Video = ref(null)
        const loadingDots = ref('.')
        const tagCounts = ref({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }) // 統計各個 tag 的次數
        const result = ref(null) // 最多被選中的 tag
        const p1ButtonClicked = ref(false) // 控制按鈕點擊縮放動畫
        const p3ButtonClicked = ref(false) // 控制按鈕點擊縮放動畫
        const p1TextHidden = ref(false) // 控制文字隱藏
        const p1VideoPlaying = ref(false) // 控制視頻顯示
        const videoLoaded = ref(true) // 控制背景視頻載入狀態
        const p1ContentVisible = ref(false) // 控制 P1 內容初始顯示（延遲 1 秒）
        const showProgressBar = ref(false) // 控制進度條顯示
        const progressWidth = ref(0) // 進度條寬度百分比（初始為 0%）
        const p6Button1Clicked = ref(false) // 控制 P6 按鈕 1 點擊動畫
        const p6Button2Clicked = ref(false) // 控制 P6 按鈕 2 點擊動畫
        const p6ShareClicked = ref(false) // 控制 P6 分享按鈕點擊動畫
        let loadingInterval = null
        let p5Timeout = null
        let bgMusicFadeInterval = null // 背景音樂淡出計時器
        let progressAnimationTimeout = null // 進度條動畫計時器
        let currentQuestionAudio = null // 當前問題音效

        // 計算音效
        const calculatingAudio = new Audio(calculatingSound)
        calculatingAudio.loop = true
        calculatingAudio.volume = 0.5

        // 問題音效
        const questionAudios = {
            1: [ // 萬壑松風圖
                new Audio(forestSound),      // Q1
                new Audio(streamSound),      // Q2
                new Audio(mistSound),        // Q3
                new Audio(mistOpenSound),    // Q4
                new Audio(guzhengSound)      // Q5
            ],
            2: [ // 谿山行旅圖
                new Audio(waterfallFarSound),  // Q1
                new Audio(waterfallNearSound), // Q2
                new Audio(donkeySound),        // Q3
                new Audio(donkeySound),        // Q4 (same as Q3)
                new Audio(signatureSound)      // Q5
            ],
            3: [ // 早春圖
                new Audio(forestEnvSound),     // Q1 
                new Audio(streamSound),        // Q2 (reuse from 萬壑松風圖 Q2)
                new Audio(poleBoatSound),      // Q3
                new Audio(woodCreakSound),     // Q4
                new Audio(footstepsSound)      // Q5
            ]
        }

        // 設定所有問題音效的音量和循環
        Object.values(questionAudios).forEach(audios => {
            audios.forEach(audio => {
                audio.loop = true
                audio.volume = 0.5
            })
        })

        // 停止所有音效
        const stopAllAudio = () => {
            console.log('停止所有音效 - 當前時間:', new Date().toLocaleTimeString())

            // 停止背景音樂
            if (window.bgAudio) {
                try {
                    window.bgAudio.pause()
                    console.log('背景音樂已停止')
                } catch (e) {
                    console.error('停止背景音樂失敗:', e)
                }
            }

            // 停止計算音效
            if (calculatingAudio) {
                try {
                    calculatingAudio.loop = false
                    calculatingAudio.pause()
                    calculatingAudio.currentTime = 0
                    console.log('計算音效已停止')
                } catch (e) {
                    console.error('停止計算音效失敗:', e)
                }
            }

            // 停止當前問題音效
            if (currentQuestionAudio) {
                try {
                    currentQuestionAudio.loop = false
                    currentQuestionAudio.pause()
                    currentQuestionAudio.currentTime = 0
                    console.log('當前問題音效已停止')
                } catch (e) {
                    console.error('停止當前問題音效失敗:', e)
                }
            }

            // 停止所有問題音效（確保沒有遺漏）
            try {
                Object.values(questionAudios).forEach(audios => {
                    audios.forEach((audio, index) => {
                        if (audio) {
                            audio.loop = false
                            audio.pause()
                            audio.currentTime = 0
                            console.log(`問題音效 ${index + 1} 已停止`)
                        }
                    })
                })
            } catch (e) {
                console.error('停止問題音效失敗:', e)
            }

            console.log('所有音效停止完成')
        }

        // 處理頁面可見性變化
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // 頁面被隱藏時停止所有音效
                stopAllAudio()
            } else {
                // 頁面恢復可見時，如果在 step 4 則恢復問題音效
                if (step.value === 4 && questionAudios[type.value] && questionAudios[type.value][questionNum.value]) {
                    console.log('恢復播放問題音效 - step:', step.value, 'type:', type.value, 'question:', questionNum.value)
                    currentQuestionAudio = questionAudios[type.value][questionNum.value]
                    currentQuestionAudio.loop = true
                    currentQuestionAudio.currentTime = 0
                    currentQuestionAudio.play().catch(err => {
                        console.log('恢復問題音效播放失敗:', err)
                    })
                }
            }
        }

        // 背景音樂淡出函數
        const fadeBgMusicOut = () => {
            if (!window.bgAudio) return

            // 淡出效果
            const startVolume = window.bgAudio.volume
            const duration = 1000 // 1秒
            const steps = 20 // 分20步淡出
            const stepDuration = duration / steps
            const volumeStep = startVolume / steps
            let currentStep = 0

            if (bgMusicFadeInterval) {
                clearInterval(bgMusicFadeInterval)
            }

            bgMusicFadeInterval = setInterval(() => {
                currentStep++
                const newVolume = Math.max(0, startVolume - (volumeStep * currentStep))
                window.bgAudio.volume = newVolume

                if (currentStep >= steps || newVolume <= 0) {
                    clearInterval(bgMusicFadeInterval)
                    bgMusicFadeInterval = null
                    window.bgAudio.volume = 0
                }
            }, stepDuration)
        }

        // 背景音樂淡入函數（恢復到0.5）
        const fadeBgMusicIn = () => {
            if (!window.bgAudio) return

            // 淡入效果
            const targetVolume = 0.5
            const duration = 1000 // 1秒
            const steps = 20
            const stepDuration = duration / steps
            const volumeStep = targetVolume / steps
            let currentStep = 0

            if (bgMusicFadeInterval) {
                clearInterval(bgMusicFadeInterval)
            }

            bgMusicFadeInterval = setInterval(() => {
                currentStep++
                const newVolume = Math.min(targetVolume, volumeStep * currentStep)
                window.bgAudio.volume = newVolume

                if (currentStep >= steps || newVolume >= targetVolume) {
                    clearInterval(bgMusicFadeInterval)
                    bgMusicFadeInterval = null
                    window.bgAudio.volume = targetVolume
                }
            }, stepDuration)
        }

        // P1 文字內容
        const p1TextTop1 = '忙碌的日常幾乎壓垮了你，在學校、工作、家庭間漫無目的地累積壓力——是時候讓靈魂放鬆，把腦中暫存檔歸零。';
        const p1TextTop2 = '累了不是你的錯，但你可以選擇逃跑！'
        const p1TextBottom1 = '人生太難，不如躲進異世界中'
        const p1TextBottom2 = '▼ 點擊下方按鈕，讓靈魂暫時逃離日常 ▼'
        const p1TextTop1Display = ref(p1TextTop1)
        const p1TextTop2Display = ref(p1TextTop2)
        const p1TextBottom1Display = ref(p1TextBottom1)
        const p1TextBottom2Display = ref('')
        let typewriterInterval = null

        // 響應式屏幕寬度檢測
        const isWideScreen = ref(window.innerWidth >= 768)

        // 預載入視頻列表
        const preloadVideoList = ref([])
        const preloadVideoElements = ref([])

        const updateScreenSize = () => {
            isWideScreen.value = window.innerWidth >= 768
            // 設定真實的視窗高度（解決移動裝置 100vh 問題）
            const vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        }
        const question = ref({
            q1: [
                {t1:'穿越時空，發現自己身在畫中', t2:'踏進幽谷，聽見松林「沙沙」響起，你腦中浮現什麼想法？'},
                {t1:'沒有發現什麼特別的事情', t2:'再往前走，你聽見山谷水聲轟鳴，此時你決定...？'},
                {t1:'站在原地、環顧四周', t2:'忽然山谷之間雲霧繚繞，你會想：'},
                {t1:'雲霧散開後，你走近觀看山石<br>發現紋理像斧頭劈開的痕跡，彷彿具有多層次空間！', t2:'哪句話首先跳進你的腦中？'},
                {t1:'邊思考邊走著...你在山峰某處隱約看見有文字', t2:'你會選擇做什麼事？'},
            ],
            q2: [
                {t1:'剛走進畫中，抬頭仰望', t2:'面對眼前聳立的巨山與飛瀑<br>你的第一反應是？'},
                {t1:'接著你選擇往山裡走', t2:'迎面瀑布轟然落下，水霧撲面<br>而來，你會有什麼舉動？'},
                {t1:'穿過瀑布後，你繼續走著', t2:'發現不遠處有一支馱負重物的驢隊<br>正慢慢前行...你會做出哪個選擇？'},
                {t1:'其中一隻驢看起來似乎有話想說', t2:'你會有什麼反應？'},
                {t1:'告別驢隊，林中樹隙中有個東西正在閃閃發亮，', t2:'細看好像是「范寬」兩個字，此時你會：'},
            ],
            q3: [
                {t1:'這幅山水畫眼前景象是磅礡生動的山峰，耳邊傳來旁白：「你來到1072年了」', t2:'你當下的想法是？'},
                {t1:'你繼續向前行，雲霧間山石具有動態，眼前松樹像套了濾鏡...', t2:'哪個敘述最符合你的個性？'},
                {t1:'不知不覺走到水邊，看見舟子正撐<br>篙前行，漁夫忙著收網', t2:'看到這一幕的你，會怎麼想？'},
                {t1:'告別漁夫跟舟子後，薄煙繚繞、春意正濃', t2:'看見一家三口帶著小狗從船上登岸，你會：'},
                {t1:'繼續往前走入山徑，兩位行腳僧結伴與你擦身而過', t2:'此時你會選擇怎麼做：'},
            ],
        })

        const currentQuestion = computed(() => {
            return question.value['q' + type.value][questionNum.value]
        })

        const currentBackgroundVideo = computed(() => {
            const videoSource = isWideScreen.value
                ? options.value.backgroundVideosTablet
                : options.value.backgroundVideos
            const videoUrl = videoSource['q' + type.value][questionNum.value]

            console.log('currentBackgroundVideo 變更:', {
                screenType: isWideScreen.value ? 'tablet' : 'mobile',
                type: type.value,
                questionNum: questionNum.value,
                videoUrl: videoUrl?.substring(0, 80),
                isInPreloadList: preloadVideoList.value.includes(videoUrl)
            })

            return videoUrl
        })

        // const currentOptions = computed(() => {
        //     return question.value['q' + type.value][questionNum.value]
        // })


        const options = ref({
            // 背景视频配置 (手機版 < 768px)
            backgroundVideos: {
                q1: [
                    require('@/assets/images/qs/q1_p_o1.webm'),
                    require('@/assets/images/qs/q1_p_o2.webm'),
                    require('@/assets/images/qs/q1_p_o3.webm'),
                    require('@/assets/images/qs/q1_p_o4.webm'),
                    require('@/assets/images/qs/q1_p_o5.webm'),
                ],
                q2: [
                    require('@/assets/images/qs/q2_p_o1.webm'),
                    require('@/assets/images/qs/q2_p_o2.webm'),
                    require('@/assets/images/qs/q2_p_o3.webm'),
                    require('@/assets/images/qs/q2_p_o4.webm'),
                    require('@/assets/images/qs/q2_p_o5.webm'),
                ],
                q3: [
                    require('@/assets/images/qs/q3_p_o1.webm'),
                    require('@/assets/images/qs/q3_p_o2.webm'),
                    require('@/assets/images/qs/q3_p_o3.webm'),
                    require('@/assets/images/qs/q3_p_o4.webm'),
                    require('@/assets/images/qs/q3_p_o5.webm'),
                ],
            },
            // 背景视频配置 (平板/桌面版 >= 768px)
            backgroundVideosTablet: {
                q1: [
                    require('@/assets/images/qs/q1_t_o1.webm'),
                    require('@/assets/images/qs/q1_t_o2.webm'),
                    require('@/assets/images/qs/q1_t_o3.webm'),
                    require('@/assets/images/qs/q1_t_o4.webm'),
                    require('@/assets/images/qs/q1_t_o5.webm'),
                ],
                q2: [
                    require('@/assets/images/qs/q2_t_o1.webm'),
                    require('@/assets/images/qs/q2_t_o2.webm'),
                    require('@/assets/images/qs/q2_t_o3.webm'),
                    require('@/assets/images/qs/q2_t_o4.webm'),
                    require('@/assets/images/qs/q2_t_o5.webm'),
                ],
                q3: [
                    require('@/assets/images/qs/q3_t_o1.webm'),
                    require('@/assets/images/qs/q3_t_o2.webm'),
                    require('@/assets/images/qs/q3_t_o3.webm'),
                    require('@/assets/images/qs/q3_t_o4.webm'),
                    require('@/assets/images/qs/q3_t_o5.webm'),
                ],
            },
            q1: [ //萬壑松風圖    1浪漫 2冒險 3理智 4領導 5助人
                [
                    {
                        text: '這是最棒的大自然冥想 BGM',
                        tag: [1, 5],
                    },
                    {
                        text: '感到害怕，這幅畫不是沒有人嗎？',
                        tag: [3],
                    },
                    {
                        text: '連松林都在歡迎我，看我華麗登場！',
                        tag: [2, 4],
                    },
                    // {
                    //     text: '該不會是風之精靈在召喚我...'
                    // },
                    // {
                    //     text: '連松林都在歡迎我，看我華麗登場！'
                    // }
                ],
                [
                    {
                        text: '拿樹枝假裝指揮樂團，沉浸於交響樂中',
                        tag: [1, 5],
                    },
                    {
                        text: '把水聲當白噪音，就地躺下補眠',
                        tag: [2],
                    },
                    {
                        text: '找出水聲方向，跟著水流找路',
                        tag: [3, 4],
                    },
                    // {
                    //     text: '找出水聲位置，跟著水流應該能找到出路'
                    // },
                    // {
                    //     text: '隨手撿起樹枝，在地上制定過河 SOP'
                    // }
                ],
                [
                    {
                        text: '就此消失在霧裡，化身雲中居士',
                        tag: [1],
                    },
                    {
                        text: '目前空氣含水量80%，降雨機率會上升',
                        tag: [3, 5],
                    },
                    {
                        text: '撥開雲霧，想看清楚松林的青綠色',
                        tag: [2, 4],
                    },
                    // {
                    //     text: '腦中OS：空氣濕度80%，降雨機率上升'
                    // },
                    // {
                    //     text: '這雲霧......該不會是隱藏怪物要出現了？'
                    // }
                ],
                [
                    {
                        text: '這不就是傳說中的斧劈皴筆法！',
                        tag: [1],
                    },
                    {
                        text: '要不要敲兩下看看，可能有寶箱？',
                        tag: [2, 4],
                    },
                    {
                        text: '這痕跡…像大師的練功印記。',
                        tag: [3, 5],
                    },
                    // {
                    //     text: '拿起樹枝做個記號，讓後面的人不會錯過'
                    // },
                    // {
                    //     text: '環顧四周，思考裂縫是如何融入整體地形'
                    // }
                ],
                [
                    {
                        text: '唸出山峰上的文字，覺得可以芝麻開門',
                        tag: [1],
                    },
                    {
                        text: '伸長手觸摸，確認是否有異次元空間',
                        tag: [2, 4],
                    },
                    {
                        text: '仔細端詳，思考文字是不是畫家的簽名',
                        tag: [3, 5],
                    },
                    // {
                    //     text: '拿起隨身的登山杖，留下標記'
                    // },
                    // {
                    //     text: '在地圖上標記出簽名的位置，視為重要地標'
                    // }
                ],
            ],
            q2: [//谿山行旅圖
                [
                    {
                        text: '被眼前高聳的山峰感動到說不出話',
                        tag: [1],
                    },
                    {
                        text: '立刻尋找山石表面的雨點皴在哪',
                        tag: [2, 3],
                    },
                    {
                        text: '山頂該不會是終極 BOSS 的大本營？',
                        tag: [2, 4],
                    },
                    // {
                    //     text: '好壯闊！要是有人能一起欣賞就更棒了！'
                    // },
                    // {
                    //     text: '我得確認這是哪個時代，再決定下一步'
                    // }
                ],
                [
                    {
                        text: '拿樹枝當劍，大喊「何方妖怪！」',
                        tag: [2, 5],
                    },
                    {
                        text: '雙手拍臉，清新的霧氣適合肌膚補水',
                        tag: [1],
                    },
                    {
                        text: '開啟練武模式，到瀑布下盤腿修行',
                        tag: [4],
                    },
                    // {
                    //     text: '說：「松樹在這裡應該代表這裡海拔的高度」'
                    // },
                    // {
                    //     text: '這畫面很不錯，先拍下來收進景點清單'
                    // }
                ],
                [
                    {
                        text: '打算混進驢隊搭便車',
                        tag: [2, 5],
                    },
                    {
                        text: '思考要如何讓驢子成為我的夥伴',
                        tag: [3, 4, 5],
                    },
                    {
                        text: '心想：他們看得到來自未來的我嗎？',
                        tag: [3, 5],
                    },
                    // {
                    //     text: '嘗試跟漁夫溝通，跟他們交換一些漁貨'
                    // },
                    // {
                    //     text: '這種捕魚方式應該與水文環境有關，值得記錄'
                    // }
                ],
                [
                    {
                        text: '輕拍驢子：「辛苦了」默默產生社畜共鳴',
                        tag: [1, 5],
                    },
                    {
                        text: '驢是不會說話的，你不要騙我',
                        tag: [4],
                    },
                    {
                        text: '我就靜靜看著牠...',
                        tag: [3],
                    },
                    // {
                    //     text: '是指修仙之旅離我還有一段很遠的路嗎？'
                    // },
                    // {
                    //     text: '實在看不懂，期待之後有人能看懂'
                    // }
                ],
                [
                    {
                        text: '這該不會是畫作的時空傳送點？',
                        tag: [3, 4],
                    },
                    {
                        text: '驚呼「一千年前的簽名彩蛋 get！」',
                        tag: [1],
                    },
                    {
                        text: '走近看，好奇簽名是簽在地上嗎？',
                        tag: [2, 3],
                    },
                    // {
                    //     text: '主動詢問僧人，是否需要幫忙或補給'
                    // },
                    // {
                    //     text: '邀請僧人與我同行，跟他多聊聊佛法的演進'
                    // }
                ],
            ],
            q3: [//早春圖
                [
                    {
                        text: '等等！1072年？是哪個朝代...',
                        tag: [4],
                    },
                    {
                        text: '難道畫作本身也會說話？',
                        tag: [3],
                    },
                    {
                        text: '太好了，這是我最愛的穿越劇！',
                        tag: [1],
                    },
                    // {
                    //     text: '想在這建立營地，必須先找出制高點才安全'
                    // },
                    // {
                    //     text: '該不會是終極 BOSS 的大本營？上去看看！'
                    // }
                ],
                [
                    {
                        text: '拍照記錄早春時節生意盎然這一刻。',
                        tag: [1, 5],
                    },
                    {
                        text: '突然悟道：「難道我是被選中的修仙者？」',
                        tag: [1],
                    },
                    {
                        text: '找找看長得像螃蟹爪的樹木在哪裡...',
                        tag: [3],
                    },
                    // {
                    //     text: '忍不住讚嘆：瀑布就像一首山水詩的化身！'
                    // },
                    // {
                    //     text: '開心貌：這裡水源充足，適合當補給站！'
                    // }
                ],
                [
                    {
                        text: '上前幫忙拉漁網，想讓他們早點收工。',
                        tag: [4, 5],
                    },
                    {
                        text: '拿竹竿大喊：「我要成為釣魚王！」',
                        tag: [2, 4],
                    },
                    {
                        text: '邊觀察記錄：「這捕魚法應與水流有關。」',
                        tag: [3, 5],
                    },
                    // {
                    //     text: '觀察隊伍行進方向，推測附近城鎮位置'
                    // },
                    // {
                    //     text: '主動示好，告訴他們另一條路線更快！'
                    // }
                ],
                [
                    {
                        text: '跟上去要看看可愛的狗勾～',
                        tag: [1, 2],
                    },
                    {
                        text: '從遠處默默觀看，好奇他們會去哪',
                        tag: [4],
                    },
                    {
                        text: '看向扁擔裡的食盒：您好，我吃一點！',
                        tag: [5],
                    },
                    // {
                    //     text: '什麼樣的胡蘿蔔，才會有什麼樣的驢'
                    // },
                    // {
                    //     text: '行囊裡是不是藏了范寬本人！？'
                    // }
                ],
                [
                    {
                        text: '僧人都能走的山路，應該算是安全吧。',
                        tag: [4],
                    },
                    {
                        text: '街訪直擊：包袱裡面到底都放些什麼？',
                        tag: [2],
                    },
                    {
                        text: '思考這幅畫裡難道有廟宇可以參拜嗎？',
                        tag: [3],
                    },
                    // {
                    //     text: '我決定將此地列為目標，展開下一步行動'
                    // },
                    // {
                    //     text: '趕緊標註在地圖上，讓後來的登山客好找'
                    // }
                ],
            ],
        })

        // 處理移動端觸控開始
        const handleTouchStart = (event) => {
           event.currentTarget.classList.add('option-item-touched')
           event.currentTarget.classList.add('option-item-selected')
        }

        // 處理移動端觸控結束
        const handleTouchEnd = (event) => {
            // 立即讓按鈕失去焦點，避免 hover 狀態黏住
            event.currentTarget.blur()

            // 延遲移除 touch 效果，給點擊事件時間觸發
            setTimeout(() => {
                // 只移除沒有被選中的選項的 touched 狀態
                const allButtons = document.querySelectorAll('.option-item')
                allButtons.forEach(btn => {
                    if (!btn.classList.contains('option-item-selected')) {
                        btn.classList.remove('option-item-touched')
                        btn.blur()
                    }
                })
            }, 300)
        }

        const selectOption = (index) => {
            console.log('選擇了選項:', index + 1)

            // 獲取當前選項的 tag 陣列並統計
            const selectedOption = options.value['q' + type.value][questionNum.value][index]
            if (selectedOption && selectedOption.tag) {
                selectedOption.tag.forEach(tag => {
                    tagCounts.value[tag]++
                })
            }

            // 移除所有按鈕的 focus/active 狀態，防止移動裝置上的選中狀態殘留
            // 對所有按鈕執行 blur，以解除手機上的 hover 狀態
            const allButtons = document.querySelectorAll('.option-item')
            allButtons.forEach(btn => {
                btn.blur()
            })

            // 在這裡處理選項選擇邏輯
            setTimeout(() => {
                // 在切換題目前，先強制隱藏所有星星
                allButtons.forEach(btn => {
                    btn.classList.add('hide-stars')
                })

                // 檢查是否為最後一個問題
                const totalQuestions = question.value['q' + type.value].length
                if (questionNum.value >= totalQuestions - 1) {
                    // 計算最多被選中的 tag
                    calculateMostFrequentTag()
                    // 已完成所有問題,跳轉到結尾頁面
                    step.value = 5
                } else {
                    // 繼續下一個問題
                    questionNum.value++;
                }

                // 等待淡出動畫完成後（1秒）再移除按鈕狀態和隱藏 class
                setTimeout(() => {
                    const allButtons = document.querySelectorAll('.option-item')
                    allButtons.forEach(btn => {
                        btn.classList.remove('option-item-touched')
                        btn.classList.remove('option-item-selected')
                        btn.classList.remove('hide-stars')
                    })
                }, 1000)
            }, 800)
        }

        // 卡片数据 - 只保留三张
        const cards = ref([
            { id: 1, name: '萬壑松風圖', image: require('@/assets/images/p3-card-left-5adf13.png') },
            { id: 2, name: '谿山行旅圖', image: require('@/assets/images/p3-card-center-3d024e.png') },
            { id: 3, name: '早春圖', image: require('@/assets/images/p3-card-right-47e46e.png') }
        ])

        // 拖曳相关状态
        const cardsWrapper = ref(null)
        const currentCardIndex = ref(0) // 0:萬壑松風圖 1:谿山行旅圖 2:早春圖
        const isDragging = ref(false)
        const hasDragged = ref(false) // 是否进行了拖曳操作
        const startX = ref(0)
        const dragOffset = ref(0) // 当前拖拽偏移量
        const showGlow = ref(false) // 控制光暈顯示
        let glowTimeout = null // 光暈延遲計時器

        // 计算每张卡片的位置（left/center/right）
        const getCardPosition = (index) => {
            const diff = (index - currentCardIndex.value + cards.value.length) % cards.value.length
            if (diff === 0) return 'center'
            if (diff === 1) return 'right'
            return 'left'
        }

        // 觸發光暈延遲顯示
        const triggerGlowDelay = () => {
            showGlow.value = false
            if (glowTimeout) {
                clearTimeout(glowTimeout)
            }
            glowTimeout = setTimeout(() => {
                showGlow.value = true
            }, 600)
        }

        // 计算卡片样式
        const getCardStyle = (index) => {
            const position = getCardPosition(index)
            const styles = {
                center: {
                    transform: 'translateX(-50%) translateY(-30px) scale(1)',
                    zIndex: 3,
                    opacity: 1
                },
                left: {
                    transform: 'translateX(calc(-50% - 180px)) translateY(20px) scale(0.85)',
                    zIndex: 1,
                    opacity: 0.7
                },
                right: {
                    transform: 'translateX(calc(-50% + 180px)) translateY(20px) scale(0.85)',
                    zIndex: 1,
                    opacity: 0.7
                }
            }
            return styles[position]
        }

        // 开始拖曳
        const startDrag = (e) => {
            isDragging.value = true
            hasDragged.value = false
            startX.value = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
            dragOffset.value = 0
        }

        // 拖曳中
        const onDrag = (e) => {
            if (!isDragging.value) return
            e.preventDefault()

            const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
            dragOffset.value = currentX - startX.value

            // 如果移动距离超过 5px，标记为已拖曳
            if (Math.abs(dragOffset.value) > 5) {
                hasDragged.value = true
            }
        }

        // 结束拖曳
        const endDrag = () => {
            if (!isDragging.value) return
            isDragging.value = false

            // 根据拖曳方向决定轮转方向
            if (Math.abs(dragOffset.value) > 50) {
                if (dragOffset.value > 0) {
                    // 向右拖曳，显示上一张
                    prevCard()
                } else {
                    // 向左拖曳，显示下一张
                    nextCard()
                }
            }

            dragOffset.value = 0
        }

        // 点击卡片选择
        const selectCard = (index) => {
            // 如果刚刚进行了拖曳操作，不触发点击
            if (hasDragged.value) {
                return
            }

            // 根据点击的卡片位置决定轮转方向
            const position = getCardPosition(index)
            if (position === 'left') {
                prevCard()
            } else if (position === 'right') {
                nextCard()
            }
        }

        // 上一张卡片（向右轮转）
        const prevCard = () => {
            let newIndex = currentCardIndex.value - 1
            if (newIndex < 0) {
                newIndex = cards.value.length - 1
            }
            currentCardIndex.value = newIndex
            triggerGlowDelay()
            console.log('上一張 - 索引:', newIndex, '卡片:', cards.value[newIndex].name)
        }

        // 下一张卡片（向左轮转）
        const nextCard = () => {
            let newIndex = currentCardIndex.value + 1
            if (newIndex >= cards.value.length) {
                newIndex = 0
            }
            currentCardIndex.value = newIndex
            triggerGlowDelay()
            console.log('下一張 - 索引:', newIndex, '卡片:', cards.value[newIndex].name)
        }

        // 确定选择
        const confirmSelection = () => {
            const selectedCard = cards.value[currentCardIndex.value]
            console.log('當前索引:', currentCardIndex.value)
            console.log('確定選擇的卡片 ID:', selectedCard.id)
            console.log('確定選擇的卡片名稱:', selectedCard.name)

            type.value = currentCardIndex.value + 1;
            // 这里可以继续处理选择后的逻辑，比如跳转到下一步
            step.value = 4
        }

        // 重新选择
        const resetSelection = () => {
            // 重置到中间卡片（index=1，对应id=2）
            currentCardIndex.value = 1
        }

        // 重新開始測驗
        const restartQuiz = () => {
            // 重置所有狀態
            step.value = 1
            questionNum.value = 0
            tagCounts.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            result.value = null
            currentCardIndex.value = 1

            // 重新啟動 P1 打字機效果
            startTypewriter()
        }

        // 刷新頁面
        const reloadPage = () => {
            window.location.reload()
        }

        // P6 按鈕 1 點擊處理（了解更多）
        const handleP6Button1Click = () => {
            p6Button1Clicked.value = true
            // 0.6 秒後執行跳轉（與動畫時間一致）
            setTimeout(() => {
                window.location.href = 'https://theme.npm.edu.tw/EnduringLegacyS203'
            }, 600)
        }

        // P6 按鈕 2 點擊處理（再玩一次）
        const handleP6Button2Click = () => {
            p6Button2Clicked.value = true
            // 0.6 秒後重新載入頁面（與動畫時間一致）
            setTimeout(() => {
                reloadPage()
            }, 600)
        }

        // P6 分享按鈕點擊處理
        const handleP6ShareClick = () => {
            p6ShareClicked.value = true
            // 0.6 秒後跳轉到 Google 表單（與動畫時間一致）
            setTimeout(() => {
                window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfaXUqpzyKDN8q45J0nvqcF-4kf2m2WzUeldWHIa03m6LDKrg/viewform'
            }, 600)
        }


        // P1 打字機效果
        const startTypewriter = () => {
            // 清除可能存在的計時器
            if (typewriterInterval) {
                clearInterval(typewriterInterval)
            }

            // 重置顯示文字
            p1TextBottom2Display.value = ''

            let index = 0
            const length = p1TextBottom2.length

            // 延遲 1.5 秒後開始打字機效果，緊接在 p1-text-top 淡入完成後 (0.3s + 1.2s = 1.5s)
            setTimeout(() => {
                // 播放打字音效
                if (window.typingAudio) {
                    window.typingAudio.currentTime = 0
                    window.typingAudio.play().catch(err => console.log('Typing sound error:', err))
                }

                typewriterInterval = setInterval(() => {
                    if (index < length) {
                        p1TextBottom2Display.value += p1TextBottom2[index]
                        index++
                    } else {
                        clearInterval(typewriterInterval)
                        typewriterInterval = null

                        // 暫停打字音效
                        if (window.typingAudio) {
                            window.typingAudio.pause()
                        }
                    }
                }, 50) // 每 50 毫秒顯示一個字
            }, 1500)
        }

        // P1, P3 轉場
        const startP1VideoAndTransition = () => {
            // 觸發按鈕縮放動畫
            p1ButtonClicked.value = true
            p3ButtonClicked.value = true

            // 清除打字機計時器和音效
            if (typewriterInterval) {
                clearInterval(typewriterInterval)
                typewriterInterval = null
            }
            if (window.typingAudio) {
                window.typingAudio.pause()
            }

            // 延遲播放視頻並淡出文字和按鈕
            setTimeout(() => {
                p1TextHidden.value = true
                if (p1Video.value) {
                    p1Video.value.play()
                }
            }, 600) // 按鈕縮放動畫完成後（0.6秒），文字和按鈕淡出，視頻開始播放
        }

        // P1 視頻播放結束
        const onP1VideoEnded = () => {
            // 跳轉到 P3
            step.value = 3
            // 重置狀態
            p1ButtonClicked.value = false
            p1TextHidden.value = false
            p1VideoPlaying.value = false
        }

        // 背景視頻載入完成
        const onVideoLoaded = () => {
            videoLoaded.value = true
        }

        // 監聽背景視頻變更，設置載入狀態為 false
        watch(currentBackgroundVideo, () => {
            videoLoaded.value = false
        })

        // 計算最多被選中的 tag
        const calculateMostFrequentTag = () => {
            let maxCount = 0
            let mostFrequentTag = null

            // 按照 1, 2, 3, 4, 5 的順序遍歷，確保數字小的優先
            for (let tag = 1; tag <= 5; tag++) {
                if (tagCounts.value[tag] > maxCount) {
                    maxCount = tagCounts.value[tag]
                    mostFrequentTag = tag
                }
            }

            result.value = mostFrequentTag
            console.log('Tag 統計:', tagCounts.value)
            console.log('最多被選中的 tag:', result.value)
        }

        const showresult = (result) => {
            // 1浪漫 2冒險 3理智 4領導 5助人
            if(result == 1){
                return '浪漫'
            }else if(result == 2){
                return '冒險'
            }else if(result == 3){
                return '理智'
            }else if(result == 4){
                return '領導'
            }else if(result == 5){
                return '助人'
            }
        }

        // 預載入視頻和圖片
        const preloadAssets = () => {
            // P1 和 P5 的視頻
            const fixedVideos = [
                require('@/assets/images/step1_bg.mp4'),
                require('@/assets/images/clacing.mp4')
            ]

            // 根據屏幕尺寸決定預載入哪些背景視頻
            const videoSource = isWideScreen.value
                ? options.value.backgroundVideosTablet
                : options.value.backgroundVideos

            // 收集所有背景視頻
            const allBackgroundVideos = [
                ...videoSource.q1,
                ...videoSource.q2,
                ...videoSource.q3
            ]

            // 合併所有需要預載入的視頻，並賦值給 preloadVideoList
            preloadVideoList.value = [...fixedVideos, ...allBackgroundVideos]

            // 預載入 P3 卡片圖片
            const cardImages = cards.value.map(card => card.image)
            cardImages.forEach(imgSrc => {
                const img = new Image()
                img.src = imgSrc
            })

            console.log('預載入資源:', {
                screenType: isWideScreen.value ? 'tablet' : 'mobile',
                windowWidth: window.innerWidth,
                videoCount: preloadVideoList.value.length,
                imageCount: cardImages.length,
                videoSample: preloadVideoList.value.slice(2, 5).map(v => v.substring(v.lastIndexOf('/') + 1))
            })

            // 強制載入視頻元素
            nextTick(() => {
                preloadVideoElements.value.length = 0 // 清空舊的引用
                setTimeout(() => {
                    if (preloadVideoElements.value.length > 0) {
                        console.log(`開始強制載入 ${preloadVideoElements.value.length} 個視頻...`)
                        preloadVideoElements.value.forEach((video) => {
                            if (video && video.load) {
                                video.load()
                            }
                        })
                    }
                }, 100)
            })
        }

        onMounted(() => {
            nextTick(() => {
                if (textContainer.value) {
                    const height = textContainer.value.offsetHeight
                    document.documentElement.style.setProperty('--text-container-height', `${height}px`)
                }
            })

            // 初始化視窗高度
            updateScreenSize()

            // 添加 resize 事件監聽
            window.addEventListener('resize', updateScreenSize)

            // 添加頁面可見性變化監聽（桌面和移動裝置）
            document.addEventListener('visibilitychange', handleVisibilityChange)

            // 添加失去焦點監聽（桌面）
            window.addEventListener('blur', stopAllAudio)

            // 添加頁面卸載監聽（用戶離開頁面時）
            window.addEventListener('beforeunload', stopAllAudio)

            // 添加 pagehide 事件（iOS Safari 支援）
            window.addEventListener('pagehide', stopAllAudio)

            // 初始化光暈延遲
            triggerGlowDelay()

            // 預載入所有視頻和圖片
            preloadAssets()
        })

        // 監聽 step 變化
        watch(step, (newStep) => {
            if (newStep === 1) {
                // 進入 P1 頁面時先隱藏內容
                p1ContentVisible.value = false
                // 延遲 1 秒後顯示內容，確保視頻載入完成
                setTimeout(() => {
                    p1ContentVisible.value = true
                    // 啟動打字機效果
                    startTypewriter()
                }, 1000)
            } else if (newStep === 3) {
                // 進入卡片選擇頁面時觸發光暈延遲
                triggerGlowDelay()
            } else if (newStep === 4) {
                // 進入 step 4 時，設置初始進度並在淡入完成後顯示進度條
                showProgressBar.value = false
                // 等待淡入動畫完成（1秒）後顯示進度條
                setTimeout(() => {
                    showProgressBar.value = true
                }, 1000)

                setTimeout(() => {
                    progressWidth.value = 20 // 重置為 1/5
                }, 1500)

                // 停止背景音樂
                fadeBgMusicOut()

                // 播放第一個問題的音效（如果該類型有音效）
                if (questionAudios[type.value] && questionAudios[type.value][0]) {
                    currentQuestionAudio = questionAudios[type.value][0]
                    currentQuestionAudio.loop = true
                    currentQuestionAudio.currentTime = 0
                    currentQuestionAudio.play().catch(err => {
                        console.log('問題音效播放失敗:', err)
                    })
                }
            } else if (newStep === 5) {
                // 停止問題音效
                if (currentQuestionAudio) {
                    currentQuestionAudio.loop = false
                    currentQuestionAudio.pause()
                    currentQuestionAudio.currentTime = 0
                    currentQuestionAudio = null
                }

                // 清除可能存在的舊計時器
                if (loadingInterval) {
                    clearInterval(loadingInterval)
                }
                if (p5Timeout) {
                    clearTimeout(p5Timeout)
                }

                // 將背景音樂音量淡出至0（1秒）
                fadeBgMusicOut()

                // 播放計算音效
                calculatingAudio.loop = true
                calculatingAudio.currentTime = 0
                calculatingAudio.play().catch(err => {
                    console.log('計算音效播放失敗:', err)
                })

                // 確保 P5 視頻播放（移動裝置可能需要手動觸發）
                nextTick(() => {
                    if (p5Video.value) {
                        p5Video.value.play().catch(err => {
                            console.log('P5 視頻自動播放失敗:', err)
                        })
                    }
                })

                // 啟動打字動畫
                loadingInterval = setInterval(() => {
                    if (loadingDots.value === '.') {
                        loadingDots.value = '..'
                    } else if (loadingDots.value === '..') {
                        loadingDots.value = '...'
                    } else {
                        loadingDots.value = '.'
                    }
                }, 500) // 每 500 毫秒切換一次

                // 7 秒後跳轉到 step 6
                p5Timeout = setTimeout(() => {
                    step.value = 6
                }, 7000)
            } else {
                // 離開 step 5 時清除計時器和停止計算音效
                if (loadingInterval) {
                    clearInterval(loadingInterval)
                    loadingInterval = null
                }
                if (p5Timeout) {
                    clearTimeout(p5Timeout)
                    p5Timeout = null
                }
                // 停止計算音效
                calculatingAudio.pause()
                calculatingAudio.currentTime = 0
                // 恢復背景音樂音量（淡入至0.5）
                fadeBgMusicIn()
            }
        })

        // 監聽 questionNum 變化，更新進度條
        watch(questionNum, (newQuestionNum) => {
            if (step.value === 4) {
                // 停止之前的問題音效
                if (currentQuestionAudio) {
                    currentQuestionAudio.loop = false
                    currentQuestionAudio.pause()
                    currentQuestionAudio.currentTime = 0
                    currentQuestionAudio = null
                }

                // 播放對應的問題音效（如果該類型有音效）
                if (questionAudios[type.value] && questionAudios[type.value][newQuestionNum]) {
                    currentQuestionAudio = questionAudios[type.value][newQuestionNum]
                    currentQuestionAudio.loop = true
                    currentQuestionAudio.currentTime = 0
                    currentQuestionAudio.play().catch(err => {
                        console.log('問題音效播放失敗:', err)
                    })
                }

                // 清除可能存在的舊計時器
                if (progressAnimationTimeout) {
                    clearTimeout(progressAnimationTimeout)
                }

                // 隱藏進度條（會隨著題目一起淡出）
                showProgressBar.value = false

                // 等待淡出+淡入動畫完成（2秒），然後顯示進度條
                progressAnimationTimeout = setTimeout(() => {
                    showProgressBar.value = true
                    // 再等待進度條浮現完成（0.3秒），然後開始長度變化
                    setTimeout(() => {
                        // 計算新的進度寬度：(questionNum + 1) / 5 * 100
                        const targetWidth = ((newQuestionNum + 1) / 5) * 100
                        progressWidth.value = targetWidth
                    }, 300)
                }, 2000)
            }
        })

        // 組件卸載時清除計時器和事件監聽
        onUnmounted(() => {
            if (loadingInterval) {
                clearInterval(loadingInterval)
            }
            if (glowTimeout) {
                clearTimeout(glowTimeout)
            }
            if (p5Timeout) {
                clearTimeout(p5Timeout)
            }
            if (typewriterInterval) {
                clearInterval(typewriterInterval)
            }
            if (bgMusicFadeInterval) {
                clearInterval(bgMusicFadeInterval)
            }
            if (progressAnimationTimeout) {
                clearTimeout(progressAnimationTimeout)
            }
            // 停止計算音效
            calculatingAudio.loop = false
            calculatingAudio.pause()
            calculatingAudio.currentTime = 0
            // 停止問題音效
            if (currentQuestionAudio) {
                currentQuestionAudio.loop = false
                currentQuestionAudio.pause()
                currentQuestionAudio.currentTime = 0
            }
            // 移除 resize 事件監聽
            window.removeEventListener('resize', updateScreenSize)
            // 移除頁面可見性變化監聽
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            // 移除失去焦點監聽
            window.removeEventListener('blur', stopAllAudio)
            // 移除頁面卸載監聽
            window.removeEventListener('beforeunload', stopAllAudio)
            // 移除 pagehide 事件
            window.removeEventListener('pagehide', stopAllAudio)
        })

        return {
            type,
            step,
            options,
            question,
            selectOption,
            handleTouchStart,
            handleTouchEnd,
            questionNum,
            currentQuestion,
            currentBackgroundVideo,
            // currentOptions,
            textContainer,
            p1Video,
            p5Video,
            p1TextTop1Display,
            p1TextTop2Display,
            p1TextBottom1Display,
            p1TextBottom2Display,
            cards,
            cardsWrapper,
            currentCardIndex,
            getCardPosition,
            getCardStyle,
            startDrag,
            onDrag,
            endDrag,
            selectCard,
            prevCard,
            nextCard,
            confirmSelection,
            resetSelection,
            restartQuiz,
            reloadPage,
            startP1VideoAndTransition,
            loadingDots,
            tagCounts,
            result,
            showGlow,
            showresult,
            preloadVideoList,
            p1ButtonClicked,
            p1TextHidden,
            p1VideoPlaying,
            p1ContentVisible,
            onP1VideoEnded,
            onVideoLoaded,
            videoLoaded,
            showProgressBar,
            progressWidth,
            p6Button1Clicked,
            p6Button2Clicked,
            handleP6Button1Click,
            handleP6Button2Click,
            p6ShareClicked,
            handleP6ShareClick,
            preloadVideoElements
        }
    }
}

</script>

<style scoped>
.question-screen {
    position: relative;
    width: 100vw;
    height: calc(var(--vh, 1vh) * 100);
    min-height: calc(var(--vh, 1vh) * 100);
    max-height: 1024px;
    overflow: hidden;
    overscroll-behavior: none;
    background: #000;
}

.background-video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    height: calc(var(--vh, 1vh) * 100);
    object-fit: cover;
    object-position: center;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.background-video.video-loaded {
    opacity: 1;
}

.content {
    position: relative;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
}

.logo {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 2;
}

.exhibition-text {
    position: absolute;
    top: 16%;
    width: 346px;
    text-align: center;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 20px;
    line-height: 1.4em;
    letter-spacing: 0.1em;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}

.exhibition-text p {
    margin: 0 0 16px 0;
}

.options {
    position: absolute;
    /* top: 550px; */
    top: 67%;
    left: 50%;
    transform: translateX(-50%);
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 0;
    z-index: 10;
    padding-bottom: 100px;
    max-height: calc(var(--vh, 1vh) * 100 - 550px - 60px);
    overflow: visible;
}

/* .option-item {
    position: relative;
    width: 350px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    background: #EEEEEEBF;
    border-radius: 20px;
    padding: 8px 74px;
    opacity: 1;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0px 0px 8px 2px rgba(255, 255, 255, 0.3);
}

.option-item:hover {
    transform: scale(1.05);
}

.option-item:active {
    transform: scale(1.08);
} */
.option-item {
    position: relative;
    padding: 12px 20px;
    width: 310px;
    height: 40px;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.75);
    color: #524735;
    border: none;
    border-radius: 50px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.8);
    transition: all 1s ease-out;
    cursor: pointer;
    overflow: visible;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    font-size: 13px;
    font-weight: 500;
    margin: 5px auto;
    display: inline-block;
}

/* 桌面裝置 hover 效果 */
@media (hover: hover) and (pointer: fine) {
  .option-item:hover {
    background: transparent;
    background-color: #524735;
    color: #ffffff;
    box-shadow: 0 0 25px #fec1958c;
  }

  /* 防止星星繼承 hover 狀態的背景色 */
  .option-item:hover .star-1,
  .option-item:hover .star-2,
  .option-item:hover .star-3,
  .option-item:hover .star-4,
  .option-item:hover .star-5,
  .option-item:hover .star-6 {
    background-color: transparent !important;
  }
}

/* 移動端觸控效果 - 使用 JavaScript 添加的 class */
.option-item-touched {
  background-color: #524735 !important;
  color: #ffffff !important;
  box-shadow: 0 0 25px #fec1958c, inset 0 0 20px rgba(255, 255, 255, 0.3) !important;
}

/* 防止星星繼承 touched 狀態的背景色 */
.option-item-touched .star-1,
.option-item-touched .star-2,
.option-item-touched .star-3,
.option-item-touched .star-4,
.option-item-touched .star-5,
.option-item-touched .star-6 {
  background-color: transparent !important;
}

/* 移動端選中狀態 - 只控制按鈕顏色，不控制星星 */
.option-item-selected {
  background-color: #524735 !important;
  color: #ffffff !important;
  box-shadow: 0 0 25px #fec1958c, inset 0 0 20px rgba(255, 255, 255, 0.3) !important;
}

/* 防止星星繼承 selected 狀態的背景色 */
.option-item-selected .star-1,
.option-item-selected .star-2,
.option-item-selected .star-3,
.option-item-selected .star-4,
.option-item-selected .star-5,
.option-item-selected .star-6 {
  background-color: transparent !important;
}

/* 通用點擊效果（移動端和桌面端） */
button.option-item:active {
  background-color: #524735 !important;
  color: #ffffff !important;
  box-shadow: 0 0 25px #fec1958c !important;
}

/* 防止星星繼承背景色 */
button.option-item:active .star-1,
button.option-item:active .star-2,
button.option-item:active .star-3,
button.option-item:active .star-4,
button.option-item:active .star-5,
button.option-item:active .star-6 {
  background-color: transparent !important;
}

/* 針對觸控裝置的額外樣式 */
@media (hover: none) and (pointer: coarse) {
  button.option-item:active {
    background-color: #524735 !important;
    color: #ffffff !important;
    box-shadow: 0 0 25px #fec1958c !important;
  }

  /* 防止星星繼承背景色 */
  button.option-item:active .star-1,
  button.option-item:active .star-2,
  button.option-item:active .star-3,
  button.option-item:active .star-4,
  button.option-item:active .star-5,
  button.option-item:active .star-6 {
    background-color: transparent !important;
  }
}

/* WebKit 觸控反饋 */
button.option-item {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* 星星顯示效果 - 移動裝置：只在觸摸時顯示 */
.option-item:active .star-1,
.option-item-touched .star-1,
.option-item:active .star-2,
.option-item-touched .star-2,
.option-item:active .star-3,
.option-item-touched .star-3,
.option-item:active .star-4,
.option-item-touched .star-4,
.option-item:active .star-5,
.option-item-touched .star-5,
.option-item:active .star-6,
.option-item-touched .star-6 {
  opacity: 1;
  transform: scale(0.7);
}

/* 桌面裝置：hover 時顯示星星 */
@media (hover: hover) and (pointer: fine) {
  .option-item:hover .star-1,
  .option-item:hover .star-2,
  .option-item:hover .star-3,
  .option-item:hover .star-4,
  .option-item:hover .star-5,
  .option-item:hover .star-6 {
    opacity: 1;
    transform: scale(0.7);
  }
}

/* 平板裝置 - 選項容器與按鈕寬度調整 */
@media (min-width: 768px ) and (max-width: 1024px) {
  .options {
    width: 650px;
    top: 70%;
  }

  .option-item {
    width: 600px;
  }

  .p3-main-content {
    gap: 0;
  }
}

/* 強制隱藏星星 - 切換題目時使用 */
.hide-stars .star-1,
.hide-stars .star-2,
.hide-stars .star-3,
.hide-stars .star-4,
.hide-stars .star-5,
.hide-stars .star-6 {
  opacity: 0 !important;
  transform: scale(0) !important;
  transition: none !important;
}

.fil0 {
  fill: #fffdef;
}

/* 星星動畫部分 */
.star-1, .star-2, .star-3, .star-4, .star-5, .star-6 {
  position: absolute;
  height: auto;
  z-index: 2;
  filter: drop-shadow(0 0 3px #fffdef);
  pointer-events: none;
  opacity: 0;
  transform: scale(0);
  background: transparent !important;
  transition: opacity 0.3s ease-out 0.3s, transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s;
}

.star-1 svg, .star-2 svg, .star-3 svg, .star-4 svg, .star-5 svg, .star-6 svg {
  background: transparent !important;
  display: block;
}

.star-1 { top: 23%; left: -2%; width: 8px; }
.star-2 { top: -15%; left: 17%; width: 8px; }
.star-3 { top: 85%; left: 32%; width: 5px; }
.star-4 { top: 60%; left: 80%; width: 5px; }
.star-5 { top: 45%; left: 100%; width: 8px; }
.star-6 { top: 5%; left: 72%; width: 5px; }


.option-text {
    position: relative;
    color: #524735;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 1.846em;
    letter-spacing: 0.154em;
    text-align: center;
    z-index: 1;
    white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 外层容器 */
.app-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    background-color: #000;
    overflow: hidden;
    overscroll-behavior: none;
}

/* RWD 斷點：桌面裝置 (≥1024px) */
@media (min-width: 1024px) {
    .app-container {
        align-items: center;
    }

    .app-container > * {
        max-width: 430px;
        width: 100%;
        margin: 0 auto;
    }
}

/* P0 主視覺樣式 */
.p0-screen {
    position: relative;
    width: 46vh; /* 402/874 ≈ 0.46 */
    height: calc(var(--vh, 1vh) * 100);
    overflow: hidden;
    background-image: url('~@/assets/images/step0_main.png');
    background-size: cover;
    background-position: center -90px;
    background-repeat: no-repeat;
}

.p0-bottom-image {
    position: absolute;
    top: 65px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 365px;
    height: auto;
    z-index: 2;
    animation: slowGlow 2.5s ease-in-out infinite;
}

@keyframes slowGlow {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

.p0-text-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 8px 50px;
    /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 63%); */
    background: rgb(199 190 44);
    z-index: 3;
}

.p0-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    width: 100%;
    top: 15px;
    position: relative;
}

.p0-title {
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 1em;
    letter-spacing: 0.23077em;
    text-align: center;
}

.p0-title::before {
  content: attr(data-stroke);
  position: absolute;
  color: #9B931D;
  -webkit-text-stroke: 5px #9B931D;
  text-stroke: 5px #9B931D;
  z-index: -1;
}

.p0-subtitle-wrapper {
    position: absolute;
    left: 50%;
    top: 250px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 6px 44px;
    background-color: #FFFFFF;
    border-radius: 20px;
    animation: subtleRipple 2.6s ease-in-out infinite;
    box-shadow: 0 0 15px 0 #9C6000;
    transform: translateX(-50%) scale(1.2);
    z-index: 2;
}

@keyframes subtleRipple {
    0%, 100% {
        transform: translateX(-50%) scale(1.2);
        opacity: 1;
    }
    50% {
        transform: translateX(-50%) scale(1.236);
        opacity: 0.95;
    }
}

.p0-subtitle {
    color: #524735;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 1em;
    letter-spacing: 0.12em;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
}

.p0-sponsor-image {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    height: auto;
    z-index: 3;
}

/* 响应式调整 - 当宽度不够时，改为宽度100%，高度按比例 */
@media (max-width: 500px) {
    .p0-screen {
        width: 100vw;
        height: 217.4vw; /* 874/402 ≈ 2.174 */
        max-height: calc(var(--vh, 1vh) * 100);
    }
}

/* 限制最大宽度 */
@media (min-width: 900px) {
    .p0-screen {
        max-width: 402px;
        width: 46vh;
    }
}

/* 平板裝置 - P0 背景圖片與布局調整 */
@media (min-width: 768px ) and (max-width: 1024px) {
    .p0-screen {
        background-image: url('~@/assets/images/step0_main.png') !important;
        background-position: center -250px;
        width: 100vh !important;
    }

    .p0-subtitle-wrapper {
        top: 325px !important;
    }

    .p0-bottom-image {
        top: 115px !important;
        max-width: 415px !important;
    }

    .p0-subtitle {
        font-size: 15px !important;
        letter-spacing: 2px !important;
    }
}

/* P1 劇情前導樣式 */
.p1-screen {
    position: relative;
    width: 46vh;
    height: calc(var(--vh, 1vh) * 100);
    overflow: hidden;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.p1-content {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px 16px 20px;
    z-index: 1;
    transition: opacity 1s ease;
}

@keyframes fadeInContent {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes fadeInText {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.p1-text-top {
    width: 100%;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 15px;
    line-height: 1.8667em;
    letter-spacing: 0.1333em;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.p1-text-top-line1 {
    opacity: 0;
    animation: fadeInText 1.2s ease-in-out 0.3s forwards;
}

.p1-text-top-line2 {
    opacity: 0;
    animation: fadeInText 1.2s ease-in-out 0.3s forwards;
}

.p1-illustration {
    width: 83vw;
    max-width: none;
    height: auto;
    object-fit: contain;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
}

@media (min-width: 500px) {
    .p1-illustration {
        width: 100%;
        height: 280px;
        object-fit: cover;
        margin-left: 0;
        margin-right: 0;
    }
}

.p1-image-fade-out {
    opacity: 0 !important;
    transition: opacity 1s ease;
}

.p1-transition-video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100vw;
    max-width: none;
    height: auto;
    object-fit: contain;
    z-index: 0;
    pointer-events: none;
}

@media (min-width: 500px) {
    .p1-transition-video {
        width: 100%;
        height: 280px;
        object-fit: cover;
    }
}

.p1-video-show {
    opacity: 1;
}

.p1-bottom-section {
    position: absolute;
    bottom: 50px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 16px 40px;
    z-index: 2;
    transition: opacity 1s ease;
}

.p1-text-bottom {
    color: #ECB757;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 15px;
    line-height: 1.8667em;
    letter-spacing: 0.1333em;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.p1-text-bottom-line1 {
    opacity: 0;
    animation: fadeInText 2s ease-in-out 1.3s forwards;
}

.p1-text-bottom-line2 {
    /* 使用打字機效果，不需要淡入動畫 */
    color: #FFFFFF;
}

.p1-content-hidden {
    opacity: 0 !important;
}

.p1-text-fade-out {
    opacity: 0 !important;
    animation: none !important;
    transition: opacity 0.3s ease;
}

.p1-text-fade-out .p1-text-top-line1,
.p1-text-fade-out .p1-text-top-line2,
.p1-text-fade-out .p1-text-bottom-line1,
.p1-text-fade-out .p1-text-bottom-line2 {
    opacity: 0 !important;
    animation: none !important;
    transition: opacity 0.3s ease;
}

.p1-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 90px;
    cursor: pointer;
    opacity: 0;
    animation: fadeInButton 1s ease-in-out 1.4s forwards;
    transition: all 0.2s ease;
}

@keyframes fadeInButton {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes shadowBlink {
    0%, 50%, 100% {
        text-shadow:
            0 0 20px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.6),
            0 0 60px rgba(255, 255, 255, 0.4);
    }
    25%, 75% {
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
    }
}

.p1-button:hover {
    /* 保持 hover 效果 */
}

.p1-button-scale-up {
    animation: none;
    opacity: 1 !important;
}

.p1-button-scale-up .p1-button-text {
    animation: none;
    transform: scale(1.3);
    opacity: 0;
    transition: all 0.6s ease;
}

/* 當父容器淡出時，保持按鈕可見，由按鈕自己的動畫控制 */
.p1-text-fade-out .p1-button {
    opacity: 1 !important;
}

.p1-button.p1-text-fade-out {
    opacity: 0;
}

.p1-button-bg {
    position: absolute;
    width: 283px;
    height: 26.24px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
}

.p1-button:hover .p1-button-bg {
    opacity: 0;
}

.p1-button::before {
    content: '';
    position: absolute;
    width: 283px;
    height: 26.24px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url('~@/assets/images/p1-button-bg-hover.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.p1-button:hover::before {
    opacity: 1;
}

.p1-button-text {
    position: relative;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 15px;
    line-height: 1.8462em;
    letter-spacing: 0.1538em;
    text-align: center;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
    z-index: 1;
    animation: shadowBlink 3s infinite;
    transition: opacity 1.2s ease;
}

.p1-sound-hint {
    margin-top: 8px;
    color: gray;
    text-align: center;
    font-feature-settings: 'liga' off, 'clig' off;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 900;
    line-height: 28px;
    letter-spacing: 2px;
    opacity: 0;
    animation: fadeInButton 1s ease-in-out 1.6s forwards;
}

.p1-logo {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 11;
}

/* P1 响应式调整 */
@media (max-width: 500px) {
    .p1-screen {
        width: 100vw;
        height: 217.4vw;
        max-height: calc(var(--vh, 1vh) * 100);
    }
}

@media (min-width: 900px) {
    .p1-screen {
        max-width: 402px;
        width: 46vh;
    }
}

/* 平板裝置 - P1 內容區域位置調整 */
@media (min-width: 768px ) and (max-width: 1024px) {
    .p1-content {
        top: 250px !important;
    }

    .p1-bottom-section {
        bottom: 190px !important;
    }
}

/* P3 三選一卡片選擇樣式 */
.txt {
    width: 100%;
    text-align: center;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-size: 17px;
    line-height: 1.5em;
    top: 8%;
    position: absolute;
    z-index: 1;
}

.txt p {
    margin-bottom: 0;
}

.p3-main-content {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: calc(var(--vh, 1vh) * 100);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 40px;
    padding: 100px 0 60px;
    box-sizing: border-box;
    background: #000;
}

.p3-image-container {
    position: relative;
    width: 100%;
    flex: 1;
    max-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* overflow: hidden; */
}

.p3-cards-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    user-select: none;
}

.p3-cards-wrapper:active {
    cursor: grabbing;
}

.p3-card {
    position: absolute;
    width: auto;
    height: 100%;
    max-height: 500px;
    aspect-ratio: 144 / 424;
    /* border: 2px solid rgba(255, 255, 255, 0.4); */
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    left: 50%;
    top: 50%;
    margin-left: 0;
    margin-top: calc(-212px * 0.85); /* 半個卡片高度 * scale */
    border-radius: 20px;
    overflow: hidden;
}

.p3-card-selected {
    border: 2px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0px 0px 10px 2.5px rgba(255, 255, 255, 0.3), 0px 0px 20px 5px rgba(255, 255, 255, 0.2), 0px 0px 30px 7.5px rgba(255, 255, 255, 0.1), 0px 8px 16px 0px rgba(0, 0, 0, 0.4);
}

.p3-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    border-radius: 20px;
    overflow: hidden;
    display: block;
}

.p3-gradient-overlay {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 201px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 63%);
    pointer-events: none;
    z-index: 1;
}

.p3-button-group {
    position: relative;
    width: 150px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 2;
}

.p3-button {
    position: relative;
    width: 150px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.p3-button-scale-up {
    animation: none;
    opacity: 1 !important;
}

.p3-button-scale-up .p3-button-text {
    animation: none;
    transform: scale(1.3);
    opacity: 0;
    transition: all 0.6s ease;
}

.p3-button:hover {
    transform: scale(1.05);
}

.p3-button-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transition: opacity 0.3s ease;
}

.p3-button:hover .p3-button-bg {
    opacity: 0;
}

.p3-button::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-image: url('~@/assets/images/p1-button-bg-hover.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.p3-button:hover::before {
    opacity: 1;
}

.p3-button-text {
    position: relative;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 15px;
    line-height: 1.8462em;
    letter-spacing: 0.1538em;
    text-align: center;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.p3-logo {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 2;
}

/* 轮播箭头按钮 */
.p3-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
    backdrop-filter: blur(4px);
}

.p3-arrow:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-50%) scale(1.1);
}

.p3-arrow:active {
    transform: translateY(-50%) scale(0.95);
}

.p3-arrow-left {
    left: 20px;
}

.p3-arrow-right {
    right: 20px;
}

.p3-arrow svg {
    display: block;
}

/* P5 結尾頁面樣式 */
.p5-background-video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    height: calc(var(--vh, 1vh) * 100);
    object-fit: cover;
    object-position: center;
    z-index: 0;
}

.p5-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 1;
}

.p5-status-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 62px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 21px 16px 19px;
    box-sizing: border-box;
    z-index: 10;
}

.p5-time {
    color: #FFFFFF;
    font-family: 'LINE Seed TW_OTF', sans-serif;
    font-weight: 400;
    font-size: 17px;
    line-height: 1.294em;
    text-align: center;
}

.p5-levels {
    display: flex;
    align-items: center;
    gap: 7px;
}

.p5-signal,
.p5-wifi,
.p5-battery {
    width: 20px;
    height: 13px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
}

.p5-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
    box-sizing: border-box;
}

.p5-title {
    width: 100%;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 20px;
    line-height: 1.4em;
    letter-spacing: 0.1em;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}

.p5-subtitle-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 8px 60px;
    box-sizing: border-box;
}

.p5-decoration {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 468px;
    height: auto;
    max-width: none;
    pointer-events: none;
}

.p5-subtitle {
    position: relative;
    width: 346px;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 2.154em;
    letter-spacing: 0.1538em;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 1;
}

.p5-logo {
    position: absolute;
    left: 50%;
    bottom: 59px;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
}

/* P6 結果頁面樣式 */
.p6-screen {
    overflow-y: scroll;
    overflow-x: hidden;
    overscroll-behavior-y: contain;
    height: calc(var(--vh, 1vh) * 100);
    -webkit-overflow-scrolling: touch;
}

.p6-container {
    position: relative;
    width: 100%;
    min-height: 100%;
    display: block;
    background: transparent;
    /* 阻止文字選擇和預設長按行為 */
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}

.p6-background-image {
    display: block;
    width: 100%;
    height: auto;
    vertical-align: bottom;
}

/* 平板裝置 - P6 背景圖片與容器高度限制 */
@media (min-width: 768px ) and (max-width: 1024px) {
    .p6-background-image {
        max-height: 1265px;
    }

    .p6-container {
        max-height: 1265px;
    }
}

.p6-content {
    position: absolute;
    top: 55px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0;
    box-sizing: border-box;
    z-index: 1;
}

.p6-image-wrapper {
    width: 100%;
    position: relative;
    /* 明確啟用長按保存功能，覆蓋父元素的限制 */
    -webkit-touch-callout: default !important;
    -webkit-user-select: auto !important;
    user-select: auto !important;
    pointer-events: auto !important;
}

.p6-result-container {
    position: relative;
    display: block;
    width: 90%;
}

.p6-result-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    /* 底層圖片，禁用互動 */
    pointer-events: none;
}

/* 平板裝置 - P6 結果圖片寬度調整 */
@media (min-height: 1023px) {
    .p6-result-image {
        width: 53% !important;
        margin: 0 auto;
    }
}

.p6-download-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    /* 頂層透明覆蓋層，用於長按下載 */
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    /* 確保可以長按保存圖片 */
    -webkit-touch-callout: default !important;
    -webkit-user-select: auto !important;
    user-select: auto !important;
    pointer-events: auto !important;
}

/* 平板裝置 - P6 下載圖片高度限制 */
@media (min-height: 1023px) {
    .p6-download-image {
        max-height: 1200px !important;
    }
}

.p6-buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 10px 30px 25px;
    margin-top: 10px;
    box-sizing: border-box;
    position: relative;
}

/* 平板裝置 - P6 按鈕區域往下移 */
@media (min-height: 1023px) {
    .p6-buttons {
        margin-top: 45px !important;
    }
}

.p6-btn {
    position: relative;
    width: 328px;
    height: 28px;
    background-color: transparent;
    background-image: url('~@/assets/images/step6btnbg.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.p6-btn:hover {
    transform: scale(1.05);
}

.p6-btn:active {
    transform: scale(0.98);
}

.p6-btn-text {
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: white;
    text-align: center;
    z-index: 1;
    transition: all 0.6s ease;
    letter-spacing: 2px;
    text-shadow: 0 0 4px #624E45;
}

/* P6 按鈕點擊特效 */
.p6-btn-scale-up .p6-btn-text {
    transform: scale(1.3);
    opacity: 0;
    transition: all 0.6s ease;
}

.p6-share-section {
    position: relative;
    bottom: 18px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30px;
    box-sizing: border-box;
}

.p6-share-link {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    background-image: url('~@/assets/images/P6-sharetxt.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    padding: 20px 30px;
    min-height: 60px;
}

.p6-share-link:hover {
    transform: scale(1.05);
    opacity: 0.9;
}

/* P6 分享按鈕點擊特效 */
.p6-share-link-scale-up .p6-share-text {
    transform: scale(1.3);
    opacity: 0;
    transition: all 0.6s ease;
}

.p6-share-text {
    color: #624E45;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    vertical-align: middle;
    transition: all 0.6s ease;
    white-space: nowrap;
    letter-spacing: 2px;
}

/* 平板裝置 - P6 按鈕與文字樣式調整 */
@media (min-width: 768px ) and (max-width: 1024px) {
    .p6-btn {
        width: 350px !important;
        height: 28px !important;
    }

    .p6-btn-text {
        font-size: 16px !important;
    }

    .p6-share-text {
        font-size: 16px !important;
    }
}

.p6-share-image {
    width: auto;
    max-width: 100%;
    height: auto;
    display: block;
    transition: all 0.6s ease;
}

.p6-logo {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 20;
}

/* 進度條容器 */
.progress-bar-container {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 238px;
    max-width: 768px;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.progress-bar-container.show {
    opacity: 1;
}

/* 進度條底色 */
.progress-bar-background {
    position: relative;
    width: 100%;
    height: 3.37px;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.4);
    box-shadow:
        0 0 16px 0 rgba(255, 255, 255, 0.6),
        0 0 24px 0 rgba(255, 255, 255, 0.4),
        0 0 32px 0 rgba(255, 255, 255, 0.2);
}

/* 進度條填充 */
.progress-bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 50px;
    background: #FFF;
    box-shadow:
        0 0 8px 0px rgba(247, 201, 8, 0.6),
        0 0 16px 1px rgba(247, 201, 8, 0.5),
        0 0 24px 2px rgba(247, 201, 8, 0.4),
        0 0 32px 2px rgba(247, 201, 8, 0.3),
        0 0 40px 3px rgba(247, 201, 8, 0.2);
    transition: width 1s ease;
}


@media (min-width: 1025px) {
    .p1-content {
        top: 190px;
    }

    .p1-bottom-section {
        bottom: 140px;
    }
}

</style>
