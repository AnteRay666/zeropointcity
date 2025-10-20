<!-- views.MembersView.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a] text-white flex flex-col items-center py-16 px-6 overflow-hidden">
    <canvas ref="bgCanvas" class="absolute inset-0 w-full z-0"></canvas>
    <div class="relative z-10 text-center mt-10">
      <h1
        class="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_#0ff,0_0_30px_#0ff] animate-pulse">
        Zero Point City Members
      </h1>
    </div>

    <div
      class="relative z-10 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center w-full max-w-6xl">
      <Card v-for="member in members" :key="member.num_id" :qq="member.qqid" :nickname="member.nickname"
        :secondName="member.second_name" :signature="member.signature" :tarot="member.tarot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import Card from "@/components/Card.vue"

interface Member {
  num_id: number
  qqid: string
  nickname: string
  second_name: string
  tarot: string
  signature?: string
}

const members = ref<Member[]>([])
const bgCanvas = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  colorHue: number
  hueSpeed: number
  type: string
  alpha: number
  pulsePhase: number
  pulseSpeed: number
  lineWidth: number
}

const particles: Particle[] = []
import memberData from "@/assets/members.json";
members.value = memberData.memberlist;
onMounted(async () => {
  // --- 数据加载 ---

  // --- Canvas 初始化 ---
  if (!bgCanvas.value) return
  const ctx = bgCanvas.value.getContext("2d")!
  let width = (bgCanvas.value.width = window.innerWidth)
  let height = (bgCanvas.value.height = window.innerHeight)

  // 创建粒子
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 25 + 20, // 增加尺寸
      colorHue: 200 + Math.random() * 160,
      hueSpeed: (Math.random() - 0.5) * 0.3,
      type: ["square", "hexagon", "star"][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.5 + 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      lineWidth: 1.5
    })
  }

  const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // 正六边形，size是外接圆直径
    const radius = size / 2; // 外接圆半径
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 // 60度一个点
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
  }

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // 五角星，size是外接圆直径
    const outerRadius = size / 2; // 外接圆半径
    const innerRadius = outerRadius * 0.4; // 内接圆半径
    const spikes = 5;
    const step = Math.PI / spikes;

    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2; // 从顶部开始
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
  }

  const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // 正方形，size是边长
    ctx.beginPath()
    ctx.rect(x - size / 2, y - size / 2, size, size)
    ctx.closePath()
    ctx.stroke()
  }

  function animate() {
    // 完全清除画布，没有拖尾效果
    ctx.clearRect(0, 0, width, height)

    particles.forEach((p) => {
      // 更新位置
      p.x += p.dx
      p.y += p.dy

      // 边界反弹
      if (p.x < 0 || p.x > width) p.dx *= -1
      if (p.y < 0 || p.y > height) p.dy *= -1

      // 保持粒子在画布内
      p.x = Math.max(0, Math.min(width, p.x))
      p.y = Math.max(0, Math.min(height, p.y))

      // 脉动效果 - 透明度闪烁
      p.pulsePhase += p.pulseSpeed
      p.alpha = 0.3 + Math.sin(p.pulsePhase) * 0.3

      // 色相渐变
      p.colorHue += p.hueSpeed
      if (p.colorHue > 360) p.colorHue = 0
      if (p.colorHue < 200) p.colorHue = 360

      const color = `hsl(${p.colorHue}, 80%, 65%)`
      ctx.strokeStyle = color
      ctx.lineWidth = p.lineWidth
      ctx.globalAlpha = p.alpha

      // 绘制形状边框（不旋转）
      switch (p.type) {
        case "square":
          drawSquare(ctx, p.x, p.y, p.size)
          break
        case "hexagon":
          drawHex(ctx, p.x, p.y, p.size) // 使用完整尺寸
          break
        case "star":
          drawStar(ctx, p.x, p.y, p.size) // 使用完整尺寸
          break
      }
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  const handleResize = () => {
    width = bgCanvas.value!.width = window.innerWidth
    height = bgCanvas.value!.height = window.innerHeight
  }

  window.addEventListener("resize", handleResize)

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

.font-orbitron {
  font-family: "Orbitron", sans-serif;
}

/* 简化Canvas效果 */
canvas {
  filter: brightness(1.1);
}
</style>