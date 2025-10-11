<template>
  <div class="relative w-screen h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
    <!-- 霓虹动态背景 -->
    <canvas ref="canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- 内容 -->
    <div class="flex flex-col justify-center items-center text-center relative z-10 flex-1">
      <h2 class="text-4xl md:text-6xl text-white mb-4 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff]">
        Welcome to Zero Point City
      </h2>
      <p class="text-lg text-gray-400 mb-8">
        The neon city of tomorrow, alive today.
      </p>
      <RouterLink to="/member"
        class="px-8 py-3 text-sm uppercase border-2 border-cyan-400 text-cyan-400 rounded-lg bg-transparent hover:bg-cyan-400 hover:text-[#1a1a1a] hover:shadow-[0_0_12px_#0ff,0_0_20px_#0ff] transition">
        Enter the City
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext("2d")!
  let width = (canvas.value.width = window.innerWidth)
  let height = (canvas.value.height = window.innerHeight)

  const lines = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    alpha: Math.random(),
  }))

  function animate() {
    ctx.clearRect(0, 0, width, height)
    lines.forEach((line) => {
      ctx.beginPath()
      ctx.arc(line.x, line.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${hexToRgb(line.color)},${line.alpha})`
      ctx.fill()
      line.x += line.dx
      line.y += line.dy
      if (line.x < 0 || line.x > width) line.dx *= -1
      if (line.y < 0 || line.y > height) line.dy *= -1
    })
    requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener("resize", () => {
    width = canvas.value!.width = window.innerWidth
    height = canvas.value!.height = window.innerHeight
  })

  function hexToRgb(hex: string) {
    const ctxTmp = document.createElement("canvas").getContext("2d")!
    ctxTmp.fillStyle = hex
    return ctxTmp.fillStyle.match(/\d+/g)?.slice(0, 3).join(",") || "255,255,255"
  }
})
</script>
