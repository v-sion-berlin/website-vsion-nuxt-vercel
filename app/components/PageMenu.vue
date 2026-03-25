<template>
  <BaseDropdown
    :mobile="props.mobile"
    :label="currentPage"
    :items="dropdownItems"
    :show-icon="true"
    @select="navigate"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { DropdownItem } from "~/components/BaseDropdown.vue";
import { navigationConfig } from "~/config/navigation";

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const props = withDefaults(defineProps<{ mobile?: boolean }>(), {
  mobile: false,
});

const currentPage = ref("Menu");

const pages = computed(() => navigationConfig[locale.value as "en" | "de"]);

const dropdownItems = computed<DropdownItem[]>(() =>
  pages.value.map((p) => ({
    key: p.path,
    label: p.name,
    value: p.path,
  })),
);

const navigate = (item: DropdownItem) => {
  const page = pages.value.find((p) => p.path === item.value);
  if (page) currentPage.value = page.name;
  router.push(item.value);
};

watch(
  [() => route.path, locale],
  ([path]) => {
    let page = pages.value.find((p) => p.path === path);

    if (!page) {
      page = pages.value
        .filter((p) => path === p.path || path.startsWith(p.path + "/"))
        .sort((a, b) => b.path.length - a.path.length)[0];
    }

    currentPage.value = page ? page.name : "Menu";
  },
  { immediate: true },
);
</script>
