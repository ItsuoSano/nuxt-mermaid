<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ svgContent: string }>()
const content = computed(() => {
  return decodeURIComponent(props.svgContent)
})
</script>

<template>
  <div v-html="content" />
</template>
