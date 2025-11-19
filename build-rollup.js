/**
 * Rollup 构建脚本 - 将 ESM 源代码编译为 CommonJS 和 ESM 两种格式
 * 使用 Rollup 进行构建
 */

import { rollup } from 'rollup';
import { readdirSync, statSync, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    } else if (file.endsWith('.cjs') && filePath.includes('paper-jsdom-canvas')) {
      // 包含 paper-jsdom-canvas 的 .cjs 文件需要直接复制，不编译
      fileList.push(filePath);
    }
  });
  return fileList;
}

/**
 * 修复 CommonJS 文件中的 require 路径
 */
function fixRequirePaths(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      fixRequirePaths(filePath);
    } else if (file.name.endsWith('.cjs')) {
      let content = readFileSync(filePath, 'utf8');
      // 匹配所有相对路径的 require('./xxx.js') 或 require('../xxx.js')
      content = content.replace(/require\((['"])(\.\.?\/[^'"]+)\.js\1\)/g, (match, quote, path) => {
        // 跳过 node_modules 路径和绝对路径
        if (path.includes('node_modules') || path.startsWith('/')) {
          return match;
        }
        // 只处理相对路径（以 ./ 或 ../ 开头）
        if (path.startsWith('./') || path.startsWith('../')) {
          return `require(${quote}${path}.cjs${quote})`;
        }
        return match;
      });
      writeFileSync(filePath, content, 'utf8');
    }
  }
}

/**
 * 修复 CommonJS 文件中的 __filename 和 __dirname 重复声明
 */
function fixFilenameDeclarations(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      fixFilenameDeclarations(filePath);
    } else if (file.name.endsWith('.cjs')) {
      let content = readFileSync(filePath, 'utf8');
      
      // 移除 const __filename = fileURLToPath(import_meta.url) 声明
      content = content.replace(
        /const __filename = [^=]*fileURLToPath\(import_meta\.url\);/g,
        '// __filename is available in CommonJS'
      );
      
      // 移除 const __dirname = dirname(__filename) 声明
      content = content.replace(
        /const __dirname = [^=]*dirname\(__filename\);/g,
        '// __dirname is available in CommonJS'
      );
      
      writeFileSync(filePath, content, 'utf8');
    }
  }
}

/**
 * 删除 CommonJS 目录中多余的 .js 文件（保留对应的 .cjs 文件）
 */
function removeDuplicateJSFiles(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      removeDuplicateJSFiles(filePath);
    } else if (file.name.endsWith('.js') && !file.name.includes('.cjs')) {
      // 检查是否存在对应的 .cjs 文件
      const cjsPath = filePath.replace(/\.js$/, '.cjs');
      if (existsSync(cjsPath)) {
        // 删除 .js 文件（保留 .cjs 文件）
        try {
          unlinkSync(filePath);
          // 同时删除对应的 .js.map 文件（如果存在）
          const mapPath = filePath + '.map';
          if (existsSync(mapPath)) {
            unlinkSync(mapPath);
          }
        } catch (err) {
          // 忽略删除错误
        }
      }
    }
  }
}

/**
 * 复制字体文件到 dist 目录
 */
function copyFontFiles(outDirESM, outDirCJS) {
  const srcFontsDir = 'src/fonts';
  if (!existsSync(srcFontsDir)) {
    return;
  }
  
  const fonts = readdirSync(srcFontsDir);
  fonts.forEach(font => {
    const srcPath = join(srcFontsDir, font);
    if (statSync(srcPath).isFile()) {
      // 复制到 ESM 目录
      const esmFontsDir = join(outDirESM, 'fonts');
      if (!existsSync(esmFontsDir)) {
        mkdirSync(esmFontsDir, { recursive: true });
      }
      copyFileSync(srcPath, join(esmFontsDir, font));
      
      // 复制到 CJS 目录
      const cjsFontsDir = join(outDirCJS, 'fonts');
      if (!existsSync(cjsFontsDir)) {
        mkdirSync(cjsFontsDir, { recursive: true });
      }
      copyFileSync(srcPath, join(cjsFontsDir, font));
    }
  });
}

