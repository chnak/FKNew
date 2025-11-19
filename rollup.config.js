/**
 * Rollup 构建配置 - 双模式构建（ESM 和 CommonJS）
 */
import { readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';

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

// 获取所有源文件
const allFiles = getAllFiles('src');
const entryPoints = {};

// 为每个文件创建入口点
allFiles.forEach(filePath => {
  const relativePath = relative('src', filePath);
  const entryKey = relativePath.replace(/\.js$/, '');
  entryPoints[entryKey] = filePath;
});

// 外部依赖（不打包）
const external = [
  'canvas',
  'cheerio',
  'execa',
  'font-finder',
  'font-list',
  'fs-extra',
  'gl',
  'gl-buffer',
  'gl-shader',
  'gl-texture2d',
  'gl-transition',
  'gl-transitions',
  'lrc-kit',
  'nanoid',
  'node-canvas-webgl',
  'paper',
  'paper-jsdom-canvas',
  'spritejs',
  'zod',
  'jsdom',
  'undici',
  'path',
  'fs',
  'os',
  'url',
  'util',
  'stream',
  'buffer',
  'events',
  'worker_threads',
  'child_process',
];

// 构建配置数组
const builds = [];

// ESM 构建
builds.push({
  input: entryPoints,
  output: {
    dir: 'dist/esm',
    format: 'es',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  external,
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      peerDeps: true,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
});

// CommonJS 构建
builds.push({
  input: entryPoints,
  output: {
    dir: 'dist/cjs',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    chunkFileNames: '[name]-[hash].cjs',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'auto',
  },
  external,
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      peerDeps: true,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
  ],
});

export default builds;

