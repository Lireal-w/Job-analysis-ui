/**
 * 绝区零风格 Ant Design Vue 主题 Token 配置
 *
 * 这些 token 通过 useAntdDesignTokens 从 CSS 变量自动映射，
 * 此处为直接指定 AntDV 主题算法的补充配置。
 */
import type { ThemeConfig } from 'antdv-next/es/config-provider';

export const zzzTheme: ThemeConfig = {
  token: {
    // 主色
    colorPrimary: '#FF6B35',
    colorSuccess: '#00E5A0',
    colorWarning: '#FFD93D',
    colorError: '#FF2D55',
    colorInfo: '#00D4AA',

    // 背景
    colorBgBase: '#0A0A0F',
    colorBgContainer: '#14141C',
    colorBgElevated: '#1A1A24',
    colorBgSpotlight: '#222230',

    // 文字
    colorTextBase: '#E8E8EC',
    colorTextSecondary: '#8B8B9A',
    colorTextTertiary: '#5A5A6A',
    colorTextQuaternary: '#3A3A4A',

    // 边框
    colorBorder: '#2A2A3A',
    colorBorderSecondary: '#1F1F2E',

    // 圆角 - 硬朗风格
    borderRadius: 4,
    borderRadiusSM: 2,
    borderRadiusLG: 6,
    borderRadiusXS: 0,
  },
};

/**
 * 绝区零风格 AntV G2 图表主题
 */
export const zzzG2Theme = {
  background: '#0A0A0F',
  defaultColor: '#FF6B35',
  paletteQualitative10: [
    '#FF6B35', '#00D4AA', '#FF2D55', '#FFD93D',
    '#9B59B6', '#3498DB', '#E74C3C', '#1ABC9C',
    '#F39C12', '#ECF0F1',
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
};
