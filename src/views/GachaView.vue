<template>
    <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
        <!-- 顶部状态栏 -->
        <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center mb-8 gap-4">
            <div>
                <h1
                    class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500">
                    星际招募终端
                </h1>
                <p class="text-gray-500 mt-2 font-mono text-sm">PROBABILITY: SSR 0.6% | SR 6.0% | R 93.4%</p>
            </div>

            <div class="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
                <!-- 移动端第一行：按钮组 -->
                <div class="flex gap-2 md:gap-4 order-1 md:order-2 w-full md:w-auto justify-center md:justify-end">
                    <button @click="showCollection = true"
                        class="bg-gray-800 hover:bg-gray-700 flex-1 md:flex-none px-3 md:px-4 py-3 md:py-2 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base">
                        <span>🎴</span> 图鉴
                    </button>
                    <button @click="showHistory = true"
                        class="bg-gray-800 hover:bg-gray-700 flex-1 md:flex-none px-3 md:px-4 py-3 md:py-2 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base">
                        <span>📜</span> 记录
                    </button>
                    <router-link to="/game"
                        class="bg-gray-800 hover:bg-gray-700 flex-1 md:flex-none px-3 md:px-4 py-3 md:py-2 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base">
                        <span>←</span> 返回
                    </router-link>
                </div>
                <!-- 移动端第二行：数据组 -->
                <div class="flex gap-2 md:gap-4 order-2 md:order-1 w-full md:w-auto justify-center md:justify-end">
                    <div class="bg-gray-900/50 border border-yellow-500/30 rounded-lg flex-1 md:flex-none px-3 md:px-4 py-2 text-center">
                        <div class="text-xs text-gray-500 uppercase">猫猫币</div>
                        <div class="text-lg md:text-xl font-bold text-yellow-500">{{ tokenStore.tokens }}</div>
                    </div>
                    <div class="bg-gray-900/50 border border-gray-800 rounded-lg flex-1 md:flex-none px-3 md:px-4 py-2 text-center">
                        <div class="text-xs text-gray-500 uppercase">SSR 保底</div>
                        <div class="text-lg md:text-xl font-bold text-yellow-500">{{ 90 - pitySSR }}</div>
                    </div>
                    <div class="bg-gray-900/50 border border-gray-800 rounded-lg flex-1 md:flex-none px-3 md:px-4 py-2 text-center">
                        <div class="text-xs text-gray-500 uppercase">SR 保底</div>
                        <div class="text-lg md:text-xl font-bold text-purple-500">{{ 10 - pitySR }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center gap-4 md:gap-8 mb-12">
            <button @click="performGacha(1)" :disabled="isDrawing || tokenStore.tokens < SINGLE_COST"
                class="group relative px-8 py-4 bg-black border border-blue-500/50 rounded-xl overflow-hidden transition-all hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                <span class="relative text-blue-400 font-bold">单次招募 ({{ SINGLE_COST }}猫猫币)</span>
            </button>

            <button @click="performGacha(10)" :disabled="isDrawing || tokenStore.tokens < TEN_COST"
                class="group relative px-10 py-4 bg-black border border-purple-500/50 rounded-xl overflow-hidden transition-all hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                <span class="relative text-purple-400 font-bold">十连招募 ({{ TEN_COST }}猫猫币)</span>
            </button>
        </div>

        <!-- 抽卡展示区 -->
        <div class="max-w-7xl mx-auto min-h-[400px]">
            <TransitionGroup name="gacha-list" tag="div" :class="[
                'grid gap-3 sm:gap-6 justify-items-center',
                currentResult.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
            ]">
                <div v-for="(card, index) in currentResult" :key="card.uniqueId" class="relative">
                    <GachaCard v-bind="card" @preview="openPreview" ref="cardRefs" />
                </div>
            </TransitionGroup>

            <!-- 初始状态 -->
            <div v-if="currentResult.length === 0 && !isDrawing"
                class="flex flex-col items-center justify-center py-20 opacity-20">
                <div class="text-9xl mb-6 animate-pulse">🛰️</div>
                <p class="text-xl tracking-[0.2em]">等待指令输入...</p>
            </div>
        </div>

        <!-- 历史记录弹窗 -->
        <div v-if="showHistory"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
                class="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 class="text-xl font-bold">招募历史记录</h2>
                    <button @click="showHistory = false" class="text-gray-500 hover:text-white text-2xl">✕</button>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
                    <table class="w-full text-left">
                        <thead class="text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th class="pb-4">时间</th>
                                <th class="pb-4">成员</th>
                                <th class="pb-4">稀有度</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800">
                            <tr v-for="(item, idx) in history" :key="idx" class="text-sm">
                                <td class="py-3 text-gray-500">{{ item.time }}</td>
                                <td class="py-3 font-medium">{{ item.name }}</td>
                                <td class="py-3">
                                    <span :class="{
                                        'text-yellow-500': item.rarity === 'SSR',
                                        'text-purple-500': item.rarity === 'SR',
                                        'text-blue-500': item.rarity === 'R'
                                    }">{{ item.rarity }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="history.length === 0" class="text-center py-10 text-gray-600">暂无记录</div>
                </div>
                <div class="p-6 border-t border-gray-800 flex justify-between">
                    <button @click="clearHistory" class="text-red-500 text-sm hover:underline">清空记录</button>
                    <button @click="showHistory = false" class="bg-gray-800 px-4 py-2 rounded-lg text-sm">关闭</button>
                </div>
            </div>
        </div>

        <!-- 图片预览大图 -->
        <div v-if="previewUrl" @click="previewUrl = ''"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out animate-in fade-in duration-300">
            <img :src="previewUrl" class="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
            <div class="absolute top-6 right-6 text-white text-4xl">✕</div>
        </div>

        <!-- 图鉴弹窗 -->
        <div v-if="showCollection"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
                class="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
                <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">图鉴</h2>
                        <p class="text-xs text-gray-500 mt-1">收集进度: {{ collectedCount }}/{{ totalCount }}</p>
                    </div>
                    <button @click="showCollection = false" class="text-gray-500 hover:text-white text-2xl">✕</button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 space-y-10">
                    <div v-for="rarity in ['SSR', 'SR', 'R']" :key="rarity">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2" :class="{
                            'text-yellow-500': rarity === 'SSR',
                            'text-purple-500': rarity === 'SR',
                            'text-blue-500': rarity === 'R'
                        }">
                            <span class="w-2 h-6 bg-current rounded-full"></span>
                            {{ rarity }} 级别
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <div v-for="item in gachaPool[rarity]" :key="item.name"
                                class="relative aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all group"
                                :class="isCollected(item.name) ? 'border-gray-700 cursor-pointer hover:border-gray-400' : 'border-dashed border-gray-800 opacity-40'"
                                @click="isCollected(item.name) && openPreview(item.imageUrl)">

                                <template v-if="isCollected(item.name)">
                                    <img :src="item.imageUrl" class="w-full h-full object-cover" />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                                        <span class="text-[10px] font-bold truncate">{{ item.name }}</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <div
                                        class="w-full h-full bg-gray-900 flex items-center justify-center text-4xl text-gray-800">
                                        ?
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-800 flex justify-end">
                    <button @click="showCollection = false" class="bg-gray-800 px-6 py-2 rounded-lg">返回终端</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import GachaCard from '@/components/GachaCard.vue'
