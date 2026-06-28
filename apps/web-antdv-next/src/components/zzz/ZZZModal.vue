<template>
  <div
    :class="['zzz-modal-overlay', { 'zzz-modal-overlay--open': open }]"
    @click.self="maskClosable && handleCancel"
  >
    <div
      ref="modalRef"
      :class="[
        'zzz-modal',
        `zzz-modal--${size}`,
        { 'zzz-modal--no-header': !title && !$slots.header },
      ]"
    >
      <!-- 霓虹边框 -->
      <div class="zzz-modal__border" />

      <!-- 关闭按钮 -->
      <button v-if="closable" class="zzz-modal__close" @click="handleCancel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Header -->
      <div v-if="title || $slots.header" class="zzz-modal__header">
        <slot name="header">
          <div class="zzz-modal__title-bar">
            <span class="zzz-modal__title">{{ title }}</span>
            <div class="zzz-modal__decorator" />
          </div>
        </slot>
      </div>

      <!-- Body -->
      <div class="zzz-modal__body">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="zzz-modal__footer">
        <slot name="footer" />
      </div>
      <div v-else-if="showFooter" class="zzz-modal__footer">
        <button v-if="showCancel" class="zzz-btn-footer zzz-btn-footer--cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button
          :disabled="confirmLoading"
          class="zzz-btn-footer zzz-btn-footer--confirm"
          @click="handleOk"
        >
          {{ confirmLoading ? '处理中...' : okText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  open?: boolean;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  closable?: boolean;
  maskClosable?: boolean;
  showFooter?: boolean;
  showCancel?: boolean;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  width?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  size: 'medium',
  closable: true,
  maskClosable: true,
  showFooter: true,
  showCancel: true,
  okText: '确认',
  cancelText: '取消',
  confirmLoading: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  ok: [];
  cancel: [];
}>();

const modalRef = ref<HTMLElement | null>(null);

function handleOk() {
  emit('ok');
}

function handleCancel() {
  emit('update:open', false);
  emit('cancel');
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
);
</script>

<style scoped lang="scss">
.zzz-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &--open {
    opacity: 1;
    visibility: visible;
  }
}

.zzz-modal {
  position: relative;
  background: #14141C;
  border: 1px solid #2A2A3A;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  transform: scale(0.9) translateY(20px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 85vh;
  display: flex;
  flex-direction: column;

  .zzz-modal-overlay--open & {
    transform: scale(1) translateY(0);
  }

  &--small { width: 400px; }
  &--medium { width: 560px; }
  &--large { width: 720px; }

  // Neon border effect
  &__border {
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #FF6B35, #FF2D55, #00D4AA, #FF6B35);
    background-size: 400% 400%;
    z-index: -1;
    animation: neon-gradient 3s ease infinite;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }

  &__border::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: #14141C;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
}

// Close button
.zzz-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #8B8B9A;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 45, 85, 0.2);
    color: #FF2D55;
  }
}

// Header
.zzz-modal__header {
  padding: 20px 24px 12px;
  border-bottom: 1px solid #2A2A3A;
  flex-shrink: 0;
}

.zzz-modal__title-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zzz-modal__title {
  font-family: 'Impact', 'Noto Sans SC', sans-serif;
  font-size: 18px;
  color: #FF6B35;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.zzz-modal__decorator {
  display: inline-block;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #FF6B35, transparent);
  vertical-align: middle;
}

// Body
.zzz-modal__body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
  color: #D0D0D8;
}

// Footer
.zzz-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 24px 20px;
  border-top: 1px solid #1F1F2E;
  flex-shrink: 0;
}

.zzz-btn-footer {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  transition: all 0.2s;

  &--cancel {
    background: rgba(255, 255, 255, 0.05);
    color: #8B8B9A;
    border: 1px solid #2A2A3A;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #E8E8EC;
    }
  }

  &--confirm {
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
    color: #0A0A0F;
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.4);

    &:hover:not(:disabled) {
      box-shadow: 0 0 16px rgba(255, 107, 53, 0.6);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

@keyframes neon-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
