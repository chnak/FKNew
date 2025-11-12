import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 图片加载器
 */
export class ImageLoader {
  constructor() {
    this.cache = new Map();
  }

  /**
   * 加载图片
   * @param {string} src - 图片路径或URL
   * @returns {Promise<Buffer>} 图片数据
   */
  async load(src) {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    try {
      let imageData;
      
      // 如果是URL，需要下载
      if (src.startsWith('http://') || src.startsWith('https://')) {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to load image from URL: ${src}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        imageData = Buffer.from(arrayBuffer);
      } else {
        // 本地文件路径
        const resolvedPath = path.isAbsolute(src) ? src : path.resolve(process.cwd(), src);
        if (!(await fs.pathExists(resolvedPath))) {
          throw new Error(`Image file not found: ${resolvedPath}`);
        }
        imageData = await fs.readFile(resolvedPath);
      }

      this.cache.set(src, imageData);
      return imageData;
    } catch (error) {
      throw new Error(`Failed to load image: ${src}. ${error.message}`);
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取图片信息（需要时可以实现）
   */
  async getImageInfo(src) {
    // 这里可以集成 sharp 或其他图片处理库来获取尺寸等信息
    // 暂时返回基本结构
    return {
      src,
      width: 0,
      height: 0,
    };
  }
}

// 单例实例
export const imageLoader = new ImageLoader();

