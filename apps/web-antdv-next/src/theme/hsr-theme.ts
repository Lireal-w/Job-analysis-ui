import type { ThemeConfig } from 'antdv-next/es/config-provider';

/**
 * 崩坏：星穹铁道风格 Ant Design Vue 主题 Token 配置
 */
export const hsrTheme: ThemeConfig = {
  token: {
    // 主色 - 量子紫
    colorPrimary: '#A855F7',
    colorSuccess: '#22C55E',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#38BDF8',

    // 背景 - 深空宇宙
    colorBgBase: '#0B0E17',
    colorBgContainer: '#141824',
    colorBgElevated: '#1A2030',
    colorBgSpotlight: '#1E2538',

    // 文字 - 星尘白/灰
    colorTextBase: '#E8ECF1',
    colorTextSecondary: '#8B92A8',
    colorTextTertiary: '#5A6380',
    colorTextQuaternary: '#3A4560',

    // 边框 - 星轨
    colorBorder: '#2A3040',
    colorBorderSecondary: '#1E2330',

    // 圆角 - 偏圆润
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,
    borderRadiusXS: 4,
  },
};
