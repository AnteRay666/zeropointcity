<template>
    <div class="auth-page">
        <!-- 背景霓虹动画 -->
        <canvas ref="canvas" class="neon-bg"></canvas>

        <div class="auth-container">
            <!-- 标识 -->
            <h1 class="logo">Zero Point City</h1>

            <div class="auth-card">
                <h2 class="card-title">请输入访问口令</h2>

                <input v-model="password" type="password" placeholder="输入口令" @keyup.enter="checkAuth"
                    class="auth-input" />

                <button class="enter-btn" @click="checkAuth">进入</button>

                <p v-if="error" class="error-msg">{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const password = ref("")
const error = ref("")
const SECRET = import.meta.env.VITE_AUTH_SECRET

function checkAuth() {
    if (password.value === SECRET) {
        localStorage.setItem("auth", password.value)
        router.push("/")
    } else {
        error.value = "口令错误"
    }
}

// 霓虹背景动画
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext("2d")!
    let width = canvas.value.width = window.innerWidth
    let height = canvas.value.height = window.innerHeight

    const lines = Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        alpha: Math.random()
    }))

    function animate() {
        ctx.clearRect(0, 0, width, height)
        lines.forEach(line => {
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

<style scoped>
.auth-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Orbitron', sans-serif;
    overflow: hidden;
}

.neon-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.auth-container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Zero Point City Logo */
.logo {
    font-size: 3rem;
    color: #0ff;
    text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff;
    margin-bottom: 40px;
    text-align: center;
    letter-spacing: 2px;
}

/* 登录卡片 */
.auth-card {
    width: 360px;
    padding: 30px 25px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4);
    text-align: center;
    color: #fff;
}

.card-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #0ff;
    text-shadow: 0 0 6px #0ff, 0 0 12px #0ff;
}

.auth-input {
    width: 80%;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid #0ff;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 1rem;
    outline: none;
    text-align: center;
    margin-bottom: 20px;
    transition: all 0.3s;
}

.auth-input:focus {
    border-color: #0ff;
    box-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
}

.enter-btn {
    width: 40%;
    padding: 12px;
    font-size: 1rem;
    color: #0ff;
    background: transparent;
    border: 2px solid #0ff;
    border-radius: 8px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.3s;
}

.enter-btn:hover {
    background: #0ff;
    color: #0f0f0f;
    box-shadow: 0 0 12px #0ff, 0 0 20px #0ff;
}

.error-msg {
    margin-top: 16px;
    color: #ff4d4f;
    text-shadow: 0 0 4px #ff4d4f;
    font-weight: bold;
}
</style>
