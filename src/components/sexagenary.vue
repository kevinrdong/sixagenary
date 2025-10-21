<template>
    <div class="app-container">
        <transition name="fade" mode="out-in">
            <!-- 入口 -->
            <div class="p0-screen" v-if="step == 0" @click="step = 1" key="p0">
                <!-- 背景层（全屏） -->
                <div class="p0-bg-layers">
                    <div class="p0-bg-layer-1"></div>
                    <div class="p0-bg-layer-2"></div>
                    <div class="p0-bg-layer-3"></div>
                </div>

                <!-- 底部小图 -->
                <img :src="require('@/assets/images/p0-bottom-image.png')" alt="裝飾圖" class="p0-bottom-image" />

                <!-- 文本容器 -->
                <div class="p0-text-container" ref="textContainer">
                    <div class="p0-title-container">
                        <div class="p0-title">人生太難，不如躲進異世界中！</div>
                        <div class="p0-subtitle-wrapper">
                            <div class="p0-subtitle">點擊測你的<span style="color: rgb(158 110 29);">靈魂逃跑</span>指數</div>
                        </div>
                    </div>
                    <img :src="require('@/assets/images/logo-southern-museum.svg')" alt="Logo" class="p0-logo" />
                </div>

                <!-- 主视觉插图（放在文本容器之后，这样在CSS中可以更容易定位） -->
                <img :src="require('@/assets/images/p0-main-visual-9254d2.png')" alt="主視覺" class="p0-main-visual" />
            </div>
            <!-- P1-1 劇情前導 -->
            <div class="p1-screen" v-else-if="step == 1" key="p1">
                <!-- 背景視頻 -->
                <video
                    ref="p1Video"
                    class="p1-background-video"
                    :src="require('@/assets/images/step1_bg.mp4')"
                    muted
                    playsinline
                ></video>

                <div class="p1-content">
                    <!-- 上方文字说明 -->
                    <div class="p1-text-top" v-html="p1TextTopDisplay"></div>

                    <!-- 插图 -->
                    <!-- <img :src="require('@/assets/images/p1-illustration-c3e447.png')" alt="插圖" class="p1-illustration" /> -->
                </div>

                <!-- 下方内容 -->
                <div class="p1-bottom-section">
                    <div class="p1-text-bottom" v-html="p1TextBottomDisplay"></div>

                    <!-- 按钮 -->
                    <div class="p1-button" @click="startP1VideoAndTransition">
                        <img :src="require('@/assets/images/p1-button-bg.svg')" alt="按鈕背景" class="p1-button-bg" />
                        <span class="p1-button-text">進入異世界冒險</span>
                    </div>
                </div>

                <!-- Logo -->
                <img :src="require('@/assets/images/logo-southern-museum.svg')" alt="Logo" class="p1-logo" />
            </div>

            <div class="question-screen" v-else-if="step == 3" key="p3">
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
                        <div class="p3-button" @click="confirmSelection">
                            <img :src="require('@/assets/images/p1-button-bg.svg')" alt="按鈕背景" class="p3-button-bg" />
                            <span class="p3-button-text">確定</span>
                        </div>

                        <!-- 重新选择按钮 -->
                        <div class="p3-button" @click="resetSelection">
                            <img :src="require('@/assets/images/p1-button-bg.svg')" alt="按鈕背景" class="p3-button-bg" />
                            <span class="p3-button-text">重新選擇</span>
                        </div>
                    </div>
                </div>

                <!-- Logo -->
                <img :src="require('@/assets/images/logo-southern-museum.svg')" alt="Logo" class="p3-logo" />
            </div>
            <div class="question-screen" v-else-if="step == 4" key="p4">
                <transition name="fade" mode="out-in">
                    <div :key="questionNum">
                        <!-- 背景視頻 -->
                        <video
                            class="background-video"
                            :src="currentBackgroundVideo"
                            autoplay
                            loop
                            muted
                            playsinline
                        ></video>
                        <div class="gradient-overlay"></div>

                        <!-- 內容區 -->
                        <div class="content">
                            <!-- Logo -->
                            <img src="../assets/images/logo.png" alt="Logo" class="logo" />

                            <!-- 展覽資訊文字 -->
                            <div class="exhibition-text">
                                <p v-html="currentQuestion.t1"></p>
                                <p v-html="currentQuestion.t2"></p>
                            </div>

                            <!-- 選項按鈕 -->
                            <div class="options">
                                <div
                                    v-for="(option, index) in options['q' + type][questionNum]"
                                    :key="index"
                                    class="option-item"
                                    @click="selectOption(index)"
                                >
                                    <span class="option-text">{{ option.text }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
                <img :src="require('@/assets/images/logo-southern-museum.svg')" alt="Logo" class="p3-logo" />
            </div>
            <div class="question-screen" v-else-if="step == 5" key="p5">
                <!-- 背景視頻 -->
                <video
                    ref="p5Video"
                    class="p5-background-video"
                    :src="require('@/assets/images/clacing.mp4')"
                    autoplay
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
                    <img :src="require('@/assets/images/logo-southern-museum.svg')" alt="Logo" class="p5-logo" />
                </div>
            </div>
            <div class="question-screen p6-screen" v-else-if="step == 6" key="p6">
                <div class="p6-container">
                    <!-- 背景圖片 -->
                    <img :src="require('@/assets/images/resultBG.png')" alt="背景" class="p6-background-image" />

                    <!-- 內容容器 -->
                    <div class="p6-content">
                        <!-- 這裡可以添加其他內容 -->
                        {{ showresult(result) }}
                    </div>

                    <!-- 底部撑开空间，让页面可以滚动到底部 -->
                    <div class="p6-spacer"></div>

                    <!-- Logo -->
                    <img :src="require('@/assets/images/logo-southern-museum.svg')" alt="Logo" class="p6-logo" />
                </div>
            </div>
        </transition>
    </div>

</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
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
        let loadingInterval = null
        let p5Timeout = null

        // P1 打字機效果相關
        const p1TextTop = '忙碌的日常幾乎壓垮了你，在學校、工作、家庭間漫無目的地累積壓力——是時候讓靈魂放鬆，把腦中暫存檔歸零。<br><br>累了不是你的錯，但你可以選擇暫時逃跑！'
        const p1TextBottom = '人生太難，不如躲進異世界中<br>▼ 點擊下方按鈕，讓靈魂暫時逃離日常 ▼'
        const p1TextTopDisplay = ref('')
        const p1TextBottomDisplay = ref('')
        let typewriterInterval = null

        // 響應式屏幕寬度檢測
        const isWideScreen = ref(window.innerWidth >= 768)

        const updateScreenSize = () => {
            isWideScreen.value = window.innerWidth >= 768
        }
        const question = ref({
            q1: [
                {t1:'一覺醒來，你發現自己身在畫中', t2:'踏入幽谷，聽見松林「沙沙」響起<br>你腦中浮現什麼想法？'},
                {t1:'沒有發現什麼特別的事情', t2:'再往前走，你聽見山谷水聲轟鳴<br>此時你決定...？'},
                {t1:'站在原地、環顧四周', t2:'忽然山谷之間雲霧繚繞<br>你會想...'},
                {t1:'雲霧散開後，你走近觀看山石<br>發現紋理像斧頭劈開的痕跡，彷彿具有多層次空間！', t2:'哪句話首先跳進你的腦中？'},
                {t1:'邊思考邊走著...你在山峰某處，隱約看見有文字<br>', t2:'你會選擇做什麼事？'},
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
            return videoSource['q' + type.value][questionNum.value]
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
                        image: require('../assets/images/option-1.svg'),
                        text: '這是最棒的大自然冥想 BGM',
                        tag: [1, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '感到害怕，這幅畫不是沒有人嗎？',
                        tag: [3],
                    },
                    {
                        image: require('../assets/images/option-4.svg'),
                        text: '連松林都在歡迎我，看我華麗登場！',
                        tag: [2, 4],
                    },
                    // {
                    //     image: require('../assets/images/option-3.svg'),
                    //     text: '該不會是風之精靈在召喚我...'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '連松林都在歡迎我，看我華麗登場！'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '拿樹枝假裝指揮樂團，沉浸於交響樂中',
                        tag: [1, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '把水聲當白噪音，就地躺下補眠',
                        tag: [2],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '找出水聲方向，跟著水流找路',
                        tag: [3, 4],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '找出水聲位置，跟著水流應該能找到出路'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '隨手撿起樹枝，在地上制定過河 SOP'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '就此消失在霧裡，化身雲中居士',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '目前空氣含水量80%，降雨機率會上升',
                        tag: [3, 5],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '撥開雲霧，想看清楚松林的青綠色',
                        tag: [2, 4],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '腦中OS：空氣濕度80%，降雨機率上升'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '這雲霧......該不會是隱藏怪物要出現了？'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '這不就是傳說中的斧劈皴筆法！',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '要不要敲兩下看看，可能有寶箱？',
                        tag: [2, 4],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '這痕跡…像大師的練功印記。',
                        tag: [3, 5],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '拿起樹枝做個記號，讓後面的人不會錯過'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '環顧四周，思考裂縫是如何融入整體地形'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '唸出山峰上的文字，覺得可以芝麻開門',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '伸長手觸摸，確認是否有異次元空間',
                        tag: [2, 4],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '仔細端詳，思考文字是不是畫家的簽名',
                        tag: [3, 5],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '拿起隨身的登山杖，留下標記'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '在地圖上標記出簽名的位置，視為重要地標'
                    // }
                ],
            ],
            q2: [//谿山行旅圖
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '被眼前高聳的山峰感動到說不出話',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '立刻尋找山石表面的雨點皴在哪',
                        tag: [2, 3],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '山頂該不會是終極 BOSS 的大本營？',
                        tag: [2, 4],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '好壯闊！要是有人能一起欣賞就更棒了！'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '我得確認這是哪個時代，再決定下一步'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '樹枝當劍，大喊：「何方妖怪，全部退下」',
                        tag: [2, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '雙手拍臉，清新的霧氣適合肌膚補水',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '開啟練武模式，到瀑布下盤腿修行',
                        tag: [4],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '說：「松樹在這裡應該代表這裡海拔的高度」'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '這畫面很不錯，先拍下來收進景點清單'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '打算混進驢隊搭便車',
                        tag: [2, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '思考要如何讓驢子成為我的夥伴',
                        tag: [3, 4, 5],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '心想：他們看得到來自未來的我嗎？',
                        tag: [3, 5],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '嘗試跟漁夫溝通，跟他們交換一些漁貨'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '這種捕魚方式應該與水文環境有關，值得記錄'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '輕拍驢子：「辛苦了」默默產生社畜共鳴',
                        tag: [1, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '驢是不會說話的，你不要騙我',
                        tag: [4],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '我就靜靜看著牠...',
                        tag: [3],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '是指修仙之旅離我還有一段很遠的路嗎？'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '實在看不懂，期待之後有人能看懂'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '這該不會是畫作的時空傳送點？',
                        tag: [3, 4],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '驚呼「一千年前的簽名彩蛋 get！」',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '走近看，好奇簽名是簽在地上嗎？',
                        tag: [2, 3],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '主動詢問僧人，是否需要幫忙或補給'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '邀請僧人與我同行，跟他多聊聊佛法的演進'
                    // }
                ],
            ],
            q3: [//早春圖
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '等等！1072年？是哪個朝代？',
                        tag: [4],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '難道畫作本身也會說話？',
                        tag: [3],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '太好了，這是我最愛的穿越劇！',
                        tag: [1],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '想在這建立營地，必須先找出制高點才安全'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '該不會是終極 BOSS 的大本營？上去看看！'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '拍照記錄早春時節生意盎然這一刻。',
                        tag: [1, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '突然悟道：「難道我是被選中的修仙者？」',
                        tag: [1],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '找找看長得像螃蟹爪的樹木在哪裡...',
                        tag: [3],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '忍不住讚嘆：瀑布就像一首山水詩的化身！'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '開心貌：這裡水源充足，適合當補給站！'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '上前幫忙拉漁網，想讓他們早點收工。',
                        tag: [4, 5],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '拿竹竿大喊：「我要成為釣魚王！」',
                        tag: [2, 4],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '邊觀察記錄：「這捕魚法應與水流有關。」',
                        tag: [3, 5],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '觀察隊伍行進方向，推測附近城鎮位置'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '主動示好，告訴他們另一條路線更快！'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '跟上去要看看可愛的狗勾～',
                        tag: [1, 2],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '從遠處默默觀看，好奇他們會去哪',
                        tag: [4],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '看向扁擔裡的食盒：您好，我吃一點！',
                        tag: [5],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '什麼樣的胡蘿蔔，才會有什麼樣的驢'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '行囊裡是不是藏了范寬本人！？'
                    // }
                ],
                [
                    {
                        image: require('../assets/images/option-1.svg'),
                        text: '僧人都能走的山路，應該算是安全吧。',
                        tag: [4],
                    },
                    {
                        image: require('../assets/images/option-2.svg'),
                        text: '街訪直擊：包袱裡面到底都放些什麼？',
                        tag: [2],
                    },
                    {
                        image: require('../assets/images/option-3.svg'),
                        text: '思考這幅畫裡難道有廟宇可以參拜嗎？',
                        tag: [3],
                    },
                    // {
                    //     image: require('../assets/images/option-4.svg'),
                    //     text: '我決定將此地列為目標，展開下一步行動'
                    // },
                    // {
                    //     image: require('../assets/images/option-5.svg'),
                    //     text: '趕緊標註在地圖上，讓後來的登山客好找'
                    // }
                ],
            ],
        })

        const selectOption = (index) => {
            console.log('選擇了選項:', index + 1)

            // 獲取當前選項的 tag 陣列並統計
            const selectedOption = options.value['q' + type.value][questionNum.value][index]
            if (selectedOption && selectedOption.tag) {
                selectedOption.tag.forEach(tag => {
                    tagCounts.value[tag]++
                })
            }

            // 在這裡處理選項選擇邏輯
            setTimeout(() => {
                // 檢查是否為最後一個問題
                const totalQuestions = question.value['q' + type.value].length
                if (questionNum.value >= totalQuestions - 1) {
                    // 計算最多被選中的 tag
                    calculateMostFrequentTag()
                    // 已完成所有問題，跳轉到結尾頁面
                    step.value = 5
                } else {
                    // 繼續下一個問題
                    questionNum.value++;
                }
            }, 300)
        }

        // 卡片数据 - 只保留三张
        const cards = ref([
            { id: 1, name: '溪山行旅圖', image: require('@/assets/images/p3-card-left-5adf13.png') },
            { id: 2, name: '早春圖', image: require('@/assets/images/p3-card-center-3d024e.png') },
            { id: 3, name: '谿山行旅圖', image: require('@/assets/images/p3-card-right-47e46e.png') }
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
                    transform: 'translateX(0) translateY(-30px) scale(1)',
                    zIndex: 3,
                    opacity: 1
                },
                left: {
                    transform: 'translateX(-180px) translateY(20px) scale(0.85)',
                    zIndex: 1,
                    opacity: 0.7
                },
                right: {
                    transform: 'translateX(180px) translateY(20px) scale(0.85)',
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

        // P1 打字機效果
        const startTypewriter = () => {
            // 清除可能存在的計時器
            if (typewriterInterval) {
                clearInterval(typewriterInterval)
            }

            // 重置顯示文字
            p1TextTopDisplay.value = ''
            p1TextBottomDisplay.value = ''

            let topIndex = 0
            let bottomIndex = 0
            const topLength = p1TextTop.length
            const bottomLength = p1TextBottom.length

            // 先顯示上方文字
            typewriterInterval = setInterval(() => {
                if (topIndex < topLength) {
                    // 處理 HTML 標籤，一次性顯示整個標籤
                    if (p1TextTop[topIndex] === '<') {
                        const closeTagIndex = p1TextTop.indexOf('>', topIndex)
                        if (closeTagIndex !== -1) {
                            p1TextTopDisplay.value += p1TextTop.substring(topIndex, closeTagIndex + 1)
                            topIndex = closeTagIndex + 1
                        } else {
                            p1TextTopDisplay.value += p1TextTop[topIndex]
                            topIndex++
                        }
                    } else {
                        p1TextTopDisplay.value += p1TextTop[topIndex]
                        topIndex++
                    }
                } else if (bottomIndex < bottomLength) {
                    // 上方文字完成後顯示下方文字
                    if (p1TextBottom[bottomIndex] === '<') {
                        const closeTagIndex = p1TextBottom.indexOf('>', bottomIndex)
                        if (closeTagIndex !== -1) {
                            p1TextBottomDisplay.value += p1TextBottom.substring(bottomIndex, closeTagIndex + 1)
                            bottomIndex = closeTagIndex + 1
                        } else {
                            p1TextBottomDisplay.value += p1TextBottom[bottomIndex]
                            bottomIndex++
                        }
                    } else {
                        p1TextBottomDisplay.value += p1TextBottom[bottomIndex]
                        bottomIndex++
                    }
                } else {
                    // 兩段文字都完成
                    clearInterval(typewriterInterval)
                    typewriterInterval = null
                }
            }, 50) // 每 50 毫秒顯示一個字
        }

        // P1 視頻播放並轉場
        const startP1VideoAndTransition = () => {
            if (p1Video.value) {
                p1Video.value.play()
                setTimeout(() => {
                    step.value = 3
                }, 5000) // 5秒後跳轉
            }
        }

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

        onMounted(() => {
            nextTick(() => {
                if (textContainer.value) {
                    const height = textContainer.value.offsetHeight
                    document.documentElement.style.setProperty('--text-container-height', `${height}px`)
                }
            })

            // 添加 resize 事件監聽
            window.addEventListener('resize', updateScreenSize)

            // 初始化光暈延遲
            triggerGlowDelay()
        })

        // 監聽 step 變化
        watch(step, (newStep) => {
            if (newStep === 1) {
                // 進入 P1 頁面時啟動打字機效果
                startTypewriter()
            } else if (newStep === 3) {
                // 進入卡片選擇頁面時觸發光暈延遲
                triggerGlowDelay()
            } else if (newStep === 5) {
                // 清除可能存在的舊計時器
                if (loadingInterval) {
                    clearInterval(loadingInterval)
                }
                if (p5Timeout) {
                    clearTimeout(p5Timeout)
                }

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
                // 離開 step 5 時清除計時器
                if (loadingInterval) {
                    clearInterval(loadingInterval)
                    loadingInterval = null
                }
                if (p5Timeout) {
                    clearTimeout(p5Timeout)
                    p5Timeout = null
                }
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
            // 移除 resize 事件監聽
            window.removeEventListener('resize', updateScreenSize)
        })

        return {
            type,
            step,
            options,
            question,
            selectOption,
            questionNum,
            currentQuestion,
            currentBackgroundVideo,
            // currentOptions,
            textContainer,
            p1Video,
            p5Video,
            p1TextTopDisplay,
            p1TextBottomDisplay,
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
            startP1VideoAndTransition,
            loadingDots,
            tagCounts,
            result,
            showGlow,
            showresult,
        }
    }
}

</script>

<style scoped>
.question-screen {
    position: relative;
    width: 100vw;
    height: 100vh;
    max-width: 768px;
    max-height: 1024px;
    overflow: hidden;
    background: #000;
}

.background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
}

.gradient-overlay {
    position: absolute;
    left: -36px;
    top: 616px;
    width: 836px;
    height: 408px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 63%);
    pointer-events: none;
}

.content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
}

.logo {
    position: absolute;
    bottom: 41px;
    left: 50%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 2;
}

.exhibition-text {
    position: absolute;
    top: 157px;
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
    top: 600px;
    width: 370px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.option-item {
    position: relative;
    width: 370px;
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
    transform: scale(1.02);
}

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
  transition: opacity 0.5s ease;
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
    min-height: 100vh;
    background-color: #000;
}

/* P0 主視覺樣式 */
.p0-screen {
    position: relative;
    width: 46vh; /* 402/874 ≈ 0.46 */
    height: 100vh;
    overflow: hidden;
}

.p0-bg-layers {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
}

.p0-bg-layer-1 {
    flex: 1;
    background-color: #B4AE65;
}

.p0-bg-layer-2 {
    flex: 1;
    background-color: #E0D070;
}

.p0-bg-layer-3 {
    flex: 1;
    background-color: #899C9A;
}

.p0-main-visual {
    position: absolute;
    bottom: var(--text-container-height, 120px);
    left: 0;
    width: 100%;
    height: auto;
    z-index: 1;
}

.p0-bottom-image {
    position: absolute;
    top: 74px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 365px;
    height: auto;
    z-index: 2;
}

.p0-text-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px 50px;
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

.p0-subtitle-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 4px 12px;
    background-color: #FFFFFF;
    border-radius: 20px;
}

