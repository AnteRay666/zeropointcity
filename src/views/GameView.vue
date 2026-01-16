<template>
    <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
        <!-- 顶部标题和猫猫币 -->
        <div class="max-w-7xl mx-auto mb-12">
            <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h1
                    class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                    游戏中心
                </h1>
                <div class="flex items-center gap-4">
                    <div class="bg-gray-900/50 border border-yellow-500/30 rounded-lg px-6 py-3 text-center">
                        <div class="text-xs text-gray-500 uppercase">猫猫币余额</div>
                        <div class="text-2xl font-bold text-yellow-500">{{ tokenStore.tokens }}</div>
                    </div>
                    <button @click="showResetConfirm = true"
                        class="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-sm text-gray-400">
                        猫猫呢，救一下啊！
                    </button>
                </div>
            </div>
            <p class="text-gray-500 text-center font-mono text-sm">SELECT YOUR GAME</p>
        </div>

        <!-- 游戏卡片列表 -->
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- 抽卡游戏 -->
            <router-link to="/game/gacha"
                class="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1">
                <div class="aspect-[4/3] relative overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-purple-500/20 to-blue-500/20 group-hover:opacity-80 transition-opacity">
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-8xl group-hover:scale-110 transition-transform duration-300">🎴</span>
                    </div>
                </div>
                <div class="p-6">
                    <h2 class="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">星际招募</h2>
                    <p class="text-gray-500 text-sm">抽取你的专属伙伴，收集稀有角色</p>
                    <div class="mt-4 flex items-center gap-2 text-xs text-gray-600">
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">单抽 2猫猫币</span>
                        <span class="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">十连 20猫猫币</span>
                    </div>
                </div>
            </router-link>

            <!-- 转盘游戏 -->
            <router-link to="/game/wheel"
                class="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
                <div class="aspect-[4/3] relative overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-green-500/20 via-teal-500/20 to-cyan-500/20 group-hover:opacity-80 transition-opacity">
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span
                            class="text-8xl group-hover:scale-110 group-hover:rotate-45 transition-transform duration-500">🎡</span>
                    </div>
                </div>
                <div class="p-6">
                    <h2 class="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">幸运转盘</h2>
                    <p class="text-gray-500 text-sm">转动命运之轮，赢取神秘奖励</p>
                    <div class="mt-4 flex items-center gap-2 text-xs">
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded">5猫猫币/次</span>
                        <span class="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded">最高100猫猫币</span>
                    </div>
                </div>
            </router-link>

            <!-- 老虎机游戏 (未设计) -->
            <div
                class="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden opacity-50 cursor-not-allowed">
                <div class="aspect-[4/3] relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10">
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-8xl">🎰</span>
                    </div>
                </div>
                <div class="p-6">
                    <h2 class="text-xl font-bold mb-2">星际老虎机</h2>
                    <p class="text-gray-500 text-sm">经典玩法，挑战运气极限</p>
                    <div class="mt-4">
                        <span class="px-3 py-1 bg-gray-800 text-gray-500 rounded text-xs">即将推出</span>
                    </div>
                </div>
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span class="text-2xl font-bold text-gray-600 tracking-widest">COMING SOON</span>
                </div>
            </div>
        </div>

        <!-- 救济确认弹窗 -->
        <div v-if="showResetConfirm"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div class="bg-[#111] border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4">猫猫救济</h3>
                <p class="text-gray-400 mb-6">{{ tokenStore.reliefCount === 0 ? '向猫猫求助？' : '又没钱了？' }}</p>
                <div class="flex gap-4">
                    <button @click="showResetConfirm = false"
                        class="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                        取消
                    </button>
                    <button @click="requestRelief"
                        class="flex-1 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg transition-colors">
                        求救
                    </button>
                </div>
            </div>
        </div>

        <!-- 救济结果弹窗 -->
        <div v-if="showReliefResult"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div class="bg-[#111] border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
                <p class="text-xl mb-6 whitespace-pre-line">{{ reliefMessage }}</p>
                <button @click="showReliefResult = false"
                    class="bg-yellow-600 hover:bg-yellow-500 px-6 py-2 rounded-lg transition-colors">
                    好的
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTokenStore } from '@/stores/token'

const tokenStore = useTokenStore()
const showResetConfirm = ref(false)
const showReliefResult = ref(false)
const reliefMessage = ref('')

const requestRelief = () => {
    showResetConfirm.value = false

    // 检查是否低于20猫猫币
    if (tokenStore.tokens >= 20) {
        // 拒绝救济
        if (tokenStore.rejectCount === 0) {
            reliefMessage.value = '不许白吃白喝'
        } else {
            reliefMessage.value = '哎呦，你干嘛！猫猫也没钱了'
        }
        tokenStore.incrementRejectCount()
    } else {
        // 给予救济
        tokenStore.earn(50)
        if (tokenStore.reliefCount === 0) {
            reliefMessage.value = '🐱🐱一脸嫌弃的给你投喂了50猫猫币'
        } else {
            reliefMessage.value = '真是杂鱼呢~zakozako~.这么快就被榨干了~\n\n+50猫猫币'
        }
        tokenStore.incrementReliefCount()
    }

    showReliefResult.value = true
}
</script>

<style scoped></style>
