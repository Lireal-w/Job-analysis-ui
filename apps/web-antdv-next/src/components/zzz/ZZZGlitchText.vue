<template>
  <span
    :class="['zzz-glitch', tag || 'span']"
    :data-text="text"
    :style="{
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    }"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  tag?: string;
}

withDefaults(defineProps<Props>(), {
  fontSize: 'inherit',
  fontWeight: '700',
  color: 'inherit',
  tag: 'span',
});
</script>

<style scoped lang="scss">
.zzz-glitch {
  position: relative;
  display: inline-block;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: hsl(var(--background));
  }

  &::before {
    left: 2px;
    text-shadow: -1px 0 hsl(348 100% 59%);
    animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -1px 0 hsl(172 100% 42%);
    animation: glitch-anim-2 2.5s infinite linear alternate-reverse;
  }
}
</style>
