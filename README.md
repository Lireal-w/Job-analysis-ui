# Job Analysis UI — 求职情报分析平台前端

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 项目简介

Job Analysis UI 是求职情报分析平台的**前端可视化管理系统**，基于 **Vue 3 + TypeScript + Vite** 构建，为职位数据采集、管理和分析提供直观、高效的 Web 操作界面。

**核心能力**：
- 📊 **数据可视化大屏**：职位分布、薪资趋势、技能词频等图表展示
- 🔍 **职位管理**：职位列表展示、多条件筛选、详情查看
- 🤖 **爬虫任务管理**：一键启动采集任务、实时查看任务执行状态
- 📈 **统计仪表盘**：多维度数据分析报表
- 🔐 **用户权限管理**：基于 RBAC 的角色权限控制
- 🌙 **暗色主题**：支持明/暗主题切换

## 🔧 技术栈

| 技术 | 说明 |
|------|------|
| **Vue 3** | 渐进式 JavaScript 框架 |
| **TypeScript** | 类型安全的 JavaScript 超集 |
| **Vite** | 极速的前端构建工具 |
| **Ant Design Vue / Vben Admin** | UI 组件库与后台管理框架 |
| **Pinia** | Vue 3 官方状态管理库 |
| **Vue Router** | 官方路由管理器 |
| **Axios** | HTTP 客户端 |
| **ECharts** | 数据可视化图表库 |

## 📁 项目结构

```
Job-analysis-ui/
├── apps/
│   └── web-antd/              # 主应用（基于 Ant Design Vue）
│       ├── src/
│       │   ├── api/           # API 接口定义
│       │   ├── components/    # 公共组件
│       │   ├── layouts/       # 布局组件
│       │   ├── pages/         # 页面组件
│       │   ├── router/        # 路由配置
│       │   ├── store/         # Pinia 状态管理
│       │   ├── utils/         # 工具函数
│       │   └── views/         # 视图页面
│       └── index.html
├── internal/                  # 内部工具包
├── packages/                  # 共享包
├── scripts/                   # 构建脚本
└── package.json
```

## 🎨 功能模块

### 1. 职位管理模块
- 职位列表展示（支持分页）
- 多维度筛选（薪资范围、工作地点、学历要求）
- 职位详情查看
- 职位数据导出

### 2. 爬虫任务模块
- 手动触发采集任务
- 任务状态实时追踪（PENDING → RUNNING → SUCCESS/FAILURE）
- 任务执行历史记录
- 定时任务配置（每日自动采集）

### 3. 数据分析模块
- 薪资分布统计图表
- 技能关键词词云
- 职位数量趋势分析
- 城市/行业分布对比

### 4. 系统管理模块
- 用户管理
- 角色权限配置
- 系统日志查看
- 监控面板（集成 Grafana）

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Lireal-w/Job-analysis-ui.git
cd Job-analysis-ui
```

### 2. 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量配置文件
cp .env.example .env
```

`.env` 配置示例：
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_TITLE=Job Analysis UI
```

### 4. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:3000 查看应用。

### 5. 生产环境构建

```bash
pnpm build
# 或
npm run build
```

构建产物位于 `dist/` 目录。

### 6. Docker 部署

```bash
# 构建镜像
docker build -t job-analysis-ui .

# 运行容器
docker run -d -p 80:80 job-analysis-ui
```

## 📖 页面路由说明

| 路由 | 页面 | 描述 |
|------|------|------|
| `/dashboard` | 仪表盘 | 数据概览与统计图表 |
| `/jobs/list` | 职位列表 | 所有采集职位的列表展示 |
| `/jobs/detail/:id` | 职位详情 | 单个职位的详细信息 |
| `/crawler/tasks` | 任务管理 | 爬虫任务的触发与状态监控 |
| `/analysis/salary` | 薪资分析 | 薪资分布统计图表 |
| `/analysis/skills` | 技能分析 | 技能关键词词云与趋势 |
| `/system/user` | 用户管理 | 用户账号管理 |
| `/system/role` | 角色管理 | 角色与权限配置 |

## 🔗 API 对接

前端通过 Axios 与后端 API 交互，主要接口包括：

- `GET /jobs` - 获取职位列表
- `GET /jobs/{id}` - 获取职位详情
- `POST /crawler/run` - 启动爬虫任务
- `GET /crawler/status/{task_id}` - 查询任务状态
- `POST /auth/login` - 用户登录

API 基础路径通过 `.env` 文件中的 `VITE_API_BASE_URL` 配置。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request。提交前请确保：
1. 代码通过 ESLint 检查
2. 添加必要的类型声明
3. 更新相关文档

## 📄 License

MIT License

## 🔗 相关项目

- **后端服务**：[Job-analysis-backend](https://github.com/Lireal-w/Job-analysis-backend)
- **爬虫模块**：[job-analysis](https://github.com/Lireal-w/job-analysis)
- **源框架**：[fba_ui](https://github.com/fastapi-practices/fba_ui)