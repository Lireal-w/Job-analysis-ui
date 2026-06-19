# 绝区零风格UI改造方案

## 一、绝区零UI核心视觉特征分析

### 1.1 整体风格关键词
- **复古潮流街头风**：融合90年代/Y2K/当下潮流，波普精神
- **都市潮酷感**：新艾利都城市氛围，强调"烟火气"与日常连接
- **美式卡通漫画感**：冲击帧(Impact Frame)、故障艺术、反色效果
- **高对比度色彩**：鲜明色彩对比，互补色/分裂补色搭配
- **新拟态+复古元素**：录像带、电视机等复古元素融入现代UI

### 1.2 色彩体系
| 类型 | 特征 | 建议值 |
|------|------|--------|
| **主背景** | 深灰/纯黑底色，降低明度纯度 | `#0A0A0F` / `#111118` |
| **主文字** | 高对比度白/浅灰，但避免纯白刺眼 | `#E8E8EC` / `#D0D0D8` |
| **强调色** | 高饱和霓虹色（橙、青、粉、紫） | `#FF6B35`(橙) `#00D4AA`(青) `#FF2D78`(粉) |
| **辅助色** | 高级灰质感，降低场景明度 | 各种低饱和灰调 |
| **危险/警告** | 高亮红色 | `#FF3333` |
| **成功/通过** | 霓虹青绿 | `#00E5A0` |

### 1.3 字体特征
- **标题字体**：超粗黑体/装饰性粗体（如印品鸿蒙体风格），极具视觉冲击力
- **正文字体**：需保证可读性，建议用较细的无衬线体
- **数字/数据**：等宽字体，增强科技感
- **英文**：粗体无衬线，如 Impact、Montserrat Black

### 1.4 图形与装饰元素
- **几何切割**：界面边缘不规则切割、斜角处理
- **故障艺术(Glitch)**：文字/图形的错位、条纹、RGB分离效果
- **胶带/贴纸元素**：拼贴感，模拟手账风格
- **扫描线/噪点纹理**：模拟老式电视机/录像带质感
- **动态边框**：霓虹灯管式发光边框，呼吸灯效果
- **美式漫画元素**：本戴点(Ben-Day dots)、拟声词、速度线

### 1.5 动效特征
- **镜头感转场**：旋转、推拉镜头替代硬切
- **冲击帧**：切换时闪现高对比色块
- **快启动慢恢复**：动画先快后慢，强调惯性
- **跟随动画**：元素惯性摆动
- **故障闪烁**：文字/图标加载时的 glitch 效果

---

## 二、项目现状分析

