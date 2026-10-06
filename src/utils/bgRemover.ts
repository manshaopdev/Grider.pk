/**
 * Background Remover utility for canvas-based image processing
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export function removeColorBackground(
  canvas: HTMLCanvasElement,
  targetColor: ColorRGB,
  tolerance: number = 30, // 0 to 100
  feather: number = 5
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Max Euclidean distance is sqrt(255^2 + 255^2 + 255^2) ≈ 441.67
  const thresholdDistance = (tolerance / 100) * 441.67;
  const featherDistance = (feather / 100) * 441.67;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    // Euclidean color distance
    const dist = Math.sqrt(
      Math.pow(r - targetColor.r, 2) +
      Math.pow(g - targetColor.g, 2) +
      Math.pow(b - targetColor.b, 2)
    );

    if (dist <= thresholdDistance) {
      data[i + 3] = 0; // Completely transparent
    } else if (dist <= thresholdDistance + featherDistance && featherDistance > 0) {
      // Soft feather edge
      const alphaFactor = (dist - thresholdDistance) / featherDistance;
      data[i + 3] = Math.min(a, Math.round(a * alphaFactor));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Erase circular area with smooth edges (Manual brush eraser)
 */
export function eraseAtPoint(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number = 20,
  hardness: number = 0.8
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';

  if (hardness >= 0.95) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const gradient = ctx.createRadialGradient(x, y, radius * hardness, x, y, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Samples the color at specific canvas coordinates
 */
export function samplePixelColor(canvas: HTMLCanvasElement, x: number, y: number): ColorRGB {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { r: 255, g: 255, b: 255 };

  const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
    a: pixel[3]
  };
}
