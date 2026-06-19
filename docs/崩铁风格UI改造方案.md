# 崩坏：星穹铁道风格UI改造方案

## 一、崩铁UI核心视觉特征分析

### 1.1 整体风格关键词
- **硬朗科幻风**：米哈游一贯的硬朗科幻风格，延续崩坏系列DNAciteweb_search:4#0
- **星际太空歌剧**：宇宙列车、星际旅行、太空喜剧的宏大叙事感citeweb_search:4#4
- **精致二次元**：动漫风格角色立绘、华丽特效、高饱和度色彩
- **现代中性**："一本正经胡说八道"的太空喜剧调性，需要中性包容的字体气质citeweb_search:4#5
- **信息密度高**：相比绝区零更克制，布局清晰、信息呈现高效citeweb_search:4#8

### 1.2 色彩体系

崩铁的色彩以**深邃宇宙**为基底，配合**星际能量**般的点缀色：

| 类型 | 特征 | 建议值 |
|------|------|--------|
| **主背景** | 深空蓝/宇宙黑，带微弱蓝紫倾向 | `#0B0E17` / `#0D1117` |
| **次级背景** | 面板/卡片背景，比主背景稍亮 | `#141824` / `#161B28` |
| **主文字** | 高亮白/冷白，略带蓝调 | `#E8ECF1` / `#F0F4F8` |
| **次级文字** | 星尘灰，带蓝紫倾向 | `#8B92A8` / `#6E7681` |
| **强调色-量子** | 量子属性紫 | `#A855F7` / `#9B59B6` |
| **强调色-虚数** | 虚数属性金/琥珀 | `#F59E0B` / `#D4A017` |
| **强调色-冰** | 冰属性青蓝 | `#38BDF8` / `#5DADE2` |
| **强调色-火** | 火属性橙红 | `#F97316` / `#E74C3C` |
| **强调色-雷** | 雷属性电光紫 | `#A78BFA` / `#8E44AD` |
| **强调色-风** | 风属性翠绿 | `#34D399` / `#2ECC71` |
| **强调色-物理** | 物理属性灰白 | `#CBD5E1` / `#BDC3C7` |
| **边框/装饰** | 星轨金/银白 | `#C9A96E` / `#D4AF37` |
| **危险/错误** | 毁灭红 | `#EF4444` |
| **成功** | 丰饶绿 | `#22C55E` |

> 色彩灵感来源：崩铁七大属性（物理、火、冰、雷、风、量子、虚数）的配色体系，以及星际空间的深邃蓝紫基调citeweb_search:4#4

### 1.3 字体特征（核心！）

崩铁对字体的选择非常讲究，这是其UI气质的关键：citeweb_search:4#5

- **标准字体组合**：`汉仪旗黑 65 + DIN Medium`（简体中文）
- **字体风格**：全游戏统一使用**黑体**，无衬线，无斜体/粗体样式变化
- **层级区分**：完全通过**字号大小**和**颜色对比**实现，不依赖字重变化
- **气质特征**：中性、现代、包容性强——既适合宏大叙事，也适合日常戏谑
- **数字/数据**：DIN Medium（等宽感、科技感强）

> 崩铁曾考虑使用更风格化的"汉仪润圆"，但最终选择了更中性的黑体，这是一个非常明智的设计决策——"一本正经胡说八道"的太空喜剧需要中性字体来承载citeweb_search:4#5

### 1.4 图形与装饰元素

- **星轨边框**：金色/银色细线边框，带有微妙的渐变光效
- **圆角与直角并存**：大圆角（卡片）+ 小圆角（按钮）+ 直角（装饰线）
- **玻璃拟态/毛玻璃**：半透明面板，背后有模糊效果（继承自米哈游设计语言）citeweb_search:4#0
- **星芒/光点装饰**：角落点缀小星芒、十字星
- **渐变光带**：顶部或底部的水平渐变光带（模拟星际光芒）
- **细线分割**：1px 极细分割线，颜色极淡
- **角色立绘融合**：重要页面（如角色详情）有大幅立绘背景

### 1.5 动效特征

- **流畅缓动**：动画曲线柔和，不突兀
- **光效呼吸**：重要按钮/元素有微妙的呼吸光效
- **粒子飘浮**：背景可能有微弱的星尘粒子
- **转场淡入**：页面切换以淡入+轻微缩放为主，不追求冲击感
- **数值跳动**：数据变化时有数字滚动动画

---

## 二、与绝区零风格的核心差异