你的项目基于 **Vben Admin v5 + Ant Design Vue 4.x**，当前特征：
- 企业级中后台风格（蓝白/暗色主题）
- Ant Design 规范组件
- 表格、表单、仪表盘为主的B端界面
- Monorepo 架构（apps/web-antdv-next + packages/*）

---

## 三、改造实施路径

### 阶段一：基础主题层改造（1-2周）

#### 3.1.1 覆盖 Ant Design Vue 主题变量

在 `apps/web-antdv-next/src/` 下创建主题配置文件：

```typescript
// src/theme/zzz-theme.ts
export const zzzTheme = {
  // 主色板 - 绝区零风格
  colorPrimary: '#FF6B35',        // 主强调色（霓虹橙）
  colorSuccess: '#00E5A0',        // 成功色（霓虹青绿）
  colorWarning: '#FFD93D',        // 警告色（亮黄）
  colorError: '#FF2D55',          // 错误色（霓虹粉红）
  colorInfo: '#00D4AA',           // 信息色（霓虹青）

  // 背景色
  colorBgBase: '#0A0A0F',         // 最深背景
  colorBgContainer: '#14141C',    // 容器背景
  colorBgElevated: '#1A1A24',     // 浮层背景
  colorBgSpotlight: '#222230',    // 高亮背景

  // 文字色
  colorTextBase: '#E8E8EC',       // 主文字
  colorTextSecondary: '#8B8B9A',  // 次要文字
  colorTextTertiary: '#5A5A6A',   // 三级文字

  // 边框
  colorBorder: '#2A2A3A',         // 常规边框
  colorBorderSecondary: '#1F1F2E',// 次级边框

  // 圆角 - 绝区零偏硬朗，减小圆角
  borderRadius: 4,
  borderRadiusSM: 2,
  borderRadiusLG: 6,
  borderRadiusXS: 0,              // 部分元素直角
};
```

在 `main.ts` 或 App 入口注入：

```typescript
import { ConfigProvider } from 'ant-design-vue';
import { zzzTheme } from './theme/zzz-theme';

// 覆盖 antdv 主题
ConfigProvider.config({
  theme: zzzTheme,
});
```

#### 3.1.2 全局CSS变量与样式覆盖

```scss
// src/styles/zzz-global.scss
:root {
  // 霓虹发光效果
  --zzz-glow-orange: 0 0 10px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 107, 53, 0.3);
  --zzz-glow-cyan: 0 0 10px rgba(0, 212, 170, 0.5), 0 0 20px rgba(0, 212, 170, 0.3);
  --zzz-glow-pink: 0 0 10px rgba(255, 45, 85, 0.5), 0 0 20px rgba(255, 45, 85, 0.3);

  // 扫描线纹理
  --zzz-scanline: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );

  // 故障偏移
  --zzz-glitch-offset: 2px;
}

// 全局背景
body {
  background-color: #0A0A0F;
  color: #E8E8EC;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}

// 滚动条改造
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0A0A0F;
}
::-webkit-scrollbar-thumb {
  background: #2A2A3A;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #FF6B35;
}
```

#### 3.1.3 字体配置

```typescript
// vite.config.ts 或 main.ts 引入
import '@fontsource-variable/noto-sans-sc';
import '@fontsource/impact'; // 标题用

// 在 tailwind 或全局样式中配置
fontFamily: {
  sans: ['"Noto Sans SC Variable"', 'sans-serif'],
  display: ['Impact', '"Noto Sans SC"', 'sans-serif'], // 大标题
  mono: ['"JetBrains Mono"', 'monospace'], // 数据/代码
}
```

---

### 阶段二：组件层改造（2-3周）

#### 3.2.1 自定义按钮组件（ZZZButton）

绝区零按钮特征：
- 异形切割（斜角/不规则）
- 霓虹发光边框
- 故障hover效果
- 大色块高对比

```vue
<!-- src/components/zzz/ZZZButton.vue -->
<template>
  <button 
    :class="['zzz-btn', `zzz-btn--${type}`, { 'zzz-btn--glitch': glitch }]"
    @mouseenter="onHover"
    @mouseleave="onLeave"
  >
    <span class="zzz-btn__content">
      <slot />
    </span>
    <span v-if="glitch" class="zzz-btn__glitch" aria-hidden="true">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  glitch?: boolean;
}
withDefaults(defineProps<Props>(), {
  type: 'primary',
  glitch: false,
});

const onHover = (e: MouseEvent) => {
  // 触发故障动画
};
const onLeave = (e: MouseEvent) => {
  // 恢复
};
</script>

<style scoped lang="scss">
.zzz-btn {
  position: relative;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  transition: all 0.2s ease;

  &--primary {
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
    color: #0A0A0F;
    box-shadow: var(--zzz-glow-orange);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.7), 0 0 40px rgba(255, 107, 53, 0.4);
    }
  }

  &--secondary {
    background: transparent;
    color: #00D4AA;
    border: 2px solid #00D4AA;
    box-shadow: var(--zzz-glow-cyan);
  }

  &--ghost {
    background: rgba(255, 255, 255, 0.05);
    color: #E8E8EC;
    border: 1px solid #2A2A3A;
  }

  // 故障效果层
  &__glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    color: #FF2D55;
    clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
  }

  &:hover &__glitch {
    animation: glitch-anim 0.3s infinite;
    opacity: 0.8;
  }
}

@keyframes glitch-anim {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
</style>
```

#### 3.2.2 卡片/面板组件（ZZZCard）

```vue
<!-- src/components/zzz/ZZZCard.vue -->
<template>
  <div :class="['zzz-card', { 'zzz-card--scanline': scanline }]">
    <div class="zzz-card__border"></div>
    <div v-if="title" class="zzz-card__header">
      <div class="zzz-card__title-bar">
        <span class="zzz-card__title">{{ title }}</span>
        <div class="zzz-card__decorator"></div>
      </div>
    </div>
    <div class="zzz-card__body">
      <slot />
    </div>
    <div v-if="scanline" class="zzz-card__scanline"></div>
  </div>
</template>

<style scoped lang="scss">
.zzz-card {
  position: relative;
  background: #14141C;
  border: 1px solid #2A2A3A;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));

  &__header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid #2A2A3A;
  }

  &__title {
    font-family: 'Impact', sans-serif;
    font-size: 18px;
    color: #FF6B35;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  &__decorator {
    display: inline-block;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #FF6B35, transparent);
    margin-left: 12px;
    vertical-align: middle;
  }

  &__body {
    padding: 20px;
  }

  &__scanline {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: var(--zzz-scanline);
    opacity: 0.3;
  }
}
</style>
```

#### 3.2.3 表格改造（Vxe-Table 主题覆盖）

```scss
// src/styles/zzz-table.scss
.vxe-table {
  background: transparent !important;

  .vxe-header--row {
    background: #1A1A24 !important;
  }

  .vxe-header--column {
    color: #00D4AA !important;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid #FF6B35 !important;
  }

  .vxe-body--row {
    background: #14141C !important;
    border-bottom: 1px solid #1F1F2E !important;

    &:hover {
      background: #1E1E2E !important;
      box-shadow: inset 3px 0 0 #FF6B35;
    }
  }

  .vxe-body--column {
    color: #D0D0D8 !important;
  }
}
```

#### 3.2.4 导航菜单改造

```scss
// src/styles/zzz-menu.scss
.ant-menu {
  background: #0A0A0F !important;
  border-right: 1px solid #2A2A3A !important;

  .ant-menu-item {
    color: #8B8B9A !important;
    margin: 4px 8px !important;
    border-radius: 4px !important;

    &:hover {
      color: #FF6B35 !important;
      background: rgba(255, 107, 53, 0.1) !important;
    }

    &-selected {
      color: #FF6B35 !important;
      background: rgba(255, 107, 53, 0.15) !important;
      border-left: 3px solid #FF6B35;

      &::after {
        display: none;
      }
    }
  }

  .ant-menu-submenu-title {
    color: #D0D0D8 !important;
    font-weight: 600;

    &:hover {
      color: #00D4AA !important;
    }
  }
}
```

---

### 阶段三：页面级改造（2-3周）

#### 3.3.1 登录页

绝区零风格登录页特征：
- 大背景图/视频（都市夜景/霓虹街道）
- 中央大标题，粗体冲击感
- 表单区域异形切割面板
- 故障艺术装饰
- 霓虹灯管边框

```vue
<!-- src/views/login/index.vue -->
<template>
  <div class="zzz-login">
    <!-- 动态背景 -->
    <div class="zzz-login__bg">
      <div class="zzz-login__grid"></div>
      <div class="zzz-login__noise"></div>
    </div>

    <!-- 主内容 -->
    <div class="zzz-login__content">
      <div class="zzz-login__brand">
        <h1 class="zzz-login__title">FBA SYSTEM</h1>
        <p class="zzz-login__subtitle">FASTAPI BEST ARCHITECTURE</p>
        <div class="zzz-login__glitch-line"></div>
      </div>

      <div class="zzz-login__form-panel">
        <ZZZCard title="ACCESS" scanline>
          <a-form :model="form" @finish="onSubmit">
            <a-form-item>
              <a-input 
                v-model:value="form.username" 
                placeholder="USERNAME"
                class="zzz-input"
                size="large"
              />
            </a-form-item>
            <a-form-item>
              <a-input-password 
                v-model:value="form.password" 
                placeholder="PASSWORD"
                class="zzz-input"
                size="large"
              />
            </a-form-item>
            <a-form-item>
              <ZZZButton type="primary" glitch block size="large">
                LOGIN // 登录
              </ZZZButton>
            </a-form-item>
          </a-form>
        </ZZZCard>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="zzz-login__decorator zzz-login__decorator--tl"></div>
    <div class="zzz-login__decorator zzz-login__decorator--br"></div>
  </div>
</template>

<style scoped lang="scss">
.zzz-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &__bg {
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse at 20% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 50%, rgba(0, 212, 170, 0.08) 0%, transparent 50%),
      #0A0A0F;
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  &__brand {
    text-align: center;
    margin-bottom: 40px;
  }

  &__title {
    font-family: 'Impact', sans-serif;
    font-size: 64px;
    color: #E8E8EC;
    letter-spacing: 8px;
    margin: 0;
    text-shadow: 
      0 0 20px rgba(255, 107, 53, 0.5),
      0 0 40px rgba(255, 107, 53, 0.3);
    animation: title-flicker 4s infinite;
  }

  &__subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #00D4AA;
    letter-spacing: 6px;
    margin-top: 12px;
  }

  &__glitch-line {
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FF6B35, transparent);
    margin: 20px auto 0;
  }

  &__form-panel {
    width: 420px;
  }
}

@keyframes title-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
  52% { opacity: 0.5; }
  54% { opacity: 1; }
  90% { opacity: 1; }
  92% { opacity: 0.3; }
  94% { opacity: 1; }
}

// 输入框改造
.zzz-input {
  :deep(.ant-input) {
    background: #0A0A0F !important;
    border: 1px solid #2A2A3A !important;
    color: #E8E8EC !important;
    font-family: 'JetBrains Mono', monospace !important;

    &::placeholder {
      color: #5A5A6A !important;
      letter-spacing: 2px;
    }

    &:focus {
      border-color: #FF6B35 !important;
      box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2) !important;
    }
  }
}
</style>
```

#### 3.3.2 仪表盘/分析页

```vue
<!-- src/views/analytics/index.vue -->
<template>
  <div class="zzz-dashboard">
    <!-- 顶部数据条 -->
    <div class="zzz-dashboard__stats-bar">
      <div v-for="stat in stats" :key="stat.key" class="zzz-stat-card">
        <div class="zzz-stat-card__label">{{ stat.label }}</div>
        <div class="zzz-stat-card__value" :class="`zzz-stat-card__value--${stat.type}`">
          {{ stat.value }}
        </div>
        <div class="zzz-stat-card__trend">
          <span :class="stat.trend > 0 ? 'up' : 'down'">
            {{ stat.trend > 0 ? '▲' : '▼' }} {{ Math.abs(stat.trend) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="zzz-dashboard__charts">
      <ZZZCard title="DATA FLOW" class="zzz-dashboard__chart-main">
        <!-- 使用 AntV G2，配置霓虹色系 -->
        <div ref="chartRef" class="zzz-chart"></div>
      </ZZZCard>

      <ZZZCard title="SYSTEM STATUS" class="zzz-dashboard__chart-side">
        <div class="zzz-status-list">
          <div v-for="item in statusList" :key="item.name" class="zzz-status-item">
            <div class="zzz-status-item__name">{{ item.name }}</div>
            <div class="zzz-status-item__bar">
              <div 
                class="zzz-status-item__fill" 
                :style="{ width: item.value + '%', background: item.color }"
              ></div>
            </div>
            <div class="zzz-status-item__value">{{ item.value }}%</div>
          </div>
        </div>
      </ZZZCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zzz-dashboard {
  padding: 24px;

  &__stats-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  &__charts {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
  }
}

.zzz-stat-card {
  background: #14141C;
  border: 1px solid #2A2A3A;
  padding: 20px;
  position: relative;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: #FF6B35;
  }

  &__label {
    font-size: 12px;
    color: #5A5A6A;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }

  &__value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    color: #E8E8EC;

    &--primary { color: #FF6B35; text-shadow: var(--zzz-glow-orange); }
    &--success { color: #00E5A0; text-shadow: var(--zzz-glow-cyan); }
    &--warning { color: #FFD93D; }
    &--info { color: #00D4AA; }
  }

  &__trend {
    margin-top: 8px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;

    .up { color: #00E5A0; }
    .down { color: #FF2D55; }
  }
}

.zzz-status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #1F1F2E;

  &__name {
    width: 100px;
    font-size: 13px;
    color: #8B8B9A;
    text-transform: uppercase;
  }

  &__bar {
    flex: 1;
    height: 4px;
    background: #1F1F2E;
    border-radius: 2px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.6s ease;
    box-shadow: 0 0 8px currentColor;
  }

  &__value {
    width: 50px;
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #D0D0D8;
  }
}
</style>
```

---

### 阶段四：动效与交互层（1-2周）

#### 3.4.1 页面转场动画

```typescript
// src/router/guard.ts 或独立 transition 配置
// 使用 Vue Router 的过渡 + GSAP

import gsap from 'gsap';

export const pageTransition = {
  beforeEnter(el: HTMLElement) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.98)';
  },
  enter(el: HTMLElement, done: () => void) {
    // 冲击帧效果
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: #FF6B35;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(flash);

    gsap.timeline()
      .to(flash, { opacity: 0.3, duration: 0.05 })
      .to(flash, { opacity: 0, duration: 0.1, onComplete: () => flash.remove() })
      .to(el, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 0.05);

    setTimeout(done, 500);
  },
  leave(el: HTMLElement, done: () => void) {
    gsap.to(el, {
      opacity: 0,
      scale: 1.02,
      duration: 0.2,
      onComplete: done,
    });
  },
};
```

#### 3.4.2 故障文字效果组件

```vue
<!-- src/components/zzz/ZZZGlitchText.vue -->
<template>
  <span class="zzz-glitch" :data-text="text">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
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
    background: #0A0A0F;
  }

  &::before {
    left: 2px;
    text-shadow: -1px 0 #FF2D55;
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-1 2s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -1px 0 #00D4AA;
    clip: rect(85px, 550px, 140px, 0);
    animation: glitch-anim-2 2s infinite linear alternate-reverse;
  }
}

@keyframes glitch-anim-1 {
  0% { clip: rect(20px, 9999px, 15px, 0); }
  20% { clip: rect(50px, 9999px, 80px, 0); }
  40% { clip: rect(10px, 9999px, 60px, 0); }
  60% { clip: rect(70px, 9999px, 30px, 0); }
  80% { clip: rect(40px, 9999px, 90px, 0); }
  100% { clip: rect(60px, 9999px, 20px, 0); }
}

@keyframes glitch-anim-2 {
  0% { clip: rect(60px, 9999px, 90px, 0); }
  20% { clip: rect(10px, 9999px, 50px, 0); }
  40% { clip: rect(80px, 9999px, 20px, 0); }
  60% { clip: rect(30px, 9999px, 70px, 0); }
  80% { clip: rect(90px, 9999px, 40px, 0); }
  100% { clip: rect(20px, 9999px, 60px, 0); }
}
</style>
```

#### 3.4.3 霓虹边框动画

```scss
// src/styles/zzz-animations.scss

// 呼吸灯边框
.zzz-neon-border {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #FF6B35, #FF2D55, #00D4AA, #FF6B35);
    background-size: 400% 400%;
    z-index: -1;
    animation: neon-gradient 3s ease infinite;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #14141C;
    z-index: -1;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
}

@keyframes neon-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

// 扫描线动画
.zzz-scanline-anim {
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 50%
    );
    background-size: 100% 4px;
    animation: scanline 8s linear infinite;
    pointer-events: none;
  }
}

@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
}
```

---

### 阶段五：图表与数据可视化改造（1周）

#### 3.5.1 AntV G2 主题配置

```typescript
// src/theme/zzz-g2-theme.ts
import { registerTheme } from '@antv/g2';

registerTheme('zzz-dark', {
  background: '#0A0A0F',
  defaultColor: '#FF6B35',
  paletteQualitative10: [
    '#FF6B35', '#00D4AA', '#FF2D55', '#FFD93D', 
    '#9B59B6', '#3498DB', '#E74C3C', '#1ABC9C',
    '#F39C12', '#ECF0F1',
  ],
  paletteQualitative20: [
    '#FF6B35', '#FF8C42', '#00D4AA', '#00E5A0',
    '#FF2D55', '#FF6B8A', '#FFD93D', '#FFE066',
    '#9B59B6', '#AF7AC5', '#3498DB', '#5DADE2',
    '#E74C3C', '#EC7063', '#1ABC9C', '#48C9B0',
    '#F39C12', '#F5B041', '#ECF0F1', '#D5DBDB',
  ],
  axis: {
    line: { style: { stroke: '#2A2A3A' } },
    grid: { line: { style: { stroke: '#1F1F2E', lineDash: [4, 4] } } },
    label: { style: { fill: '#5A5A6A', fontSize: 12 } },
    title: { style: { fill: '#8B8B9A', fontSize: 12 } },
  },
  legend: {
    itemName: { style: { fill: '#8B8B9A', fontSize: 12 } },
  },
  tooltip: {
    domStyles: {
      'g2-tooltip': {
        background: '#1A1A24',
        border: '1px solid #2A2A3A',
        borderRadius: '4px',
        color: '#E8E8EC',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  label: {
    style: { fill: '#D0D0D8', fontSize: 11 },
  },
  innerLabel: {
    style: { fill: '#0A0A0F', fontSize: 11 },
  },
});
```

---

## 四、项目文件改造清单

### 4.1 新增文件

```
apps/web-antdv-next/src/
├── theme/
│   ├── zzz-theme.ts          # AntDV 主题变量
│   └── zzz-g2-theme.ts       # G2 图表主题
├── styles/
│   ├── zzz-global.scss       # 全局样式
│   ├── zzz-table.scss        # 表格覆盖
│   ├── zzz-menu.scss         # 菜单覆盖
│   └── zzz-animations.scss   # 动画定义
├── components/zzz/
│   ├── ZZZButton.vue         # 按钮
│   ├── ZZZCard.vue           # 卡片
│   ├── ZZZGlitchText.vue     # 故障文字
│   ├── ZZZBadge.vue          # 徽章标签
│   ├── ZZZTag.vue            # 标签
│   ├── ZZZModal.vue          # 弹窗
│   ├── ZZZInput.vue          # 输入框
│   └── ZZZSelect.vue         # 选择器
├── composables/
│   └── useGlitch.ts          # 故障效果组合式函数
└── views/
    └── login/
        └── index.vue         # 重写登录页
```

### 4.2 修改文件

```
apps/web-antdv-next/
├── vite.config.ts            # 添加字体/SCSS配置
├── main.ts                   # 注入主题
├── src/layouts/              # 布局改造（侧边栏、头部）
├── src/views/                # 各页面逐步替换组件
└── src/styles/index.scss     # 引入zzz全局样式

packages/@core/
└── 可能需要调整基础UI Kit
```

---

## 五、依赖安装

```bash
# 进入项目
cd fastapi-best-architecture-ui

# 安装动画库
pnpm add gsap @vueuse/motion --filter @vben/web-antdv-next

# 安装字体（可选，也可使用CDN）
pnpm add @fontsource-variable/noto-sans-sc @fontsource/jetbrains-mono --filter @vben/web-antdv-next

# 安装图标库（如果需要补充图标）
pnpm add @iconify-json/mingcute @iconify-json/solar --filter @vben/web-antdv-next
```

---

## 六、注意事项与建议

### 6.1 平衡风格与可用性
绝区零原版UI存在**过度追求视觉冲击而牺牲可读性**的问题citeweb_search:2#6web_search:2#13：
- 避免在正文中使用超粗黑体
- 避免大面积纯黑背景配纯白文字（建议用 `#0A0A0F` + `#E8E8EC`）
- 保持足够的对比度但不要刺眼
- 关键操作按钮需保持明显的可交互性citeweb_search:2#11

### 6.2 性能考量
- 扫描线/噪点纹理使用 CSS 而非图片
- 故障动画使用 `will-change: transform`
- 霓虹发光效果适度使用，避免过多重绘
- 考虑提供"低性能模式"开关，关闭复杂动效

### 6.3 响应式适配
- 异形切割在移动端可能有问题，提供回退方案
- 霓虹效果在移动端适当减弱
- 表格在移动端保持横向滚动

### 6.4 渐进式改造建议
1. **第一周**：主题色 + 全局样式 + 登录页
2. **第二周**：基础组件（Button、Card、Input）
3. **第三周**：布局改造（侧边栏、头部、面包屑）
4. **第四周**：页面级改造（仪表盘、表格页）
5. **第五周**：动效优化 + 图表主题 + 细节打磨

---

## 七、参考资源

- **绝区零风格关键词**：复古潮流、街头文化、美式卡通、波普艺术、Y2K、故障艺术、霓虹朋克
- **配色灵感**：霓虹橙 `#FF6B35`、霓虹青 `#00D4AA`、霓虹粉 `#FF2D55`、深空黑 `#0A0A0F`
- **字体选择**：标题用粗黑体/Impact，正文用 Noto Sans SC，数据用 JetBrains Mono
- **动效参考**：冲击帧、故障闪烁、霓虹呼吸、镜头推拉、快启动慢恢复
