<template>
  <button
    :class="[
      'zzz-btn',
      `zzz-btn--${type}`,
      `zzz-btn--${size}`,
      {
        'zzz-btn--block': block,
        'zzz-btn--loading': loading,
        'zzz-btn--disabled': disabled,
        'zzz-btn--glitch': glitch && !disabled,
      },
    ]"
    :disabled="disabled || loading"
    @mouseenter="onHover"
    @mouseleave="onLeave"
  >
    <span v-if="loading" class="zzz-btn__spinner" />
    <span v-if="icon" class="zzz-btn__icon"><slot name="icon">{{ icon }}</slot></span>
    <span class="zzz-btn__content">
      <slot />
    </span>
    <span v-if="glitch && !disabled" class="zzz-btn__glitch" aria-hidden="true">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'small' | 'medium' | 'large';
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  glitch?: boolean;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  block: false,
  loading: false,
  disabled: false,
  glitch: false,
});

const emit = defineEmits<{
  hover: [e: MouseEvent];
  leave: [e: MouseEvent];
}>();

function onHover(e: MouseEvent) {
  emit('hover', e);
}

function onLeave(e: MouseEvent) {
  emit('leave', e);
}
</script>

<style scoped lang="scss">
.zzz-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  // 斜角切割 clip-path
  clip-path: polygon(
    8px 0,
    100% 0,
    100% calc(100% - 8px),
    calc(100% - 8px) 100%,
    0 100%,
    0 8px
  );

  // Size variants
  &--small {
    padding: 6px 16px;
    font-size: 12px;
    clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  }

  &--medium {
    padding: 10px 24px;
    font-size: 14px;
  }

  &--large {
    padding: 14px 32px;
    font-size: 16px;
    letter-spacing: 2px;
  }

  // Type variants
  &--primary {
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
    color: #0A0A0F;
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 107, 53, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.7), 0 0 40px rgba(255, 107, 53, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: transparent;
    color: #00D4AA;
    border: 2px solid #00D4AA;
    box-shadow: 0 0 6px rgba(0, 212, 170, 0.3);

    &:hover:not(:disabled) {
      background: rgba(0, 212, 170, 0.1);
      box-shadow: 0 0 12px rgba(0, 212, 170, 0.5);
      transform: translateY(-2px);
    }
  }

  &--danger {
    background: linear-gradient(135deg, #FF2D55 0%, #FF4D6A 100%);
    color: #fff;
    box-shadow: 0 0 10px rgba(255, 45, 85, 0.4);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 45, 85, 0.6);
    }
  }

  &--ghost {
    background: rgba(255, 255, 255, 0.05);
    color: #E8E8EC;
    border: 1px solid #2A2A3A;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: #FF6B35;
      color: #FF6B35;
    }
  }

  &--success {
    background: linear-gradient(135deg, #00E5A0 0%, #00C988 100%);
    color: #0A0A0F;
    box-shadow: 0 0 10px rgba(0, 229, 160, 0.4);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(0, 229, 160, 0.6);
    }
  }

  // Block mode
  &--block {
    display: flex;
    width: 100%;
  }

  // Disabled state
  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Loading state
  &--loading {
    cursor: wait;
    pointer-events: none;
  }

  // Content
  &__content {
    position: relative;
    z-index: 1;
  }

  // Icon
  &__icon {
    display: inline-flex;
    align-items: center;
    font-size: 1.1em;
  }

  // Spinner
  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: zzz-spin 0.6s linear infinite;
  }

  // Glitch effect layer
  &__glitch {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    color: #FF2D55;
    clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    pointer-events: none;
    z-index: 2;
  }

  &:hover &__glitch {
    animation: glitch-slide 0.3s infinite;
    opacity: 0.85;
  }
}

@keyframes zzz-spin {
  to { transform: rotate(360deg); }
}

@keyframes glitch-slide {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
</style>