import { useTokenStore } from '@/stores/token'

const tokenStore = useTokenStore()

// 抽卡费用
const SINGLE_COST = 2
const TEN_COST = 20

interface GachaItem {
    name: string
    imageUrl: string
    rarity: 'SSR' | 'SR' | 'R'
    uniqueId?: number
    time?: string
}

// 状态变量
const currentResult = ref<GachaItem[]>([])
const history = ref<GachaItem[]>([])
const pitySSR = ref(0)
const pitySR = ref(0)
const isDrawing = ref(false)
const showHistory = ref(false)
const showCollection = ref(false)
const collectedNames = ref<Set<string>>(new Set())
const cardRefs = ref<any[]>([])
const previewUrl = ref('')

// 动态读取资源池
const gachaPool = ref<{ [key: string]: { name: string, imageUrl: string }[] }>({
    SSR: [],
    SR: [],
    R: []
})

// 使用 Vite 的 import.meta.glob 动态导入图片
const loadGachaPool = () => {
    const images = import.meta.glob('@/assets/gacha/**/*.{png,jpg,jpeg,webp}', { eager: true })

    for (const path in images) {
        const parts = path.split('/')
        const rarity = parts[parts.length - 2] // SSR, SR, R
        const fileName = parts[parts.length - 1]
        const name = fileName.substring(0, fileName.lastIndexOf('.'))

        if (gachaPool.value[rarity]) {
            gachaPool.value[rarity].push({
                name,
                imageUrl: (images[path] as any).default
            })
        }
    }
}

