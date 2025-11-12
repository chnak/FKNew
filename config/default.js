/**
 * 默认配置
 */
export default {
  // 合成默认配置
  composition: {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 10,
    backgroundColor: '#000000',
    renderQuality: 'high',
  },

  // 渲染器配置
  renderer: {
    quality: 'high',
    antialias: true,
  },

  // FFmpeg 配置
  ffmpeg: {
    codec: 'libx264',
    preset: 'medium',
    crf: 23,
    pixelFormat: 'yuv420p',
    audioCodec: 'aac',
    audioBitrate: '128k',
  },

  // 导出配置
  export: {
    format: 'mp4',
    outputDir: './output',
  },
};

