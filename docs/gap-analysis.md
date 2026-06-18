# 项目差距分析报告

> 生成日期: 2026-06-19
> 基于项目全面审查与 Swagger API 文档 (OAS 3.1) 对比

---

## 总体状态

| 维度 | 状态 |
|------|------|
| API 层 (21 个模块) | ✅ 全部实现真实后端接口 |
| 视图页面 (20+ 个) | ✅ 全部对应路由且编译通过 |
| 路由配置 | ✅ 全部到位 |
| 国际化 | ⚠️ 部分 key 缺失 |
| 暗黑模式 | ⚠️ 部分页面需适配 |
| Mock 数据 | ⚠️ 1 处残留 |
| 测试覆盖 | ❌ 空白 |

---

## 🔴 P0 — 严重问题

### 1. 采集分析页面仍使用 Mock 数据

**文件**: `views/crawler/analysis/index.vue` + `views/crawler/analysis/data.ts`

**问题**: 完全使用静态 Mock 数据，未对接后端 API。

**Swagger 可用接口**:
- `GET /api/v1/sys/crawl-tasks/dashboard` — 采集任务仪表盘统计
- `GET /api/v1/sys/crawl-tasks/{pk}/logs` — 获取采集任务日志列表
- `GET /api/v1/sys/crawl-tasks/logs/{log_id}` — 获取采集任务日志详情

---

## 🟠 P1 — 重要改进

### 2. API 路径规范统一检查

已修复 `datasource.ts`（单复数不一致）和 `crawl-task.ts`（下划线 vs 连字符），但需全面排查剩余 API 文件。

| 规范 | 后端要求 | 风险文件 |
|------|---------|---------|
| 资源名复数 | `datasources`, `data-flows` | 全部 API 文件 |
| 多单词用连字符 `-` | `crawl-tasks`, `data-flows` | 全部 API 文件 |

### 3. 国际化 key 缺失

`page.json` 中缺少部分路由的翻译 key：

- `page.demos.title` — 演示
- `page.demos.antd` — Ant Design 演示
- `page.vben.document` — 项目文档
- `page.vben.github` — GitHub

### 4. 暗黑模式硬编码颜色

除已修复的 `dataset/index.vue` 外，其他页面可能存在 `bg-white`、`text-gray-600` 等硬编码颜色。
- 全局搜索 `bg-white`、`bg-gray-50`、`text-gray-600`、`text-gray-700`、`border-gray-200`
- 统一替换为 Tailwind `dark:` 变体或使用 CSS 变量（`--bg-card`、`--border` 等）

---

## 🟡 P2 — 中等优先级

### 5. ETL 流程编辑器增强

| 功能 | 说明 |
|------|------|
| 节点删除与撤销 | Delete 键删除选中节点，Ctrl+Z 撤销 |
| 边标签 | 边上显示连线名称（如流转条件） |
| 迷你地图 | `@antv/x6-plugin-minimap` 便于导航 |
| 节点状态 | 根据运行记录显示成功/失败状态 |
| 多选与框选 | 启用 Selection 插件 |

### 6. 数据加载状态骨架屏

多数页面仅有简单文字提示，建议统一使用骨架屏组件。

### 7. 操作栏按钮宽度一致性

| 页面 | 操作列宽度 |
|------|-----------|
| `etl/flow/data.ts` | 340px |
| `crawler/management/data.ts` | 250px |

建议统一为 `280px` 或动态计算。

### 8. ETL 创建表单优化

`nodes` 和 `edges` 为 JSON 文本输入框难以手动填写，建议：
- 简化创建表单，仅保留名称和描述
- 节点和边在编辑器中自动初始化

---

## 🔵 P3 — 长期优化

### 9. E2E 测试
使用 Playwright 对核心页面添加冒烟测试。

### 10. 类型安全
部分 `Record<string, any>` 应提取为强类型接口。

### 11. 错误监控
在 `request.ts` 中接入前端错误监控/上报。

### 12. 清理遗留文件
检查并删除不再使用的演示文件。

---

## Swagger API 覆盖矩阵

| 标签 | API 端点 | 前端 API 文件 | 状态 |
|------|---------|--------------|------|
| 授权 | `/api/v1/auth/*` | — | 内置 |
| 验证码 | `/api/v1/auth/captcha` | — | 内置 |
| 系统数据权限 | `/api/v1/sys/permissions/*` | `data-permission.ts` | ✅ |
| 系统采集任务管理 | `/api/v1/sys/crawl-tasks/*` | `crawl-task.ts` | ✅ |
| 系统部门 | `/api/v1/sys/depts/*` | `dept.ts` | ✅ |
| 系统菜单 | `/api/v1/sys/menus/*` | `core/index.ts` 等 | ✅ |
| 系统查询引擎 | `/api/v1/sys/query/*` | `query.ts` | ✅ |
| 系统报表管理 | `/api/v1/sys/reports/*` | `report.ts` | ✅ |
| 系统角色 | `/api/v1/sys/roles/*` | `role.ts` | ✅ |
| 系统用户 | `/api/v1/sys/users/*` | `core/index.ts` 等 | ✅ |
| 系统数据质量管理 | `/api/v1/sys/data-quality/*` | `quality.ts` | ✅ |
| 系统数据规则 | `/api/v1/sys/data-rules/*` | `data-permission.ts` | ✅ |
| 系统数据范围 | `/api/v1/sys/data-scopes/*` | `data-permission.ts` | ✅ |
| 系统文件 | `/api/v1/sys/files/upload` | — | 待实现 |
| 系统数据流管理 | `/api/v1/sys/data-flows/*` | `data-flow.ts` | ✅ |
| 系统数据存储管理 | `/api/v1/sys/data-storage/*` | `dataset.ts` | ✅ |
| 系统数据源管理 | `/api/v1/sys/datasources/*` | `datasource.ts` | ✅ |
| 系统服务器管理 | `/api/v1/sys/servers/*` | `server.ts` | ✅ |
