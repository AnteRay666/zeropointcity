<template>
    <div
        class="memory relative w-screen min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#101020] to-[#1a1a2a] text-white font-orbitron">

        <!-- 背景霓虹光点 -->
        <canvas ref="canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

        <!-- 标题 -->
        <div class="relative z-10 text-center mt-10 mb-8">
            <h1 class="text-4xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_15px_#0ff,0_0_30px_#0ff]">
                Memory Archive
            </h1>
            <p class="text-gray-300 mt-2 text-lg">Click an image to view full size</p>
        </div>

        <!-- 图片网格 -->
        <div
            class="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-6 pb-16 w-full max-w-6xl">
            <div v-for="(src, index) in imageUrls" :key="index"
                class="group relative aspect-square overflow-hidden rounded-xl cursor-pointer border border-cyan-400/30 hover:border-cyan-400/80 transition-all duration-300"
                @click="openImage(src)">
                <img :src="src" alt="Memory"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy" />
                <div
                    class="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
            </div>
        </div>

        <!-- 放大查看层 -->
        <div v-if="showPreview"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
            @click="closePreview">
            <img :src="previewSrc" alt="Preview" class="max-w-[90%] max-h-[90%] rounded-lg shadow-[0_0_25px_#0ff]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 1️⃣ 自动导入 memory 目录下所有图片
const images = import.meta.glob("@/assets/memory/*.{jpg,jpeg,png,webp,gif}", { eager: true });
const imageUrls = Object.values(images).map((img: any) => img.default);

// 2️⃣ 点击预览逻辑
const showPreview = ref(false);
const previewSrc = ref("");

function openImage(src: string) {
    previewSrc.value = src;
    showPreview.value = true;
}

function closePreview() {
    showPreview.value = false;
}

// 3️⃣ 霓虹背景动画
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d")!;
    let width = (canvas.value.width = window.innerWidth);
    let height = (canvas.value.height = window.innerHeight);

    const dots = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        alpha: Math.random() * 0.8 + 0.2,
        radius: Math.random() * 2 + 1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        dots.forEach((d) => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(d.color)},${d.alpha})`;
            ctx.fill();

            d.x += d.dx;
            d.y += d.dy;

            if (d.x < 0 || d.x > width) d.dx *= -1;
            if (d.y < 0 || d.y > height) d.dy *= -1;
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
        return ctxTmp.fillStyle.match(/\d+/g)?.slice(0, 3).join(",") || "255,255,255";
    }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

.font-orbitron {
    font-family: "Orbitron", sans-serif;
}

/* 点击放大时禁用滚动（优化体验） */
body:has(.fixed.inset-0.z-50) {
    overflow: hidden;
}
</style>
