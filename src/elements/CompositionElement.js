import { BaseElement } from './BaseElement.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import { VideoMaker } from '../core/VideoMaker.js';
import { TextElement } from './TextElement.js';
import { ImageElement } from './ImageElement.js';
import { RectElement } from './RectElement.js';
import { CircleElement } from './CircleElement.js';
import spritejs from 'spritejs';

const { Group } = spritejs;

/**
 * 合成元素（嵌套合成）
 */
export class CompositionElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.COMPOSITION;
    this.config = deepMerge({}, DEFAULT_ELEMENT_CONFIG, config);
    this.composition = config.composition || null;
    this.startTime = config.startTime || 0;
    this.endTime = config.endTime || Infinity;
    
    // 如果提供了合成配置，创建嵌套合成
    if (config.compositionConfig && !this.composition) {
      this.composition = new VideoMaker(config.compositionConfig);
    }
    
    // 如果没有提供composition，创建一个默认的
    if (!this.composition) {
      this.composition = new VideoMaker({
        width: config.width || 1920,
        height: config.height || 1080,
        fps: config.fps || 30,
        duration: config.duration || 5,
        backgroundColor: config.backgroundColor || 'transparent',
      });
    }
  }

  /**
   * 设置嵌套合成
   */
  setComposition(composition) {
    this.composition = composition;
  }

  /**
   * 获取嵌套合成
   */
  getComposition() {
    return this.composition;
  }

  /**
   * 添加元素（直接添加到嵌套合成）
   * @param {BaseElement} element - 元素实例
   * @returns {CompositionElement} 返回自身以支持链式调用
   */
  addElement(element) {
    if (this.composition) {
      // 获取第一个元素图层，如果没有则创建一个
      let elementLayer = this.composition.getLayers().find(layer => 
        layer.type === 'element' || layer.constructor.name === 'ElementLayer'
      );
      if (!elementLayer) {
        elementLayer = this.composition.createElementLayer();
      }
      elementLayer.addElement(element);
    }
    return this;
  }

  /**
   * 添加文本元素
   * @param {Object} config - 文本配置
   * @returns {CompositionElement} 返回自身以支持链式调用
   */
  addText(config = {}) {
    const element = new TextElement(config);
    this.addElement(element);
    return this;
  }

  /**
   * 添加图片元素
   * @param {Object} config - 图片配置
   * @returns {CompositionElement} 返回自身以支持链式调用
   */
  addImage(config = {}) {
    const element = new ImageElement(config);
    if (config.src) {
      element.load().catch(err => {
        console.warn('图片加载失败:', config.src, err);
      });
    }
    this.addElement(element);
    return this;
  }

  /**
   * 添加矩形元素
   * @param {Object} config - 矩形配置
   * @returns {CompositionElement} 返回自身以支持链式调用
   */
  addRect(config = {}) {
    const element = new RectElement(config);
    this.addElement(element);
    return this;
  }

  /**
   * 添加圆形元素
   * @param {Object} config - 圆形配置
   * @returns {CompositionElement} 返回自身以支持链式调用
   */
  addCircle(config = {}) {
    const element = new CircleElement(config);
    this.addElement(element);
    return this;
  }

  /**
   * 获取嵌套合成中的所有元素
   * @returns {Array<BaseElement>}
   */
  getElements() {
    if (!this.composition) return [];
    const elements = [];
    for (const layer of this.composition.getLayers()) {
      if (layer.getElements) {
        elements.push(...layer.getElements());
      }
    }
    return elements;
  }

  /**
   * 渲染合成元素
   */
  render(scene, time) {
    if (!this.visible || !this.composition) return null;

    const state = this.getStateAtTime(time);
    
    // 创建子场景或容器
    const group = new Group({
      id: this.id,
      pos: [state.x, state.y],
      size: [state.width, state.height],
      opacity: state.opacity,
      anchor: state.anchor,
      rotate: state.rotation,
      scale: [state.scaleX, state.scaleY],
    });

    // 渲染嵌套合成到组中
    // 注意：这里需要根据 Composition 的渲染方式来实现
    // 暂时返回组，具体渲染逻辑需要在 Composition 中实现
    scene.appendChild(group);
    return group;
  }

  /**
   * 直接使用Canvas 2D API渲染嵌套合成
   * 注意：这个方法需要异步处理，但为了兼容性，我们使用同步方式
   */
  renderToCanvas(ctx, time) {
    if (!this.visible || !this.composition) return;
    
    // 检查时间范围
    if (time < this.startTime || time > this.endTime) {
      return;
    }

    // 获取Canvas尺寸用于单位转换
    const canvas = ctx.canvas;
    const context = { width: canvas.width, height: canvas.height };
    const state = this.getStateAtTime(time, context);

    // 计算嵌套合成的时间（相对于嵌套合成的开始时间）
    const nestedTime = Math.max(0, time - this.startTime);
    
    // 限制嵌套时间不超过嵌套合成的时长
    const maxNestedTime = this.composition.duration || Infinity;
    if (nestedTime > maxNestedTime) {
      return; // 嵌套合成已结束
    }

    // 保存当前上下文
    ctx.save();
    ctx.globalAlpha = state.opacity;

    // 应用变换
    ctx.translate(state.x, state.y);
    ctx.rotate((state.rotation || 0) * Math.PI / 180);
    ctx.scale(state.scaleX || 1, state.scaleY || 1);

    // 创建裁剪区域
    const anchorX = state.anchor?.[0] || 0.5;
    const anchorY = state.anchor?.[1] || 0.5;
    const x = -state.width * anchorX;
    const y = -state.height * anchorY;
    
    ctx.beginPath();
    ctx.rect(x, y, state.width, state.height);
    ctx.clip();

    // 渲染嵌套合成
    try {
      // 初始化嵌套合成的渲染器（同步检查）
      if (!this.composition.renderer.initialized) {
        // 注意：这里不能使用await，所以我们需要确保renderer已经初始化
        // 在实际使用中，应该在渲染前预先初始化所有嵌套合成
        console.warn('嵌套合成的renderer未初始化，跳过渲染');
        ctx.restore();
        return;
      }
      
      // 渲染嵌套合成的一帧（同步方式）
      // 注意：renderFrame是异步的，但这里我们假设已经渲染好了
      // 更好的方式是预先渲染嵌套合成的所有帧
      const nestedCanvas = this.composition.renderer.canvas;
      if (nestedCanvas) {
        // 临时渲染嵌套合成（这里需要同步，但renderFrame是异步的）
        // 为了简化，我们直接使用renderer的canvas
        // 在实际应用中，应该预先渲染或使用缓存
        ctx.drawImage(nestedCanvas, x, y, state.width, state.height);
      }
    } catch (error) {
      console.warn('渲染嵌套合成失败:', error);
    }

    ctx.restore();
  }
  
  /**
   * 预渲染嵌套合成（异步方法）
   * 在渲染主合成之前调用此方法
   */
  async preRender(time) {
    if (!this.composition) return;
    
    const nestedTime = Math.max(0, time - this.startTime);
    const maxNestedTime = this.composition.duration || Infinity;
    
    if (nestedTime <= maxNestedTime) {
      // 确保renderer已初始化
      if (!this.composition.renderer.initialized) {
        await this.composition.renderer.init();
      }
      
      // 预渲染这一帧
      await this.composition.renderer.renderFrame(
        this.composition.timeline.getLayers(),
        nestedTime,
        this.composition.backgroundColor || 'transparent'
      );
    }
  }
}

