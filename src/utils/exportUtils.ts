import { LogoProject, LogoElement } from '../types';

/**
 * Builds an SVG string representation of the current logo canvas
 */
export function generateSvgString(project: LogoProject): string {
  const { canvasWidth, canvasHeight, background, elements } = project;
  
  // Sort elements by zIndex
  const sorted = [...elements]
    .filter(el => el.isVisible)
    .sort((a, b) => a.zIndex - b.zIndex);

  let bgMarkup = '';
  if (background.type === 'solid') {
    bgMarkup = `<rect width="${canvasWidth}" height="${canvasHeight}" fill="${background.color}" />`;
  } else if (background.type === 'gradient' && background.gradient) {
    const { colors, angle } = background.gradient;
    bgMarkup = `
      <defs>
        <linearGradient id="canvasGradient" gradientTransform="rotate(${angle})">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="100%" stop-color="${colors[1]}" />
        </linearGradient>
      </defs>
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#canvasGradient)" />
    `;
  }

  const elementsMarkup = sorted.map((el) => {
    const filterStyle = `
      filter: brightness(${el.brightness ?? 100}%) 
              contrast(${el.contrast ?? 100}%) 
              saturate(${el.saturation ?? 100}%) 
              hue-rotate(${el.hueRotate ?? 0}deg) 
              sepia(${el.sepia ?? 0}%) 
              grayscale(${el.grayscale ?? 0}%) 
              invert(${el.invert ?? 0}%) 
              blur(${el.blur ?? 0}px);
    `;

    const transform = `translate(${el.x}, ${el.y}) rotate(${el.rotation}, ${el.width / 2}, ${el.height / 2})`;

    if (el.type === 'text') {
      const fontFamilyCss = el.fontFamily === 'font-nastaliq' 
        ? "'Noto Nastaliq Urdu', serif" 
        : el.fontFamily === 'font-amiri' 
        ? "'Amiri', serif" 
        : el.fontFamily === 'font-cinzel' 
        ? "'Cinzel', serif" 
        : el.fontFamily === 'font-outfit' 
        ? "'Outfit', sans-serif" 
        : "'Plus Jakarta Sans', sans-serif";

      return `
        <g transform="${transform}" opacity="${el.opacity / 100}" style="${filterStyle}">
          <text 
            x="${el.width / 2}" 
            y="${el.height / 2 + (el.fontSize ?? 32) / 3}" 
            fill="${el.fill}" 
            font-family="${fontFamilyCss}" 
            font-size="${el.fontSize ?? 32}" 
            font-weight="${el.fontWeight ?? 'normal'}" 
            text-anchor="middle"
            letter-spacing="${el.letterSpacing ?? 0}px"
          >
            ${escapeXml(el.text ?? '')}
          </text>
        </g>
      `;
    }

    if (el.type === 'image' && el.imageUrl) {
      return `
        <g transform="${transform}" opacity="${el.opacity / 100}" style="${filterStyle}">
          <image href="${el.imageUrl}" width="${el.width}" height="${el.height}" preserveAspectRatio="xMidYMid meet" />
        </g>
      `;
    }

    if (el.svgPath) {
      return `
        <g transform="${transform}" opacity="${el.opacity / 100}" style="${filterStyle}">
          <svg viewBox="${el.viewBox || '0 0 100 100'}" width="${el.width}" height="${el.height}">
            <path 
              d="${el.svgPath}" 
              fill="${el.fill}" 
              stroke="${el.stroke || 'none'}" 
              stroke-width="${el.strokeWidth || 0}" 
            />
          </svg>
        </g>
      `;
    }

    return '';
  }).join('\n');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${canvasHeight}" width="${canvasWidth}" height="${canvasHeight}">
      ${bgMarkup}
      ${elementsMarkup}
    </svg>
  `.trim();
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Exports the logo in ultra high resolution (PNG/JPEG up to 4096px Ultra HD)
 */
export async function exportLogoAsImage(
  project: LogoProject,
  format: 'png' | 'jpeg',
  resolutionMultiplier: number = 2, // 1 = 800px, 2 = 1600px, 4 = 3200px
  quality: number = 0.95
): Promise<string> {
  const svgString = generateSvgString(project);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const targetWidth = project.canvasWidth * resolutionMultiplier;
      const targetHeight = project.canvasHeight * resolutionMultiplier;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // If jpeg and transparent bg, fill with white
      if (format === 'jpeg' && project.background.type === 'transparent') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      URL.revokeObjectURL(url);
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mime, quality);
      resolve(dataUrl);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Downloads a data URL or SVG file to the user's computer
 */
export function downloadFile(dataUrlOrText: string, filename: string, isText = false) {
  const link = document.createElement('a');
  link.download = filename;

  if (isText) {
    const blob = new Blob([dataUrlOrText], { type: 'image/svg+xml;charset=utf-8' });
    link.href = URL.createObjectURL(blob);
  } else {
    link.href = dataUrlOrText;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