/**
 * 复制 paper-jsdom-canvas 的 .cjs 文件到 dist 目录
 */
function copyPaperJSDOMCanvasFiles(outDirESM, outDirCJS) {
  const srcPaperDir = 'src/utils/paper-jsdom-canvas';
  if (!existsSync(srcPaperDir)) {
    return;
  }
  
  function copyDir(srcDir, destDir) {
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    const files = readdirSync(srcDir, { withFileTypes: true });
    files.forEach(file => {
      const srcPath = join(srcDir, file.name);
      const destPath = join(destDir, file.name);
      
      if (file.isDirectory()) {
        copyDir(srcPath, destPath);
      } else if (file.name.endsWith('.cjs')) {
        copyFileSync(srcPath, destPath);
      }
    });
  }
  
  // 复制到 ESM 目录
  const esmPaperDir = join(outDirESM, 'utils/paper-jsdom-canvas');
  copyDir(srcPaperDir, esmPaperDir);
  
  // 复制到 CJS 目录
  const cjsPaperDir = join(outDirCJS, 'utils/paper-jsdom-canvas');
  copyDir(srcPaperDir, cjsPaperDir);
}

/**
 * 添加 File API polyfill 到 CommonJS 入口文件
 */
function addFileAPIPolyfill(indexPath) {
  if (!existsSync(indexPath)) {
    return;
  }
  
  let content = readFileSync(indexPath, 'utf8');
  
  // 检查是否已经添加了 polyfill
  if (content.includes('File API polyfill')) {
    return;
  }
  
  // 在文件开头添加 File API polyfill
  const polyfill = `// File API polyfill for CommonJS (required by undici/fetch)
if (typeof globalThis.File === 'undefined') {
  try {
    const undici = require('undici');
    if (undici.File) {
      globalThis.File = undici.File;
    } else {
      globalThis.File = class File {
        constructor(bits, name, options = {}) {
          this.name = name;
          this.size = bits.length || bits.byteLength || 0;
          this.type = options.type || '';
          this.lastModified = options.lastModified || Date.now();
          this._bits = bits;
        }
        async arrayBuffer() {
          if (this._bits instanceof ArrayBuffer) return this._bits;
          if (Buffer.isBuffer(this._bits)) {
            return this._bits.buffer.slice(this._bits.byteOffset, this._bits.byteOffset + this._bits.byteLength);
          }
          return new ArrayBuffer(0);
        }
        async text() {
          if (Buffer.isBuffer(this._bits)) return this._bits.toString('utf8');
          return String(this._bits);
        }
      };
    }
  } catch (e) {
    globalThis.File = class File {
      constructor(bits, name, options = {}) {
        this.name = name;
        this.size = bits.length || bits.byteLength || 0;
        this.type = options.type || '';
        this.lastModified = options.lastModified || Date.now();
        this._bits = bits;
      }
      async arrayBuffer() {
        if (this._bits instanceof ArrayBuffer) return this._bits;
        if (Buffer.isBuffer(this._bits)) {
          return this._bits.buffer.slice(this._bits.byteOffset, this._bits.byteOffset + this._bits.byteLength);
        }
        return new ArrayBuffer(0);
      }
      async text() {
        if (Buffer.isBuffer(this._bits)) return this._bits.toString('utf8');
        return String(this._bits);
      }
    };
  }
}
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.error = null;
      this.readyState = 0;
    }
    readAsArrayBuffer(file) {
      this.result = file;
      this.readyState = 2;
      if (this.onload) this.onload({ target: this });
    }
  };
}

`;
  
  content = polyfill + content;
  writeFileSync(indexPath, content, 'utf8');
}

/**
 * 构建函数
 */
