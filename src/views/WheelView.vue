<template>
    <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
        <!-- 顶部状态栏 -->
        <div class="max-w-4xl mx-auto flex flex-wrap justify-between items-center mb-8 gap-4">
            <div>
                <h1
                    class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500">
                    幸运转盘
                </h1>
                <p class="text-gray-500 mt-2 font-mono text-sm">SPIN THE WHEEL OF FORTUNE</p>
            </div>

            <div class="flex gap-4 items-center">
                <div class="bg-gray-900/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-center">
                    <div class="text-xs text-gray-500 uppercase">猫猫币</div>
                    <div class="text-xl font-bold text-yellow-500">{{ tokenStore.tokens }}</div>
                </div>
                <router-link to="/game"
                    class="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>←</span> 返回
                </router-link>
            </div>
        </div>

        <!-- 转盘区域 -->
        <div class="max-w-4xl mx-auto flex flex-col items-center">
            <!-- 转盘 -->
            <div class="relative mb-8">
                <!-- 指针 -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                    <div
                        class="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-lg">
                    </div>
                </div>

                <!-- 转盘主体 -->
                <div class="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-yellow-500/50 shadow-2xl shadow-yellow-500/20 overflow-hidden"
                    :style="{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }">
                    <svg viewBox="0 0 100 100" class="w-full h-full">
                        <g v-for="(segment, index) in segments" :key="index">
                            <path :d="getSegmentPath(index)" :fill="segment.color" stroke="#1a1a1a"
                                stroke-width="0.5" />
                            <text :transform="getTextTransform(index)" text-anchor="middle" dominant-baseline="middle"
                                :fill="segment.textColor" font-size="4" font-weight="bold">
                                {{ segment.label }}
                            </text>
                        </g>
                        <!-- 中心圆 -->
                        <circle cx="50" cy="50" r="12" fill="#1a1a1a" stroke="#333" stroke-width="1" />
                        <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="#666"
                            font-size="3">SPIN</text>
                    </svg>
                </div>
            </div>

            <!-- 抽奖按钮 -->
            <button @click="spin" :disabled="isSpinning || tokenStore.tokens < SPIN_COST"
                class="group relative px-12 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl overflow-hidden transition-all hover:from-green-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30">
                <span class="relative text-white font-bold text-lg">
                    {{ isSpinning ? '转动中...' : `抽奖 (${SPIN_COST} 猫猫币)` }}
                </span>
            </button>

            <!-- 猫猫币不足提示 -->
            <p v-if="tokenStore.tokens < SPIN_COST && !isSpinning" class="mt-4 text-red-400 text-sm">
                猫猫币不足，需要 {{ SPIN_COST }} 猫猫币
            </p>

            <!-- 结果展示 -->
            <Transition name="result">
                <div v-if="showResult" class="mt-8 text-center">
                    <div class="text-4xl md:text-6xl font-bold mb-2"
                        :class="lastResult > 0 ? 'text-yellow-400' : 'text-gray-500'">
                        {{ lastResult > 0 ? `+${lastResult}` : '谢谢惠顾' }}
                    </div>
                    <p class="text-gray-500">{{ lastResult > 0 ? '恭喜获得猫猫币!' : '再接再厉!' }}</p>
                </div>
            </Transition>

            <!-- 历史记录 -->
            <div class="mt-8 w-full max-w-sm bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                <h3 class="text-lg font-bold mb-3 text-gray-400 flex items-center justify-center gap-2">
                    <span>历史记录</span>
                    <span class="text-xs text-gray-600">(最近6条)</span>
                </h3>
                <div class="history-list max-h-48 overflow-y-auto">
                    <div v-if="history.length === 0" class="text-gray-600 text-sm text-center py-4">
                        暂无记录
                    </div>
                    <TransitionGroup name="history" tag="div" class="grid grid-cols-3 gap-2">
                        <div v-for="(record, index) in history" :key="record.id"
                            class="flex flex-col items-center py-2 px-3 rounded-lg"
                            :class="record.value > 0 ? 'bg-green-900/30 border border-green-700/30' : 'bg-gray-800/50 border border-gray-700/30'">
                            <span class="text-gray-500 text-xs">#{{ history.length - index }}</span>
                            <span class="font-bold" :class="record.value > 0 ? 'text-yellow-400' : 'text-gray-500'">
                                {{ record.value > 0 ? `+${record.value}` : '0' }}
                            </span>
                        </div>
                    </TransitionGroup>
                </div>
            </div>

            <!-- 概率说明（不公示具体概率） -->
            <div class="mt-8 w-full max-w-md">
                <h3 class="text-lg font-bold mb-4 text-gray-400">奖励档次</h3>
                <div class="grid grid-cols-3 gap-2 text-sm">
                    <div v-for="segment in segments" :key="segment.label"
                        class="flex justify-center items-center bg-gray-900/50 rounded px-3 py-2">
                        <span :style="{ color: segment.color }">{{ segment.label === '谢谢惠顾' ? '谢谢惠顾' : segment.label +
                            '猫猫币' }}</span>
                    </div>
                </div>
                <p class="mt-4 text-xs text-gray-600 text-center">
                    每次消耗 {{ SPIN_COST }} 猫猫币，祝你好运！
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTokenStore } from '@/stores/token'

