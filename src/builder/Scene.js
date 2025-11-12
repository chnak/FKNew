/**
 * 场景类 - 本身是一个独立的 VideoMaker（嵌套合成）
 */
import { VideoMaker } from '../core/VideoMaker.js';
import { TextElement } from '../elements/TextElement.js';
import { ImageElement } from '../elements/ImageElement.js';
import { RectElement } from '../elements/RectElement.js';
import { CircleElement } from '../elements/CircleElement.js';

/**
 * 场景类 - 继承自 VideoMaker
 */
export class Scene extends VideoMaker {
  constructor(config = {}) {
    // 初始化 VideoMaker
    super({
      width: config.width || config.track?.width || config.track?.builder?.config?.width || 1920,
      height: config.height || config.track?.height || config.track?.builder?.config?.height || 1080,
      fps: config.fps || config.track?.fps || config.track?.builder?.config?.fps || 30,
      duration: config.duration || 5,
      backgroundColor: config.backgroundColor || 'transparent',
    });
    
    this.track = config.track;
    this.startTime = config.startTime; // 可选，如果不指定则自动计算
    this.name = config.name || `Scene-${this.track?.scenes?.length || 0}`;
    
    this.elements = [];
    this.backgroundLayer = null;
  }

  /**
   * 添加背景
   * @param {Object} config - 背景配置 { color, image, ... }
   * @returns {Scene} 返回自身以支持链式调用
   */
  addBackground(config = {}) {
    // 如果已经有背景图层，更新它
    if (!this.backgroundLayer) {
      this.backgroundLayer = {
        type: 'background',
        config: {
          backgroundColor: config.color || config.backgroundColor || '#000000',
          ...config,
        },
      };
    } else {
      this.backgroundLayer.config = {
        ...this.backgroundLayer.config,
        ...config,
      };
    }
    
    return this;
  }

  /**
   * 添加文本元素
   * @param {Object} config - 文本配置
   * @returns {Scene} 返回自身以支持链式调用
   */
  addText(config = {}) {
    this.elements.push({
      type: 'text',
      element: new TextElement(config),
    });
    return this;
  }

  /**
   * 添加图片元素
   * @param {Object} config - 图片配置
   * @returns {Scene} 返回自身以支持链式调用
   */
  addImage(config = {}) {
    const imageElement = new ImageElement(config);
    // 如果提供了src，异步加载图片
    if (config.src) {
      imageElement.load().catch(err => {
        console.warn('图片加载失败:', config.src, err);
      });
    }
    this.elements.push({
      type: 'image',
      element: imageElement,
    });
    return this;
  }

  /**
   * 添加矩形元素
   * @param {Object} config - 矩形配置
   * @returns {Scene} 返回自身以支持链式调用
   */
  addRect(config = {}) {
    this.elements.push({
      type: 'rect',
      element: new RectElement(config),
    });
    return this;
  }

  /**
   * 添加圆形元素
   * @param {Object} config - 圆形配置
   * @returns {Scene} 返回自身以支持链式调用
   */
  addCircle(config = {}) {
    this.elements.push({
      type: 'circle',
      element: new CircleElement(config),
    });
    return this;
  }

  /**
   * 添加自定义元素
   * @param {BaseElement} element - 元素实例
   * @returns {Scene} 返回自身以支持链式调用
   */
  addElement(element) {
    this.elements.push({
      type: 'custom',
      element: element,
    });
    return this;
  }

  /**
   * 获取所有元素
   * @returns {Array}
   */
  getElements() {
    return this.elements.map(e => e.element);
  }

  /**
   * 构建场景（将元素添加到场景合成）
   * @returns {VideoMaker} 返回场景合成本身
   */
  build() {
    // 获取场景图层
    const sceneLayer = this.createElementLayer();
    
    // 添加背景（作为矩形元素添加到图层最底层）
    if (this.backgroundLayer) {
      const bgElement = new RectElement({
        x: this.width / 2,
        y: this.height / 2,
        width: this.width,
        height: this.height,
        bgcolor: this.backgroundLayer.config.backgroundColor,
        anchor: [0.5, 0.5],
        zIndex: -9999,
      });
      sceneLayer.addElement(bgElement);
    }

    // 添加所有元素到场景图层
    for (const { element } of this.elements) {
      sceneLayer.addElement(element);
    }

    return this;
  }

  /**
   * 销毁场景
   */
  destroy() {
    for (const { element } of this.elements) {
      if (element.destroy) {
        element.destroy();
      }
    }
    this.elements = [];
    this.backgroundLayer = null;
    // 调用父类的销毁方法
    super.destroy();
  }
}

