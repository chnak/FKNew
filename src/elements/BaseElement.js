import { generateId } from '../utils/helpers.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { toPixels, toFontSizePixels } from '../utils/unit-converter.js';
import { TransformAnimation } from '../animations/TransformAnimation.js';
import { KeyframeAnimation } from '../animations/KeyframeAnimation.js';
import { AnimationType } from '../types/enums.js';
import { getPresetAnimation } from '../animations/preset-animations.js';
import paper from 'paper';
import { got } from 'got';
import path from 'path';
import fs from 'fs';
import {pipeline} from 'stream/promises';
/**
 * 规范化动画配置为统一格式
 * 将动画实例或配置对象转换为纯配置对象，便于序列化和传递
 * @param {string|Object|Animation} animConfig - 动画配置（字符串、对象或动画实例）
 * @returns {string|Object} 规范化后的动画配置（字符串或配置对象）
 */
export function normalizeAnimationConfig(animConfig) {
  // 如果是字符串（预设动画名称），直接返回
  if (typeof animConfig === 'string') {
    return animConfig;
  }

  // 如果是动画实例，提取其配置信息（避免循环引用）
  if (animConfig && typeof animConfig.getStateAtTime === 'function') {
    const config = {};
    // 提取所有可序列化的属性
    if (animConfig.type) config.type = animConfig.type;
    if (animConfig.duration !== undefined) config.duration = animConfig.duration;
    if (animConfig.delay !== undefined) config.delay = animConfig.delay;
    if (animConfig.startTime !== undefined) config.startTime = animConfig.startTime;
    if (animConfig.easing) config.easing = animConfig.easing;
    if (animConfig.property) config.property = animConfig.property;
    if (animConfig.from !== undefined) config.from = animConfig.from;
    if (animConfig.to !== undefined) config.to = animConfig.to;
    if (animConfig.fromOpacity !== undefined) config.fromOpacity = animConfig.fromOpacity;
    if (animConfig.toOpacity !== undefined) config.toOpacity = animConfig.toOpacity;
    if (animConfig.fromX !== undefined) config.fromX = animConfig.fromX;
    if (animConfig.toX !== undefined) config.toX = animConfig.toX;
    if (animConfig.fromY !== undefined) config.fromY = animConfig.fromY;
    if (animConfig.toY !== undefined) config.toY = animConfig.toY;
    if (animConfig.fromScaleX !== undefined) config.fromScaleX = animConfig.fromScaleX;
    if (animConfig.toScaleX !== undefined) config.toScaleX = animConfig.toScaleX;
    if (animConfig.fromScaleY !== undefined) config.fromScaleY = animConfig.fromScaleY;
    if (animConfig.toScaleY !== undefined) config.toScaleY = animConfig.toScaleY;
    if (animConfig.fromRotation !== undefined) config.fromRotation = animConfig.fromRotation;
    if (animConfig.toRotation !== undefined) config.toRotation = animConfig.toRotation;
    if (animConfig.keyframes) config.keyframes = animConfig.keyframes;
    return config;
  }

  // 如果是配置对象，深拷贝基本类型属性（避免循环引用）
  if (animConfig && typeof animConfig === 'object') {
    const config = {};
    for (const key in animConfig) {
      if (animConfig.hasOwnProperty(key)) {
        const value = animConfig[key];
        // 跳过循环引用（如 target）
        if (key === 'target') continue;
        // 拷贝基本类型
        if (value === null || value === undefined || 
            typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          config[key] = value;
        } else if (Array.isArray(value)) {
          // 拷贝数组
          config[key] = [...value];
        } else if (typeof value === 'object' && !value.getStateAtTime) {
          // 拷贝普通对象（排除动画实例）
          config[key] = { ...value };
        }
      }
    }
    return config;
  }

  return animConfig;
}

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
          console.warn(`未找到预设动画: ${animConfig}，使用默认 fadeIn`);
          // 如果找不到预设，使用默认的淡入动画预设
          return createAnimationFromConfig('fadeIn');
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
    case AnimationType.TRANSFORM:
    case 'transform':
      return new TransformAnimation(config);
    case AnimationType.KEYFRAME:
    case 'keyframe':
      return new KeyframeAnimation(config);
    case 'fade':
      // 将 fade 类型转换为 transform 类型
      return new TransformAnimation({
        from: { opacity: config.fromOpacity !== undefined ? config.fromOpacity : 0 },
        to: { opacity: config.toOpacity !== undefined ? config.toOpacity : 1 },
        duration: config.duration,
        delay: config.delay,
        startTime: config.startTime,
        easing: config.easing,
      });
    case 'move':
      // 将 move 类型转换为 keyframe 类型
      const fromX = config.fromX !== undefined ? config.fromX : 0;
      const fromY = config.fromY !== undefined ? config.fromY : 0;
      const toX = config.toX !== undefined ? config.toX : 0;
      const toY = config.toY !== undefined ? config.toY : 0;
      // 检查是否是相对偏移量模式（用于滑入滑出动画）
      const isRelative = (toX === 0 && toY === 0) && (fromX !== 0 || fromY !== 0);
      return new KeyframeAnimation({
        keyframes: [
          { time: 0, translateX: isRelative ? fromX : 0, translateY: isRelative ? fromY : 0, x: isRelative ? undefined : fromX, y: isRelative ? undefined : fromY },
          { time: 1, translateX: isRelative ? toX : 0, translateY: isRelative ? toY : 0, x: isRelative ? undefined : toX, y: isRelative ? undefined : toY },
        ],
        duration: config.duration,
        delay: config.delay,
        startTime: config.startTime,
        easing: config.easing,
      });
    default:
      // 默认使用淡入动画预设
      return createAnimationFromConfig({ type: 'transform', from: { opacity: 0 }, to: { opacity: 1 }, ...config });
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

    // 回调函数支持
    this.onLoaded = config.onLoaded || null; // (element, time) => void
    this.onRender = config.onRender || null; // (element, time) => void
    this.onFrame = config.onFrame || null; // (element, event, paperItem) => void
    this._loadedCallbackCalled = false; // 标记 onLoaded 是否已调用
    this._paperItem = null; // Paper.js 项目引用（用于 onFrame）
  }


  async ready() {
    const src=this.config.src || this.config.videoPath || this.config.audioPath || this.config.svgPath || this.config.imagePath || this.config.jsonPath || this.config.fontPath || null;
    if(this.config.src&&(src.startsWith('http'))) {
      this.config.src=await this.download(src);
      this.src=this.config.src;
    }else if(this.config.videoPath&&(this.config.videoPath.startsWith('http'))) {
      this.config.videoPath=await this.download(this.config.videoPath);
      this.videoPath=this.config.videoPath;
    }else if(this.config.audioPath&&(this.config.audioPath.startsWith('http'))) {
      this.config.audioPath=await this.download(this.config.audioPath);
      this.audioPath=this.config.audioPath;
    }else if(this.config.svgPath&&(this.config.svgPath.startsWith('http'))) {
      this.config.svgPath=await this.download(this.config.svgPath);
      this.svgPath=this.config.svgPath;
    }else if(this.config.imagePath&&(this.config.imagePath.startsWith('http'))) {
      this.config.imagePath=await this.download(this.config.imagePath);
      this.imagePath=this.config.imagePath;
    }else if(this.config.jsonPath&&(this.config.jsonPath.startsWith('http'))) {
      this.config.jsonPath=await this.download(this.config.jsonPath);
      this.jsonPath=this.config.jsonPath;
    }else if(this.config.fontPath&&(this.config.fontPath.startsWith('http'))) {
      this.config.fontPath=await this.download(this.config.fontPath);
      this.fontPath=this.config.fontPath;
    }
    return true;
  }
  /**
   * 初始化元素（在渲染之前调用）
   * 子类可以覆盖此方法来实现异步初始化逻辑（如加载资源）
   * @returns {Promise<void>|void} 如果返回 Promise，渲染器会等待初始化完成
   */
  initialize() {
    return Promise.resolve();
  }


  async downloadWithPipeline(url, outputPath) {
    try {
      const writeStream = fs.createWriteStream(outputPath);
      
      await pipeline(
        got.stream(url),
        writeStream
      );
      
      console.log(`✅ 下载完成: ${outputPath}`);
      
      // 验证文件
      const stats = fs.statSync(outputPath);
      if (stats.size === 0) {
        throw new Error('下载的文件为空');
      }
      
      console.log(`📊 文件大小: ${stats.size} bytes`);
      return outputPath;
      
    } catch (error) {
      // 清理不完整文件
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      console.error(`❌ 下载失败: ${error.message}`);
      throw error;
    }
  }

  async download(url,name) {
    try {
      // 从 URL 提取文件名（处理查询参数）
      let filename = name || path.basename(url);
      
      // 去除查询参数
      if (filename.includes('?')) {
        filename = filename.split('?')[0];
      }
      
      // 如果没有扩展名，添加默认扩展名
      if (!path.extname(filename)) {
        // 尝试从 Content-Type 推断扩展名
        const response = await got.head(url);
        const contentType = response.headers['content-type'];
        
        if (contentType === 'image/jpeg') filename += '.jpg';
        else if (contentType === 'image/png') filename += '.png';
        else if (contentType === 'video/mp4') filename += '.mp4';
        else if (contentType === 'video/avi') filename += '.avi';
        else if (contentType === 'video/quicktime') filename += '.mov';
        else if (contentType === 'video/x-ms-wmv') filename += '.wmv';
        else if (contentType === 'video/x-flv') filename += '.flv';
        else if (contentType === 'video/x-matroska') filename += '.mkv';
        else if (contentType === 'video/webm') filename += '.webm';
        else if (contentType === 'audio/mpeg') filename += '.mp3';
        else if (contentType === 'audio/wav') filename += '.wav';
        else if (contentType === 'audio/flac') filename += '.flac';
        else if (contentType === 'audio/aac') filename += '.aac';
        else if (contentType === 'audio/ogg') filename += '.ogg';
        else if (contentType === 'audio/x-ms-wma') filename += '.wma';
        else if (contentType === 'audio/mp4') filename += '.m4a';
        else if (contentType === 'font/ttf') filename += '.ttf';
        else if (contentType === 'font/otf') filename += '.otf';
        else if (contentType === 'font/woff') filename += '.woff';
        else if (contentType === 'font/woff2') filename += '.woff2';
        else if (contentType === 'application/vnd.ms-fontobject') filename += '.eot';
        else if (contentType === 'application/font-sfnt') filename += '.sfnt';
        else if (contentType === 'application/json') filename += '.json';
        else if (contentType === 'application/xml') filename += '.xml';
        else if (contentType === 'application/x-font-ttf') filename += '.ttf';
        else if (contentType === 'application/x-font-otf') filename += '.otf';
        else if (contentType === 'application/x-font-woff') filename += '.woff';
        else if (contentType === 'application/x-font-woff2') filename += '.woff2';
        else if (contentType === 'application/x-font-eot') filename += '.eot';
        else if (contentType === 'application/x-font-sfnt') filename += '.sfnt';
        else if (contentType === 'application/x-font-opentype') filename += '.otf';
        else if (contentType === 'application/x-font-truetype') filename += '.ttf';
        else if (contentType === 'application/x-font-woff') filename += '.woff';
        else filename += '.bin';
      }
      
      const outputPath = path.join(this.cacheDir, filename);
      
      const result=await this.downloadWithPipeline(url,outputPath);
      console.log(`下载完成: ${filename}`);

      return result;
    } catch (error) {
      console.error('下载失败:', error.message);
      throw error;
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
   * 获取元素在指定时间的进度（0-1）
   * @param {number} time - 时间（秒）
   * @returns {number} 进度值，范围 0-1
   */
  getProgressAtTime(time) {
    if (!this.isActiveAtTime(time)) {
      return 0;
    }
    
    const elapsed = time - this.startTime;
    const duration = this.duration || (this.endTime - this.startTime);
    
    if (duration <= 0) {
      return 0;
    }
    
    return Math.max(0, Math.min(1, elapsed / duration));
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
      // 对于负 delay 的动画，从元素的结束时间往前计算
      let effectiveEndTime = this.endTime;
      
      // 对于分割片段，需要调整 endTime 使退出动画按 splitDelay 错开
      // 这样每个片段的退出动画会提前 segmentDelay 开始
      if (delay < 0 && this.isSegment && this.parentElement) {
        const segmentDelay = this.startTime - this.parentElement.startTime;
        // 调整 endTime，使每个片段的退出动画提前 segmentDelay 开始
        // 例如：父元素 endTime=5, delay=-1，动画开始时间=4
        // 片段0（segmentDelay=0）：effectiveEndTime=5，动画开始时间=4
        // 片段1（segmentDelay=0.1）：effectiveEndTime=4.9，动画开始时间=3.9
        // 片段2（segmentDelay=0.2）：effectiveEndTime=4.8，动画开始时间=3.8
        effectiveEndTime = this.endTime - segmentDelay;
      }
      
      const startTime = delay < 0 ? effectiveEndTime + delay : this.startTime + delay;
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
   * 转换位置值（x, y）为像素值
   * @param {string|number} x - X 坐标
   * @param {string|number} y - Y 坐标
   * @param {Object} context - 上下文对象 { width, height }
   * @returns {{x: number, y: number}} 转换后的像素坐标
   */
  convertPosition(x, y, context = {}) {
    const { width = 1920, height = 1080 } = context;
    const unitContext = { width, height };
    
    return {
      x: typeof x === 'string' ? toPixels(x, unitContext, 'x') : (x || 0),
      y: typeof y === 'string' ? toPixels(y, unitContext, 'y') : (y || 0),
    };
  }

  /**
   * 转换尺寸值（width, height）为像素值
   * @param {string|number} width - 宽度
   * @param {string|number} height - 高度
   * @param {Object} context - 上下文对象 { width, height }
   * @returns {{width: number, height: number}} 转换后的像素尺寸
   */
  convertSize(width, height, context = {}) {
    const { width: canvasWidth = 1920, height: canvasHeight = 1080 } = context;
    const unitContext = { width: canvasWidth, height: canvasHeight };
    
    return {
      width: typeof width === 'string' ? toPixels(width, unitContext, 'width') : (width || 0),
      height: typeof height === 'string' ? toPixels(height, unitContext, 'height') : (height || 0),
    };
  }

  /**
   * 转换字体大小为像素值
   * @param {string|number} fontSize - 字体大小
   * @param {Object} context - 上下文对象 { width, height, baseFontSize }
   * @param {number} defaultSize - 默认字体大小（如果转换失败）
   * @returns {number} 转换后的像素值
   */
  convertFontSize(fontSize, context = {}, defaultSize = 24) {
    if (!fontSize) return defaultSize;
    
    const { width = 1920, height = 1080, baseFontSize = 16 } = context;
    const unitContext = { width, height, baseFontSize };
    
    const pixelSize = typeof fontSize === 'string' 
      ? toFontSizePixels(fontSize, unitContext)
      : fontSize;
    
    return pixelSize > 0 ? pixelSize : defaultSize;
  }

  /**
   * 计算元素的最终位置（包括 anchor 对齐）
   * @param {Object} state - 元素状态（从 getStateAtTime 获取，已转换单位）
   * @param {Object} context - 上下文对象 { width, height }
   * @param {Object} options - 选项
   * @param {Array<number>} options.anchor - 锚点 [x, y]，默认使用 state.anchor
   * @param {number} options.elementWidth - 元素宽度（用于 anchor 对齐），可选
   * @param {number} options.elementHeight - 元素高度（用于 anchor 对齐），可选
   * @returns {{x: number, y: number}} 最终位置（像素值）
   */
  calculatePosition(state, context = {}, options = {}) {
    const anchor = options.anchor || state.anchor || [0.5, 0.5];
    const { elementWidth, elementHeight } = options;
    
    // state.x 和 state.y 已经在 getStateAtTime 中转换了单位
    let x = typeof state.x === 'number' ? state.x : (typeof state.x === 'string' ? toPixels(state.x, context, 'x') : 0);
    let y = typeof state.y === 'number' ? state.y : (typeof state.y === 'string' ? toPixels(state.y, context, 'y') : 0);
    
    // 如果有元素尺寸，根据 anchor 调整位置
    if (elementWidth !== undefined || elementHeight !== undefined) {
      if (elementWidth !== undefined) {
        x = x - (elementWidth * anchor[0]);
      }
      if (elementHeight !== undefined) {
        y = y - (elementHeight * anchor[1]);
      }
    }
    
    return { x, y };
  }

  /**
   * 计算分割文本片段的位置（特殊处理）
   * @param {Object} state - 元素状态（从 getStateAtTime 获取）
   * @param {Object} context - 上下文对象 { width, height }
   * @param {Object} segmentConfig - 分割片段配置
   * @returns {{x: number, y: number, baseline: string}} 最终位置和 baseline
   */
  calculateSegmentPosition(state, context = {}, segmentConfig = {}) {
    const {
      parentX,
      parentY,
      parentAnchor = [0.5, 0.5],
      parentTextAlign = 'center',
      totalTextWidth = 0,
      totalTextHeight = 0,
      segmentOffsetX = 0,
      segmentOffsetY = 0,
    } = segmentConfig;
    
    // 转换父元素位置单位
    const { x: parentXPixels, y: parentYPixels } = this.convertPosition(parentX, parentY, context);
    
    // 计算文本基准位置（考虑 anchor 和 textAlign）
    let baseX = parentXPixels;
    let baseY = parentYPixels;
    
    // 根据 anchor 调整水平位置
    if (parentAnchor[0] === 0.5) {
      // 水平居中
      if (parentTextAlign === 'center') {
        baseX = baseX - totalTextWidth / 2;
      } else if (parentTextAlign === 'right') {
        baseX = baseX - totalTextWidth;
      }
    } else if (parentAnchor[0] === 1) {
      // 右对齐
      if (parentTextAlign === 'center') {
        baseX = baseX - totalTextWidth / 2;
      } else if (parentTextAlign === 'right') {
        baseX = baseX - totalTextWidth;
      }
    }
    
    // 根据 anchor 调整垂直位置（segmentOffsetY 是相对于文本顶部的）
    if (parentAnchor[1] === 0.5) {
      // 垂直居中：baseY 应该指向文本顶部
      baseY = baseY - totalTextHeight / 2;
    } else if (parentAnchor[1] === 1) {
      // 底部对齐：baseY 应该指向文本顶部
      baseY = baseY - totalTextHeight;
    }
    // 顶部对齐：baseY 就是文本顶部，不需要调整
    
    // 计算动画偏移量（state.x 和 state.y 已经包含了动画偏移）
    const { x: originalConfigX, y: originalConfigY } = this.convertPosition(
      this.config.x || parentX,
      this.config.y || parentY,
      context
    );
    
    const animatedX = (state.x !== undefined && typeof state.x === 'number') 
      ? state.x 
      : originalConfigX;
    const animatedY = (state.y !== undefined && typeof state.y === 'number')
      ? state.y
      : originalConfigY;
    
    const animOffsetX = animatedX - originalConfigX;
    const animOffsetY = animatedY - originalConfigY;
    
    // 最终位置 = 基准位置 + 片段偏移 + 动画偏移
    const x = baseX + segmentOffsetX + animOffsetX;
    const y = baseY + segmentOffsetY + animOffsetY;
    
    return {
      x,
      y,
      baseline: 'top', // 分割片段使用 top baseline
    };
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
   * 将状态中的变换应用到 Paper.js 对象
   * 这是一个统一的动画应用方法，所有元素都应该使用它来应用变换
   * @param {Object} item - Paper.js 对象（Path, Raster, Group, PointText 等）
   * @param {Object} state - 元素状态（从 getStateAtTime 获取）
   * @param {Object} options - 选项
   * @param {paper.Point} options.pivot - 变换的中心点（用于 rotation 和 scale），如果不提供则使用 item.position
   * @param {boolean} options.applyPosition - 是否应用位置（x, y），默认 true
   * @param {boolean} options.applyOpacity - 是否应用透明度，默认 true
   * @param {boolean} options.applyRotation - 是否应用旋转，默认 true
   * @param {boolean} options.applyScale - 是否应用缩放，默认 true
   * @param {Object} options.paperInstance - Paper.js 实例 { project, paper }（可选）
   */
  applyTransform(item, state, options = {}) {
    if (!item) return;

    const {
      pivot = null,
      applyPosition = true,
      applyOpacity = true,
      applyRotation = true,
      applyScale = true,
      paperInstance = null,
    } = options;
    
    // 获取 Paper.js 实例
    const { paper: p } = this.getPaperInstance(paperInstance);

    // 快速路径：检查是否有需要应用的变换
    const needsPosition = applyPosition && state.x !== undefined && typeof state.x === 'number' && state.y !== undefined && typeof state.y === 'number';
    const needsOpacity = applyOpacity && state.opacity !== undefined;
    const needsRotation = applyRotation && state.rotation !== undefined && state.rotation !== 0;
    const needsScale = applyScale && (state.scaleX !== undefined || state.scaleY !== undefined) && 
                       ((state.scaleX !== undefined && state.scaleX !== 1) || (state.scaleY !== undefined && state.scaleY !== 1));
    
    if (!needsPosition && !needsOpacity && !needsRotation && !needsScale) {
      return; // 没有需要应用的变换，直接返回
    }

    // 应用位置（x, y）
    if (needsPosition) {
      // 如果 item 有 position 属性，直接设置
      if (item.position !== undefined) {
        item.position = new p.Point(state.x, state.y);
      } else if (item.center !== undefined) {
        // 对于 Path 等对象，使用 center
        item.center = new p.Point(state.x, state.y);
      }
    }

    // 应用透明度
    if (needsOpacity) {
      item.opacity = state.opacity;
    }

    // 确定变换中心点（只在需要旋转或缩放时计算）
    if (needsRotation || needsScale) {
      let transformPivot;
      if (pivot) {
        transformPivot = pivot;
      } else if (item.position) {
        transformPivot = item.position;
      } else if (item.center) {
        transformPivot = item.center;
      } else {
        transformPivot = new p.Point(0, 0);
      }

      // 应用旋转
      if (needsRotation) {
        item.rotate(state.rotation, transformPivot);
      }

      // 应用缩放
      if (needsScale) {
        const scaleX = state.scaleX !== undefined ? state.scaleX : 1;
        const scaleY = state.scaleY !== undefined ? state.scaleY : 1;
        
        // 只有当 scaleX 或 scaleY 不等于 1 时才应用缩放（包括 0 的情况）
        if (scaleX !== 1 || scaleY !== 1) {
          // 如果 scaleX 或 scaleY 为 0，需要先设置一个很小的值，否则 Paper.js 可能无法正确渲染
          const finalScaleX = scaleX === 0 ? 0.001 : scaleX;
          const finalScaleY = scaleY === 0 ? 0.001 : scaleY;
          item.scale(finalScaleX, finalScaleY, transformPivot);
        }
      }
    }
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
   * 调用 onLoaded 回调（如果存在且未调用过）
   * @param {number} time - 当前时间（秒）
   * @param {paper.Item} paperItem - Paper.js 项目（如果已创建）
   * @param {Object} paperInstance - Paper.js 实例 { project, paper }
   */
  _callOnLoaded(time, paperItem = null, paperInstance = null) {
    if (this.onLoaded && !this._loadedCallbackCalled) {
      try {
        // 获取正确的 Paper.js 实例
        const { paper: p, project } = this.getPaperInstance(paperInstance || this._paperInstance);
        
        // 临时设置全局 paper.project 为当前实例的 project
        const originalProject = paper.project;
        if (project && paper) {
          paper.project = project;
        }
        
        try {
          // 调用 onLoaded 回调
          // 如果回调接受 3 个参数，传递 paperItem 作为第三个参数
          // 如果回调接受 4 个参数，传递 paperInstance 作为第四个参数
          if (this.onLoaded.length >= 4) {
            this.onLoaded(this, time, paperItem, { paper: p, project });
          } else if (this.onLoaded.length >= 3) {
            this.onLoaded(this, time, paperItem);
          } else {
            this.onLoaded(this, time);
          }
          this._loadedCallbackCalled = true;
        } finally {
          // 恢复原始的 project
          if (originalProject !== undefined) {
            paper.project = originalProject;
          }
        }
      } catch (e) {
        console.warn(`[${this.type}] onLoaded 回调执行失败:`, e);
      }
    }
  }

  /**
   * 调用 onRender 回调（如果存在）
   * @param {number} time - 当前时间（秒）
   * @param {paper.Item} paperItem - Paper.js 项目（如果已创建）
   * @param {Object} paperInstance - Paper.js 实例 { project, paper }
   */
  _callOnRender(time, paperItem = null, paperInstance = null) {
    // 如果元素有 _paperItem 属性，更新它（用于 onFrame 中访问）
    if (paperItem && this._paperItem !== paperItem) {
      this._paperItem = paperItem;
    }
    
    if (this.onRender) {
      try {
        // 获取正确的 Paper.js 实例
        const { paper: p, project } = this.getPaperInstance(paperInstance || this._paperInstance);
        
        // 临时设置全局 paper.project 为当前实例的 project
        const originalProject = paper.project;
        if (project && paper) {
          paper.project = project;
        }
        
        try {
          // 调用 onRender 回调
          // 如果回调接受 3 个参数，传递 paperItem 作为第三个参数
          // 如果回调接受 4 个参数，传递 paperInstance 作为第四个参数
          if (this.onRender.length >= 4) {
            this.onRender(this, time, paperItem, { paper: p, project });
          } else if (this.onRender.length >= 3) {
            this.onRender(this, time, paperItem);
          } else {
            this.onRender(this, time);
          }
        } finally {
          // 恢复原始的 project
          if (originalProject !== undefined) {
            paper.project = originalProject;
          }
        }
      } catch (e) {
        console.warn(`[${this.type}] onRender 回调执行失败:`, e);
      }
    }
  }

  /**
   * 调用 onFrame 回调（如果存在）
   * @param {Object} event - Paper.js onFrame 事件对象 { count, time, delta }
   * @param {paper.Item} paperItem - Paper.js 项目（如果已创建）
   * @param {Object} paperInstance - Paper.js 实例 { project, paper }
   */
  _callOnFrame(event, paperItem = null, paperInstance = null) {
    // 更新 Paper.js 项目引用
    if (paperItem && this._paperItem !== paperItem) {
      this._paperItem = paperItem;
    }
    
    // 保存 paperInstance 以便在 onFrame 回调中使用
    if (paperInstance && !this._paperInstance) {
      this._paperInstance = paperInstance;
    }
    
    if (this.onFrame) {
      try {
        // 获取正确的 Paper.js 实例
        const { paper: p, project } = this.getPaperInstance(paperInstance || this._paperInstance);
        
        // 临时设置全局 paper.project 为当前实例的 project
        // 这样用户在 onFrame 回调中使用 paper. 时，可以访问到正确的 project
        const originalProject = paper.project;
        if (project && paper) {
          paper.project = project;
        }
        
        try {
          // 调用 onFrame 回调
          // 如果回调接受 4 个参数，传递 paperInstance 作为第四个参数
          // 否则只传递 3 个参数（保持向后兼容）
          if (this.onFrame.length >= 4) {
            this.onFrame(this, event, this._paperItem || paperItem, { paper: p, project });
          } else {
            this.onFrame(this, event, this._paperItem || paperItem);
          }
        } finally {
          // 恢复原始的 project
          if (originalProject !== undefined) {
            paper.project = originalProject;
          }
        }
      } catch (e) {
        console.warn(`[${this.type}] onFrame 回调执行失败:`, e);
      }
    }
  }

  /**
   * 获取 Paper.js 实例（辅助方法，用于在 render 方法中获取 paper 和 project）
   * @param {Object} paperInstance - Paper.js 实例 { project, paper }
   * @returns {Object} { paper, project } - Paper.js 对象和项目
   */
  getPaperInstance(paperInstance = null) {
    // 如果没有传入 paperInstance，尝试使用全局 paper（向后兼容）
    if (!paperInstance) {
      return {
        paper: paper,
        project: paper.project || null,
      };
    }
    return {
      paper: paperInstance.paper || paper,
      project: paperInstance.project || (paper.project || null),
    };
  }

  /**
   * 销毁元素
   */
  destroy() {
    this.animations = [];
    this.config = {};
    this.parent = null;
    this.onLoaded = null;
    this.onRender = null;
    this._loadedCallbackCalled = false;
  }
}

