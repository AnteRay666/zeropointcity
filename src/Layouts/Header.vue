<template>
  <header class="flex justify-between items-center px-6 py-3 bg-black/60 backdrop-blur-sm relative z-20">
    <!-- 左侧 Logo -->
    <div class="flex items-center space-x-3">
      <img src="/android-chrome-192x192.png" alt="Logo" class="w-10 h-10 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff]" />
      <h1 class="text-2xl text-cyan-400 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff]">
        Zero Point City
      </h1>
    </div>

    <!-- 桌面导航 -->
    <nav class="hidden md:flex space-x-6 text-gray-300 font-bold">
      <RouterLink to="/" class="hover:text-cyan-400 transition">Home</RouterLink>
      <RouterLink to="/member" class="hover:text-cyan-400 transition">Members</RouterLink>
      <RouterLink to="/memory" class="hover:text-cyan-400 transition">Memory</RouterLink>
      <RouterLink to="/about" class="hover:text-cyan-400 transition">About</RouterLink>
      <!-- <RouterLink to="/contact" class="hover:text-cyan-400 transition">Contact</RouterLink> -->
    </nav>

    <!-- 移动端菜单按钮 -->
    <button @click="toggleMenu"
      class="md:hidden text-cyan-400 text-3xl drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff] focus:outline-none">
      <span v-if="!isOpen">☰</span>
      <span v-else>✕</span>
    </button>

    <!-- 移动端侧滑菜单 -->
    <transition name="slide">
      <div v-if="isOpen"
        class="absolute left-0 top-full w-64 h-[calc(100vh-56px)] bg-gradient-to-br from-[#0a0a0a] via-[#14142a] to-[#1a1a3a]
               border-r border-cyan-400/40 shadow-[0_0_25px_#0ff] flex flex-col p-6 space-y-6 text-cyan-300 font-orbitron z-10">
        <RouterLink to="/" class="hover:text-cyan-400 transition" @click="closeMenu">
          Home
        </RouterLink>
        <RouterLink to="/member" class="hover:text-cyan-400 transition" @click="closeMenu">
          Members
        </RouterLink>
        <RouterLink to="/memory" class="hover:text-cyan-400 transition" @click="closeMenu">
          Memory
        </RouterLink>
        <RouterLink to="/about" class="hover:text-cyan-400 transition" @click="closeMenu">
          About
        </RouterLink>
        <!-- <RouterLink to="/contact" class="hover:text-cyan-400 transition" @click="closeMenu">
          Contact
        </RouterLink> -->

        <div class="mt-auto text-xs text-gray-500 border-t border-cyan-400/20 pt-4">
          © Zero Point City
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}
function closeMenu() {
  isOpen.value = false;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

.font-orbitron {
  font-family: "Orbitron", sans-serif;
}

/* 侧滑动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
