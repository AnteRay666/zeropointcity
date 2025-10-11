<!-- Layouts/Header.vue -->
<template>
  <header class="flex justify-between items-center px-6 py-3 bg-black/60 backdrop-blur-sm relative z-10">
    <div class="flex items-center space-x-3">
      <!-- 图标 -->
      <img src="/android-chrome-192x192.png" alt="Logo" class="w-10 h-10 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff]" />
      <!-- 文本（仅桌面端显示） -->
      <h1 class="text-2xl text-cyan-400 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff] hidden sm:block">
        Zero Point City
      </h1>
    </div>

    <nav class="flex space-x-6 text-gray-300 font-bold">
      <RouterLink to="/" class="hover:text-cyan-400 transition">Home</RouterLink>
      <RouterLink to="/about" class="hover:text-cyan-400 transition">About</RouterLink>
      <RouterLink to="/contact" class="hover:text-cyan-400 transition">Contact</RouterLink>
    </nav>
  </header>
</template>
