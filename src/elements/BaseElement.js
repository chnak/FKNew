import { generateId } from '../utils/helpers.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { toPixels } from '../utils/unit-converter.js';

/**
 * 元素基类
 */
export class BaseElement {
  constructor(config = {}) {
    this.id = generateId('element');
    this.type = 'base';
    this.config = deepMerge({}, DEFAULT_ELEMENT_CONFIG, config);
    this.animations = [];
    this.parent = null;
    this.visible = true;
    this.createdAt = Date.now();
    
    // 时间范围控制
    this.startTime = config.startTime !== undefined ? config.startTime : 0;
    this.endTime = config.endTime !== undefined ? config.endTime : Infinity;
    this.duration = config.duration !== undefined ? config.duration : undefined;
    
    // 如果指定了duration但没有endTime，自动计算endTime
    if (this.duration !== undefined && this.endTime === Infinity) {
      this.endTime = this.startTime + this.duration;
    }
  }

  /**
   * 获取元素类型
   */
  getType() {
    return this.type;
  }

  /**
   * 获取配置
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig) {
    this.config = deepMerge(this.config, newConfig);
  }

  /**
   * 设置位置
   */
  setPosition(x, y) {
    this.config.x = x;
    this.config.y = y;
  }

  /**
   * 设置尺寸
   */
  setSize(width, height) {
    this.config.width = width;
    this.config.height = height;
  }

  /**
   * 设置透明度
   */
  setOpacity(opacity) {
    this.config.opacity = Math.max(0, Math.min(1, opacity));
  }

  /**
   * 设置旋转角度（度）
   */
  setRotation(rotation) {
    this.config.rotation = rotation;
  }

  /**
   * 设置缩放
   */
  setScale(scaleX, scaleY = scaleX) {
    this.config.scaleX = scaleX;
    this.config.scaleY = scaleY;
  }

  /**
   * 设置锚点
   */
  setAnchor(x, y) {
    this.config.anchor = [x, y];
  }

  /**
   * 添加动画
   */
  addAnimation(animation) {
    this.animations.push(animation);
    animation.setTarget(this);
  }

  /**
   * 移除动画
   */
  removeAnimation(animationId) {
    this.animations = this.animations.filter(anim => anim.id !== animationId);
  }

  /**
   * 显示元素
   */
  show() {
    this.visible = true;
  }

  /**
   * 隐藏元素
   */
  hide() {
    this.visible = false;
  }

  /**
   * 判断元素在指定时间是否激活
   * @param {number} time - 时间（秒）
   * @returns {boolean}
   */
  isActiveAtTime(time) {
    return this.visible && time >= this.startTime && time <= this.endTime;
  }

  /**
   * 设置时间范围
   * @param {number} startTime - 开始时间（秒）
   * @param {number} endTime - 结束时间（秒），如果未指定则使用duration计算
   */
  setTimeRange(startTime, endTime) {
    this.startTime = startTime;
    if (endTime !== undefined) {
      this.endTime = endTime;
    } else if (this.duration !== undefined) {
      this.endTime = startTime + this.duration;
    }
  }

  /**
   * 设置持续时间
   * @param {number} duration - 持续时间（秒）
   */
  setDuration(duration) {
    this.duration = duration;
    if (this.endTime === Infinity) {
      this.endTime = this.startTime + duration;
    }
  }

  /**
   * 在指定时间获取元素状态
   * @param {number} time - 时间（秒）
   * @param {Object} context - 上下文对象 { width, height } 用于单位转换
   * @returns {Object} 元素状态
   */
  getStateAtTime(time, context = {}) {
    // 检查时间范围
    if (!this.isActiveAtTime(time)) {
      // 如果不在时间范围内，返回隐藏状态
      return { ...this.config, opacity: 0, visible: false };
    }
    
    let state = { ...this.config };

    // 应用所有动画
    for (const animation of this.animations) {
      if (animation.isActiveAtTime(time)) {
        const animationState = animation.getStateAtTime(time);
        state = { ...state, ...animationState };
      }
    }

    // 转换单位（x, y, width, height）
    const { width = 1920, height = 1080 } = context;
    const unitContext = { width, height };

    // 只对字符串类型进行单位转换，数字类型直接使用
    // 注意：x和width基于宽度，y和height基于高度
    if (typeof state.x === 'string') {
      state.x = toPixels(state.x, unitContext, 'x');
    }
    if (typeof state.y === 'string') {
      state.y = toPixels(state.y, unitContext, 'y');
    }
    if (typeof state.width === 'string') {
      state.width = toPixels(state.width, unitContext, 'width');
    }
    if (typeof state.height === 'string') {
      state.height = toPixels(state.height, unitContext, 'height');
    }

    return state;
  }

  /**
   * 渲染元素到 SpriteJS 场景（子类实现）
   * @param {Object} scene - SpriteJS 场景对象
   * @param {number} time - 当前时间（秒）
   */
  render(scene, time) {
    // 子类实现具体渲染逻辑
    throw new Error('render method must be implemented by subclass');
  }

  /**
   * 直接使用Canvas 2D API渲染元素（子类实现）
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   * @param {number} time - 当前时间（秒）
   */
  renderToCanvas(ctx, time) {
    // 检查时间范围，如果不在范围内则不渲染
    if (!this.isActiveAtTime(time)) {
      return;
    }
    // 子类实现具体渲染逻辑
    throw new Error('renderToCanvas method must be implemented by subclass');
  }

  /**
   * 销毁元素
   */
  destroy() {
    this.animations = [];
    this.parent = null;
  }
}

