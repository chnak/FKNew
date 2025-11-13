import { generateId } from '../utils/helpers.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { toPixels } from '../utils/unit-converter.js';
import { FadeAnimation } from '../animations/FadeAnimation.js';
import { MoveAnimation } from '../animations/MoveAnimation.js';
import { TransformAnimation } from '../animations/TransformAnimation.js';
import { KeyframeAnimation } from '../animations/KeyframeAnimation.js';
import { AnimationType } from '../types/enums.js';
import { getPresetAnimation } from '../animations/preset-animations.js';

/**
 * 根据动画配置创建动画实例
 * 支持字符串形式的预设动画名称，如 "fadeIn", "fadeOut"
 * 也支持对象形式的配置，如 {type: "fadeIn", duration: 1, delay: 2}
 */
function createAnimationFromConfig(animConfig) {
  // 如果已经是动画实例，直接返回
  if (animConfig && typeof animConfig.getStateAtTime === 'function') {
    return animConfig;
  }

  // 如果是字符串，尝试获取预设动画
  if (typeof animConfig === 'string') {
    const preset = getPresetAnimation(animConfig);
    if (preset) {
      // 使用预设动画的默认配置
      return createAnimationFromConfig(preset);
    } else {
      console.warn(`未找到预设动画: ${animConfig}`);
      // 如果找不到预设，返回一个默认的淡入动画
      return new FadeAnimation({ fromOpacity: 0, toOpacity: 1 });
    }
  }

  // 如果是对象，检查是否有预设动画名称
  if (animConfig && typeof animConfig === 'object') {
    // 检查 type 是否是预设动画名称
    const presetName = animConfig.type || animConfig.animationType;
    const preset = getPresetAnimation(presetName);
    
    if (preset) {
      // 合并预设配置和用户配置（用户配置优先级更高）
      const mergedConfig = { ...preset, ...animConfig };
      // 移除 type，因为预设配置中已经有 type
      delete mergedConfig.type;
      delete mergedConfig.animationType;
      // 使用合并后的配置创建动画
      return createAnimationFromConfig(mergedConfig);
    }
  }

  // 从配置对象创建动画
  const type = animConfig.type || animConfig.animationType;
  const config = { ...animConfig };
  delete config.type;
  delete config.animationType;

  switch (type) {
    case AnimationType.FADE:
    case 'fade':
      return new FadeAnimation(config);
    case AnimationType.MOVE:
    case 'move':
      return new MoveAnimation(config);
    case AnimationType.TRANSFORM:
    case 'transform':
      return new TransformAnimation(config);
    case AnimationType.KEYFRAME:
    case 'keyframe':
      return new KeyframeAnimation(config);
    default:
      // 默认使用 FadeAnimation
      return new FadeAnimation(config);
  }
}

/**
 * 元素基类
 */
