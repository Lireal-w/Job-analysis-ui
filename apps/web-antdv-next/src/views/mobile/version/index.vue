<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  AppVersionResult,
  CreateAppVersionParams,
  UpdateAppVersionParams,
} from '#/api';

import { computed, ref } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createAppVersionApi,
  deleteAppVersionApi,
  getAppVersionListApi,
  updateAppVersionApi,
  updateAppVersionStatusApi,
  uploadFileApi,
} from '#/api';

import { querySchema, useColumns, useFormSchema } from './data';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

const gridOptions: VxeTableGridOptions<AppVersionResult> = {
  rowConfig: {
    keyField: 'id',
  },
  checkboxConfig: {
    highlight: true,
  },
  height: 'auto',
  exportConfig: {},
  printConfig: {},
  toolbarConfig: {
    export: true,
    print: true,
    refresh: true,
    refreshOptions: {
      code: 'query',
    },
    custom: true,
    zoom: true,
  },
  columns: useColumns(onActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAppVersionListApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

// 文件上传状态
const uploading = ref(false);
const uploadedFileInfo = ref<{ name: string; url: string }>();

async function handleUploadFile(file: File): Promise<boolean> {
  uploading.value = true;
  try {
    const result = await uploadFileApi(file);
    formApi.setFieldValue('download_url', result.url);
    formApi.setFieldValue('apk_file_size', file.size);
    // 计算文件大小的可读格式
    const sizeStr =
      file.size < 1024
        ? `${file.size} B`
        : file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    uploadedFileInfo.value = { name: `${file.name} (${sizeStr})`, url: result.url };
    message.success('文件上传成功');
  } catch (error) {
    console.error(error);
    message.error('文件上传失败');
    return false;
  } finally {
    uploading.value = false;
  }
  // 返回 false 阻止 antdv 默认上传行为（已通过 uploadFileApi 手动上传）
  return false;
}

function onRefresh() {
  gridApi.query();
}

async function onActionClick({
  code,
  row,
}: OnActionClickParams<AppVersionResult>) {
  switch (code) {
    case 'delete': {
      gridApi.setLoading(true);
      try {
        await deleteAppVersionApi([row.id]);
        message.success({
          content: $t('ui.actionMessage.deleteSuccess', [row.version_name]),
          key: 'action_process_msg',
        });
        onRefresh();
      } finally {
        gridApi.setLoading(false);
      }
      break;
    }
    case 'edit': {
      modalApi.setData(row).open();
      break;
    }
    case 'toggle_status': {
      const newStatus =
        row.publish_status === 'published' ? 'draft' : 'published';
      try {
        await updateAppVersionStatusApi(row.id, newStatus as any);
        message.success($t('ui.actionMessage.operationSuccess'));
        onRefresh();
      } catch (error) {
        console.error(error);
      }
      break;
    }
  }
}

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useFormSchema(),
});

interface FormAppVersionParams extends CreateAppVersionParams {
  id?: number;
}

const formData = ref<FormAppVersionParams>();

const modalTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['App 版本'])
    : $t('ui.actionTitle.create', ['App 版本']);
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues<CreateAppVersionParams>();
      try {
        await (formData.value?.id
          ? updateAppVersionApi(formData.value.id, data as UpdateAppVersionParams)
          : createAppVersionApi(data));
        message.success($t('ui.actionMessage.operationSuccess'));
        await modalApi.close();
        await formApi.resetForm();
        onRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        modalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<FormAppVersionParams>();
      formApi.resetForm();
      formData.value = data ?? undefined;
      // 编辑模式下显示已有文件信息
      if (data?.download_url) {
        uploadedFileInfo.value = {
          name: data.download_url.split('/').pop() || '已上传文件',
          url: data.download_url,
        };
      } else {
        uploadedFileInfo.value = undefined;
      }
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton
          @click="
            () => {
              modalApi.setData(null).open();
            }
          "
        >
          <MaterialSymbolsAdd class="size-5" />
          添加版本
        </VbenButton>
      </template>
    </Grid>
    <Modal v-bind="$attrs" :title="modalTitle">
      <div class="px-4 pb-3">
        <div class="mb-1 text-sm font-medium text-foreground">
          APK/IPA 文件
        </div>
        <div class="flex items-center gap-3">
          <a-upload
            :accept="'.apk,.ipa,.aab,.zip'"
            :before-upload="handleUploadFile"
            :disabled="uploading"
            :show-upload-list="false"
          >
            <VbenButton :disabled="uploading" :loading="uploading" variant="outline">
              {{ uploading ? '上传中...' : '选择文件上传' }}
            </VbenButton>
          </a-upload>
          <span
            v-if="uploadedFileInfo"
            class="inline-flex items-center gap-1 text-xs text-green-600"
          >
            <span class="size-1.5 inline-block rounded-full bg-green-500" />
            {{ uploadedFileInfo.name }}
          </span>
        </div>
        <div v-if="uploadedFileInfo" class="mt-1 text-xs text-muted-foreground">
          下载链接: {{ uploadedFileInfo.url }}
        </div>
      </div>
      <Form />
    </Modal>
  </Page>
</template>
