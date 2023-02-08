<script setup lang="ts">
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <button class="mx-2 icon-btn !outline-none" title="toggle theme" @click="toggleDark()">
    <div i="carbon-sun dark:carbon-moon" />
  </button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