| 维度 | 绝区零 | 崩坏：星穹铁道 |
|------|--------|---------------|
| **整体气质** | 街头潮流、复古、故障艺术 | 星际科幻、太空歌剧、精致二次元 |
| **色彩** | 霓虹高饱和（橙、青、粉） | 深邃蓝紫基底 + 属性色点缀 |
| **字体** | 超粗黑体/Impact，视觉冲击 | 统一黑体，中性克制，字号区分层级 |
| **边框** | 异形切割、霓虹发光、故障效果 | 星轨金线、圆角、毛玻璃、细线分割 |
| **背景** | 纯黑/深灰 + 扫描线/噪点 | 深空蓝 + 星尘粒子 + 渐变光晕 |
| **动效** | 冲击帧、Glitch、快启动慢恢复 | 流畅缓动、呼吸光效、粒子飘浮 |
| **装饰** | 胶带、拼贴、漫画元素 | 星芒、光点、渐变光带、角色立绘 |
| **信息密度** | 较低，强调视觉冲击 | 较高，布局清晰高效citeweb_search:4#8 |
| **情绪** | 躁动、街头、亚文化 | 宏大、浪漫、太空喜剧 |

---

## 三、改造实施路径

### 阶段一：基础主题层改造（1-2周）

#### 3.1.1 覆盖 Ant Design Vue 主题变量

```typescript
// src/theme/hsr-theme.ts
export const hsrTheme = {
  // 主色板 - 崩铁星际风格
  colorPrimary: '#A855F7',        // 主强调色（量子紫）
  colorSuccess: '#22C55E',        // 成功色（丰饶绿）
  colorWarning: '#F59E0B',        // 警告色（虚数金）
  colorError: '#EF4444',          // 错误色（毁灭红）
  colorInfo: '#38BDF8',           // 信息色（冰蓝）

  // 背景色 - 深空宇宙
  colorBgBase: '#0B0E17',         // 最深背景（宇宙黑）
  colorBgContainer: '#141824',    // 容器背景（深空蓝）
  colorBgElevated: '#1A2030',     // 浮层背景
  colorBgSpotlight: '#1E2538',    // 高亮背景

  // 文字色 - 星尘白/灰
  colorTextBase: '#E8ECF1',       // 主文字（冷白）
  colorTextSecondary: '#8B92A8',  // 次要文字（星尘灰）
  colorTextTertiary: '#5A6380',   // 三级文字（暗星灰）

  // 边框 - 星轨金/银
  colorBorder: '#2A3040',         // 常规边框（暗星轨）
  colorBorderSecondary: '#1E2330',// 次级边框

  // 圆角 - 崩铁偏圆润但不失硬朗
  borderRadius: 8,
  borderRadiusSM: 6,
  borderRadiusLG: 12,
  borderRadiusXS: 4,
};
```

#### 3.1.2 全局CSS变量与样式覆盖

```scss
// src/styles/hsr-global.scss
:root {
  // 星际光效
  --hsr-glow-quantum: 0 0 12px rgba(168, 85, 247, 0.4), 0 0 24px rgba(168, 85, 247, 0.2);
  --hsr-glow-imaginary: 0 0 12px rgba(245, 158, 11, 0.4), 0 0 24px rgba(245, 158, 11, 0.2);
  --hsr-glow-ice: 0 0 12px rgba(56, 189, 248, 0.4), 0 0 24px rgba(56, 189, 248, 0.2);
  --hsr-glow-fire: 0 0 12px rgba(249, 115, 22, 0.4), 0 0 24px rgba(249, 115, 22, 0.2);

  // 星轨渐变
  --hsr-gradient-gold: linear-gradient(135deg, #C9A96E 0%, #D4AF37 50%, #F0E68C 100%);
  --hsr-gradient-purple: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%);
  --hsr-gradient-blue: linear-gradient(180deg, transparent 0%, rgba(56, 189, 248, 0.05) 100%);

  // 玻璃拟态
  --hsr-glass: rgba(20, 24, 36, 0.75);
  --hsr-glass-border: rgba(255, 255, 255, 0.08);
}

// 全局背景 - 深空宇宙
body {
  background-color: #0B0E17;
  color: #E8ECF1;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

// 滚动条 - 星轨风格
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0B0E17;
}
::-webkit-scrollbar-thumb {
  background: #2A3040;
  border-radius: 3px;
  border: 1px solid #3A4050;
}
::-webkit-scrollbar-thumb:hover {
  background: #A855F7;
  box-shadow: var(--hsr-glow-quantum);
}
```

#### 3.1.3 字体配置（关键！）

```typescript
// vite.config.ts
import '@fontsource-variable/noto-sans-sc';

// tailwind.config.ts 或全局样式
fontFamily: {
  // 崩铁全游戏统一黑体，不区分标题/正文字体
  sans: ['"Noto Sans SC Variable"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
  // 数据/数字用 DIN 风格
  din: ['"DIN Alternate"', '"DIN"', '"Roboto Mono"', 'monospace'],
}
```

