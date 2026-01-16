<!-- components/GachaCard.vue -->
<template>
    <div class="group [perspective:1000px] w-36 h-48 sm:w-48 sm:h-64 md:w-64 md:h-80 cursor-pointer" @click="toggleFlip">
        <div class="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
            :class="{ '[transform:rotateY(180deg)]': !isFlipped }">

            <!-- 正面 -->
            <div class="absolute inset-0 bg-[#111] border-2 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center p-2 sm:p-3 md:p-5 backface-hidden"
                :class="rarityStyles[rarity].border">

                <div class="relative w-full h-28 sm:h-40 md:h-56 mb-2 sm:mb-3 overflow-hidden rounded-lg group/img"
                    @click.stop="$emit('preview', imageUrl)">
                    <img :src="imageUrl" alt="Card Image"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />

                    <!-- 稀有度标签 - 移入图片内部底部，半透明背景 -->
                    <div class="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 text-[10px] font-bold uppercase tracking-[0.3em]"
                        :class="rarityStyles[rarity].text">
                        {{ rarity }}
                    </div>

                    <!-- 放大提示图标 -->
                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/20">
                        <span class="text-white text-2xl">🔍</span>
                    </div>

                    <!-- 装饰光效 -->
                    <div class="absolute inset-0 animate-pulse opacity-30 pointer-events-none"
                        :class="rarityStyles[rarity].glow"></div>
                </div>

                <h3 class="text-sm sm:text-base md:text-lg font-bold mb-1 tracking-wider truncate w-full px-1 sm:px-2"
                    :class="rarityStyles[rarity].text">
                    {{ name }}
                </h3>
                <div class="mt-auto w-full hidden sm:block">
                    <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"></div>
                    <div class="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                        Zero Point City Collection
                    </div>
                </div>
            </div>

            <!-- 背面 (抽卡时的初始状态) -->
            <div
                class="absolute inset-0 rounded-2xl border-2 border-gray-700 bg-[#1a1a1a] overflow-hidden flex flex-col justify-center items-center text-center p-2 sm:p-3 md:p-5 [transform:rotateY(180deg)] backface-hidden">
                <div class="absolute inset-0 opacity-20">
                    <div class="grid grid-cols-4 gap-2 p-4">
                        <div v-for="n in 16" :key="n" class="w-full aspect-square border border-gray-600 rounded-sm">
                        </div>
                    </div>
                </div>
                <div class="relative z-10">
                    <div class="text-4xl mb-2 grayscale opacity-50">🎴</div>
                    <div class="text-gray-600 font-bold tracking-widest text-xs uppercase">Zero Point City</div>
                </div>
                <!-- 抽中时的瞬间光效 -->
                <div v-if="rarity === 'SSR'" class="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                <div v-if="rarity === 'SR'" class="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{
    name: string
    imageUrl: string
    rarity: 'SSR' | 'SR' | 'R'
}>()

defineEmits(['preview'])

const isFlipped = ref(false)

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value
}

const rarityStyles = {
    SSR: {
        border: 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
        tag: 'bg-yellow-500 text-black',
        text: 'text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]',
        avatarBorder: 'border-yellow-400',
        glow: 'shadow-[0_0_15px_#eab308] bg-yellow-500'
    },
    SR: {
        border: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        tag: 'bg-purple-500 text-white',
        text: 'text-purple-400',
        avatarBorder: 'border-purple-400',
        glow: 'shadow-[0_0_10px_#a855f7] bg-purple-500'
    },
    R: {
        border: 'border-blue-500/50 shadow-md',
        tag: 'bg-blue-500/50 text-white',
        text: 'text-blue-400',
        avatarBorder: 'border-blue-400/50',
        glow: 'bg-blue-500/20'
    }
}

defineExpose({
    toggleFlip,
    isFlipped
})
</script>

<style scoped>
.backface-hidden {
    backface-visibility: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
