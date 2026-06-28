<template>
  <div :class="['zzz-input-wrapper', { 'zzz-input-wrapper--focused': isFocused, 'zzz-input-wrapper--error': error }]">
    <span v-if="$slots.prefix || prefix" class="zzz-input__prefix">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      ref="inputRef"
      v-bind="$attrs"
      :class="['zzz-input', sizeClass]"
      :value="modelValue"
      :placeholder="placeholder"
      :type="inputType"
      :disabled="disabled"
      :readonly="readonly"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    />
    <span v-if="$slots.suffix || suffix" class="zzz-input__suffix">
      <slot name="suffix">{{ suffix }}</slot>
    </span>
    <button
      v-if="clearable && modelValue && !disabled"
      class="zzz-input__clear"
      @click="onClear"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue?: string | number;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  error?: boolean;
  prefix?: string;
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  clearable: false,
  error: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
}>();

const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const inputType = computed(() => props.type);

const sizeClass = computed(() => `zzz-input--${props.size}`);

function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  isFocused.value = false;
  emit('blur', event);
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function onClear() {
  emit('update:modelValue', '');
  emit('clear');
  inputRef.value?.focus();
}
</script>

<style scoped lang="scss">
.zzz-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #0A0A0F;
  border: 1px solid #2A2A3A;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);

  &:hover {
    border-color: #3A3A4A;
  }

  &--focused {
    border-color: #FF6B35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.15), 0 0 12px rgba(255, 107, 53, 0.1);
  }

  &--error {
    border-color: #FF2D55;
    box-shadow: 0 0 0 2px rgba(255, 45, 85, 0.15);

    &:hover {
      border-color: #FF2D55;
    }
  }
}

.zzz-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #E8E8EC;
  font-family: 'JetBrains Mono', 'Noto Sans SC', monospace;
  padding: 0 4px;
  width: 100%;
  min-width: 0;

  &::placeholder {
    color: #5A5A6A;
    letter-spacing: 1px;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #0A0A0F inset;
    -webkit-text-fill-color: #E8E8EC;
  }

  &--small {
    height: 32px;
    font-size: 12px;
    padding: 0 4px;
  }

  &--medium {
    height: 40px;
    font-size: 14px;
    padding: 0 4px;
  }

  &--large {
    height: 48px;
    font-size: 16px;
    padding: 0 4px;
  }
}

.zzz-input__prefix,
.zzz-input__suffix {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #5A5A6A;
  font-size: 13px;
  flex-shrink: 0;
}

.zzz-input__prefix {
  border-right: 1px solid #2A2A3A;
  margin-right: 8px;
}

.zzz-input__suffix {
  border-left: 1px solid #2A2A3A;
  margin-left: 8px;
}

.zzz-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #8B8B9A;
  font-size: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 45, 85, 0.3);
    color: #FF2D55;
  }
}
</style>