> 崩铁的核心字体策略：**全游戏只用一套字体**，通过字号和颜色区分层级，不依赖字重变化。这是与绝区零最大的差异之一。citeweb_search:4#5

---

### 阶段二：组件层改造（2-3周）

#### 3.2.1 自定义按钮组件（HSRButton）

崩铁按钮特征：
- 圆润但不失硬朗（圆角适中）
- 微妙的星轨光效边框
- 属性色主题（量子紫、虚数金、冰蓝等）
- hover时有光效扩散
- 无故障/Glitch效果（与绝区零核心差异）

```vue
<!-- src/components/hsr/HSRButton.vue -->
<template>
  <button 
    :class="[
      'hsr-btn', 
      `hsr-btn--${type}`, 
      `hsr-btn--${size}`,
      { 'hsr-btn--glow': glow }
    ]"
  >
    <span class="hsr-btn__content">
      <slot />
    </span>
    <span v-if="glow" class="hsr-btn__glow-border"></span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'quantum' | 'imaginary' | 'ice' | 'fire' | 'wind' | 'thunder' | 'physical' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}
withDefaults(defineProps<Props>(), {
  type: 'quantum',
  size: 'md',
  glow: true,
});
</script>

<style scoped lang="scss">
.hsr-btn {
  position: relative;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500; // 崩铁不用超粗字重
  letter-spacing: 1px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--md {
    padding: 10px 28px;
    font-size: 14px;
    border-radius: 8px;
  }

  &--lg {
    padding: 14px 36px;
    font-size: 16px;
    border-radius: 10px;
  }

  &--sm {
    padding: 6px 16px;
    font-size: 12px;
    border-radius: 6px;
  }

  // 量子紫 - 主按钮
  &--quantum {
    background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
    color: #FFFFFF;

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--hsr-glow-quantum);
    }
  }

  // 虚数金
  &--imaginary {
    background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
    color: #0B0E17;

    &:hover {
      box-shadow: var(--hsr-glow-imaginary);
    }
  }

  // 冰蓝
  &--ice {
    background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%);
    color: #0B0E17;

    &:hover {
      box-shadow: var(--hsr-glow-ice);
    }
  }

  // 火
  &--fire {
    background: linear-gradient(135deg, #EA580C 0%, #F97316 100%);
    color: #FFFFFF;

    &:hover {
      box-shadow: var(--hsr-glow-fire);
    }
  }

  // 幽灵/次要
  &--ghost {
    background: rgba(255, 255, 255, 0.05);
    color: #E8ECF1;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(168, 85, 247, 0.3);
    }
  }

  // 光效边框层
  &__glow-border {
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 50%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover &__glow-border {
    opacity: 1;
  }
}
</style>
```

#### 3.2.2 卡片/面板组件（HSRCard）

```vue
<!-- src/components/hsr/HSRCard.vue -->
<template>
  <div :class="['hsr-card', { 'hsr-card--glass': glass, 'hsr-card--starline': starline }]">
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

    <!-- 背景星尘粒子 -->
    <div v-if="particles" class="hsr-card__particles">
      <span v-for="i in 6" :key="i" class="hsr-card__particle"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  glass?: boolean;
  starline?: boolean;
  particles?: boolean;
}
withDefaults(defineProps<Props>(), {
  glass: true,
  starline: true,
  particles: false,
});
</script>

<style scoped lang="scss">
.hsr-card {
  position: relative;
  background: #141824;
  border: 1px solid #2A3040;
  border-radius: 12px;
  overflow: hidden;

  &--glass {
    background: var(--hsr-glass);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  // 顶部星轨光带
  &__starline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--hsr-gradient-gold);
    opacity: 0.6;
  }

  // 角标装饰 - 小星芒
  &__corner {
    position: absolute;
    width: 8px;
    height: 8px;

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
    border-bottom: 1px solid rgba(42, 48, 64, 0.5);
  }

  &__title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500; // 崩铁不用Bold
    color: #E8ECF1;
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
    color: #5A6380;
  }

  &__body {
    padding: 20px 24px;
  }

  // 星尘粒子
  &__particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  &__particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: particle-float 6s infinite ease-in-out;

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        left: random(100) * 1%;
        top: random(100) * 1%;
        animation-delay: $i * 0.8s;
        animation-duration: 4s + random(4);
      }
    }
  }
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
}
</style>
```

#### 3.2.3 表格改造（Vxe-Table 主题覆盖）

