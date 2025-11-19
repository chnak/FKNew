/**
 * 文件操作工具函数
 */
import { readdirSync, statSync, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';

// 导出 existsSync 供其他模块使用
export { existsSync };

/**
 * 递归获取所有源文件
 * @param {string} dir - 目录路径
 * @param {string[]} fileList - 文件列表（递归使用）
 * @param {Object} options - 选项
 * @returns {string[]} 文件路径数组
 */
export function getAllFiles(dir, fileList = [], options = {}) {
  const {
    excludeDirs = ['node_modules', 'dist', 'output', '.git'],
    includeExtensions = ['.js'],
    excludePatterns = [/\.test\.js$/],
  } = options;
  
  if (!existsSync(dir)) {
    return fileList;
  }
  
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // 跳过排除的目录
      if (!excludeDirs.includes(file)) {
        getAllFiles(filePath, fileList, options);
      }
    } else {
      // 检查文件扩展名
      const hasValidExtension = includeExtensions.some(ext => file.endsWith(ext));
      if (!hasValidExtension) {
        return;
      }
      
      // 检查排除模式
      const shouldExclude = excludePatterns.some(pattern => pattern.test(file));
      if (shouldExclude) {
        return;
      }
      
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * 确保目录存在
 * @param {string} dir - 目录路径
 */
export function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * 递归复制目录
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 * @param {Object} options - 选项
 */
export function copyDir(src, dest, options = {}) {
  const {
    filter = () => true,
    transform = null,
  } = options;
  
  if (!existsSync(src)) {
    return;
  }
  
  ensureDir(dest);
  
  const files = readdirSync(src, { withFileTypes: true });
  files.forEach(file => {
    const srcPath = join(src, file.name);
    const destPath = join(dest, file.name);
    
    if (file.isDirectory()) {
      copyDir(srcPath, destPath, options);
    } else if (file.isFile() && filter(file.name, srcPath)) {
      if (transform) {
        const content = readFileSync(srcPath, 'utf8');
        const transformed = transform(content, file.name, srcPath);
        writeFileSync(destPath, transformed, 'utf8');
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  });
}

/**
 * 递归删除目录中的文件（保留目录结构）
 * @param {string} dir - 目录路径
 * @param {Function} filter - 过滤函数，返回 true 表示删除
 */
export function removeFiles(dir, filter = () => true) {
  if (!existsSync(dir)) {
    return;
  }
  
  const files = readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      removeFiles(filePath, filter);
    } else if (file.isFile() && filter(file.name, filePath)) {
      try {
        unlinkSync(filePath);
        // 同时删除对应的 .map 文件（如果存在）
        const mapPath = filePath + '.map';
        if (existsSync(mapPath)) {
          unlinkSync(mapPath);
        }
      } catch (err) {
        // 忽略删除错误
      }
    }
  });
}

/**
 * 读取文件内容
 * @param {string} filePath - 文件路径
 * @returns {string} 文件内容
 */
export function readFile(filePath) {
  return readFileSync(filePath, 'utf8');
}

/**
 * 写入文件内容
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 */
export function writeFile(filePath, content) {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, 'utf8');
}

