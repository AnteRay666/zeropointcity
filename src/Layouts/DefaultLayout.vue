<!-- Layouts/DefaultLayout.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-gray-200 font-orbitron">
    <Header v-if="showHeader" />
    <Main />
    <Footer v-if="showHeader" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import Header from "./Header.vue"
import Main from "./Main.vue"
import Footer from "./Footer.vue"

const route = useRoute()
const showHeader = computed(() => route.path !== "/auth")
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");
.font-orbitron {
  font-family: "Orbitron", sans-serif;
}
</style>
