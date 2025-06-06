# Ahoy desktop

An Electron application with React and TypeScript

## 项目目录结构

以下是主要目录和文件的说明：

- `build/`: 包含构建配置
  - entitlements.mac.plist: macOS应用签名授权文件
- `dist/`: 构建输出目录（自动生成）
- `src/`: 源代码目录
  - `main/`: Electron主进程代码
  - `preload/`: 预加载脚本
  - `renderer/`: 渲染进程React应用
- `electron-builder.yml`: 应用打包配置
- `electron.vite.config.ts`: Vite构建配置
- `tsconfig.*.json`: TypeScript配置文件
  - tsconfig.node.json: Node环境配置
  - tsconfig.web.json: 浏览器环境配置
- `.npmrc`: npm镜像源配置
- `resources/`: 静态资源目录
  - icon.png: 应用图标

## Recommended IDE Setup

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Project Configuration
See [Configuration Reference](https://cn.electron-vite.org/config/).    