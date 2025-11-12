/**
 * 开发环境配置
 */
import defaultConfig from './default.js';

export default {
  ...defaultConfig,
  
  // 开发环境覆盖配置
  composition: {
    ...defaultConfig.composition,
    fps: 24, // 开发时使用较低帧率加快渲染
  },

  renderer: {
    ...defaultConfig.renderer,
    quality: 'medium', // 开发时使用中等质量
  },

  // 启用调试日志
  debug: true,
};

