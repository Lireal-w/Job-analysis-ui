# FBA UI — FastAPI Best Architecture 前端

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Ant Design Vue](https://img.shields.io/badge/AntDV-4.x-1677ff.svg)](https://next.antdv.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 项目简介

FBA UI 是基于 **Vue 3 + TypeScript + Vite** 构建的企业级数据中台前端管理系统，基于 [Vben Admin v5](https://vben.pro/) 框架二次开发。为数据采集、加工、分析和管理提供一站式可视化操作界面。

**核心能力**：
- 🗄️ **数据源管理** — 多类型数据源（MySQL、PostgreSQL、ClickHouse 等）的注册与连接管理
- 🗃️ **数据集管理** — 数据分层存储、Schema 管理、生命周期管理
- ⚙️ **ETL 数据加工** — 可视化拖拽式流程编排编辑器（基于 AntV X6）
- 🕷️ **爬虫任务管理** — 分布式采集任务的创建、调度、监控与日志追踪
- 🔍 **查询分析** — 可视化 SQL 查询构建器与查询历史管理
- 📋 **可视化报表** — 报表设计、组件编排与预览导出
- ✅ **数据质量管理** — 质量规则配置、检查执行与结果追踪
- ⏰ **任务调度** — 定时任务管理、Cron 表达式构建、执行记录追踪
- 🔐 **权限管理** — 基于 RBAC 的用户、角色、菜单、数据权限控制
- 📊 **岗位数据分析** — 职位分布、薪资趋势、技能词频等图表展示
- 🌙 **暗色主题** — 支持明/暗主题切换

## 🔧 技术栈

| 技术 | 说明 |
|------|------|
| **Vue 3** + **TypeScript** | 渐进式 JavaScript 框架，类型安全 |
| **Vite 5** | 极速的前端构建工具 |
| **Ant Design Vue 4.x** | UI 组件库 |
| **Vben Admin 5.x** | 后台管理框架（Monorepo 架构） |
| **Pinia** | Vue 3 官方状态管理 |
| **Vue Router** | 官方路由管理（后端动态路由模式） |
| **Vxe-Table** | 企业级表格组件 |
| **AntV X6** | 流程图编辑引擎（ETL 流程编排） |
| **AntV G2** | 数据可视化图表 |
| **pnpm + Turborepo** | Monorepo 包管理 |

## 📁 项目结构

```
fba-ui/
├── apps/
│   └── web-antdv-next/          # 主应用（Ant Design Vue Next）
│       └── src/
│           ├── api/             # API 接口定义（21 个模块）
│           ├── layouts/         # 布局组件
│           ├── locales/         # 国际化（zh-CN / en-US）
│           ├── router/          # 路由配置与守卫
│           │   ├── routes/
│           │   │   └── modules/ # 菜单路由模块（19 个模块）
│           │   ├── guard.ts     # 通用/权限/WebSocket 守卫
│           │   └── access.ts    # 动态路由生成（后端模式）
│           ├── views/           # 页面视图（20+ 页面）
│           │   ├── crawler/     # 爬虫管理
│           │   ├── etl/         # 数据加工（含流程编辑器）
│           │   ├── system/      # 系统管理
│           │   ├── dataset/     # 数据集管理
│           │   ├── datasource/  # 数据源管理
│           │   └── ...          # 其他模块
│           ├── adapter/         # 表单/表格适配层
│           ├── store/           # 全局状态
│           └── plugins/         # 插件
├── internal/                    # 内部工具包（ESLint、Stylelint、TSConfig 等）
├── packages/                    # 共享包（icons、locales、styles、utils 等）
│   ├── @core/                  # 核心 UI Kit
│   ├── effects/                # 业务逻辑（access、layouts、request 等）
│   ├── icons/                  # 图标库（Iconify + SVG）
│   ├── locales/                # 国际化
│   ├── preferences/            # 偏好配置
│   ├── stores/                 # Pinia 状态
│   └── utils/                  # 工具函数
├── scripts/                    # 构建与部署脚本
├── docs/                       # 项目文档
│   └── gap-analysis.md         # 差距分析报告
├── turbo.json                  # Turborepo 配置
└── package.json                # Monorepo 根配置
```

## 🎨 功能模块

### 1. 数据源管理
- 多类型数据源注册（MySQL、PostgreSQL、ClickHouse 等）
- 连接测试与状态监控
- 数据源分类与搜索

### 2. 数据集管理
- 分层存储管理（ODS、DWD、DWS、ADS）
- 数据集 Schema 定义与编辑
- 生命周期与存储策略配置

### 3. ETL 数据加工（流程编排）
- 可视化拖拽式流程编辑器（基于 **AntV X6**）
- 支持 8 种节点：数据库输入、API 输入、字段映射、数据过滤、聚合、合并、数据库输出、文件输出
- 节点配置面板（支持动态数据源选择）
- 自动布局、保存、发布、运行

### 4. 爬虫任务管理
- 爬虫目录管理 — 任务列表、启停控制（支持 CRUD + 启动/停止/触发器）
- 采集分析 — 仪表盘统计（成功/失败率）、任务运行日志追踪

### 5. 查询分析
- 可视化 SQL 查询构建器
- 查询历史记录与保存
- 结果数据导出

### 6. 可视化报表
- 报表列表与分类管理
- 报表设计器（组件拖拽编排）
- 报表预览与导出

### 7. 数据质量管理
- 质量规则配置（字段级规则）
- 规则执行与检查记录追踪
- 异常数据告警

### 8. 任务调度
- Cron 表达式可视化构建
- 定时任务管理与执行记录
- 失败重试与告警

### 9. 系统管理
- **用户管理** — 账号 CRUD、角色分配、状态管理
- **角色管理** — RBAC 角色定义、菜单/权限分配
- **菜单管理** — 动态菜单树配置与可视化编辑
- **部门管理** — 组织架构树
- **数据权限** — 数据范围与数据规则配置
- **插件管理** — 系统插件注册与管理

### 10. 系统监控与日志
- **在线用户** — 实时在线用户监控
- **Redis 监控** — 缓存服务状态
- **服务器监控** — CPU、内存、磁盘
- **审计日志** — 操作审计与追溯
- **登录日志** — 登录历史记录

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.x（推荐 20.x）
- **pnpm** >= 9.x
- **Docker**（可选，用于容器化部署）

### 1. 安装

```bash
# 克隆项目
git clone https://gitee.com/Lireal-W/fastapi-best-architecture-ui.git
cd fastapi-best-architecture-ui

# 安装依赖
pnpm install
```

### 2. 配置环境变量

```bash
# 复制环境变量配置
cp apps/web-antdv-next/.env.example apps/web-antdv-next/.env
```

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. 启动开发服务器

```bash
# 启动 web-antdv-next 应用
pnpm --filter @vben/web-antdv-next dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 4. 生产构建

```bash
pnpm build
```

### 5. 启动后端（Docker）

```bash
docker-compose up -d
```

后端 API 文档：[http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 📖 页面路由

| 菜单 | 路由 | 页面说明 |
|------|------|----------|
| **数据加工** | `/etl/flow` | 流程编排列表 |
| | `/etl/flow/editor/:id` | ⚡ 流程编辑器（AntV X6） |
| **爬虫管理** | `/crawler/management` | 爬虫目录 |
| | `/crawler/analysis` | 采集分析 |
| **数据资产** | `/dataset/management` | 数据集管理 |
| **数据源管理** | `/datasource/management` | 数据源配置 |
| **可视化报表** | `/report/list` | 报表列表 |
| | `/report/designer/:id?` | 报表设计器 |
| **查询分析** | `/query/builder` | 查询构建器 |
| **数据质量** | `/quality/rules` | 质量规则 |
| **任务调度** | `/scheduler/manage` | 任务管理 |
| | `/scheduler/record` | 执行记录 |
| **系统管理** | `/system/dept` | 部门管理 |
| | `/system/user` | 用户管理 |
| | `/system/role` | 角色管理 |
| | `/system/menu` | 菜单管理 |
| | `/system/data-scope` | 数据范围 |
| | `/system/data-rule` | 数据规则 |
| | `/system/plugin` | 插件管理 |
| **权限管理** | `/permission/management` | 权限配置 |
| **日志管理** | `/log/login` | 登录日志 |
| | `/log/opera` | 操作日志 |
| **系统监控** | `/monitor/online` | 在线用户 |
| | `/monitor/redis` | Redis 监控 |
| | `/monitor/server` | 服务器监控 |
| **告警管理** | `/alert/management` | 告警配置 |
| **审计日志** | `/audit-log/list` | 日志列表 |
| **岗位数据分析** | `/job-dashboard` | 岗位数据分析 |
| **仪表盘** | `/analytics` | 分析页 |
| | `/workspace` | 工作台 |
| **个人中心** | `/profile` | 个人信息 |

> 以上共 **20 个菜单模块，36+ 个页面**。

## 🗄️ 后端 API 覆盖

前端通过 Axios 与后端 FastAPI 服务交互，完整覆盖以下 API 模块（详见解剖报告 `docs/gap-analysis.md`）：

| 标签 | 端点前缀 | 状态 |
|------|---------|------|
| 系统数据源管理 | `/api/v1/sys/datasources/*` | ✅ |
| 系统数据存储管理 | `/api/v1/sys/data-storage/*` | ✅ |
| 系统数据流管理 | `/api/v1/sys/data-flows/*` | ✅ |
| 系统采集任务管理 | `/api/v1/sys/crawl-tasks/*` | ✅ |
| 系统数据范围/规则 | `/api/v1/sys/data-scopes/*` | ✅ |
| 系统数据质量管理 | `/api/v1/sys/data-quality/*` | ✅ |
| 系统查询引擎 | `/api/v1/sys/query/*` | ✅ |
| 系统报表管理 | `/api/v1/sys/reports/*` | ✅ |
| 角色/用户/部门/菜单 | `/api/v1/sys/{roles,users,depts,menus}/*` | ✅ |
| 系统服务器管理等 | ... | ✅ |

## 🧱 依赖安装参考

```bash
# ETL 流程编辑器
pnpm add @antv/x6 @antv/x6-vue-shape --filter @vben/web-antdv-next
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request。提交前请确保：
1. 代码通过 ESLint / Prettier 检查
2. 添加必要的类型声明
3. 如需扩展 API，同步更新 `api/` 对应文件

## 📄 License

[MIT License](LICENSE)

## 🔗 相关项目

- **后端服务**：[FastAPI Best Architecture](https://github.com/fastapi-practices/fastapi-best-architecture)
- **前端框架**：[Vben Admin v5](https://github.com/vbenjs/vue-vben-admin)
- **流程图引擎**：[AntV X6](https://x6.antv.antgroup.com/)