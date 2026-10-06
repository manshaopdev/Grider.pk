import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid, 
  Eye, 
  Square, 
  Layers, 
  Maximize2,
  Undo2,
  Redo2,
  Palette,
  Sparkles
} from 'lucide-react';
import { CanvasBackground } from '../types';

interface EditorToolbarProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  background: CanvasBackground;
  onBackgroundChange: (bg: CanvasBackground) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  lang: 'en' | 'ur';
}

const BG_COLOR_PRESETS = [
  { name: 'Transparent', value: 'transparent', type: 'transparent' as const },
  { name: 'Pak Flag Green', value: '#01411C', type: 'solid' as const },
  { name: 'Crisp White', value: '#FFFFFF', type: 'solid' as const },
  { name: 'Pure Black', value: '#0A0A0A', type: 'solid' as const },
  { name: 'Royal Gold', value: '#D4AF37', type: 'solid' as const },
  { name: 'Truck Art Crimson', value: '#881337', type: 'solid' as const },
  { name: 'Navy Midnight', value: '#0F172A', type: 'solid' as const },
  { name: 'Deep Emerald', value: '#064E3B', type: 'solid' as const },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  zoom,
  onZoomChange,
  background,
  onBackgroundChange,
  showGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  lang
}) => {
  return (
    <div className="h-12 bg-stone-900/90 backdrop-blur border-b border-stone-800 px-4 flex items-center justify-between gap-4 text-xs select-none">
      {/* History Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`p-1.5 rounded-md transition-colors ${
            canUndo ? 'text-stone-300 hover:text-white hover:bg-stone-800' : 'text-stone-600 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={`p-1.5 rounded-md transition-colors ${
            canRedo ? 'text-stone-300 hover:text-white hover:bg-stone-800' : 'text-stone-600 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-stone-800 mx-2" />

        {/* Canvas Background Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 text-[11px] font-medium hidden sm:inline">
            {lang === 'ur' ? 'بیک گراؤنڈ:' : 'BG:'}
          </span>

          <div className="flex items-center gap-1">
            {BG_COLOR_PRESETS.map((p) => {
              const isSelected = p.type === 'transparent'
                ? background.type === 'transparent'
                : background.type === 'solid' && background.color === p.value;

              return (
                <button
                  key={p.name}
                  onClick={() => {
                    if (p.type === 'transparent') {
                      onBackgroundChange({ type: 'transparent', color: 'transparent' });
                    } else {
                      onBackgroundChange({ type: 'solid', color: p.value });
                    }
                  }}
                  title={p.name}
                  className={`w-5 h-5 rounded-md border transition-transform ${
                    isSelected ? 'ring-2 ring-emerald-400 scale-110 border-white' : 'border-stone-700 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: p.type === 'transparent' ? 'transparent' : p.value,
                    backgroundImage: p.type === 'transparent' 
                      ? 'linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%)' 
                      : 'none',
                    backgroundSize: '6px 6px'
                  }}
                />
              );
            })}
          </div>

          {/* Custom color input */}
          <div className="relative flex items-center ml-1">
            <input
              type="color"
              value={background.color.startsWith('#') ? background.color : '#01411C'}
              onChange={(e) => onBackgroundChange({ type: 'solid', color: e.target.value })}
              title="Custom Background Color"
              className="w-5 h-5 rounded cursor-pointer opacity-0 absolute inset-0"
            />
            <div className="w-5 h-5 rounded-md border border-stone-700 bg-stone-800 flex items-center justify-center hover:border-stone-500">
              <Palette className="w-3 h-3 text-stone-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid and Zoom Controls */}
      <div className="flex items-center gap-3">
        {/* Toggle Grid */}
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
            showGrid ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-700/50' : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
          title="Toggle alignment grid"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden md:inline">{lang === 'ur' ? 'گرڈ' : 'Grid'}</span>
        </button>

        <div className="h-4 w-px bg-stone-800" />

        {/* Zoom */}
        <div className="flex items-center gap-1 text-stone-300 bg-stone-800/80 px-2 py-1 rounded-lg border border-stone-700/50">
          <button
            onClick={() => onZoomChange(Math.max(0.4, zoom - 0.1))}
            className="p-0.5 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-[11px] font-mono w-10 text-center text-stone-200">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => onZoomChange(Math.min(2.5, zoom + 0.1))}
            className="p-0.5 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onZoomChange(1)}
            className="text-[10px] text-stone-400 hover:text-stone-200 ml-1 pl-1 border-l border-stone-700"
            title="Reset Zoom"
          >
            100%
          </button>
        </div>
      </div>
    </div>
  );
};
