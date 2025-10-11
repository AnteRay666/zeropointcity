<!-- views.MembersView.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white flex flex-col items-center py-16 px-6">
    <h1 class="text-4xl font-bold mb-8 text-cyan-400 drop-shadow-[0_0_10px_#0ff,0_0_20px_#0ff]">
      Zero Point City Members
    </h1>

    <div
      class="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center w-full max-w-6xl">
      <Card v-for="member in members" :key="member.num_id" :qq="member.qqid" :nickname="member.nickname"
        :secondName="member.second_name" :signature="member.signature" :tarot="member.tarot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import Card from "@/components/Card.vue"

interface Member {
  num_id: number
  qqid: string
  nickname: string
  second_name: string
  tarot: string
  signature?: string
}

const members = ref<Member[]>([])

onMounted(async () => {
  const res = await fetch("/src/assets/members.json")
  const data = await res.json()
  members.value = data.memberlist
})
</script>