.p0-subtitle {
    color: #524735;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 1em;
    letter-spacing: 0.23077em;
    text-align: center;
    cursor: pointer;
}

.p0-logo {
    width: 109.72px;
    height: 16.01px;
    margin-top: 16px;
}

/* 响应式调整 - 当宽度不够时，改为宽度100%，高度按比例 */
@media (max-width: 500px) {
    .p0-screen {
        width: 100vw;
        height: 217.4vw; /* 874/402 ≈ 2.174 */
        max-height: 100vh;
    }
}

/* 限制最大宽度 */
@media (min-width: 900px) {
    .p0-screen {
        max-width: 402px;
        width: 46vh;
    }
}

/* P1 劇情前導樣式 */
.p1-screen {
    position: relative;
    width: 46vh;
    height: 100vh;
    overflow: hidden;
    background-color: #000000;
    display: flex;
    flex-direction: column;
}

.p1-background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
}

.p1-content {
    position: absolute;
    top: 160px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 44px;
    z-index: 1;
}

.p1-text-top {
    width: 100%;
    padding: 0 16px;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 15px;
    line-height: 1.8667em;
    letter-spacing: 0.1333em;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}

.p1-illustration {
    width: 100%;
    height: 188px;
    object-fit: cover;
}

.p1-bottom-section {
    position: absolute;
    bottom: 15%;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    padding: 0 16px;
    z-index: 2;
}

