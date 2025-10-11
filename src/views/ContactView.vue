<!-- views/ContactView.vue -->
<template>
    <div
        class="contact relative w-screen min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white font-orbitron">
        <!-- 背景霓虹光点 -->
        <canvas ref="canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

        <!-- 页面内容 -->
        <div class="relative z-10 text-center px-4">
            <h1 class="text-4xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff] mb-4">
                像素猫
            </h1>
            <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                欢迎来到 Zero Point City 的联系页面。你可以在这里找到我们或发送信息。
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d")!;
    let width = (canvas.value.width = window.innerWidth);
    let height = (canvas.value.height = window.innerHeight);

    const lines = Array.from({ length: 30 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 1.5,
        dy: (Math.random() - 0.5) * 1.5,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        alpha: Math.random() * 0.8 + 0.2,
        radius: Math.random() * 2 + 1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        lines.forEach((line) => {
            ctx.beginPath();
            ctx.arc(line.x, line.y, line.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(line.color)},${line.alpha})`;
            ctx.fill();

            line.x += line.dx;
            line.y += line.dy;

            if (line.x < 0 || line.x > width) line.dx *= -1;
            if (line.y < 0 || line.y > height) line.dy *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        width = canvas.value!.width = window.innerWidth;
        height = canvas.value!.height = window.innerHeight;
    });

    function hexToRgb(hex: string) {
        const ctxTmp = document.createElement("canvas").getContext("2d")!;
        ctxTmp.fillStyle = hex;
        return (
            ctxTmp.fillStyle.match(/\d+/g)?.slice(0, 3).join(",") || "255,255,255"
        );
    }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

.font-orbitron {
    font-family: "Orbitron", sans-serif;
}
</style>
