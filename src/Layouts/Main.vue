<!-- Layouts/Main.vue -->
<template>
  <main class="flex-1 relative overflow-hidden">
    <Transition name="fade" mode="out-in">
      <RouterView />
    </Transition>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
