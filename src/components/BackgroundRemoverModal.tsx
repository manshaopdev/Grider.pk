import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Eraser, 
  Download, 
  RotateCcw, 
  Check, 
  Upload, 
  Sliders, 
  Eye, 
  MousePointer2 
} from 'lucide-react';
import { samplePixelColor, removeColorBackground, eraseAtPoint, ColorRGB } from '../utils/bgRemover';
import { downloadFile } from '../utils/exportUtils';

interface BackgroundRemoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl?: string | null;
  onApplyToCanvas: (transparentDataUrl: string) => void;
  lang: 'en' | 'ur';
}

export const BackgroundRemoverModal: React.FC<BackgroundRemoverModalProps> = ({
  isOpen,
  onClose,
  initialImageUrl,
  onApplyToCanvas,
  lang
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [tolerance, setTolerance] = useState<number>(25);
  const [feather, setFeather] = useState<number>(5);
  const [brushSize, setBrushSize] = useState<number>(25);
  const [activeTool, setActiveTool] = useState<'sample' | 'eraser'>('sample');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [sampledColor, setSampledColor] = useState<ColorRGB | null>(null);

  // Load initial image or sample
  useEffect(() => {
    if (!isOpen) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const source = initialImageUrl || createDemoSampleImage();
    img.src = source;

    img.onload = () => {
      setOriginalImage(img);
      initCanvasWithImage(img);
    };
  }, [isOpen, initialImageUrl]);

  const initCanvasWithImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions respecting aspect ratio
    const maxDimension = 600;
    let w = img.width;
    let h = img.height;

    if (w > maxDimension || h > maxDimension) {
      if (w > h) {
        h = Math.round((h * maxDimension) / w);
        w = maxDimension;
      } else {
        w = Math.round((w * maxDimension) / h);
        h = maxDimension;
      }
    }

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    // Save initial state to history
    const initialData = ctx.getImageData(0, 0, w, h);
    setHistory([initialData]);
    setSampledColor(null);
  };

  const handleUploadNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = dataUrl;
        img.onload = () => {
          setOriginalImage(img);
          initCanvasWithImage(img);
        };
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const saveHistoryStep = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-10), currentData]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'sample') {
      const color = samplePixelColor(canvas, x, y);
      setSampledColor(color);
      saveHistoryStep();
      removeColorBackground(canvas, color, tolerance, feather);
    }
  };

  // Pointer drag for eraser tool
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'eraser') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveHistoryStep();
    setIsErasing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    eraseAtPoint(canvas, x, y, brushSize);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isErasing || activeTool !== 'eraser') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    eraseAtPoint(canvas, x, y, brushSize);
  };

  const handlePointerUp = () => {
    setIsErasing(false);
  };

  const handleApplyPreset = (color: ColorRGB) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveHistoryStep();
    removeColorBackground(canvas, color, tolerance, feather);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousStates = [...history];
    previousStates.pop(); // Remove current
    const stateToRestore = previousStates[previousStates.length - 1];

    if (stateToRestore) {
      ctx.putImageData(stateToRestore, 0, 0);
      setHistory(previousStates);
    }
  };

  const handleReset = () => {
    if (originalImage) {
      initCanvasWithImage(originalImage);
    }
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onApplyToCanvas(dataUrl);
    onClose();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    downloadFile(dataUrl, 'transparent_pakistan_logo.png');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit">
                {lang === 'ur' ? 'بیک گراؤنڈ ریموور ٹول' : 'Instant Background Remover'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' ? 'کسی بھی تصویر یا لوگو کا بیک گراؤنڈ ختم کر کے شفاف پی این جی بنائیں' : 'Sample color or erase background to make transparent logos'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="space-y-5 order-2 md:order-1">
            {/* Upload Another Image */}
            <div>
              <label className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-stone-700 bg-stone-800/80 hover:bg-stone-800 rounded-lg text-xs font-semibold text-stone-200 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ur' ? 'نئی تصویر منتخب کریں' : 'Upload Another Image'}</span>
                <input type="file" accept="image/*" onChange={handleUploadNewImage} className="hidden" />
              </label>
            </div>

            {/* Tool Modes */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                {lang === 'ur' ? 'ٹول کا انتخاب' : 'Select Tool'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTool('sample')}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors ${
                    activeTool === 'sample'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <MousePointer2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'کلک ریموور' : 'Magic Picker'}</span>
                </button>

                <button
                  onClick={() => setActiveTool('eraser')}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors ${
                    activeTool === 'eraser'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'مینوئل ایریزر' : 'Eraser Brush'}</span>
                </button>
              </div>
            </div>

            {/* One-Click Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                {lang === 'ur' ? 'فوری پری سیٹس' : '1-Click Presets'}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleApplyPreset({ r: 255, g: 255, b: 255 })}
                  className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md text-[11px] text-stone-200 text-center font-medium"
                >
                  {lang === 'ur' ? 'سفید ختم' : 'White BG'}
                </button>
                <button
                  onClick={() => handleApplyPreset({ r: 0, g: 0, b: 0 })}
                  className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md text-[11px] text-stone-200 text-center font-medium"
                >
                  {lang === 'ur' ? 'سیاہ ختم' : 'Black BG'}
                </button>
                <button
                  onClick={() => handleApplyPreset({ r: 0, g: 255, b: 0 })}
                  className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md text-[11px] text-stone-200 text-center font-medium"
                >
                  {lang === 'ur' ? 'سبز ختم' : 'Green BG'}
                </button>
              </div>
            </div>

            {/* Tolerance & Brush Adjustments */}
            <div className="space-y-3 bg-stone-950/50 p-3 rounded-xl border border-stone-800">
              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                  <span>{lang === 'ur' ? 'ٹولرینس (رنگ کی حساسیت)' : 'Color Tolerance'}</span>
                  <span className="font-mono">{tolerance}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={80}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                  <span>{lang === 'ur' ? 'کناروں کی نرمی (Feather)' : 'Edge Feather'}</span>
                  <span className="font-mono">{feather}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {activeTool === 'eraser' && (
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'برش سائز' : 'Eraser Brush Size'}</span>
                    <span className="font-mono">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Undo / Reset */}
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="flex-1 py-1.5 px-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'واپس' : 'Undo'}</span>
              </button>

              <button
                onClick={handleReset}
                className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold transition-colors"
              >
                {lang === 'ur' ? 'ری سیٹ' : 'Reset'}
              </button>
            </div>
          </div>

          {/* Canvas Preview Column */}
          <div className="md:col-span-2 order-1 md:order-2 flex flex-col items-center justify-center bg-stone-950 p-4 rounded-xl border border-stone-800 min-h-[350px]">
            <div className="relative border border-stone-700/60 rounded overflow-hidden bg-checkerboard shadow-inner flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`max-w-full max-h-[420px] object-contain ${
                  activeTool === 'sample' ? 'cursor-crosshair' : 'cursor-pointer'
                }`}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-3 text-center">
              {activeTool === 'sample' 
                ? (lang === 'ur' ? '💡 تصویر میں جس رنگ پر کلک کریں گے وہ غائب ہو جائے گا' : '💡 Click on any background color to remove it instantly')
                : (lang === 'ur' ? '💡 برش کے ذریعے اضافی کناروں کو مٹائیں' : '💡 Drag eraser brush to clean edges')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ur' ? 'شفاف PNG ڈاؤنلوڈ کریں' : 'Download Transparent PNG'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
            >
              {lang === 'ur' ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950/50"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'ur' ? 'لوگو کینوس میں شامل کریں' : 'Apply to Logo Canvas'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generates an attractive default Pakistan emblem graphic on canvas if user has no image
function createDemoSampleImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Solid white background to demo removal
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 400, 400);

  // Green circular emblem
  ctx.fillStyle = '#01411C';
  ctx.beginPath();
  ctx.arc(200, 200, 140, 0, Math.PI * 2);
  ctx.fill();

  // Crescent & star in white
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(200, 200, 75, 0, Math.PI * 2);
  ctx.fill();

  // Subtract inner arc for crescent
  ctx.fillStyle = '#01411C';
  ctx.beginPath();
  ctx.arc(220, 185, 65, 0, Math.PI * 2);
  ctx.fill();

  // Star
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(235, 160, 20, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
