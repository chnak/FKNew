import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { DEFAULT_FFMPEG_CONFIG } from '../types/constants.js';

/**
 * FFmpeg 工具类
 */
export class FFmpegUtil {
  constructor(config = {}) {
    this.config = { ...DEFAULT_FFMPEG_CONFIG, ...config };
  }

  /**
   * 检查 FFmpeg 是否可用
   */
  async checkFFmpeg() {
    try {
      const { stdout } = await execa('ffmpeg', ['-version']);
      return stdout.includes('ffmpeg version');
    } catch (error) {
      throw new Error('FFmpeg is not installed or not in PATH. Please install FFmpeg first.');
    }
  }

  /**
   * 将图片序列转换为视频
   * @param {string} inputPattern - 输入图片序列模式（如：frame_%04d.png）
   * @param {string} outputPath - 输出视频路径
   * @param {Object} options - 选项
   */
  async imagesToVideo(inputPattern, outputPath, options = {}) {
    await this.checkFFmpeg();

    const {
      fps = 30,
      width,
      height,
      codec = this.config.codec,
      preset = this.config.preset,
      crf = this.config.crf,
      pixelFormat = this.config.pixelFormat,
    } = options;

    const args = [
      '-y', // 覆盖输出文件
      '-framerate', fps.toString(),
      '-i', inputPattern,
      '-c:v', codec,
      '-preset', preset,
      '-crf', crf.toString(),
      '-pix_fmt', pixelFormat,
    ];

    if (width && height) {
      args.push('-s', `${width}x${height}`);
    }

    args.push(outputPath);

    try {
      await execa('ffmpeg', args);
      return outputPath;
    } catch (error) {
      throw new Error(`FFmpeg encoding failed: ${error.message}`);
    }
  }

  /**
   * 添加音频到视频
   * @param {string} videoPath - 视频路径
   * @param {string} audioPath - 音频路径
   * @param {string} outputPath - 输出路径
   * @param {Object} options - 选项
   */
  async addAudioToVideo(videoPath, audioPath, outputPath, options = {}) {
    await this.checkFFmpeg();

    const {
      audioCodec = this.config.audioCodec,
      audioBitrate = this.config.audioBitrate,
      audioStartTime = 0,
    } = options;

    const args = [
      '-y',
      '-i', videoPath,
      '-i', audioPath,
      '-c:v', 'copy', // 复制视频流，不重新编码
      '-c:a', audioCodec,
      '-b:a', audioBitrate,
      '-map', '0:v:0',
      '-map', '1:a:0',
    ];

    if (audioStartTime > 0) {
      args.push('-ss', audioStartTime.toString());
    }

    args.push('-shortest', outputPath);

    try {
      await execa('ffmpeg', args);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to add audio to video: ${error.message}`);
    }
  }

  /**
   * 合并多个视频
   * @param {string[]} videoPaths - 视频路径数组
   * @param {string} outputPath - 输出路径
   */
  async concatVideos(videoPaths, outputPath) {
    await this.checkFFmpeg();

    // 创建临时文件列表
    const listFile = path.join(path.dirname(outputPath), 'concat_list.txt');
    const listContent = videoPaths.map(p => `file '${path.resolve(p)}'`).join('\n');
    await fs.writeFile(listFile, listContent);

    const args = [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', listFile,
      '-c', 'copy',
      outputPath,
    ];

    try {
      await execa('ffmpeg', args);
      await fs.remove(listFile); // 清理临时文件
      return outputPath;
    } catch (error) {
      await fs.remove(listFile).catch(() => {});
      throw new Error(`Failed to concat videos: ${error.message}`);
    }
  }

  /**
   * 获取视频信息
   * @param {string} videoPath - 视频路径
   */
  async getVideoInfo(videoPath) {
    await this.checkFFmpeg();

    const args = [
      '-i', videoPath,
      '-hide_banner',
    ];

    try {
      const { stderr } = await execa('ffmpeg', args, { reject: false });
      // 解析 stderr 输出获取视频信息
      const durationMatch = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      const sizeMatch = stderr.match(/(\d+)x(\d+)/);
      const fpsMatch = stderr.match(/(\d+(?:\.\d+)?) fps/);

      return {
        duration: durationMatch ? this.parseDuration(durationMatch) : 0,
        width: sizeMatch ? parseInt(sizeMatch[1]) : 0,
        height: sizeMatch ? parseInt(sizeMatch[2]) : 0,
        fps: fpsMatch ? parseFloat(fpsMatch[1]) : 30,
      };
    } catch (error) {
      throw new Error(`Failed to get video info: ${error.message}`);
    }
  }

  /**
   * 解析时长字符串
   */
  parseDuration(match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);
    return hours * 3600 + minutes * 60 + seconds;
  }
}

