<script setup lang="ts">
</script>

<template>
  <div class="homepage">
    <!-- 动态霓虹网格背景 -->
    <canvas ref="canvas" class="neon-bg"></canvas>

    <header class="header">
      <h1 class="logo">Zero Point City</h1>
      <nav class="nav">
        <a href="#">Home</a>
        <a href="#">Projects</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
    </header>

    <main class="main">
      <h2 class="welcome-text">Welcome to Zero Point City</h2>
      <p class="subtitle">The neon city of tomorrow, alive today.</p>
      <button class="enter-btn">Enter the City</button>
    </main>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!canvas.value) return;

  const ctx = canvas.value.getContext('2d')!;
  let width = canvas.value.width = window.innerWidth;
  let height = canvas.value.height = window.innerHeight;

  // 随机生成霓虹线条
  const lines = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    alpha: Math.random()
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    lines.forEach(line => {
      ctx.beginPath();
      ctx.arc(line.x, line.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(line.color)},${line.alpha})`;
      ctx.fill();

      line.x += line.dx;
      line.y += line.dy;

      // 边界反弹
      if (line.x < 0 || line.x > width) line.dx *= -1;
      if (line.y < 0 || line.y > height) line.dy *= -1;
    });

    requestAnimationFrame(animate);
  }

  animate();

  // 窗口自适应
  window.addEventListener('resize', () => {
    width = canvas.value!.width = window.innerWidth;
    height = canvas.value!.height = window.innerHeight;
  });

  function hexToRgb(hex: string) {
    // hsl转rgb approximation
    const ctxTmp = document.createElement('canvas').getContext('2d')!;
    ctxTmp.fillStyle = hex;
    return ctxTmp.fillStyle
      .match(/\d+/g)
      ?.slice(0, 3)
      .join(',') || '255,255,255';
  }
});
</script>

<style scoped>
.homepage {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
  display: flex;
  flex-direction: column;
  color: #eee;
  font-family: 'Orbitron', sans-serif;
  overflow: hidden;
}

.neon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
  z-index: 2;
  position: relative;
}

.logo {
  font-size: 2rem;
  color: #fff;
  text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
}

.nav a {
  margin-left: 20px;
  color: #ccc;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s, text-shadow 0.3s;
}

.nav a:hover {
  color: #0ff;
  text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
}

.welcome-text {
  font-size: 3rem;
  color: #fff;
  text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #bbb;
  margin-bottom: 2rem;
}

.enter-btn {
  padding: 12px 30px;
  font-size: 1rem;
  background: transparent;
  border: 2px solid #0ff;
  color: #0ff;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
}

.enter-btn:hover {
  background: #0ff;
  color: #1a1a1a;
  box-shadow: 0 0 12px #0ff, 0 0 20px #0ff;
}
</style>
