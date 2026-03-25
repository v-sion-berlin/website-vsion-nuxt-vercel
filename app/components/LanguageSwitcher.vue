<template>
  <BaseDropdown
    :mobile="props.mobile"
    :label="locale.toUpperCase()"
    :items="dropdownItems"
    :show-icon="false"
    aria-label="Select language"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DropdownItem } from "~/components/BaseDropdown.vue";

const { setLocale, locales, locale } = useI18n();

const props = withDefaults(defineProps<{ mobile?: boolean }>(), {
  mobile: false,
});

const dropdownItems = computed<DropdownItem[]>(() =>
  locales.value.map((l) => ({
    key: typeof l === "string" ? l : l.code,
    label: (typeof l === "string" ? l : l.code).toUpperCase(),
    value: typeof l === "string" ? l : l.code,
  })),
);

const handleSelect = (item: DropdownItem) => {
  setLocale(item.value);
};
</script>
