<!-- components/Card.vue -->
<template>
    <div class="group [perspective:1000px] w-64 h-80 cursor-pointer" @click="isFlipped = !isFlipped">
        <div class="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
            :class="{ '[transform:rotateY(180deg)]': !isFlipped }">
            <!-- 正面 -->
            <div
                class="absolute inset-0 bg-gradient-to-br from-[#111] to-[#1f1f1f] border border-cyan-500/30 rounded-2xl shadow-[0_0_15px_#0ff] flex flex-col justify-center items-center text-center p-5 backface-hidden">
                <img :src="avatarUrl" alt="QQ头像"
                    class="w-20 h-20 rounded-full border-2 border-cyan-400 shadow-[0_0_12px_#0ff] mb-3" />
                <h3 class="text-lg font-semibold text-cyan-300">{{ nickname }}</h3>
                <p class="text-sm text-gray-400">QQ: {{ qq }}</p>
                <p class="text-sm text-gray-400 mt-1">别名：{{ secondName }}</p>
                <p v-if="signature" class="text-sm text-gray-500 italic mt-2">
                    “{{ signature }}”
                </p>
            </div>

            <!-- 背面（默认显示） -->
            <div
                class="absolute inset-0 rounded-2xl border border-pink-400/40 shadow-[0_0_25px_#ff00ff] overflow-hidden flex flex-col justify-center items-center text-center p-5 [transform:rotateY(180deg)] backface-hidden">
                <!-- 动态Canvas背景 -->
                <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>

                <!-- 文字内容 -->
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
import { ref, onMounted, onUnmounted, computed } from "vue"

const props = defineProps<{
    qq: string
    nickname: string
    secondName: string
    signature?: string
    tarot: string
}>()

const isFlipped = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)

// QQ头像地址
const avatarUrl = computed(() => `https://q1.qlogo.cn/g?b=qq&nk=${props.qq}&s=100`)

// Canvas 动画逻辑
onMounted(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext("2d")
    if (!ctx) return

    const particles = Array.from({ length: 25 }).map(() => ({
        x: Math.random() * canvas.value!.width,
        y: Math.random() * canvas.value!.height,
        r: 8 + Math.random() * 12,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        shape: ["circle", "square", "hex"][Math.floor(Math.random() * 3)],
        color: `hsla(${Math.random() * 360}, 80%, 60%, 0.5)`,
    }))

    const resize = () => {
        canvas.value!.width = canvas.value!.offsetWidth * devicePixelRatio
        canvas.value!.height = canvas.value!.offsetHeight * devicePixelRatio
        ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const drawHex = (cx: number, cy: number, r: number) => {
        const sides = 6
        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
            const angle = (Math.PI / 3) * i
            const x = cx + r * Math.cos(angle)
            const y = cy + r * Math.sin(angle)
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath()
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
        particles.forEach((p) => {
            ctx.strokeStyle = p.color
            ctx.lineWidth = 1.2
            ctx.shadowBlur = 6
            ctx.shadowColor = p.color

            ctx.save()
            ctx.translate(p.x, p.y)

            switch (p.shape) {
                case "circle":
                    ctx.beginPath()
                    ctx.arc(0, 0, p.r, 0, Math.PI * 2)
                    ctx.stroke()
                    break
                case "square":
                    ctx.strokeRect(-p.r / 1.2, -p.r / 1.2, p.r * 1.2, p.r * 1.2)
                    break
                case "hex":
                    drawHex(0, 0, p.r)
                    ctx.stroke()
                    break
            }

            ctx.restore()

            // 轻微移动
            p.x += p.speedX
            p.y += p.speedY
            if (p.x < -20) p.x = canvas.value!.width + 20
            if (p.x > canvas.value!.width + 20) p.x = -20
            if (p.y < -20) p.y = canvas.value!.height + 20
            if (p.y > canvas.value!.height + 20) p.y = -20
        })
        requestAnimationFrame(animate)
    }
    animate()

    onUnmounted(() => {
        window.removeEventListener("resize", resize)
    })
})
</script>

<style scoped>
.backface-hidden {
    backface-visibility: hidden;
}

canvas {
    background: radial-gradient(circle at 50% 50%, #0a0a0a 0%, #111 100%);
}
</style>
