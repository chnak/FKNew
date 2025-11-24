import { BaseElement } from './BaseElement.js';
import { DEFAULT_TEXT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { toPixels } from '../utils/unit-converter.js';
import {createCanvas} from 'canvas'
import paper from 'paper';


/**
 * 简化版语法高亮器（与 CodeBlock 保持一致的高亮规则）
 */
class SyntaxHighlighter {
  constructor(language = 'javascript') {
    this.language = language.toLowerCase();
  }

  getKeywords() {
    const keywordMap = {
      javascript: ['const','let','var','function','async','await','return','if','else','for','while','switch','case','try','catch','finally','throw','new','class','extends','import','export','from','as'],
      python: ['def','class','if','elif','else','for','while','try','except','finally','with','as','import','from','return','yield'],
      java: ['public','private','protected','static','final','class','interface','new','return','if','else','for','while','try','catch','finally']
    };
    return keywordMap[this.language] || keywordMap.javascript;
  }

  isNumber(str) { return /^[\d.]+$/.test(str); }
  isOperator(str) { return /^[+\-*/%=<>!&|^~?:;,.]$/.test(str) || /^(==|!=|===|!==|<=|>=|&&|\|\||>>|<<|\*\*|=>)$/.test(str); }

  tokenize(line) {
    const tokens = [];
    let current = '';
    let inString = false;
    let stringChar = null;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i+1];

      if ((char === '"' || char === "'" || char === '`') && !inString) {
        if (current) { tokens.push({ text: current, type: 'other' }); current = ''; }
        inString = true; stringChar = char; current = char; continue;
      }
      if (inString && char === stringChar) { current += char; tokens.push({ text: current, type: 'string' }); current = ''; inString = false; stringChar = null; continue; }
      if (inString) { current += char; continue; }

      if ((char === '/' && nextChar === '/') || char === '#' || (char === '/' && nextChar === '*')) {
        if (current) { tokens.push({ text: current, type: 'other' }); current = ''; }
        tokens.push({ text: line.slice(i), type: 'comment' }); break;
      }

      if (char === ' ' || this.isOperator(char)) {
        if (current) {
          const trimmed = current.trim();
          if (trimmed) {
            let type = 'identifier';
            const keywords = this.getKeywords();
            if (keywords.includes(trimmed)) type = 'keyword';
            else if (this.isNumber(trimmed)) type = 'number';
            else if (/^[A-Z]/.test(trimmed)) type = 'function';
            tokens.push({ text: trimmed, type });
          }
          current = '';
        }
        if (char === ' ') tokens.push({ text: ' ', type: 'space' }); else tokens.push({ text: char, type: 'operator' });
      } else {
        current += char;
      }
    }
    if (current) {
      const trimmed = current.trim();
      if (trimmed) {
        let type = 'identifier';
        const keywords = this.getKeywords();
        if (keywords.includes(trimmed)) type = 'keyword';
        else if (this.isNumber(trimmed)) type = 'number';
        else if (/^[A-Z]/.test(trimmed)) type = 'function';
        tokens.push({ text: trimmed, type });
      }
    }
    return tokens;
  }

  highlight(code) {
    const lines = (code || '').split('\n');
    return lines.map(line => ({ line, tokens: this.tokenize(line) }));
  }
}

export class CodeElement extends BaseElement {
  constructor(config = {}) {
    const merged = deepMerge({}, DEFAULT_TEXT_CONFIG, config);
    super(merged);
    this.type = 'code';
    this.config = merged;

    this.code = this.config.code || '';
    this.language = this.config.language || 'javascript';
    this.theme = this.config.theme || 'dark';
    this.showLineNumbers = this.config.showLineNumbers !== false;
    this.padding = this.config.padding !== undefined ? this.config.padding : 12;
    this.lineHeight = this.config.lineHeight || 1.6;
    this.fontSize = this.config.fontSize || 20;
    this.showBorder = this.config.showBorder !== false;
    this.borderRadius = this.config.borderRadius || 8;
    this.borderWidth = this.config.borderWidth !== undefined ? this.config.borderWidth : (this.showBorder ? 2 : 0);
    this.bgcolor = this.config.bgcolor || null;
    this.borderColor = this.config.borderColor || null;

    this.highlighter = new SyntaxHighlighter(this.language);
    this.highlightedLines = this.highlighter.highlight(this.code);
    
    // 缓存用于宽度测量
    this._widthCache = new Map();
  }

  /**
   * 使用 canvas 测量文本宽度
   */
  measureTextWidth(text, fontSize, fontFamily = 'Courier New') {
    const cacheKey = `${text}|${fontSize}|${fontFamily}`;
    if (this._widthCache.has(cacheKey)) {
      return this._widthCache.get(cacheKey);
    }

    const canvas = createCanvas();

    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;
    const width = ctx.measureText(text).width;
    
    this._widthCache.set(cacheKey, width);
    return width;
  }

  initialize() {
    return Promise.resolve();
  }

