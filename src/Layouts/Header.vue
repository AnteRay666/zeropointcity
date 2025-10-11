<!-- Layouts/Header.vue -->
<template>
  <header class="flex justify-between items-center px-12 py-5 bg-black/60 backdrop-blur-sm relative z-10">
    <h1 class="text-2xl text-cyan-400 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff]">
      Zero Point City
    </h1>
    <nav class="flex space-x-6 text-gray-300 font-bold">
      <RouterLink to="/" class="hover:text-cyan-400 transition">Home</RouterLink>
      <RouterLink to="/about" class="hover:text-cyan-400 transition">About</RouterLink>
      <RouterLink to="/contact" class="hover:text-cyan-400 transition">Contact</RouterLink>
    </nav>
  </header>
</template>