```scss
// src/styles/hsr-table.scss
.vxe-table {
  background: transparent !important;

  .vxe-header--row {
    background: rgba(20, 24, 36, 0.8) !important;
  }

  .vxe-header--column {
    color: #C9A96E !important; // 星轨金色表头
    font-weight: 500; // 不用Bold
    font-size: 13px;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(201, 169, 110, 0.3) !important;
  }

  .vxe-body--row {
    background: rgba(20, 24, 36, 0.4) !important;
    border-bottom: 1px solid rgba(42, 48, 64, 0.3) !important;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(26, 32, 48, 0.8) !important;
      box-shadow: inset 0 0 0 1px rgba(168, 85, 247, 0.2);
    }

    &--current {
      background: rgba(168, 85, 247, 0.1) !important;
      box-shadow: inset 3px 0 0 #A855F7;
    }
  }

  .vxe-body--column {
    color: #D0D8E8 !important;
    font-size: 13px;
  }
}
```

#### 3.2.4 导航菜单改造

```scss
// src/styles/hsr-menu.scss
.ant-menu {
  background: rgba(11, 14, 23, 0.95) !important;
  border-right: 1px solid rgba(42, 48, 64, 0.5) !important;
  backdrop-filter: blur(10px);

  .ant-menu-item {
    color: #8B92A8 !important;
    margin: 4px 12px !important;
    border-radius: 8px !important;
    font-size: 14px;
    font-weight: 400; // 崩铁不用Bold

    &:hover {
      color: #E8ECF1 !important;
      background: rgba(168, 85, 247, 0.08) !important;
    }

    &-selected {
      color: #E8ECF1 !important;
      background: rgba(168, 85, 247, 0.12) !important;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: linear-gradient(180deg, #A855F7, #7C3AED);
        border-radius: 0 2px 2px 0;
      }

      &::after {
        display: none;
      }
    }
  }

  .ant-menu-submenu-title {
    color: #D0D8E8 !important;
    font-weight: 500;
    font-size: 14px;

    &:hover {
      color: #E8ECF1 !important;
    }
  }

  .ant-menu-submenu-selected .ant-menu-submenu-title {
    color: #A855F7 !important;
  }
}
```

---

### 阶段三：页面级改造（2-3周）

#### 3.3.1 登录页

崩铁风格登录页特征：
- 深空宇宙背景（星空、星云、银河）
- 中央大标题，字体克制但有气质
- 玻璃拟态登录面板
- 星轨光带装饰
- 角色立绘/星穹列车元素（可选）

```vue
<!-- src/views/login/index.vue -->
<template>
  <div class="hsr-login">
    <!-- 宇宙背景 -->
    <div class="hsr-login__universe">
      <div class="hsr-login__stars"></div>
      <div class="hsr-login__nebula"></div>
      <div class="hsr-login__grid"></div>
    </div>

    <!-- 主内容 -->
    <div class="hsr-login__content">
      <div class="hsr-login__brand">
        <div class="hsr-login__logo">
          <!-- 星穹列车标志或自定义Logo -->
          <svg class="hsr-login__logo-svg" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" stroke="#C9A96E" stroke-width="2" fill="none" opacity="0.6"/>
            <circle cx="32" cy="32" r="20" stroke="#A855F7" stroke-width="1" fill="none" opacity="0.4"/>
            <path d="M32 8 L32 56 M8 32 L56 32" stroke="#C9A96E" stroke-width="1" opacity="0.3"/>
          </svg>
        </div>
        <h1 class="hsr-login__title">FBA SYSTEM</h1>
        <p class="hsr-login__subtitle">FastAPI Best Architecture</p>
        <div class="hsr-login__divider">
          <span class="hsr-login__divider-line"></span>
          <span class="hsr-login__divider-star">✦</span>
          <span class="hsr-login__divider-line"></span>
        </div>
      </div>

      <div class="hsr-login__form-panel">
        <HSRCard title="SYSTEM ACCESS" glass starline>
          <a-form :model="form" @finish="onSubmit" class="hsr-form">
            <a-form-item>
              <a-input 
                v-model:value="form.username" 
                placeholder="请输入用户名"
                class="hsr-input"
                size="large"
              >
                <template #prefix>
                  <UserOutlined class="hsr-input__icon" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input-password 
                v-model:value="form.password" 
                placeholder="请输入密码"
                class="hsr-input"
                size="large"
              >
                <template #prefix>
                  <LockOutlined class="hsr-input__icon" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <HSRButton type="quantum" size="lg" glow block>
                登 录
              </HSRButton>
            </a-form-item>
          </a-form>
        </HSRCard>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="hsr-login__footer">
      <span class="hsr-login__footer-text">开拓未知的边界</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hsr-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &__universe {
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(201, 169, 110, 0.03) 0%, transparent 70%),
      #0B0E17;
  }

  &__stars {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 160px 20px, rgba(255,255,255,0.3), transparent);
    background-size: 200px 100px;
    animation: stars-twinkle 8s infinite;
  }

  &__nebula {
    position: absolute;
    top: 20%;
    right: 10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
    filter: blur(40px);
    animation: nebula-float 12s infinite ease-in-out;
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(201, 169, 110, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201, 169, 110, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  &__brand {
    text-align: center;
    margin-bottom: 48px;
  }

  &__logo {
    margin-bottom: 24px;

    &-svg {
      width: 64px;
      height: 64px;
      animation: logo-rotate 20s linear infinite;
    }
  }

  &__title {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 48px;
    font-weight: 500; // 不用Bold！
    color: #E8ECF1;
    letter-spacing: 8px;
    margin: 0;
    text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
  }

  &__subtitle {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #8B92A8;
    letter-spacing: 6px;
    margin-top: 12px;
  }

  &__divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;

    &-line {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.5), transparent);
    }

    &-star {
      color: #C9A96E;
      font-size: 12px;
      opacity: 0.8;
    }
  }

  &__form-panel {
    width: 400px;
  }

  &__footer {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);

    &-text {
      font-size: 12px;
      color: #5A6380;
      letter-spacing: 4px;
    }
  }
}

@keyframes stars-twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes nebula-float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -20px); }
  66% { transform: translate(-20px, 30px); }
}

@keyframes logo-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 输入框改造
.hsr-input {
  :deep(.ant-input) {
    background: rgba(11, 14, 23, 0.6) !important;
    border: 1px solid rgba(42, 48, 64, 0.8) !important;
    color: #E8ECF1 !important;
    font-family: 'Noto Sans SC', sans-serif !important;
    border-radius: 8px !important;

    &::placeholder {
      color: #5A6380 !important;
    }

    &:focus {
      border-color: rgba(168, 85, 247, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
    }
  }

  &__icon {
    color: #5A6380;
  }
}
</style>
```

