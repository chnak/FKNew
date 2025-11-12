/**
 * 轨道类 - 本身是一个独立的 VideoMaker（嵌套合成）
 */
import { Scene } from './Scene.js';
import { Transition } from './Transition.js';
import { VideoMaker } from '../core/VideoMaker.js';
import { CompositionElement } from '../elements/CompositionElement.js';

/**
 * 轨道类 - 继承自 VideoMaker
 */
export class Track extends VideoMaker {
  constructor(config = {}) {
    // 初始化 VideoMaker
    super({
      width: config.width || config.builder?.config?.width || 1920,
      height: config.height || config.builder?.config?.height || 1080,
      fps: config.fps || config.builder?.config?.fps || 30,
      duration: 0, // 初始为0，会根据场景自动计算
      backgroundColor: 'transparent', // 轨道背景透明
    });
    
    this.builder = config.builder;
    this.zIndex = config.zIndex || 0;
    this.name = config.name || `Track-${this.zIndex}`;
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
   * 构建轨道（将场景作为 CompositionElement 添加到轨道）
   */
  build() {
    const totalDuration = this.getTotalDuration();
    
    // 更新轨道合成的时长
    this.setDuration(totalDuration);
    
    // 获取轨道图层
    const trackLayer = this.createElementLayer();
    
    // 先创建所有场景元素
    const sceneElements = [];
    let currentTime = 0;
    
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i];
      const sceneStartTime = scene.startTime !== undefined ? scene.startTime : currentTime;
      
      // 构建场景为独立的 VideoMaker
      const sceneComposition = scene.build();
      
      // 创建 CompositionElement 包装场景合成
      const sceneElement = new CompositionElement({
        x: this.width / 2,
        y: this.height / 2,
        width: this.width,
        height: this.height,
        composition: sceneComposition,
        anchor: [0.5, 0.5],
        startTime: sceneStartTime,
        endTime: sceneStartTime + scene.duration,
      });
      
      sceneElements.push(sceneElement);
      currentTime = sceneStartTime + scene.duration;
    }
    
    // 应用转场效果并添加场景元素到图层
    for (let i = 0; i < sceneElements.length; i++) {
      const sceneElement = sceneElements[i];
      const scene = this.scenes[i];
      
      // 添加到轨道图层
      trackLayer.addElement(sceneElement);
      
      // 处理转场
      if (i < sceneElements.length - 1) {
        const nextSceneElement = sceneElements[i + 1];
        const nextScene = this.scenes[i + 1];
        
        // 查找转场
        const transition = this.transitions.find(t => 
          (t.fromScene === scene || t.fromSceneIndex === i) &&
          (t.toScene === nextScene || t.toSceneIndex === i + 1)
        );
        
        if (transition && transition.duration > 0) {
          // 计算转场时间（前一个场景结束时间）
          const transitionTime = sceneElement.endTime;
          const transitionStartTime = Math.max(0, transitionTime - transition.duration);
          
          // 创建转场元素（Scene 本身就是 VideoMaker）
          const transitionElement = transition.createTransitionElement(
            scene, // 源场景合成（Scene extends VideoMaker）
            nextScene, // 目标场景合成（Scene extends VideoMaker）
            transitionTime,
            this.width,
            this.height
          );
          
          // 调整场景元素的可见时间，避免与转场重叠
          sceneElement.endTime = transitionStartTime;
          nextSceneElement.startTime = transitionTime;
          
          // 添加转场元素到图层（zIndex 更高，确保在最上层）
          transitionElement.zIndex = 9999;
          trackLayer.addElement(transitionElement);
        }
      }
    }

    return this;
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
    // 调用父类的销毁方法
    super.destroy();
  }
}

