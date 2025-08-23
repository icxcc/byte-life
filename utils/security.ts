/**
 * XSS 防护工具函数
 * 提供客户端和服务器端的安全防护功能
 */

/**
 * 基本的 HTML 实体编码
 * 防止 XSS 攻击
 */
export function encodeHTML(str: string): string {
  if (typeof str !== 'string') return str
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * 解码 HTML 实体
 */
export function decodeHTML(str: string): string {
  if (typeof str !== 'string') return str
  
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

/**
 * 验证 URL 是否安全
 * 防止 JavaScript: 等危险协议
 */
export function isSafeURL(url: string): boolean {
  if (typeof url !== 'string') return false
  
  try {
    const parsed = new URL(url, window.location.origin)
    const protocol = parsed.protocol.toLowerCase()
    
    // 允许的安全协议
    const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:']
    
    if (!safeProtocols.includes(protocol)) {
      return false
    }
    
    // 检查 JavaScript: 等危险内容
    if (url.toLowerCase().includes('javascript:')) {
      return false
    }
    
    if (url.toLowerCase().includes('data:')) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * 清理 HTML 内容
 * 移除危险的标签和属性
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') return html
  
  // 允许的标签
  const allowedTags = [
    'a', 'abbr', 'acronym', 'address', 'b', 'br', 'blockquote', 'cite', 'code',
    'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'pre', 'q', 's', 'samp',
    'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'p', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup',
    'col', 'img', 'figure', 'figcaption', 'hr', 'main', 'section', 'article',
    'aside', 'header', 'footer', 'nav', 'details', 'summary', 'menu'
  ]
  
  // 允许的属性
  const allowedAttributes = {
    '*': ['class', 'id', 'style', 'title', 'lang', 'dir', 'accesskey', 'tabindex'],
    a: ['href', 'target', 'rel', 'type', 'download', 'hreflang', 'referrerpolicy'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'loading'],
    source: ['src', 'srcset', 'sizes', 'type', 'media'],
    track: ['src', 'kind', 'srclang', 'label', 'default'],
    video: ['src', 'width', 'height', 'poster', 'preload', 'controls', 'autoplay', 'loop', 'muted'],
    audio: ['src', 'preload', 'controls', 'autoplay', 'loop', 'muted'],
    form: ['action', 'method', 'enctype', 'accept-charset', 'autocomplete', 'novalidate'],
    input: ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'readonly', 'maxlength',
            'minlength', 'pattern', 'min', 'max', 'step', 'autocomplete', 'autofocus', 'size'],
    textarea: ['name', 'placeholder', 'required', 'disabled', 'readonly', 'maxlength', 'minlength',
               'rows', 'cols', 'autocomplete', 'autofocus', 'wrap'],
    select: ['name', 'required', 'disabled', 'autocomplete', 'autofocus', 'size', 'multiple'],
    option: ['value', 'disabled', 'selected', 'label'],
    button: ['type', 'name', 'value', 'disabled', 'autofocus'],
    label: ['for'],
    fieldset: ['disabled', 'form'],
    legend: [],
    datalist: [],
    output: ['for', 'name', 'form'],
    meter: ['value', 'min', 'max', 'low', 'high', 'optimum', 'form'],
    progress: ['value', 'max', 'form'],
    time: ['datetime'],
    link: ['href', 'rel', 'type', 'sizes', 'media', 'hreflang', 'crossorigin'],
    meta: ['name', 'content', 'charset', 'http-equiv'],
    style: ['type', 'media', 'scoped'],
    script: ['src', 'type', 'charset', 'async', 'defer', 'crossorigin', 'integrity'],
    base: ['href', 'target']
  }
  
  // 创建一个临时 div 来解析 HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // 清理所有元素
  const cleanElement = (element: Element) => {
    // 检查标签是否允许
    const tagName = element.tagName.toLowerCase()
    if (!allowedTags.includes(tagName)) {
      element.parentNode?.removeChild(element)
      return
    }
    
    // 清理属性
    const attributes = Array.from(element.attributes)
    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase()
      const tagAttrs = allowedAttributes[tagName as keyof typeof allowedAttributes] || []
      const globalAttrs = allowedAttributes['*'] || []
      
      if (![...globalAttrs, ...tagAttrs].includes(attrName)) {
        element.removeAttribute(attr.name)
        continue
      }
      
      // 特殊处理 href 和 src 属性
      if (attrName === 'href' || attrName === 'src') {
        const value = attr.value
        if (!isSafeURL(value)) {
          element.removeAttribute(attr.name)
        }
      }
      
      // 处理 style 属性
      if (attrName === 'style') {
        const cleanStyle = sanitizeCSS(attr.value)
        element.setAttribute('style', cleanStyle)
      }
      
      // 处理 JavaScript 事件属性
      if (attrName.startsWith('on')) {
        element.removeAttribute(attr.name)
      }
    }
    
    // 递归清理子元素
    Array.from(element.children).forEach(cleanElement)
  }
  
  // 清理所有元素
  Array.from(tempDiv.children).forEach(cleanElement)
  
  return tempDiv.innerHTML
}

/**
 * 清理 CSS 样式
 */
export function sanitizeCSS(css: string): string {
  if (typeof css !== 'string') return css
  
  // 移除危险的 CSS 表达式
  return css
    .replace(/expression\(/gi, '/* disabled */(')
    .replace(/javascript:/gi, '/* disabled */:')
    .replace(/vbscript:/gi, '/* disabled */:')
    .replace(/@import/gi, '/* @import */')
    .replace(/url\(.*javascript:/gi, 'url(/* disabled */')
}

/**
 * 验证输入内容是否包含 XSS 攻击
 */
export function hasXSS(content: string): boolean {
  if (typeof content !== 'string') return false
  
  const xssPatterns = [
    /<script[^>]*>([\s\S]*?)<\/script>/gi,
    /javascript:[^\s"']*/gi,
    /on\w+\s*=\s*["']?[^"']*["']?/gi,
    /expression\([^)]*\)/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:image\/svg\+xml/gi,
    /<iframe[^>]*>([\s\S]*?)<\/iframe>/gi,
    /<object[^>]*>([\s\S]*?)<\/object>/gi,
    /<embed[^>]*>([\s\S]*?)<\/embed>/gi,
    /<applet[^>]*>([\s\S]*?)<\/applet>/gi,
    /<form[^>]*>([\s\S]*?)<\/form>/gi,
    /<meta[^>]*>/gi,
    /<link[^>]*>/gi
  ]
  
  return xssPatterns.some(pattern => pattern.test(content))
}

/**
 * 清理对象中的所有字符串字段
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = encodeHTML(sanitized[key])
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  
  return sanitized
}

/**
 * 安全的 innerHTML 设置
 */
export function setSafeHTML(element: HTMLElement, html: string): void {
  element.innerHTML = sanitizeHTML(html)
}

/**
 * 安全的 URL 设置
 */
export function setSafeURL(element: HTMLAnchorElement | HTMLImageElement, url: string): void {
  if (isSafeURL(url)) {
    if ('href' in element) {
      element.href = url
    } else if ('src' in element) {
      element.src = url
    }
  }
}

/**
 * CSP（内容安全策略）相关工具
 */
export const cspUtils = {
  /**
   * 生成 CSP 头内容
   */
  generateCSPHeader: (options: {
    defaultSrc?: string[]
    scriptSrc?: string[]
    styleSrc?: string[]
    imgSrc?: string[]
    connectSrc?: string[]
    fontSrc?: string[]
    objectSrc?: string[]
    mediaSrc?: string[]
    frameSrc?: string[]
    reportURI?: string
  } = {}): string => {
    const directives: string[] = []
    
    if (options.defaultSrc) {
      directives.push(`default-src ${options.defaultSrc.join(' ')}`)
    }
    
    if (options.scriptSrc) {
      directives.push(`script-src ${options.scriptSrc.join(' ')}`)
    }
    
    if (options.styleSrc) {
      directives.push(`style-src ${options.styleSrc.join(' ')}`)
    }
    
    if (options.imgSrc) {
      directives.push(`img-src ${options.imgSrc.join(' ')}`)
    }
    
    if (options.connectSrc) {
      directives.push(`connect-src ${options.connectSrc.join(' ')}`)
    }
    
    if (options.fontSrc) {
      directives.push(`font-s极rc ${options.fontSrc.join(' ')}`)
    }
    
    if (options.objectSrc) {
      directives.push(`object-src ${options.objectSrc.join(' ')}`)
    }
    
    if (options.mediaSrc) {
      directives.push(`media-src ${options.mediaSrc.join(' ')}`)
    }
    
    if (options.frameSrc) {
      directives.push(`frame-src ${options.frameSrc.join(' ')}`)
    }
    
    if (options.reportURI) {
      directives.push(`report-uri ${options.reportURI}`)
    }
    
    return directives.join('; ')
  }
}

/**
 * 安全工具默认导出
 */
export default {
  encodeHTML,
  decodeHTML,
  isSafeURL,
  sanitizeHTML,
  sanitizeCSS,
  hasXSS,
  sanitizeObject,
  setSafeHTML,
  setSafeURL,
  cspUtils
}