.p1-text-bottom {
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 15px;
    line-height: 1.8667em;
    letter-spacing: 0.1333em;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}

.p1-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 90px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.p1-button:hover {
    transform: scale(1.05);
}

.p1-button-bg {
    position: absolute;
    width: 283px;
    height: 26.24px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.p1-button-text {
    position: relative;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 1.8462em;
    letter-spacing: 0.1538em;
    text-align: center;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.p1-logo {
    position: absolute;
    bottom: 41px;
    left: 50%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 2;
}

/* P1 响应式调整 */
@media (max-width: 500px) {
    .p1-screen {
        width: 100vw;
        height: 217.4vw;
        max-height: 100vh;
    }
}

@media (min-width: 900px) {
    .p1-screen {
        max-width: 402px;
        width: 46vh;
    }
}

/* P3 三選一卡片選擇樣式 */
.p3-main-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 40px;
    padding: 100px 0 80px;
    box-sizing: border-box;
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
    left: 45%;
    top: 50%;
    margin-left: calc(-72px * 0.85); /* 半個卡片寬度 * scale */
    margin-top: calc(-212px * 0.85); /* 半個卡片高度 * scale */
    border-radius: 20px;
}

.p3-card-selected {
    border: 2px solid rgba(255, 255, 255, 0.6);
    box-shadow:
        0px 0px 10px 2.5px rgba(255, 255, 255, 0.3),
        0px 0px 20px 5px rgba(255, 255, 255, 0.2),
        0px 0px 30px 7.5px rgba(255, 255, 255, 0.1),
        0px 8px 16px 0px rgba(0, 0, 0, 0.4);
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
    width: 302px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 2;
}

.p3-button {
    position: relative;
    width: 302px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;
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
}

.p3-button-text {
    position: relative;
    color: #FFFFFF;
    font-family: 'Swei B2 Sugar CJK TC', sans-serif;
    font-weight: 900;
    font-size: 13px;
    line-height: 1.8462em;
    letter-spacing: 0.1538em;
    text-align: center;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.p3-logo {
    position: absolute;
    bottom: 41px;
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
    left: 0;
    width: 100%;
    height: 100%;
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
    overflow-y: auto;
    overflow-x: hidden;
}

.p6-container {
    position: relative;
    width: 100%;
    display: block;
}

.p6-background-image {
    display: block;
    width: 100%;
    height: auto;
}

.p6-content {
    position: absolute;
    top: 102px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
    box-sizing: border-box;
    z-index: 1;
}

.p6-spacer {
    display: none;
}

.p6-logo {
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translateX(-50%);
    width: 123px;
    height: 18.01px;
    z-index: 2;
}
</style>