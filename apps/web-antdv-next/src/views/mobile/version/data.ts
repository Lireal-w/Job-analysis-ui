import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { AppVersionResult } from '#/api';

import { $t } from '@vben/locales';

import { h } from 'vue';

import { Tag } from 'antdv-next';

import { PlatformType, PublishStatus } from '#/api';

/**
 * 平台类型映射
 */
const platformMap: Record<string, { label: string; color: string }> = {
  [PlatformType.IOS]: { label: 'iOS', color: 'cyan' },
  [PlatformType.ANDROID]: { label: 'Android', color: 'green' },
};

/**
 * 发布状态映射
 */
const publishStatusMap: Record<string, { label: string; color: string }> = {
  [PublishStatus.DRAFT]: { label: '草稿', color: 'default' },
  [PublishStatus.PUBLISHED]: { label: '已发布', color: 'success' },
  [PublishStatus.ARCHIVED]: { label: '已归档', color: 'warning' },
};

export function getPlatformLabel(platform: string): string {
  return platformMap[platform]?.label ?? platform;
}

export function getPublishStatusLabel(status: string): string {
  return publishStatusMap[status]?.label ?? status;
}

/**
 * 查询表单
 */
export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'app_name',
    label: '应用名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: [
        { label: 'iOS', value: PlatformType.IOS },
        { label: 'Android', value: PlatformType.ANDROID },
      ],
    },
    fieldName: 'platform',
    label: '平台',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: [
        { label: '草稿', value: PublishStatus.DRAFT },
        { label: '已发布', value: PublishStatus.PUBLISHED },
        { label: '已归档', value: PublishStatus.ARCHIVED },
      ],
    },
    fieldName: 'publish_status',
    label: '发布状态',
  },
];

/**
 * 表格列配置
 */
export function useColumns(
  onActionClick?: OnActionClickFn<AppVersionResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      fixed: 'left',
      width: 50,
    },
    {
      field: 'app_name',
      title: '应用名称',
      width: 120,
    },
    {
      field: 'platform',
      title: '平台',
      width: 90,
      formatter({ cellValue }) {
        const info = platformMap[cellValue];
        return info
          ? h(Tag, { color: info.color }, () => info.label)
          : cellValue;
      },
    },
    {
      field: 'version_name',
      title: '版本名称',
      width: 100,
    },
    {
      field: 'version_code',
      title: '版本号',
      width: 80,
    },
    {
      field: 'changelog',
      title: '更新日志',
      width: 200,
      showOverflow: 'ellipsis',
    },
    {
      field: 'download_url',
      title: '下载链接',
      width: 150,
      showOverflow: 'ellipsis',
      formatter({ cellValue }) {
        return cellValue || '暂无';
      },
    },
    {
      field: 'apk_file_size',
      title: '文件大小',
      width: 100,
      formatter({ cellValue }) {
        if (!cellValue) return '暂无';
        const size = Number(cellValue);
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      field: 'force_update',
      title: '强制更新',
      width: 80,
      formatter({ cellValue }) {
        return cellValue
          ? h(Tag, { color: 'red' }, () => '是')
          : h(Tag, { color: 'default' }, () => '否');
      },
    },
    {
      field: 'publish_status',
      title: '发布状态',
      width: 90,
      formatter({ cellValue }) {
        const info = publishStatusMap[cellValue];
        return info
          ? h(Tag, { color: info.color }, () => info.label)
          : cellValue;
      },
    },
    {
      field: 'download_count',
      title: '下载次数',
      width: 80,
    },
    {
      field: 'created_time',
      title: '创建时间',
      width: 168,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 150,
      cellRender: {
        attrs: {
          nameField: 'version_name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'toggle_status',
            text: '切换状态',
          },
          'delete',
        ],
      },
    },
  ];
}

/**
 * 创建/编辑表单
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'app_name',
      label: '应用名称',
      rules: 'required',
      formItemProps: {
        help: '例如: FBA、FBA-企业版',
      },
    },
    {
      component: 'Input',
      fieldName: 'bundle_id',
      label: '包名/Bundle ID',
      rules: 'required',
      formItemProps: {
        help: '例如: com.example.app',
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: [
          { label: 'iOS', value: PlatformType.IOS },
          { label: 'Android', value: PlatformType.ANDROID },
        ],
      },
      fieldName: 'platform',
      label: '平台',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'version_name',
      label: '版本名称',
      rules: 'required',
      formItemProps: {
        help: '例如: 1.0.0',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'version_code',
      label: '版本号',
      rules: 'required',
      formItemProps: {
        help: '正整数，用于版本比较',
      },
      componentProps: {
        class: 'w-full',
        min: 1,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'min_version_code',
      label: '最低兼容版本号',
      componentProps: {
        class: 'w-full',
        min: 1,
      },
      formItemProps: {
        help: '低于此版本的 App 将被提示更新',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'changelog',
      label: '更新日志',
      componentProps: {
        rows: 3,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: [
          { label: '草稿', value: PublishStatus.DRAFT },
          { label: '已发布', value: PublishStatus.PUBLISHED },
          { label: '已归档', value: PublishStatus.ARCHIVED },
        ],
      },
      fieldName: 'publish_status',
      label: '发布状态',
    },
    {
      component: 'Switch',
      fieldName: 'force_update',
      label: '强制更新',
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        rows: 2,
      },
    },
  ];
}