const openPreview = (url: string) => {
    previewUrl.value = url
}

// 初始化加载
onMounted(() => {
    loadGachaPool()
    const savedHistory = localStorage.getItem('gacha_history')
    if (savedHistory) history.value = JSON.parse(savedHistory)

    const savedCollected = localStorage.getItem('gacha_collected')
    if (savedCollected) {
        const names = JSON.parse(savedCollected)
        names.forEach((name: string) => collectedNames.value.add(name))
    }

    const savedPity = localStorage.getItem('gacha_pity')
    if (savedPity) {
        const { ssr, sr } = JSON.parse(savedPity)
        pitySSR.value = ssr
        pitySR.value = sr
    }
})

// 保存状态
const saveState = () => {
    localStorage.setItem('gacha_history', JSON.stringify(history.value.slice(0, 100))) // 只存最近100条
    localStorage.setItem('gacha_pity', JSON.stringify({ ssr: pitySSR.value, sr: pitySR.value }))
    localStorage.setItem('gacha_collected', JSON.stringify(Array.from(collectedNames.value)))
}

// 抽卡核心逻辑
const performGacha = async (count: number) => {
    if (isDrawing.value) return

    // 检查并消耗猫猫币
    const cost = count === 1 ? SINGLE_COST : TEN_COST
    if (!tokenStore.spend(cost)) {
        alert(`猫猫币不足！需要 ${cost} 猫猫币`)
        return
    }

    isDrawing.value = true
    currentResult.value = []

    const results: GachaItem[] = []

    for (let i = 0; i < count; i++) {
        pitySSR.value++
        pitySR.value++

        let rarity: 'SSR' | 'SR' | 'R' = 'R'
        const roll = Math.random() * 100

        // 判定稀有度
        if (roll < 0.6 || pitySSR.value >= 90) {
            rarity = 'SSR'
            pitySSR.value = 0
            pitySR.value = 0
        } else if (roll < 6.6 || pitySR.value >= 10) {
            rarity = 'SR'
            pitySR.value = 0
        }

        // 从对应稀有度池中随机选一个
        const pool = gachaPool.value[rarity]
        const itemBase = pool[Math.floor(Math.random() * pool.length)]

        const item: GachaItem = {
            name: itemBase.name,
            imageUrl: itemBase.imageUrl,
            rarity,
            uniqueId: Date.now() + i,
            time: new Date().toLocaleString()
        }

        results.push(item)
    }

    // 更新历史记录和图鉴
    results.forEach(item => collectedNames.value.add(item.name))
    history.value = [...results, ...history.value].slice(0, 100)
    saveState()

    // 动画展示
    for (const card of results) {
        currentResult.value.push(card)
        await new Promise(r => setTimeout(r, 100))
    }

    await nextTick()

    setTimeout(() => {
        if (cardRefs.value) {
            cardRefs.value.forEach((card, idx) => {
                setTimeout(() => card?.toggleFlip(), idx * 150)
            })
        }
        isDrawing.value = false
    }, 400)
}

const clearHistory = () => {
    if (confirm('确定要清空所有招募记录吗？（图鉴进度将保留）')) {
        history.value = []
        saveState()
    }
}

const isCollected = (name: string) => collectedNames.value.has(name)

const totalCount = computed(() => {
    return Object.values(gachaPool.value).reduce((acc, pool) => acc + pool.length, 0)
})

const collectedCount = computed(() => collectedNames.value.size)
</script>

<style scoped>
.gacha-list-enter-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gacha-list-enter-from {
    opacity: 0;
    transform: scale(0.3) rotateY(180deg);
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #444;
}
</style>
