<template>
  <button
    :class="[
      'hsr-btn',
      `hsr-btn--${type}`,
      `hsr-btn--${size}`,
      {
        'hsr-btn--block': block,
        'hsr-btn--loading': loading,
        'hsr-btn--disabled': disabled,
      },
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="hsr-btn__spinner" />
    <span v-if="icon" class="hsr-btn__icon">{{ icon }}</span>
    <span class="hsr-btn__content">
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
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  block: false,
  loading: false,
  disabled: false,
});
</script>

<style scoped lang="scss">
.hsr-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  overflow: hidden;

  // Glow pseudo-element
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 10px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: -1;
  }

  // Size variants
  &--small {
    padding: 6px 16px;
    font-size: 12px;
  }

  &--medium {
    padding: 10px 24px;
    font-size: 14px;
  }

  &--large {
    padding: 14px 32px;
    font-size: 16px;
  }

  // Type variants
  &--primary {
    background: linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 2px 12px rgba(168, 85, 247, 0.3);

    &::before {
      background: linear-gradient(135deg, #C084FC, #A855F7);
    }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(168, 85, 247, 0.5);

      &::before {
        opacity: 1;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #38BDF8;
    border-color: rgba(56, 189, 248, 0.4);

    &:hover:not(:disabled) {
      background: rgba(56, 189, 248, 0.1);
      border-color: #38BDF8;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
    }
  }

  &--danger {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: #fff;
    border-color: transparent;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
      transform: translateY(-1px);
    }
  }

  &--ghost {
    background: transparent;
    color: #C9A96E;
    border-color: rgba(201, 169, 110, 0.3);

    &:hover:not(:disabled) {
      background: rgba(201, 169, 110, 0.08);
      border-color: #C9A96E;
    }
  }

  &--success {
    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
    color: #fff;
    border-color: transparent;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
      transform: translateY(-1px);
    }
  }

  // Block
  &--block {
    display: flex;
    width: 100%;
  }

  // Disabled
  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    cursor: wait;
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    font-size: 1.1em;
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: hsr-spin 0.6s linear infinite;
  }
}

@keyframes hsr-spin {
  to { transform: rotate(360deg); }
}
</style>
