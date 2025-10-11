<!-- views/AuthPage.vue -->
<template>
    <div
        class="relative w-screen h-screen flex justify-center items-center overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] font-orbitron">
        <!-- 背景霓虹动画 -->
        <canvas ref="canvas" class="absolute inset-0 w-full h-full z-0"></canvas>

        <!-- 内容 -->
        <div class="relative z-10 flex flex-col items-center">
            <!-- 标识 -->
            <h1
                class="text-4xl text-cyan-400 mb-10 tracking-wider text-center drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff,0_0_40px_#0ff]">
                Zero Point City
            </h1>

            <!-- 登录卡片 -->
            <div
                class="w-[360px] px-6 py-8 rounded-2xl bg-black/70 shadow-[0_0_20px_rgba(0,255,255,0.6),0_0_40px_rgba(0,255,255,0.4)] text-center text-white">
                <h2 class="text-2xl mb-6 text-cyan-400 drop-shadow-[0_0_6px_#0ff,0_0_12px_#0ff]">
                    请输入访问口令
                </h2>

                <input v-model="password" type="password" placeholder="输入口令" @keyup.enter="checkAuth"
                    class="w-4/5 py-3 px-4 mb-6 rounded-lg border-2 border-cyan-400 bg-black/30 text-white text-center text-base outline-none transition focus:border-cyan-400 focus:shadow-[0_0_8px_#0ff,0_0_16px_#0ff]" />

                <button @click="checkAuth"
                    class="w-2/5 py-3 text-base uppercase rounded-lg border-2 border-cyan-400 text-cyan-400 bg-transparent cursor-pointer transition hover:bg-cyan-400 hover:text-[#0f0f0f] hover:shadow-[0_0_12px_#0ff,0_0_20px_#0ff]">
                    进入
                </button>

                <p v-if="error" class="mt-4 text-red-500 font-bold drop-shadow-[0_0_4px_#ff4d4f]">
                    {{ error }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const password = ref("");
const error = ref("");
const SECRET = import.meta.env.VITE_AUTH_SECRET;

function checkAuth() {
    if (password.value === SECRET) {
        localStorage.setItem("auth", password.value);
        router.push("/");
    } else {
        error.value = "口令错误";
    }
}

// 霓虹背景动画
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("2d")!;
    let width = (canvas.value.width = window.innerWidth);
    let height = (canvas.value.height = window.innerHeight);

    const lines = Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        alpha: Math.random(),
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        lines.forEach((line) => {
            ctx.beginPath();
            ctx.arc(line.x, line.y, 2, 0, Math.PI * 2);
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
/* 引入 Orbitron 字体 */
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

.font-orbitron {
    font-family: "Orbitron", sans-serif;
}
</style>
