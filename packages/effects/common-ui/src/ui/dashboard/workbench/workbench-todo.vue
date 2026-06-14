<script setup lang="ts">
import type { WorkbenchTodoItem } from '../typing';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VbenCheckbox,
} from '@vben-core/shadcn-ui';

interface Props {
  items?: WorkbenchTodoItem[];
  title: string;
  emptyText?: string;
  manageText?: string;
}

interface Emits {
  (e: 'manage'): void;
}

defineOptions({
  name: 'WorkbenchTodo',
});

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  emptyText: '所有任务已经完成',
  manageText: '管理',
});

const emit = defineEmits<Emits>();
</script>

<template>
  <Card>
    <CardHeader class="py-4">
      <CardTitle class="text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-wrap p-5 pt-0">
      <!-- 空状态 -->
      <div
        v-if="items.length === 0"
        class="flex w-full flex-col items-center justify-center py-8 text-foreground/60"
      >
        <svg
          class="mb-3 size-12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="text-sm">{{ emptyText }}</p>
      </div>
      <!-- 任务列表 -->
      <ul
        v-else
        class="w-full divide-y divide-border"
        role="list"
      >
        <li
          v-for="item in items"
          :key="item.title"
          :class="{
            'line-through opacity-60 select-none': item.completed,
          }"
          class="flex cursor-pointer justify-between gap-x-6 py-5"
        >
          <div class="flex min-w-0 items-center gap-x-4">
            <VbenCheckbox v-model="item.completed" name="completed" />
            <div class="min-w-0 flex-auto">
              <p class="text-sm/6 font-semibold text-foreground">
                {{ item.title }}
              </p>
              <!-- eslint-disable vue/no-v-html -->
              <p
                class="mt-1 truncate text-xs/5 text-foreground/80 *:text-primary"
                v-html="item.content"
              ></p>
            </div>
          </div>
          <div class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
            <span class="mt-6 text-xs/6 text-foreground/80">
              {{ item.date }}
            </span>
          </div>
        </li>
      </ul>
    </CardContent>
    <CardFooter
      v-if="manageText"
      class="flex justify-center border-t border-border px-5 py-3"
    >
      <Button variant="outline" size="sm" @click="emit('manage')">
        {{ manageText }}
      </Button>
    </CardFooter>
  </Card>
</template>
