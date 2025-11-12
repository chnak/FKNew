import { generateId } from '../utils/helpers.js';

/**
 * 时间线管理类
 */
export class Timeline {
  constructor(config = {}) {
    this.id = generateId('timeline');
    this.duration = config.duration || 10; // 秒
    this.fps = config.fps || 30;
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.playbackRate = config.playbackRate || 1;
    this.layers = [];
    this.events = []; // 时间线事件
  }

  /**
   * 设置持续时间
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * 设置帧率
   */
  setFPS(fps) {
    this.fps = fps;
  }

  /**
   * 添加图层
   */
  addLayer(layer) {
    if (!this.layers.includes(layer)) {
      this.layers.push(layer);
    }
  }

  /**
   * 移除图层
   */
  removeLayer(layer) {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  /**
   * 获取所有图层（按 zIndex 排序）
   */
  getLayers() {
    return [...this.layers].sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * 设置当前时间
   */
  setTime(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
  }

  /**
   * 获取当前时间
   */
  getTime() {
    return this.currentTime;
  }

  /**
   * 获取当前帧数
   */
  getCurrentFrame() {
    return Math.floor(this.currentTime * this.fps);
  }

  /**
   * 时间转帧数
   */
  timeToFrame(time) {
    return Math.floor(time * this.fps);
  }

  /**
   * 帧数转时间
   */
  frameToTime(frame) {
    return frame / this.fps;
  }

  /**
   * 播放
   */
  play() {
    this.isPlaying = true;
    this.isPaused = false;
  }

  /**
   * 暂停
   */
  pause() {
    this.isPaused = true;
    this.isPlaying = false;
  }

  /**
   * 停止
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTime = 0;
  }

  /**
   * 跳转到指定时间
   */
  seek(time) {
    this.setTime(time);
  }

  /**
   * 跳转到指定帧
   */
  seekToFrame(frame) {
    this.setTime(this.frameToTime(frame));
  }

  /**
   * 更新（用于播放时更新当前时间）
   */
  update(deltaTime) {
    if (this.isPlaying && !this.isPaused) {
      this.currentTime += deltaTime * this.playbackRate;
      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.stop();
      }
    }
  }

  /**
   * 获取指定时间激活的图层
   */
  getActiveLayersAtTime(time) {
    return this.getLayers().filter(layer => layer.isActiveAtTime(time));
  }

  /**
   * 添加时间线事件
   */
  addEvent(time, callback) {
    this.events.push({ time, callback });
    this.events.sort((a, b) => a.time - b.time);
  }

  /**
   * 触发时间线事件
   */
  triggerEvents(time) {
    for (const event of this.events) {
      if (Math.abs(event.time - time) < 1 / this.fps) {
        event.callback(time);
      }
    }
  }

  /**
   * 重置时间线
   */
  reset() {
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
  }
}