#### 3.3.2 仪表盘/分析页

```vue
<!-- src/views/analytics/index.vue -->
<template>
  <div class="hsr-dashboard">
    <!-- 顶部数据概览 - 属性卡风格 -->
    <div class="hsr-dashboard__stats">
      <div 
        v-for="(stat, index) in stats" 
        :key="stat.key" 
        :class="['hsr-stat-card', `hsr-stat-card--${stat.element}`]"
      >
        <div class="hsr-stat-card__element-icon">
          <!-- 属性图标 -->
          <component :is="stat.icon" />
        </div>
        <div class="hsr-stat-card__info">
          <div class="hsr-stat-card__label">{{ stat.label }}</div>
          <div class="hsr-stat-card__value">{{ stat.value }}</div>
          <div class="hsr-stat-card__change" :class="stat.change > 0 ? 'up' : 'down'">
            {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
          </div>
        </div>
        <div class="hsr-stat-card__glow"></div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="hsr-dashboard__charts">
      <HSRCard title="DATA FLOW" subtitle="实时数据流监控" glass starline class="hsr-dashboard__chart-main">
        <div ref="chartRef" class="hsr-chart"></div>
      </HSRCard>

      <HSRCard title="SYSTEM STATUS" subtitle="系统运行状态" glass class="hsr-dashboard__chart-side">
        <div class="hsr-status-grid">
          <div v-for="item in statusList" :key="item.name" class="hsr-status-item">
            <div class="hsr-status-item__header">
              <span class="hsr-status-item__name">{{ item.name }}</span>
              <span class="hsr-status-item__value" :style="{ color: item.color }">{{ item.value }}%</span>
            </div>
            <div class="hsr-status-item__bar">
              <div 
                class="hsr-status-item__fill" 
                :style="{ width: item.value + '%', background: item.color }"
              ></div>
            </div>
          </div>
        </div>
      </HSRCard>
    </div>

    <!-- 任务列表 -->
    <div class="hsr-dashboard__tasks">
      <HSRCard title="SCHEDULED TASKS" subtitle="任务调度队列" glass starline>
        <div class="hsr-task-list">
          <div v-for="task in tasks" :key="task.id" class="hsr-task-item">
            <div class="hsr-task-item__icon" :class="`hsr-task-item__icon--${task.status}`">
              <component :is="task.icon" />
            </div>
            <div class="hsr-task-item__content">
              <div class="hsr-task-item__name">{{ task.name }}</div>
              <div class="hsr-task-item__meta">{{ task.time }} · {{ task.type }}</div>
            </div>
            <div class="hsr-task-item__status">
              <span :class="`hsr-tag hsr-tag--${task.status}`">{{ task.statusText }}</span>
            </div>
          </div>
        </div>
      </HSRCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { key: 'datasource', label: '数据源', value: '24', change: 12, element: 'quantum', icon: 'DatabaseOutlined' },
  { key: 'etl', label: 'ETL任务', value: '156', change: 8, element: 'ice', icon: 'ApartmentOutlined' },
  { key: 'crawler', label: '爬虫任务', value: '89', change: -3, element: 'fire', icon: 'GlobalOutlined' },
  { key: 'quality', label: '质检规则', value: '42', change: 5, element: 'imaginary', icon: 'SafetyOutlined' },
];

const statusList = [
  { name: 'CPU', value: 45, color: '#38BDF8' },
  { name: 'Memory', value: 62, color: '#A855F7' },
  { name: 'Disk', value: 78, color: '#F59E0B' },
  { name: 'Network', value: 34, color: '#22C55E' },
];

const tasks = [
  { id: 1, name: '每日数据同步', time: '02:00', type: 'ETL', status: 'running', statusText: '运行中', icon: 'SyncOutlined' },
  { id: 2, name: '爬虫定时采集', time: '06:00', type: 'Crawler', status: 'pending', statusText: '待执行', icon: 'ClockCircleOutlined' },
  { id: 3, name: '数据质量检查', time: '08:00', type: 'Quality', status: 'success', statusText: '已完成', icon: 'CheckCircleOutlined' },
];
</script>

<style scoped lang="scss">
.hsr-dashboard {
  padding: 24px;

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  &__charts {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
}

// 属性卡 - 崩铁七种属性风格
.hsr-stat-card {
  position: relative;
  background: rgba(20, 24, 36, 0.6);
  border: 1px solid rgba(42, 48, 64, 0.5);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  backdrop-filter: blur(8px);

  &__element-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  &--quantum &__element-icon {
    background: rgba(168, 85, 247, 0.15);
    color: #A855F7;
  }

  &--ice &__element-icon {
    background: rgba(56, 189, 248, 0.15);
    color: #38BDF8;
  }

  &--fire &__element-icon {
    background: rgba(249, 115, 22, 0.15);
    color: #F97316;
  }

  &--imaginary &__element-icon {
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
  }

  &__label {
    font-size: 12px;
    color: #5A6380;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  &__value {
    font-family: 'DIN Alternate', 'Roboto Mono', monospace;
    font-size: 28px;
    font-weight: 500;
    color: #E8ECF1;
  }

  &__change {
    font-size: 12px;
    font-family: 'DIN Alternate', monospace;
    margin-top: 4px;

    &.up { color: #22C55E; }
    &.down { color: #EF4444; }
  }

  &__glow {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }
}

// 状态条
.hsr-status-item {
  padding: 14px 0;
  border-bottom: 1px solid rgba(42, 48, 64, 0.3);

  &:last-child {
    border-bottom: none;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 13px;
    color: #8B92A8;
    letter-spacing: 1px;
  }

  &__value {
    font-family: 'DIN Alternate', monospace;
    font-size: 14px;
    font-weight: 500;
  }

  &__bar {
    height: 4px;
    background: rgba(42, 48, 64, 0.5);
    border-radius: 2px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px currentColor;
  }
}

// 任务列表
.hsr-task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hsr-task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: rgba(11, 14, 23, 0.4);
  border: 1px solid rgba(42, 48, 64, 0.3);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(26, 32, 48, 0.6);
    border-color: rgba(168, 85, 247, 0.2);
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;

    &--running {
      background: rgba(56, 189, 248, 0.15);
      color: #38BDF8;
    }

    &--pending {
      background: rgba(245, 158, 11, 0.15);
      color: #F59E0B;
    }

    &--success {
      background: rgba(34, 197, 94, 0.15);
      color: #22C55E;
    }
  }

  &__content {
    flex: 1;
  }

  &__name {
    font-size: 14px;
    color: #E8ECF1;
    font-weight: 500;
    margin-bottom: 2px;
  }

  &__meta {
    font-size: 12px;
    color: #5A6380;
  }
}

// 标签
.hsr-tag {
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &--running {
    background: rgba(56, 189, 248, 0.15);
    color: #38BDF8;
  }

  &--pending {
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
  }

  &--success {
    background: rgba(34, 197, 94, 0.15);
    color: #22C55E;
  }
}
</style>
```

