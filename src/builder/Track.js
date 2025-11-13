/**
 * 轨道类 - 直接使用 Layer 方式构建
 */
import { Scene } from './Scene.js';
import { Transition } from './Transition.js';

/**
 * 轨道类 - 直接创建 Layer 并添加元素，不使用 CompositionElement
 */
export class Track {
  constructor(config = {}) {
    this.builder = config.builder;
    this.zIndex = config.zIndex || 0;
    this.name = config.name || `Track-${this.zIndex}`;
    this.width = config.width || config.builder?.config?.width || 1920;
    this.height = config.height || config.builder?.config?.height || 1080;
    this.fps = config.fps || config.builder?.config?.fps || 30;
    this.scenes = [];
    this.transitions = []; // 场景之间的转场效果
  }

  /**
   * 创建场景
   * @param {Object} config - 场景配置 { duration, startTime, name }
   * @returns {Scene} 场景实例
   */
  createScene(config = {}) {
    const scene = new Scene({
      ...config,
      track: this,
      duration: config.duration || 5,
    });
    
    this.scenes.push(scene);
    return scene;
  }

  /**
   * 添加转场效果
   * @param {Object} config - 转场配置 { fromScene, toScene, type, duration }
   * @returns {Track} 返回自身以支持链式调用
   */
  addTransition(config = {}) {
    const transition = new Transition({
      ...config,
      track: this,
    });
    
    this.transitions.push(transition);
    return this;
  }

  /**
   * 获取所有场景
   * @returns {Array<Scene>}
   */
  getScenes() {
    return this.scenes;
  }

  /**
   * 计算轨道总时长
   * @returns {number} 总时长（秒）
   */
  getTotalDuration() {
    if (this.scenes.length === 0) return 0;
    
    let totalDuration = 0;
    for (const scene of this.scenes) {
      totalDuration += scene.duration;
    }
    
    // 加上转场时长
    for (const transition of this.transitions) {
      totalDuration += transition.duration || 0;
    }
    
    return totalDuration;
  }

  /**
   * 构建轨道（直接创建 Layer 并添加元素到 VideoMaker）
   * @param {VideoMaker} videoMaker - VideoMaker 实例
   * @returns {ElementLayer} 创建的 Layer
   */
  build(videoMaker) {
    const totalDuration = this.getTotalDuration();
    
    // 为轨道创建 Layer
    const layer = videoMaker.createElementLayer({
      zIndex: this.zIndex,
      startTime: 0,
      endTime: totalDuration,
    });
    
    // 构建所有场景，获取它们的元素
    let currentTime = 0;
    
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i];
      const sceneStartTime = scene.startTime !== undefined ? scene.startTime : currentTime;
      
      // 构建场景，返回元素实例数组
      const sceneElements = scene.build(sceneStartTime);
      
      // 将所有元素添加到 Layer 或 VideoMaker（音频元素特殊处理）
      for (const element of sceneElements) {
        // 设置元素的绝对时间（相对于视频开始）
        const relativeStartTime = element.startTime || 0;
        const absoluteStartTime = sceneStartTime + relativeStartTime;
        element.startTime = absoluteStartTime;
        
        // 更新元素的 endTime（基于绝对时间）
        if (element.duration !== undefined) {
          element.endTime = absoluteStartTime + element.duration;
        } else if (element.endTime !== Infinity) {
          // 如果 endTime 不是 Infinity，也需要转换为绝对时间
          element.endTime = sceneStartTime + (element.endTime - relativeStartTime);
        }
        
        // 音频元素需要添加到 VideoMaker 的 audioElements 数组，而不是 Layer
        if (element.type === 'audio') {
          // 更新音频元素的开始时间
          if (element.audioStartTime === undefined) {
            element.audioStartTime = 0;
          }
          videoMaker.addAudio(element);
        } else {
          // 设置元素的 canvasWidth 和 canvasHeight
          element.canvasWidth = videoMaker.width;
          element.canvasHeight = videoMaker.height;
          
          // 如果是分割文本，也需要设置子元素的 canvasWidth 和 canvasHeight
          if (element.type === 'text' && element.segments) {
            for (const segment of element.segments) {
              segment.canvasWidth = videoMaker.width;
              segment.canvasHeight = videoMaker.height;
            }
          }
          
          // 其他元素添加到 Layer
          layer.addElement(element);
        }
      }
      
      currentTime = sceneStartTime + scene.duration;
      
      // 处理转场（暂时跳过，转场需要特殊处理）
      // TODO: 转场效果需要重新设计
    }

    return layer;
  }

  /**
   * 销毁轨道
   */
  destroy() {
    for (const scene of this.scenes) {
      scene.destroy();
    }
    this.scenes = [];
    this.transitions = [];
  }
}

