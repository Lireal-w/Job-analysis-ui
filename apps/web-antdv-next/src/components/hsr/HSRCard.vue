<template>
  <div :class="['hsr-card', glass ? 'hsr-card--glass' : '', starline ? 'hsr-card--has-starline' : '']">
    <!-- 顶部星轨光带 -->
    <div v-if="starline" class="hsr-card__starline"></div>

    <!-- 角标装饰 -->
    <div class="hsr-card__corner hsr-card__corner--tl"></div>
    <div class="hsr-card__corner hsr-card__corner--tr"></div>
    <div class="hsr-card__corner hsr-card__corner--bl"></div>
    <div class="hsr-card__corner hsr-card__corner--br"></div>

    <div v-if="title" class="hsr-card__header">
      <div class="hsr-card__title-wrapper">
        <span class="hsr-card__title">{{ title }}</span>
        <div class="hsr-card__title-line"></div>
      </div>
      <div v-if="subtitle" class="hsr-card__subtitle">{{ subtitle }}</div>
    </div>

    <div class="hsr-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  glass?: boolean;
  starline?: boolean;
}

withDefaults(defineProps<Props>(), {
  glass: true,
  starline: true,
});
</script>

<style scoped lang="scss">
.hsr-card {
  position: relative;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  overflow: hidden;

  &--glass {
    background: hsla(225, 25%, 11%, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* 顶部星轨光带 */
  &--has-starline {
    border-top: none;
  }

  &__starline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(135deg, #C9A96E 0%, #D4AF37 50%, #F0E68C 100%);
    opacity: 0.6;
    z-index: 1;
  }

  /* 角标装饰 */
  &__corner {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 1;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: rgba(201, 169, 110, 0.4);
    }

    &--tl {
      top: 8px;
      left: 8px;
      &::before { width: 8px; height: 1px; top: 0; left: 0; }
      &::after { width: 1px; height: 8px; top: 0; left: 0; }
    }

    &--tr {
      top: 8px;
      right: 8px;
      &::before { width: 8px; height: 1px; top: 0; right: 0; }
      &::after { width: 1px; height: 8px; top: 0; right: 0; }
    }

    &--bl {
      bottom: 8px;
      left: 8px;
      &::before { width: 8px; height: 1px; bottom: 0; left: 0; }
      &::after { width: 1px; height: 8px; bottom: 0; left: 0; }
    }

    &--br {
      bottom: 8px;
      right: 8px;
      &::before { width: 8px; height: 1px; bottom: 0; right: 0; }
      &::after { width: 1px; height: 8px; bottom: 0; right: 0; }
    }
  }

  &__header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid hsl(var(--border) / 0.5);
  }

  &__title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: hsl(var(--foreground));
    letter-spacing: 2px;
  }

  &__title-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(201, 169, 110, 0.5), transparent);
  }

  &__subtitle {
    margin-top: 4px;
    font-size: 12px;
    color: hsl(225, 15%, 50%);
  }

  &__body {
    padding: 20px 24px;
  }
}
</style>