const tokenStore = useTokenStore()

const SPIN_COST = 5

// ============================================
// 转盘模式配置（后台可修改，前台不可见）
// 模式1: 期望值0.9  模式2: 期望值1.5  模式3: 期望值2.4
// ============================================
const WHEEL_MODE = 3 // 修改此值切换模式：1, 2, 或 3

// 模式一：期望值 = 0.9（亏损模式）
// 期望收益 = 4.5 猫猫币，消耗5猫猫币，期望值 = 4.5/5 = 0.9
const MODE_1_SEGMENTS = [
    { label: '谢谢惠顾', value: 0, probability: 0.55, color: '#374151', textColor: '#9ca3af' },
    { label: '5', value: 5, probability: 0.30, color: '#059669', textColor: '#ffffff' },
    { label: '10', value: 10, probability: 0.10, color: '#0891b2', textColor: '#ffffff' },
    { label: '25', value: 25, probability: 0.03, color: '#7c3aed', textColor: '#ffffff' },
    { label: '50', value: 50, probability: 0.015, color: '#db2777', textColor: '#ffffff' },
    { label: '100', value: 100, probability: 0.005, color: '#f59e0b', textColor: '#000000' },
]

// 模式二：期望值 = 1.5（中等盈利模式）
// 期望收益 = 7.5 猫猫币，消耗5猫猫币，期望值 = 7.5/5 = 1.5
const MODE_2_SEGMENTS = [
    { label: '谢谢惠顾', value: 0, probability: 0.35, color: '#374151', textColor: '#9ca3af' },
    { label: '5', value: 5, probability: 0.40, color: '#059669', textColor: '#ffffff' },
    { label: '10', value: 10, probability: 0.15, color: '#0891b2', textColor: '#ffffff' },
    { label: '25', value: 25, probability: 0.06, color: '#7c3aed', textColor: '#ffffff' },
    { label: '50', value: 50, probability: 0.03, color: '#db2777', textColor: '#ffffff' },
    { label: '100', value: 100, probability: 0.01, color: '#f59e0b', textColor: '#000000' },
]

// 模式三：期望值 = 2.4（高盈利模式）
// 期望收益 = 12 猫猫币，消耗5猫猫币，期望值 = 12/5 = 2.4
const MODE_3_SEGMENTS = [
    { label: '谢谢惠顾', value: 0, probability: 0.18, color: '#374151', textColor: '#9ca3af' },
    { label: '5', value: 5, probability: 0.40, color: '#059669', textColor: '#ffffff' },
    { label: '10', value: 10, probability: 0.25, color: '#0891b2', textColor: '#ffffff' },
    { label: '25', value: 25, probability: 0.09, color: '#7c3aed', textColor: '#ffffff' },
    { label: '50', value: 50, probability: 0.055, color: '#db2777', textColor: '#ffffff' },
    { label: '100', value: 100, probability: 0.025, color: '#f59e0b', textColor: '#000000' },
]

