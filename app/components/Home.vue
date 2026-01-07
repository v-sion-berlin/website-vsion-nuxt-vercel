<script setup lang="ts">
import type { HomePage } from "~/types/content";

const props = defineProps<{
  page: HomePage;
}>();
</script>

<template>
  <Hero :page="{ hero: page.hero, heroImage: page.heroImage }" />
  <Interview
    :page="{
      interview_header: page.interview.header,
      interview_body: page.interview.body_text,
      interview_body_part_2: page.interview.body_part_2,
      interview_source_text: page.interview.source_text,
      interview_watch_text: page.interview.watch_text,
    }"
  />
  <TexBlockLive
    :page="{
      textblock_live_header: page.textblocks.live.header,
      textblock_live_body: page.textblocks.live.body_text,
    }"
  />
  <TexBlockLeistungen
    :page="{
      textblock_leistungen_header: page.textblocks.leistungen.header,
      textblock_leistungen_body: page.textblocks.leistungen.body_text,
    }"
  />
  <List :page="page.lists" />
  <TexBlockMarken
    :page="{
      textblock_marken_header: page.textblocks.marken.header,
      textblock_marken_body: page.textblocks.marken.body_text,
      textblock_marken_button: page.textblocks.marken.button,
    }"
  />
  <TexBlockAnspruch
    :page="{
      textblock_anspruch_header: page.textblocks.anspruch.header,
      textblock_anspruch_body: page.textblocks.anspruch.body_text,
      textblock_anspruch_button: page.textblocks.anspruch.button,
      textblock_anspruch_button_soon: page.textblocks.anspruch.button_soon,
    }"
  />
</template>
