/**
 * 构建脚本 - 将 ESM 源代码编译为 CommonJS 和 ESM 两种格式
 * 使用 esbuild 进行编译
 */

import { build } from 'esbuild';
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 递归获取所有源文件
 */
function getAllFiles(dir, fileList = []) {
  if (!existsSync(dir)) {
    return fileList;
  }
  
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      // 跳过 node_modules 和输出目录
      if (file !== 'node_modules' && file !== 'dist' && file !== 'output') {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') && !file.endsWith('.test.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

/**
 * 构建函数
 */
async function buildPackage() {
  console.log('🚀 开始构建...\n');

  const entryPoint = 'src/index.js';
  const outDirESM = 'dist/esm';
  const outDirCJS = 'dist/cjs';

  // 确保输出目录存在
  if (!existsSync(outDirESM)) {
    mkdirSync(outDirESM, { recursive: true });
  }
  if (!existsSync(outDirCJS)) {
    mkdirSync(outDirCJS, { recursive: true });
  }

  // 获取所有源文件
  const allFiles = getAllFiles('src');
  console.log(`📦 找到 ${allFiles.length} 个源文件\n`);

  // 构建选项
  // 注意：当 bundle: false 时，不需要 external，因为不会打包依赖
  // esbuild 只会转换模块格式（ESM <-> CJS），保持 import/require 语句不变
  const baseOptions = {
    platform: 'node',
    target: 'node16',
    sourcemap: true,
    keepNames: true,
    bundle: false, // 不打包，保持文件结构，只转换格式
  };

  try {
    // 1. 构建 ESM 格式
    console.log('📦 构建 ESM 格式...');
    await build({
      ...baseOptions,
      entryPoints: allFiles,
      format: 'esm',
      outdir: outDirESM,
      outbase: 'src',
    });
    console.log('✅ ESM 构建完成\n');

    // 2. 构建 CommonJS 格式
    console.log('📦 构建 CommonJS 格式...');
    await build({
      ...baseOptions,
      entryPoints: allFiles,
      format: 'cjs',
      outdir: outDirCJS,
      outbase: 'src',
    });
    console.log('✅ CommonJS 构建完成\n');

    console.log('🎉 构建完成！');
    console.log(`   ESM: ${outDirESM}/`);
    console.log(`   CJS: ${outDirCJS}/`);

  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

// 运行构建
buildPackage().catch(console.error);

