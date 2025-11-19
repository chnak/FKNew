#!/usr/bin/env node
/**
 * 构建脚本入口
 * 使用 Rollup 进行双模式构建（ESM 和 CommonJS）
 */

import { build, clean } from './build/builder.js';

// 解析命令行参数
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean') || args.includes('-c');
const watch = args.includes('--watch') || args.includes('-w');

// 执行构建
if (args.includes('clean')) {
  clean();
} else {
  build({ clean: shouldClean, watch });
}
