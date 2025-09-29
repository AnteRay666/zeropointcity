---
title: 关于 Vue 项目中的 Env 配置
date: 2025-09-29
tags:
  - Vue3
categories:
  - Vue3
---

# 关于 Vue 项目中的 Env

在 Vue3（基于 Vite 的项目）开发中，经常会用到 `.env` 文件来配置环境变量，比如接口地址、调试开关、认证秘钥等。合理使用 `.env` 可以让项目在不同环境（开发 / 测试 / 生产）下自动切换配置，避免硬编码。

---

## 1. Env 文件命名规则

Vite 支持的环境变量文件：

- **.env**  
  所有环境都会加载。
- **.env.development**  
  仅在开发环境（`vite dev`）下加载。
- **.env.production**  
  仅在生产环境（`vite build`）下加载。
- **.env.local / .env.development.local / .env.production.local**  
  本地专用配置，不会被 git 提交（适合存放私密信息）。

> 💡 `.local` 文件通常要放进 `.gitignore`，避免泄露敏感信息。

---

## 2. 变量命名规范

⚠️ **重点：Vite 只会注入 `VITE_` 开头的变量到客户端代码**。

示例 `.env` 文件：

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_AUTH_SECRET=mySecretAuth
```

在 Vue 中访问：

```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL
const secret = import.meta.env.VITE_AUTH_SECRET
```

## 3. 常见问题与解决办法

Q1: import.meta.env 报错

错误提示：

```js
仅当 '--module' 选项为 'es2020'、'esnext'、'node16' 等时，才允许使用 'import.meta'
```

✅ 解决办法：修改 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "isolatedModules": true
  }
}
```
