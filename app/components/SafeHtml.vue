<!-- eslint-disable vue/no-v-html -->
<template>
  <component :is="tag" v-html="sanitized"></component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DOMPurify from "dompurify";

const props = defineProps<{
  html: string;
  tag?: string;
}>();

const tag = props.tag ?? "p";
const sanitized = computed(() => DOMPurify.sanitize(props.html));
</script>