export class BaseElement {
  constructor(config = {}) {
    this.id = generateId('element');
    this.type = 'base';
    
    // 提取 animations 配置（在 deepMerge 之前）
    const animationsConfig = config.animations || [];
    delete config.animations; // 从 config 中移除，避免被合并到 this.config
    
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

    // 从配置中添加动画
    if (Array.isArray(animationsConfig)) {
      for (const animConfig of animationsConfig) {
        if (animConfig) {
          const animation = createAnimationFromConfig(animConfig);
          this.addAnimation(animation);
        }
      }
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
    
    // 深拷贝 config，避免修改原始配置
    // 注意：不能使用 JSON.stringify，因为 config 中可能包含循环引用（如 parent、layer 等）
    // 使用深合并来创建一个新的对象，只拷贝基本类型的属性
    let state = deepMerge({}, this.config);

    // 应用所有动画
    // 注意：动画的 startTime 是相对于元素自己的 startTime 的
    // 如果 delay 为负数，则从元素的结束时间往前计算
    if (this.animations.length === 0) {
      // 如果没有动画，直接返回状态
      return state;
    }
    
    // 按开始时间排序动画，确保先应用先开始的动画
    const sortedAnimations = [...this.animations].map(anim => {
      const delay = anim.config.delay !== undefined ? anim.config.delay : 0;
      const startTime = delay < 0 ? this.endTime + delay : this.startTime + delay;
      return { animation: anim, startTime, delay };
    }).sort((a, b) => a.startTime - b.startTime);
    
    for (let i = 0; i < sortedAnimations.length; i++) {
      const { animation, startTime: animationAbsoluteStartTime, delay } = sortedAnimations[i];
      const animationAbsoluteEndTime = animationAbsoluteStartTime + animation.config.duration;
      
      // 调试信息（仅在开发时启用）
      // if (this.type === 'text' && animation.type === 'transform' && time < 0.1) {
      //   console.log(`[Animation] ${animation.type || 'unknown'}, delay: ${delay}, duration: ${animation.config.duration}, element startTime: ${this.startTime}, element endTime: ${this.endTime}, current time: ${time}, animationAbsoluteStartTime: ${animationAbsoluteStartTime}`);
      // }
      
      // 获取动画的初始状态（from 值）和结束状态（to 值）
      let animationState = {};
      
      // 使用一个小的阈值（1ms）来处理浮点数精度问题
      const epsilon = 0.001;
      
      // 判断动画在当前时间是否应该应用
      // 只有在动画进行中或刚结束时才应用，避免未开始的动画覆盖已开始的动画
      const isAnimationActive = time >= animationAbsoluteStartTime - epsilon && time <= animationAbsoluteEndTime + epsilon;
      const isAnimationBeforeStart = time < animationAbsoluteStartTime - epsilon;
      const isAnimationAfterEnd = time > animationAbsoluteEndTime + epsilon;
      
      // 检查这是否是第一个动画（按开始时间排序）
      const isFirstAnimation = i === 0;
      
      if (isAnimationBeforeStart) {
        // 动画还未开始
        // 如果是第一个动画，应用初始状态（确保动画从正确的初始状态开始）
        // 否则不应用任何状态（避免覆盖其他动画）
        if (isFirstAnimation) {
          animationState = animation.getInitialState ? animation.getInitialState() : {};
        } else {
          animationState = {};
        }
      } else if (time <= animationAbsoluteStartTime + epsilon) {
        // 动画刚开始，应用初始状态（from 值）
        animationState = animation.getInitialState ? animation.getInitialState() : {};
      } else if (isAnimationAfterEnd) {
        // 动画已结束，应用结束状态（to 值）
        animationState = animation.getFinalState ? animation.getFinalState() : {};
      } else {
        // 动画进行中，计算当前状态
        const animationRelativeTime = time - animationAbsoluteStartTime;
        // getStateAtTime 接收的时间会被用来计算进度
        // Animation.getProgress 使用 time - this.startTime 来计算经过的时间
        // 所以需要传递 animation.startTime + animationRelativeTime
        // 这样动画内部计算时：elapsed = (animation.startTime + animationRelativeTime) - animation.startTime = animationRelativeTime
        animationState = animation.getStateAtTime(animation.startTime + animationRelativeTime);
      }
      
      // 合并动画状态到元素状态（只合并非 undefined 的值）
      // 注意：如果动画还未开始，不应用状态，避免覆盖其他动画
      if (isAnimationActive || isAnimationAfterEnd) {
        for (const key in animationState) {
          if (animationState.hasOwnProperty(key) && animationState[key] !== undefined) {
            state[key] = animationState[key];
            // 调试信息（仅在开发时启用）
            // if (this.type === 'text' && (key === 'scaleX' || key === 'scaleY') && time < 0.1) {
            //   console.log(`[Animation] Applied ${key} = ${animationState[key]} at time ${time}, animationState:`, animationState);
            // }
          }
        }
      }
    }

    // 处理 translateX 和 translateY（相对偏移量）
    // 这些属性来自 KeyframeAnimation，表示相对于元素原始位置的偏移
    if (state.translateX !== undefined) {
      // translateX 是相对于原始 x 的偏移量
      const baseX = typeof this.config.x === 'string' 
        ? toPixels(this.config.x, { width: context.width || 1920, height: context.height || 1080 }, 'x')
        : (this.config.x || 0);
      state.x = baseX + (state.translateX || 0);
      delete state.translateX;
    }
    if (state.translateY !== undefined) {
      // translateY 是相对于原始 y 的偏移量
      const baseY = typeof this.config.y === 'string'
        ? toPixels(this.config.y, { width: context.width || 1920, height: context.height || 1080 }, 'y')
        : (this.config.y || 0);
      state.y = baseY + (state.translateY || 0);
      delete state.translateY;
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
   * 初始化元素（在渲染之前调用）
   * 子类可以覆盖此方法来实现异步初始化逻辑（如加载资源）
   * @returns {Promise<void>|void} 如果返回 Promise，渲染器会等待初始化完成
   */
  initialize() {
    // 默认实现为空，子类可以覆盖
    // 如果子类需要异步初始化，可以返回 Promise
    return Promise.resolve();
  }

  /**
   * 检查元素是否已初始化
   * 子类可以覆盖此方法来自定义初始化状态检查
   * @returns {boolean} 是否已初始化
   */
  isInitialized() {
    // 默认返回 true，子类可以覆盖
    return true;
  }

  /**
   * 渲染元素到 Paper.js 图层（子类实现）
   * @param {Object} layer - Paper.js 图层对象
   * @param {number} time - 当前时间（秒）
   */
  render(layer, time) {
    // 子类实现具体渲染逻辑
    throw new Error('render method must be implemented by subclass');
  }


  /**
   * 销毁元素
   */
  destroy() {
    this.animations = [];
    this.parent = null;
  }
}