---

### 阶段四：动效与交互层（1-2周）

#### 3.4.1 页面转场动画

崩铁的转场比绝区零更克制，以流畅淡入为主：

```typescript
// src/router/transition.ts
import gsap from 'gsap';

export const hsrPageTransition = {
  beforeEnter(el: HTMLElement) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.97)';
  },
  enter(el: HTMLElement, done: () => void) {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: done,
    });
  },
  leave(el: HTMLElement, done: () => void) {
    gsap.to(el, {
      opacity: 0,
      scale: 1.01,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: done,
    });
  },
};
```

#### 3.4.2 数值跳动动画组件

```vue
<!-- src/components/hsr/HSRNumber.vue -->
<template>
  <span class="hsr-number" :class="{ 'hsr-number--animated': animated }">
    {{ displayValue }}
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  value: number;
  duration?: number;
  animated?: boolean;
  prefix?: string;
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000,
  animated: true,
  prefix: '',
  suffix: '',
});

const displayValue = ref(props.prefix + '0' + props.suffix);

const animate = (target: number) => {
  const start = parseInt(displayValue.value.replace(/[^0-9-]/g, '')) || 0;
  const diff = target - start;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / props.duration, 1);

    // easeOutExpo
    const eased = 1 - Math.pow(2, -10 * progress);
    const current = Math.round(start + diff * eased);

    displayValue.value = props.prefix + current.toLocaleString() + props.suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

watch(() => props.value, (newVal) => {
  if (props.animated) {
    animate(newVal);
  } else {
    displayValue.value = props.prefix + newVal.toLocaleString() + props.suffix;
  }
});

onMounted(() => {
  if (props.animated) {
    animate(props.value);
  }
});
</script>

<style scoped lang="scss">
.hsr-number {
  font-family: 'DIN Alternate', 'Roboto Mono', monospace;
  font-variant-numeric: tabular-nums;

  &--animated {
    transition: color 0.3s;
  }
}
</style>
```

