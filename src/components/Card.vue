<!-- components/Card.vue -->
<template>
    <div class="group [perspective:1000px] w-64 h-80 cursor-pointer" @click="toggleFlip">
        <div class="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
            :class="{ '[transform:rotateY(180deg)]': !isFlipped }">
            <!-- 正面 -->
            <div
                class="absolute inset-0 bg-gradient-to-br from-[#111] to-[#1f1f1f] border border-cyan-500/30 rounded-2xl shadow-[0_0_15px_#0ff] flex flex-col justify-center items-center text-center p-5 backface-hidden">
                <img :src="avatarUrl" alt="QQ头像"
                    class="w-20 h-20 rounded-full border-2 border-cyan-400 shadow-[0_0_12px_#0ff] mb-3" />
                <h3 class="text-lg font-semibold text-cyan-300">{{ nickname }}</h3>

                <!-- QQ号：独立点击显示/隐藏马赛克 -->
                <p class="text-sm text-gray-400 relative select-none" @click.stop="toggleQQ">
                    QQ：
                    <span :class="[
                        'transition-all duration-500 cursor-pointer',
                        showQQ ? 'blur-0 select-text' : 'blur-sm'
                    ]">
                        {{ qq }}
                    </span>
                    <span v-if="!showQQ">
                    </span>
                </p>

                <p v-if="secondName" class="text-sm text-gray-400 mt-1">
                    别名：{{ secondName }}
                </p>
                <p v-if="signature" class="text-sm text-gray-500 italic mt-2">
                    “{{ signature }}”
                </p>
            </div>

            <!-- 背面 -->
            <div
                class="absolute inset-0 rounded-2xl border border-pink-400/40 shadow-[0_0_25px_#ff00ff] overflow-hidden flex flex-col justify-center items-center text-center p-5 [transform:rotateY(180deg)] backface-hidden">
                <div class="absolute inset-0">
                    <div v-for="n in 8" :key="n"
                        class="absolute w-3 h-3 rounded-full bg-pink-500/30 blur-md animate-float" :style="{
                            top: Math.random() * 90 + '%',
                            left: Math.random() * 90 + '%',
                            animationDelay: Math.random() * 3 + 's'
                        }"></div>
                </div>
                <div class="relative z-10">
                    <h3 class="text-2xl text-pink-400 font-bold drop-shadow-[0_0_10px_#ff00ff] mb-3">
                        {{ tarot }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{
    qq: string
    nickname: string
    secondName: string
    signature?: string
    tarot: string
}>()

const isFlipped = ref(false)
const showQQ = ref(false)

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value
}

// 单独控制 QQ 号马赛克
const toggleQQ = () => {
    showQQ.value = !showQQ.value
}

const avatarUrl = computed(() => `https://q1.qlogo.cn/g?b=qq&nk=${props.qq}&s=100`)
</script>

<style scoped>
.backface-hidden {
    backface-visibility: hidden;
}

/* 浮动动画 */
@keyframes float {

    0%,
    100% {
        transform: translateY(0) scale(1);
        opacity: 0.5;
    }

    50% {
        transform: translateY(-10px) scale(1.2);
        opacity: 1;
    }
}

.animate-float {
    animation: float 4s ease-in-out infinite;
}
</style>
