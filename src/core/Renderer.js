import spritejs from 'spritejs';
import { createCanvas, registerFont } from 'canvas';
import '../utils/dom-polyfill.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Scene, Layer: SpriteLayer } = spritejs;

// 初始化默认字体（必须在创建Canvas之前注册）
let fontsInitialized = false;
function initFonts() {
  if (fontsInitialized) return;
  
  const defaultFontPath = path.join(__dirname, '../fonts/PatuaOne-Regular.ttf');
  if (fs.pathExistsSync(defaultFontPath)) {
    try {
      // 注册为 PatuaOne（无空格），避免字体名称问题
      registerFont(defaultFontPath, { family: 'PatuaOne' });
      fontsInitialized = true;
      console.log('默认字体已注册: PatuaOne');
    } catch (error) {
      console.warn('注册默认字体失败:', error.message);
    }
  } else {
    console.warn(`默认字体文件不存在: ${defaultFontPath}`);
  }
}

// 立即初始化字体
initFonts();

/**
 * 渲染器类
 */
export class Renderer {
  constructor(config = {}) {
    this.width = config.width || 1920;
    this.height = config.height || 1080;
    this.fps = config.fps || 30;
    this.quality = config.quality || 'high';
    this.canvas = null;
    this.scene = null;
    this.layer = null;
    this.initialized = false;
  }

  /**
   * 初始化渲染器
   */
  async init() {
    if (this.initialized) return;

    // 创建离屏 Canvas
    this.canvas = createCanvas(this.width, this.height);
    
    // 创建虚拟DOM容器（SpriteJS需要DOM元素）
    const container = {
      clientWidth: this.width,
      clientHeight: this.height,
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: this.width,
        height: this.height,
      }),
    };
    
    // 创建 SpriteJS 场景
    this.scene = new Scene({
      container: container,
      width: this.width,
      height: this.height,
      canvas: this.canvas, // 直接传入canvas
    });

    // 创建图层
    this.layer = this.scene.layer();

    this.initialized = true;
  }

  /**
   * 设置尺寸
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    if (this.scene) {
      this.scene.setResolution(width, height);
    }
  }

  /**
   * 清空场景
   */
  clear() {
    if (this.layer) {
      this.layer.removeAllChildren();
    }
  }

  /**
   * 渲染一帧
   * @param {Array} layers - 图层数组
   * @param {number} time - 当前时间（秒）
   * @param {string} backgroundColor - 背景颜色
   */
  async renderFrame(layers, time, backgroundColor = '#000000') {
    if (!this.initialized) {
      await this.init();
    }

    // 获取Canvas 2D上下文
    const ctx = this.canvas.getContext('2d');
    
    // 先绘制背景色
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // 按 zIndex 排序图层
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    // 直接使用Canvas 2D API渲染所有激活的图层
      for (const layer of sortedLayers) {
        if (layer.isActiveAtTime(time)) {
          // 优先使用Canvas 2D API渲染（更可靠）
          if (typeof layer.renderToCanvas === 'function') {
            await layer.renderToCanvas(ctx, time);
          } else {
            // 回退到SpriteJS渲染（可能不工作）
            this.clear();
            layer.render(this.layer, time);
            try {
              await this.scene.snapshot();
            } catch (e) {
              // 忽略错误
            }
          }
        }
      }

    return this.canvas;
  }

  /**
   * 获取 Canvas 缓冲区
   */
  getCanvasBuffer() {
    if (!this.canvas) return null;
    return this.canvas.toBuffer('image/png');
  }

  /**
   * 获取 Canvas
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   * 销毁渲染器
   */
  destroy() {
    if (this.scene) {
      // SpriteJS Scene可能没有destroy方法，尝试清理
      try {
        if (typeof this.scene.destroy === 'function') {
          this.scene.destroy();
        } else if (this.scene.clear) {
          this.scene.clear();
        }
      } catch (e) {
        // 忽略清理错误
      }
    }
    this.canvas = null;
    this.scene = null;
    this.layer = null;
    this.initialized = false;
  }
}

