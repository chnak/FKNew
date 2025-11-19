# 构建系统文档

## 目录结构

```
build/
├── config.js          # 构建配置
├── file-utils.js      # 文件操作工具函数
├── post-process.js    # 后处理工具函数
├── builder.js         # Rollup 构建器
└── README.md          # 本文档

build.js               # 构建脚本入口
```

## 模块说明

### config.js
包含所有构建配置：
- 路径配置（源目录、输出目录等）
- 外部依赖配置
- Rollup 插件配置
- 输出格式配置
- 后处理配置

### file-utils.js
文件操作工具函数：
- `getAllFiles()` - 递归获取所有源文件
- `ensureDir()` - 确保目录存在
- `copyDir()` - 递归复制目录
- `removeFiles()` - 删除文件
- `readFile()` / `writeFile()` - 读写文件

### post-process.js
后处理工具函数：
- `fixRequirePaths()` - 修复 CommonJS 文件中的 require 路径
- `fixFilenameDeclarations()` - 修复 __filename/__dirname 声明
- `removeDuplicateJSFiles()` - 删除多余的 .js 文件
- `addFileAPIPolyfill()` - 添加 File API polyfill

### builder.js
Rollup 构建器：
- `build()` - 执行构建
- `clean()` - 清理构建目录
- `buildESM()` - 构建 ESM 格式
- `buildCJS()` - 构建 CommonJS 格式
- `copyAssets()` - 复制资源文件

## 使用方法

### 基本构建
```bash
npm run build
# 或
node build.js
```

### 清理后构建
```bash
npm run build:clean
# 或
node build.js --clean
```

### Watch 模式（开发中）
```bash
npm run build:watch
# 或
node build.js --watch
```

## 构建流程

1. **清理**（可选）- 清理 dist 目录
2. **获取源文件** - 递归扫描 src 目录
3. **创建入口点** - 为每个源文件创建入口点映射
4. **构建 ESM** - 使用 Rollup 构建 ESM 格式
5. **构建 CommonJS** - 使用 Rollup 构建 CommonJS 格式
6. **后处理** - 修复 require 路径、__filename/__dirname 等
7. **复制资源** - 复制字体文件和 paper-jsdom-canvas 文件

## 输出结构

```
dist/
├── esm/              # ESM 格式输出
│   ├── index.js
│   ├── animations/
│   ├── builder/
│   ├── core/
│   ├── elements/
│   ├── fonts/
│   ├── layers/
│   ├── types/
│   └── utils/
│
└── cjs/              # CommonJS 格式输出
    ├── index.cjs
    ├── animations/
    ├── builder/
    ├── core/
    ├── elements/
    ├── fonts/
    ├── layers/
    ├── types/
    └── utils/
```

## 配置说明

### 外部依赖
所有 `node_modules` 中的包都会被标记为外部依赖，不会被打包。

### 文件处理
- `.js` 文件会被编译
- `.cjs` 文件会被直接复制（如 paper-jsdom-canvas）
- `.test.js` 文件会被排除

### 后处理
- CommonJS 文件中的 `require('./xxx.js')` 会被修复为 `require('./xxx.cjs')`
- CommonJS 文件中的 `__filename` 和 `__dirname` 声明会被移除（因为它们是内置的）
- 多余的 `.js` 文件会被删除（保留 `.cjs` 文件）
- CommonJS 入口文件会添加 File API polyfill

## 注意事项

1. 构建系统使用 Rollup，支持 tree-shaking 和代码优化
2. 保持文件结构（`preserveModules: true`），便于调试
3. 生成 sourcemap，便于调试
4. 自动处理 CommonJS 和 ESM 的兼容性问题

