---
title: Vue设计规范
date: 2025-09-29
tags:
  - Vue3
categories:
  - Vue3
---

# Vue设计规范

这里写下我们设计Vue界面的一些规范。

---

## App.vue

`App.vue`:一般而言我们在入口的app.vue部分只简单设置一个路由，具体布局将在`Layouts/*.vue`中，并且在`router/index.ts`中进行配置。

````vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
```
````