#### 3.4.3 呼吸光效动画

```scss
// src/styles/hsr-animations.scss

// 呼吸光效 - 用于重要按钮/指示器
.hsr-breathe {
  animation: hsr-breathe 3s ease-in-out infinite;
}

@keyframes hsr-breathe {
  0%, 100% { 
    box-shadow: 0 0 8px currentColor, 0 0 16px currentColor; 
    opacity: 1;
  }
  50% { 
    box-shadow: 0 0 4px currentColor, 0 0 8px currentColor; 
    opacity: 0.8;
  }
}

// 星轨旋转 - 用于加载/装饰
.hsr-orbit {
  animation: hsr-orbit 8s linear infinite;
}

@keyframes hsr-orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 光带扫描 - 用于高亮区域
.hsr-scan-light {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    animation: hsr-scan 3s ease-in-out infinite;
  }
}

@keyframes hsr-scan {
  0% { left: -100%; }
  100% { left: 200%; }
}

// 悬浮上升 - 卡片hover
.hsr-float {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
}

// 粒子背景
.hsr-particles-bg {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.15), transparent),
      radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.1), transparent),
      radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.12), transparent),
      radial-gradient(2px 2px at 60% 10%, rgba(168, 85, 247, 0.1), transparent),
      radial-gradient(2px 2px at 90% 70%, rgba(56, 189, 248, 0.08), transparent);
    pointer-events: none;
  }
}
```

---

### 阶段五：图表与数据可视化改造（1周）

#### 3.5.1 AntV G2 主题配置

```typescript
// src/theme/hsr-g2-theme.ts
import { registerTheme } from '@antv/g2';

registerTheme('hsr-dark', {
  background: '#0B0E17',
  defaultColor: '#A855F7', // 量子紫
  paletteQualitative10: [
    '#A855F7', '#38BDF8', '#F59E0B', '#F97316',
    '#22C55E', '#EF4444', '#C9A96E', '#8B5CF6',
    '#EC4899', '#14B8A6',
  ],
  paletteQualitative20: [
    '#A855F7', '#C084FC', '#38BDF8', '#7DD3FC',
    '#F59E0B', '#FCD34D', '#F97316', '#FB923C',
    '#22C55E', '#4ADE80', '#EF4444', '#F87171',
    '#C9A96E', '#E8D5A3', '#8B5CF6', '#A78BFA',
    '#EC4899', '#F472B6', '#14B8A6', '#5EEAD4',
  ],
  axis: {
    line: { style: { stroke: '#2A3040' } },
    grid: { line: { style: { stroke: 'rgba(42, 48, 64, 0.5)', lineDash: [4, 4] } } },
    label: { style: { fill: '#5A6380', fontSize: 12, fontFamily: 'Noto Sans SC' } },
    title: { style: { fill: '#8B92A8', fontSize: 12, fontFamily: 'Noto Sans SC' } },
  },
  legend: {
    itemName: { style: { fill: '#8B92A8', fontSize: 12, fontFamily: 'Noto Sans SC' } },
  },
  tooltip: {
    domStyles: {
      'g2-tooltip': {
        background: 'rgba(20, 24, 36, 0.95)',
        border: '1px solid rgba(42, 48, 64, 0.8)',
        borderRadius: '8px',
        color: '#E8ECF1',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
      },
    },
  },
  label: {
    style: { fill: '#D0D8E8', fontSize: 11, fontFamily: 'Noto Sans SC' },
  },
  innerLabel: {
    style: { fill: '#0B0E17', fontSize: 11, fontFamily: 'Noto Sans SC' },
  },
});
```

---

