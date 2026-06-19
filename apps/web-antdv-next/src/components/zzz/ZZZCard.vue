<template>
  <div :class="['zzz-card', scanline ? 'zzz-anim-scanline' : '', glowClass]">
    <!-- 霓虹渐变边框 -->
    <div
      v-if="neonBorder"
      class="zzz-card__neon-border"
    ></div>

    <!-- 标题栏 -->
    <div v-if="title || $slots.title" class="zzz-card__header">
      <div class="zzz-card__title-bar">
        <span v-if="title" class="zzz-card__title">{{ title }}</span>
        <slot name="title" />
        <div class="zzz-card__decorator"></div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="zzz-card__body">
      <slot />
    </div>

    <!-- 扫描线叠加层 -->
    <div v-if="scanline" class="zzz-card__scanline"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title?: string;
  scanline?: boolean;
  neonBorder?: boolean;
  glow?: 'orange' | 'cyan' | 'pink' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  scanline: false,
  neonBorder: false,
  glow: 'none',
});

const glowClass = computed(() => {
  if (props.glow === 'none') return '';
  return `zzz-glow-${props.glow}`;
});
</script>

<style scoped lang="scss">
.zzz-card {
  position: relative;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  overflow: hidden;

  /* 斜角切割 */
  clip-path: polygon(
    0 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% 100%,
    12px 100%,
    0 calc(100% - 12px)
  );

  &__header {
    padding: 14px 20px 10px;
    border-bottom: 1px solid hsl(var(--border) / 0.6);
  }

  &__title-bar {
    display: flex;
    align-items: center;
  }

  &__title {
    font-family: 'Impact', 'Arial Black', sans-serif;
    font-size: 16px;
    color: hsl(var(--primary));
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  &__decorator {
    display: inline-block;
    width: 32px;
    height: 3px;
    background: linear-gradient(90deg, hsl(var(--primary)), transparent);
    margin-left: 10px;
    vertical-align: middle;
    flex-shrink: 0;
  }

  &__body {
    padding: 20px;
  }

  &__scanline {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.08) 2px,
      rgba(0, 0, 0, 0.08) 4px
    );
    opacity: 0.3;
  }

  &__neon-border {
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      45deg,
      hsl(var(--primary)),
      hsl(348 100% 59%),
      hsl(172 100% 42%),
      hsl(var(--primary))
    );
    background-size: 400% 400%;
    z-index: -1;
    animation: neon-gradient 3s ease infinite;
    clip-path: polygon(
      0 0,
      calc(100% - 12px) 0,
      100% 12px,
      100% 100%,
      12px 100%,
      0 calc(100% - 12px)
    );
  }
}
</style>