  render(layer, time, paperInstance = null) {
    if (!this.visible) return null;
    const p = paperInstance ? paperInstance.paper : paper;

    if (!this.isActiveAtTime(time)) return null;

    const project = paperInstance ? paperInstance.project : (paper.project || null);
    const viewSize = project && project.view && project.view.viewSize ? project.view.viewSize : { width: 1920, height: 1080 };
    const context = { width: this.canvasWidth || viewSize.width, height: this.canvasHeight || viewSize.height, baseFontSize: 16 };

    const state = this.getStateAtTime(time, context);
    const fontSize = this.convertFontSize(state.fontSize || this.fontSize, context, 20);
    const lineHeightPx = fontSize * this.lineHeight;

    // 几何尺寸
    const elementWidth = state.width || this.config.width || context.width;
    const elementHeight = state.height || this.config.height || context.height;

    // 背景和边框
    const fillColor = state.bgcolor || this.bgcolor || (this.theme === 'light' ? '#ffffff' : '#071226');
    const strokeColor = state.borderColor || this.borderColor || (this.theme === 'light' ? '#e6e6e6' : '#2b2b2b');
    const strokeWidth = state.borderWidth || this.borderWidth || 0;

    // 计算元素左上角位置（考虑 anchor）
    const pos = this.calculatePosition(state, context, { elementWidth, elementHeight });

    // 在内容绘制前先绘制背景矩形（支持圆角）
    let bgRect = null;
    if (elementWidth > 0 && elementHeight > 0) {
      const r = Math.min(this.borderRadius || 0, elementWidth / 2, elementHeight / 2);
      if (r > 0) {
        const path = new p.Path();
        path.moveTo(new p.Point(pos.x + r, pos.y));
        path.lineTo(new p.Point(pos.x + elementWidth - r, pos.y));
        path.arcTo(new p.Point(pos.x + elementWidth, pos.y + r));
        path.lineTo(new p.Point(pos.x + elementWidth, pos.y + elementHeight - r));
        path.arcTo(new p.Point(pos.x + elementWidth - r, pos.y + elementHeight));
        path.lineTo(new p.Point(pos.x + r, pos.y + elementHeight));
        path.arcTo(new p.Point(pos.x, pos.y + elementHeight - r));
        path.lineTo(new p.Point(pos.x, pos.y + r));
        path.arcTo(new p.Point(pos.x + r, pos.y));
        path.closePath();
        bgRect = path;
      } else {
        bgRect = new p.Path.Rectangle({ rectangle: new p.Rectangle(pos.x, pos.y, elementWidth, elementHeight) });
      }

      if (bgRect) {
        bgRect.fillColor = fillColor;
        if (strokeWidth > 0 && strokeColor) {
          bgRect.strokeColor = strokeColor;
          bgRect.strokeWidth = strokeWidth;
        }

        // 应用动画/变换
        this.applyTransform(bgRect, state, { pivot: new p.Point(pos.x + elementWidth/2, pos.y + elementHeight/2), paperInstance });
        layer.addChild(bgRect);
        this._callOnRender(time, bgRect, paperInstance);
      }
    }

    // 上对齐：使用固定 padding（顶部缩进）
    const paddingPx = this.padding;

    const lineNumberWidth = this.showLineNumbers ? 50 : 0;
    const contentStartX = pos.x + paddingPx + lineNumberWidth + 8;
    const contentStartY = pos.y + paddingPx;

    // 遍历行，创建 PointText
    this.highlightedLines.forEach((lineData, idx) => {
      const centerY = contentStartY + idx * lineHeightPx + (lineHeightPx / 2);

      if (this.showLineNumbers) {
        const ln = new p.PointText(new p.Point(pos.x + (lineNumberWidth - 8), centerY));
        ln.content = String(idx + 1);
        ln.fontSize = fontSize;
        ln.fontFamily = state.fontFamily || 'Courier New';
        ln.justification = 'right';
        ln.fillColor = '#888888';
      }

      // 逐 token 渲染（使用 canvas 精确测量宽度）
      let currentX = contentStartX;
      const fontFamily = state.fontFamily || 'Courier New';
      for (const token of lineData.tokens) {
        if (token.type === 'space') {
          const spaceWidth = this.measureTextWidth(token.text, fontSize, fontFamily);
          currentX += spaceWidth;
          continue;
        }
        const pt = new p.PointText(new p.Point(currentX, centerY));
        pt.content = token.text;
        pt.fontSize = fontSize;
        pt.fontFamily = fontFamily;
        pt.justification = 'left';
        const colorMap = { keyword: '#ff6b9d', string: '#00ff88', comment: '#888888', number: '#ffd700', operator: '#ffffff', function: '#00d9ff', identifier: '#ffffff', other: '#ffffff' };
        pt.fillColor = colorMap[token.type] || '#ffffff';
        const tokenWidth = this.measureTextWidth(token.text, fontSize, fontFamily);
        currentX += tokenWidth;
      }
    });

    return null;
  }

  setCode(code, language = null) {
    this.code = code;
    if (language) this.language = language;
    this.highlighter = new SyntaxHighlighter(this.language);
    this.highlightedLines = this.highlighter.highlight(this.code);
  }
}

export default CodeElement;