async function buildPackage() {
  console.log('🚀 开始构建（使用 Rollup）...\n');

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

  // 创建入口点映射
  const entryPoints = {};
  const entryPointAbsPaths = [];
  allFiles.forEach(filePath => {
    // 跳过 .cjs 文件（这些文件会直接复制）
    if (filePath.endsWith('.cjs')) {
      return;
    }
    const relativePath = filePath.replace(/^src[\\/]/, '').replace(/\.js$/, '');
    entryPoints[relativePath] = filePath;
    entryPointAbsPaths.push(filePath.replace(/\\/g, '/'));
  });

  // 外部依赖（不打包）- 使用函数形式，更灵活
  const external = (id, importer) => {
    // 如果 id 是入口文件的绝对路径，不应该被标记为 external
    const normalizedId = id.replace(/\\/g, '/');
    if (entryPointAbsPaths.some(ep => normalizedId === ep || normalizedId.endsWith(ep))) {
      return false;
    }
    
    // Node.js 内置模块
    if (id.startsWith('node:') || ['path', 'fs', 'os', 'url', 'util', 'stream', 'buffer', 'events', 'worker_threads', 'child_process', 'module', 'crypto', 'http', 'https'].includes(id)) {
      return true;
    }
    // 不处理 node_modules 中的包（全部作为外部依赖）
    // 但相对路径（./ 或 ../）和绝对路径（/）应该被打包
    if (!id.startsWith('.') && !id.startsWith('/')) {
      return true;
    }
    return false;
  };

  try {
    // 1. 构建 ESM 格式
    console.log('📦 构建 ESM 格式...');
    const esmBuild = await rollup({
      input: entryPoints,
      external,
      plugins: [
        nodeResolve({
          preferBuiltins: true,
          exportConditions: ['node', 'default'],
        }),
        commonjs({
          transformMixedEsModules: true,
          requireReturnsDefault: 'auto',
        }),
      ],
    });

    await esmBuild.write({
      dir: outDirESM,
      format: 'es',
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    });

    await esmBuild.close();
    console.log('✅ ESM 构建完成\n');

    // 2. 构建 CommonJS 格式
    console.log('📦 构建 CommonJS 格式...');
    const cjsBuild = await rollup({
      input: entryPoints,
      external,
      plugins: [
        nodeResolve({
          preferBuiltins: true,
          exportConditions: ['node', 'default'],
        }),
        commonjs({
          transformMixedEsModules: true,
          requireReturnsDefault: 'auto',
        }),
      ],
    });

    await cjsBuild.write({
      dir: outDirCJS,
      format: 'cjs',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name]-[hash].cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    });

    await cjsBuild.close();
    
    // 后处理：将 CommonJS 文件中的 require('.js') 改为 require('.cjs')
    console.log('🔧 修复 CommonJS 文件中的 require 路径...');
    fixRequirePaths(outDirCJS);
    
    // 修复 CommonJS 文件中的 __filename 和 __dirname 重复声明问题
    console.log('🔧 修复 CommonJS 文件中的 __filename/__dirname 声明...');
    fixFilenameDeclarations(outDirCJS);
    
    // 删除多余的 .js 文件（只保留 .cjs 文件）
    console.log('🧹 清理多余的 .js 文件...');
    removeDuplicateJSFiles(outDirCJS);
    
    // 复制字体文件到 dist 目录
    console.log('📁 复制字体文件...');
    copyFontFiles(outDirESM, outDirCJS);
    
    // 复制 paper-jsdom-canvas 的 .cjs 文件
    console.log('📁 复制 paper-jsdom-canvas .cjs 文件...');
    copyPaperJSDOMCanvasFiles(outDirESM, outDirCJS);
    
    // 添加 File API polyfill 到 CommonJS 入口文件
    console.log('🔧 添加 File API polyfill...');
    addFileAPIPolyfill(join(outDirCJS, 'index.cjs'));
    
    console.log('✅ CommonJS 构建完成\n');

    console.log('🎉 构建完成！');
    console.log(`   ESM: ${outDirESM}/`);
    console.log(`   CJS: ${outDirCJS}/`);

  } catch (error) {
    console.error('❌ 构建失败:', error);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// 运行构建
buildPackage().catch(console.error);