// 根据模式选择对应的配置
const getSegmentsByMode = (mode: number) => {
    switch (mode) {
        case 1: return MODE_1_SEGMENTS
        case 2: return MODE_2_SEGMENTS
        case 3: return MODE_3_SEGMENTS
        default: return MODE_1_SEGMENTS
    }
}

const segments = getSegmentsByMode(WHEEL_MODE)

// 计算期望值（仅用于调试，前台不显示）
const expectedValue = computed(() => {
    const ev = segments.reduce((sum, s) => sum + s.value * s.probability, 0)
    return ev / SPIN_COST
})

const rotation = ref(0)
const isSpinning = ref(false)
const showResult = ref(false)
const lastResult = ref(0)

// 历史记录
interface HistoryRecord {
    id: number
    value: number
}
const history = ref<HistoryRecord[]>([])
let historyIdCounter = 0

const addToHistory = (value: number) => {
    history.value.unshift({ id: ++historyIdCounter, value })
    if (history.value.length > 6) {
        history.value.pop()
    }
}

// 根据概率获取结果
const getRandomResult = () => {
    const rand = Math.random()
    let cumulative = 0
    for (let i = 0; i < segments.length; i++) {
        cumulative += segments[i].probability
        if (rand < cumulative) {
            return i
        }
    }
    return 0 // 默认返回谢谢惠顾
}

// 计算扇形路径
const getSegmentPath = (index: number) => {
    const total = segments.length
    const angle = 360 / total
    const startAngle = index * angle - 90
    const endAngle = startAngle + angle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 50 + 50 * Math.cos(startRad)
    const y1 = 50 + 50 * Math.sin(startRad)
    const x2 = 50 + 50 * Math.cos(endRad)
    const y2 = 50 + 50 * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
}

// 计算文字位置
const getTextTransform = (index: number) => {
    const total = segments.length
    const angle = 360 / total
    const midAngle = index * angle + angle / 2 - 90
    const rad = (midAngle * Math.PI) / 180
    const x = 50 + 32 * Math.cos(rad)
    const y = 50 + 32 * Math.sin(rad)
    return `translate(${x}, ${y}) rotate(${midAngle + 90})`
}

// 抽奖
const spin = () => {
    if (isSpinning.value || !tokenStore.spend(SPIN_COST)) return

    isSpinning.value = true
    showResult.value = false

    // 先获取结果
    const resultIndex = getRandomResult()
    const segment = segments[resultIndex]

    // 每个扇区60度，计算目标角度
    // 扇区0（谢谢惠顾）的中心需要旋转330度才能对准顶部指针
    // 扇区1（5）需要旋转270度，扇区2（10）需要210度，以此类推
    const segmentAngle = 360 / segments.length // 60度
    const targetAngleInCircle = (330 - resultIndex * segmentAngle + 360) % 360

    // 确保总是顺时针旋转：从当前位置向上取整 + 5圈 + 目标角度
    const currentBase = Math.floor(rotation.value / 360) * 360
    const finalRotation = currentBase + 5 * 360 + targetAngleInCircle

    rotation.value = finalRotation

    // 动画结束后显示结果
    setTimeout(() => {
        isSpinning.value = false
        lastResult.value = segment.value
        showResult.value = true
        addToHistory(segment.value)

        if (segment.value > 0) {
            tokenStore.earn(segment.value)
        }
    }, 4100)
}
</script>

<style scoped>
.result-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-leave-active {
    transition: all 0.3s ease-out;
}

.result-enter-from {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
}

.result-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

/* 历史记录动画 */
.history-enter-active {
    transition: all 0.4s ease-out;
}

.history-leave-active {
    transition: all 0.3s ease-in;
}

.history-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.history-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.history-move {
    transition: transform 0.3s ease;
}

/* 历史记录滚动条样式 */
.history-list::-webkit-scrollbar {
    width: 4px;
}

.history-list::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 2px;
}

.history-list::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 2px;
}

.history-list::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
}
</style>
