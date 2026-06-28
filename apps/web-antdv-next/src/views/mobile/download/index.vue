<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { getLatestAppVersionApi } from '#/api/app-version';

/** 平台定义 */
const PLATFORMS = [
  { value: 0, label: 'Android', icon: '📱', suffix: '.apk' },
  { value: 1, label: 'iOS', icon: '📲', suffix: '.ipa' },
  { value: 2, label: 'HarmonyOS', icon: '📟', suffix: '.apk' },
];

interface AppVersion {
  id: number;
  app_name: string;
  version_name: string;
  version_code: number;
  platform: number;
  changelog: string | null;
  download_url: string | null;
  download_count: number;
  apk_file_size: number;
  force_update: boolean;
  publish_status: string;
}

const currentPlatform = ref(0);
const version = ref<AppVersion | null>(null);
const loading = ref(false);
const hasMore = ref(false);
const allVersions = ref<{ [key: number]: AppVersion | null }>({});

const platformInfo = computed(() =>
  PLATFORMS.find((p) => p.value === currentPlatform.value),
);

const formattedSize = computed(() => {
  if (!version.value?.apk_file_size) return '';
  const size = version.value.apk_file_size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
});

async function loadVersion(platform: number) {
  if (allVersions.value[platform]) {
    version.value = allVersions.value[platform];
    return;
  }

  loading.value = true;
  try {
    const res: any = await getLatestAppVersionApi();
    // API returns data directly or wrapped in { data }
    const data = res?.data || res;
    if (data && data.platform === platform) {
      allVersions.value[platform] = data;
      version.value = data;
    } else {
      version.value = null;
    }
  } catch (e) {
    if (platform === currentPlatform.value) {
      version.value = null;
    }
  } finally {
    loading.value = false;
  }
}

function switchPlatform(platform: number) {
  currentPlatform.value = platform;
  loadVersion(platform);
}

function handleDownload() {
  if (!version.value?.download_url) {
    message.warning('当前版本暂无下载链接');
    return;
  }
  window.open(version.value.download_url, '_blank');
}

onMounted(() => {
  loadVersion(0);
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex flex-col items-center justify-center py-12">
      <!-- 标题区 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold">下载 App</h1>
        <p class="mt-2 text-[var(--text-tertiary)]">
          选择您的设备平台，获取最新版本
        </p>
      </div>

      <!-- 平台选择 -->
      <div class="mb-8 flex gap-4">
        <div
          v-for="p in PLATFORMS"
          :key="p.value"
          class="flex cursor-pointer flex-col items-center rounded-xl border-2 px-8 py-5 transition-all hover:shadow-lg"
          :class="{
            'border-[var(--color-primary)] bg-[var(--color-primary-bg)]':
              currentPlatform === p.value,
            'border-[var(--border)]': currentPlatform !== p.value,
          }"
          @click="switchPlatform(p.value)"
        >
          <span class="text-4xl">{{ p.icon }}</span>
          <span class="mt-2 font-medium">{{ p.label }}</span>
        </div>
      </div>

      <!-- 版本信息 -->
      <div
        class="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
      >
        <div v-if="loading" class="py-8 text-center text-[var(--text-tertiary)]">
          加载中...
        </div>

        <div v-else-if="!version" class="py-8 text-center text-[var(--text-tertiary)]">
          暂无 {{ platformInfo?.label }} 版本
        </div>

        <template v-else>
          <!-- 版本头 -->
          <div class="mb-4 flex items-center justify-between">
            <div>
              <span class="text-lg font-bold">{{ version.app_name }}</span>
              <span class="ml-2 rounded bg-[var(--color-primary-bg)] px-2 py-0.5 text-sm text-[var(--color-primary)]">
                v{{ version.version_name }}
              </span>
              <span class="ml-1 text-xs text-[var(--text-tertiary)]">
                (build {{ version.version_code }})
              </span>
            </div>
            <span v-if="version.force_update" class="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
              强制更新
            </span>
          </div>

          <!-- 详情 -->
          <div class="mb-4 space-y-1 text-sm text-[var(--text-tertiary)]">
            <div class="flex justify-between">
              <span>文件大小</span>
              <span class="font-medium text-[var(--text)]">{{ formattedSize }}</span>
            </div>
            <div class="flex justify-between">
              <span>下载次数</span>
              <span class="font-medium text-[var(--text)]">{{ version.download_count }}</span>
            </div>
            <div class="flex justify-between">
              <span>平台</span>
              <span class="font-medium text-[var(--text)]">{{ PLATFORMS.find((p) => p.value === version.platform)?.label }}</span>
            </div>
          </div>

          <!-- 更新日志 -->
          <div v-if="version.changelog" class="mb-6">
            <h4 class="mb-2 text-sm font-medium">更新日志</h4>
            <div
              class="whitespace-pre-wrap rounded-lg bg-[var(--bg-muted)] p-3 text-sm leading-relaxed text-[var(--text-secondary)]"
            >
              {{ version.changelog }}
            </div>
          </div>

          <!-- 下载按钮 -->
          <VbenButton
            class="w-full"
            size="large"
            :disabled="!version.download_url"
            @click="handleDownload"
          >
            <template #icon>
              <span class="text-lg">⬇</span>
            </template>
            下载 {{ platformInfo?.suffix }} 文件
          </VbenButton>
          <p v-if="!version.download_url" class="mt-2 text-center text-xs text-[var(--text-tertiary)]">
            暂无下载文件，请联系管理员上传
          </p>
        </template>
      </div>

      <!-- 底部 -->
      <p class="mt-8 text-xs text-[var(--text-tertiary)]">
        请下载官方渠道发布的 App 安装包，确保安全可靠
      </p>
    </div>
  </Page>
</template>