## 四、崩铁 vs 绝区零 改造策略对比

| 改造维度 | 绝区零方案 | 崩铁方案 |
|----------|-----------|---------|
| **主题文件** | `zzz-theme.ts` | `hsr-theme.ts` |
| **组件前缀** | `ZZZ` | `HSR` |
| **背景色** | `#0A0A0F` 纯黑 | `#0B0E17` 深空蓝 |
| **主强调色** | `#FF6B35` 霓虹橙 | `#A855F7` 量子紫 |
| **字体策略** | 标题超粗/正文常规，多字体 | **全游戏统一黑体**，只用字号区分 |
| **边框风格** | 异形切割、霓虹发光 | 圆角+星轨金线、毛玻璃 |
| **装饰元素** | 故障艺术、扫描线、胶带 | 星芒、粒子、渐变光带、角色立绘 |
| **动效** | 冲击帧、Glitch、快启动 | 流畅缓动、呼吸光、数值跳动 |
| **按钮** | 异形切割、故障hover | 圆润、属性色渐变、光效扩散 |
| **卡片** | 直角切割、扫描线 | 圆角、玻璃拟态、角标星芒 |
| **信息密度** | 较低 | 较高（更适合作中后台） |
| **情绪** | 躁动街头 | 浪漫星际 |

---

## 五、项目文件改造清单

### 5.1 新增文件

```
apps/web-antdv-next/src/
├── theme/
│   ├── hsr-theme.ts          # AntDV 主题变量
│   └── hsr-g2-theme.ts       # G2 图表主题
├── styles/
│   ├── hsr-global.scss       # 全局样式
│   ├── hsr-table.scss        # 表格覆盖
│   ├── hsr-menu.scss         # 菜单覆盖
│   └── hsr-animations.scss   # 动画定义
├── components/hsr/
│   ├── HSRButton.vue         # 按钮（属性色主题）
│   ├── HSRCard.vue           # 卡片（玻璃拟态+星轨）
│   ├── HSRNumber.vue         # 数值跳动
│   ├── HSRBadge.vue          # 徽章（属性色）
│   ├── HSRTag.vue            # 标签
│   ├── HSRModal.vue          # 弹窗
│   ├── HSRInput.vue          # 输入框
│   └── HSRSelect.vue         # 选择器
├── composables/
│   └── useBreathing.ts       # 呼吸光效组合式函数
└── views/
    └── login/
        └── index.vue         # 重写登录页（宇宙星空主题）
```

### 5.2 修改文件

```
apps/web-antdv-next/
├── vite.config.ts            # 添加字体配置
├── main.ts                   # 注入主题
├── src/layouts/              # 布局改造（玻璃拟态侧边栏）
├── src/views/                # 各页面逐步替换组件
└── src/styles/index.scss     # 引入hsr全局样式
```

---

## 六、依赖安装

```bash
cd fastapi-best-architecture-ui

# 安装动画库
pnpm add gsap --filter @vben/web-antdv-next

# 安装字体（可选）
pnpm add @fontsource-variable/noto-sans-sc --filter @vben/web-antdv-next

# 如需 DIN 风格数字字体
pnpm add @fontsource/roboto-mono --filter @vben/web-antdv-next
```

---

## 七、关键设计原则

### 7.1 字体策略（最重要！）
崩铁全游戏只用一套字体，**不区分标题/正文字体**，不依赖字重变化。这是其UI克制感的核心来源：citeweb_search:4#5
- 标题：通过**大字号** + **颜色对比**实现层级
- 正文：保持常规字号，确保可读性
- 数据：用等宽/类DIN字体增强科技感

### 7.2 色彩克制
- 背景保持深邃但不压抑（蓝紫倾向）
- 强调色使用"属性色"体系，有叙事逻辑
- 避免过多高饱和色同时出现

### 7.3 玻璃拟态适度使用
- 面板使用半透明+背景模糊，增加层次感
- 但不要过度，保持中后台的信息清晰度

### 7.4 动效克制
- 崩铁的动效比绝区零更柔和
- 避免故障/Glitch效果
- 重点在流畅过渡和微妙光效

---

## 八、参考资源

- **崩铁风格关键词**：星际科幻、太空歌剧、属性色、玻璃拟态、星轨、宇宙列车
- **配色灵感**：量子紫 `#A855F7`、虚数金 `#F59E0B`、冰蓝 `#38BDF8`、深空 `#0B0E17`、星轨金 `#C9A96E`
- **字体选择**：全站统一黑体（Noto Sans SC），数据用 Roboto Mono/DIN 风格
- **动效参考**：呼吸光效、数值跳动、粒子飘浮、流畅淡入
- **核心差异**：崩铁比绝区零更**克制**、更**精致**、更**浪漫**，更适合中后台系统的气质
