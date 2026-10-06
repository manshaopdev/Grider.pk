import React, { useState } from 'react';
import { 
  Type, 
  Sparkles, 
  Shapes, 
  Upload, 
  Sliders, 
  Layers, 
  Plus, 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  AlignCenter, 
  AlignVerticalJustifyCenter,
  Palette,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';
import { LogoElement, LogoProject } from '../types';
import { PAKISTAN_SYMBOLS, PAKISTANI_CALLIGRAPHY_PRESETS, PAKISTAN_COLOR_PALETTES } from '../data/pakistanSymbols';

interface EditorSidebarProps {
  project: LogoProject;
  selectedElement: LogoElement | null;
  onAddElement: (element: Partial<LogoElement>) => void;
  onUpdateElement: (id: string, updates: Partial<LogoElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onOpenBgRemoverWithImage?: (dataUrl: string) => void;
  lang: 'en' | 'ur';
}

type TabType = 'symbols' | 'text' | 'shapes' | 'uploads' | 'filters' | 'layers';

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  project,
  selectedElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onOpenBgRemoverWithImage,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('symbols');
  const [selectedSymbolCategory, setSelectedSymbolCategory] = useState<string>('national');
  const [customText, setCustomText] = useState('');
  const [customUrduFont, setCustomUrduFont] = useState('font-nastaliq');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onAddElement({
          type: 'image',
          name: file.name.substring(0, 15),
          imageUrl: dataUrl,
          width: 250,
          height: 250,
          x: project.canvasWidth / 2 - 125,
          y: project.canvasHeight / 2 - 125,
          fill: 'transparent'
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddCustomText = (textToAdd?: string, fontClass?: string) => {
    const text = textToAdd || customText || 'پاکستان';
    const font = fontClass || customUrduFont;
    onAddElement({
      type: 'text',
      name: text.substring(0, 15),
      text: text,
      fontFamily: font,
      fontSize: 48,
      fontWeight: '700',
      textAlign: 'center',
      fill: '#FFFFFF',
      width: 400,
      height: 70,
      x: project.canvasWidth / 2 - 200,
      y: project.canvasHeight / 2 - 35
    });
    if (!textToAdd) setCustomText('');
  };

  return (
    <aside className="w-80 sm:w-96 bg-stone-900 border-r border-stone-800 flex flex-col h-full select-none z-20">
      {/* Tab Navigation */}
      <div className="grid grid-cols-6 border-b border-stone-800 bg-stone-950/60 p-1 gap-1">
        {[
          { id: 'symbols' as TabType, label: lang === 'ur' ? 'نشانات' : 'Symbols', icon: Sparkles },
          { id: 'text' as TabType, label: lang === 'ur' ? 'متن' : 'Text', icon: Type },
          { id: 'shapes' as TabType, label: lang === 'ur' ? 'شیلڈز' : 'Badges', icon: Shapes },
          { id: 'uploads' as TabType, label: lang === 'ur' ? 'تصاویر' : 'Upload', icon: Upload },
          { id: 'filters' as TabType, label: lang === 'ur' ? 'فلٹرز' : 'Filters', icon: Sliders },
          { id: 'layers' as TabType, label: lang === 'ur' ? 'لیئرز' : 'Layers', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-medium truncate w-full text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: PAKISTANI SYMBOLS & EMBLEMS */}
        {activeTab === 'symbols' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                {lang === 'ur' ? 'پاکستانی نشانات و مونوگرام' : 'Pakistani Emblems & Motifs'}
              </span>
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {PAKISTAN_SYMBOLS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSymbolCategory(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                    selectedSymbolCategory === cat.id
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {lang === 'ur' ? cat.nameUrdu : cat.name}
                </button>
              ))}
            </div>

            {/* Symbols grid */}
            {PAKISTAN_SYMBOLS.filter(c => c.id === selectedSymbolCategory).map((cat) => (
              <div key={cat.id} className="grid grid-cols-2 gap-2.5">
                {cat.symbols.map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => {
                      onAddElement({
                        type: 'symbol',
                        name: sym.name,
                        svgPath: sym.svgPath,
                        viewBox: sym.viewBox,
                        fill: sym.defaultFill,
                        width: 180,
                        height: 180,
                        x: project.canvasWidth / 2 - 90,
                        y: project.canvasHeight / 2 - 90
                      });
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 hover:border-emerald-500/60 transition-all group hover:scale-[1.02]"
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      <svg viewBox={sym.viewBox} className="w-14 h-14 group-hover:scale-110 transition-transform">
                        <path d={sym.svgPath} fill={sym.defaultFill} />
                      </svg>
                    </div>
                    <span className="text-[11px] font-medium text-stone-300 group-hover:text-emerald-300 text-center line-clamp-1">
                      {lang === 'ur' ? sym.nameUrdu : sym.name}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TEXT & URDU CALLIGRAPHY */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                {lang === 'ur' ? 'نیا متن لکھیں' : 'Add Custom Text'}
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={lang === 'ur' ? 'یہاں نام یا تحریر لکھیں...' : 'Enter Urdu or English brand name...'}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomText();
                  }}
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleAddCustomText()}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'شامل کریں' : 'Add'}</span>
                </button>
              </div>

              {/* Font picker for new text */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-stone-400">{lang === 'ur' ? 'فونٹ:' : 'Font:'}</span>
                <select
                  value={customUrduFont}
                  onChange={(e) => setCustomUrduFont(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-md text-xs px-2 py-1 text-stone-200 focus:outline-none"
                >
                  <option value="font-nastaliq">نستعلیق (Noto Nastaliq Urdu)</option>
                  <option value="font-amiri">خط امیری (Amiri Arabic)</option>
                  <option value="font-cinzel">Cinzel (Royal Brand)</option>
                  <option value="font-outfit">Outfit (Modern Bold)</option>
                  <option value="font-jakarta">Plus Jakarta Sans</option>
                </select>
              </div>
            </div>

            {/* Quick Pakistani Calligraphy Seals */}
            <div className="space-y-2 pt-2 border-t border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                {lang === 'ur' ? 'تیار خطاطی اور القاب' : 'Urdu Calligraphy Presets'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PAKISTANI_CALLIGRAPHY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleAddCustomText(preset.text, preset.font)}
                    className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-800/90 border border-stone-700 hover:border-emerald-500/50 text-center transition-all group"
                  >
                    <span className={`block text-base text-stone-100 group-hover:text-emerald-400 ${preset.font}`}>
                      {preset.text}
                    </span>
                    <span className="block text-[10px] text-stone-500 mt-1 truncate">
                      {preset.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Element Typography Controller */}
            {selectedElement && selectedElement.type === 'text' && (
              <div className="p-3 bg-stone-950/70 border border-emerald-900/40 rounded-xl space-y-3">
                <span className="text-xs font-bold text-emerald-400">
                  {lang === 'ur' ? 'منتخب متن کی تبدیلیاں' : 'Edit Selected Text'}
                </span>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">
                    {lang === 'ur' ? 'تحریر:' : 'Content:'}
                  </label>
                  <input
                    type="text"
                    value={selectedElement.text || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ur' ? 'فونٹ سٹائل:' : 'Font:'}
                    </label>
                    <select
                      value={selectedElement.fontFamily || 'font-nastaliq'}
                      onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-md text-xs px-2 py-1 text-stone-200"
                    >
                      <option value="font-nastaliq">نستعلیق (Nastaliq)</option>
                      <option value="font-amiri">خط امیری (Amiri)</option>
                      <option value="font-cinzel">Cinzel (Royal)</option>
                      <option value="font-outfit">Outfit (Bold)</option>
                      <option value="font-jakarta">Jakarta Sans</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ur' ? 'سائز:' : 'Size:'} {selectedElement.fontSize || 32}px
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={120}
                      value={selectedElement.fontSize || 32}
                      onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Letter Spacing & Color */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ur' ? 'رنگ:' : 'Color:'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={selectedElement.fill.startsWith('#') ? selectedElement.fill : '#FFFFFF'}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="w-7 h-7 rounded border border-stone-700 cursor-pointer bg-transparent"
                      />
                      <span className="text-[11px] font-mono text-stone-300">{selectedElement.fill}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ur' ? 'حروف کا فاصلہ:' : 'Spacing:'} {selectedElement.letterSpacing || 0}px
                    </label>
                    <input
                      type="range"
                      min={-2}
                      max={20}
                      value={selectedElement.letterSpacing || 0}
                      onChange={(e) => onUpdateElement(selectedElement.id, { letterSpacing: Number(e.target.value) })}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHAPES & BADGES */}
        {activeTab === 'shapes' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
              {lang === 'ur' ? 'شیلڈز، مونوگرام اور فریمز' : 'Crests, Shields & Badges'}
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {PAKISTAN_SYMBOLS.find(c => c.id === 'shields')?.symbols.map((sym) => (
                <button
                  key={sym.id}
                  onClick={() => {
                    onAddElement({
                      type: 'badge',
                      name: sym.name,
                      svgPath: sym.svgPath,
                      viewBox: sym.viewBox,
                      fill: sym.defaultFill,
                      width: 220,
                      height: 220,
                      x: project.canvasWidth / 2 - 110,
                      y: project.canvasHeight / 2 - 110
                    });
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-800 hover:bg-stone-800/90 border border-stone-700/60 hover:border-emerald-500 transition-all group"
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-1">
                    <svg viewBox={sym.viewBox} className="w-14 h-14 group-hover:scale-110 transition-transform">
                      <path d={sym.svgPath} fill={sym.defaultFill} />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-stone-300 text-center">
                    {lang === 'ur' ? sym.nameUrdu : sym.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UPLOADS & IMAGES */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
              {lang === 'ur' ? 'اپنی تصویر یا لوگو شامل کریں' : 'Upload Images / Logos'}
            </span>

            <label className="border-2 border-dashed border-stone-700 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-stone-950/40 hover:bg-stone-900/60 group">
              <Upload className="w-8 h-8 text-stone-400 group-hover:text-emerald-400 mb-2 transition-colors" />
              <span className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300">
                {lang === 'ur' ? 'تصویر منتخب کریں' : 'Click to Upload Image'}
              </span>
              <span className="text-[10px] text-stone-500 mt-1">PNG, JPG, SVG, WebP</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* If selected element is an image, provide quick action to remove background */}
            {selectedElement && selectedElement.type === 'image' && selectedElement.imageUrl && (
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 space-y-2">
                <span className="text-xs font-bold text-stone-200 block">
                  {lang === 'ur' ? 'تصویر کا ٹول' : 'Image Action'}
                </span>
                <button
                  onClick={() => onOpenBgRemoverWithImage && onOpenBgRemoverWithImage(selectedElement.imageUrl!)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'اس کا بیک گراؤنڈ ختم کریں' : 'Remove Background of this Image'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FILTERS & EFFECTS */}
        {activeTab === 'filters' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
              {lang === 'ur' ? 'فلٹرز اور بصری اثرات' : 'Filters & Image Adjustments'}
            </span>

            {selectedElement ? (
              <div className="space-y-3">
                {/* Color Selector */}
                {selectedElement.type !== 'image' && (
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ur' ? 'عنصر کا رنگ:' : 'Fill Color:'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.fill.startsWith('#') ? selectedElement.fill : '#FFFFFF'}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="w-8 h-8 rounded border border-stone-700 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={selectedElement.fill}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="flex-1 bg-stone-800 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200"
                      />
                    </div>
                  </div>
                )}

                {/* Opacity */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'شفافیت (Opacity)' : 'Opacity'}</span>
                    <span>{selectedElement.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selectedElement.opacity}
                    onChange={(e) => onUpdateElement(selectedElement.id, { opacity: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Brightness */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'روشنی (Brightness)' : 'Brightness'}</span>
                    <span>{selectedElement.brightness ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={200}
                    value={selectedElement.brightness ?? 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { brightness: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'کونٹراسٹ (Contrast)' : 'Contrast'}</span>
                    <span>{selectedElement.contrast ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={200}
                    value={selectedElement.contrast ?? 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { contrast: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'رنگوں کی گہرائی (Saturation)' : 'Saturation'}</span>
                    <span>{selectedElement.saturation ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={selectedElement.saturation ?? 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { saturation: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Hue Rotate */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'رنگ کا رخ (Hue Rotate)' : 'Hue Rotate'}</span>
                    <span>{selectedElement.hueRotate ?? 0}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={selectedElement.hueRotate ?? 0}
                    onChange={(e) => onUpdateElement(selectedElement.id, { hueRotate: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Blur */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>{lang === 'ur' ? 'دھندلاپن (Blur)' : 'Blur'}</span>
                    <span>{selectedElement.blur ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={selectedElement.blur ?? 0}
                    onChange={(e) => onUpdateElement(selectedElement.id, { blur: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Reset Filters button */}
                <button
                  onClick={() => onUpdateElement(selectedElement.id, {
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    hueRotate: 0,
                    sepia: 0,
                    grayscale: 0,
                    invert: 0,
                    blur: 0
                  })}
                  className="w-full py-1.5 text-xs text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
                >
                  {lang === 'ur' ? 'فلٹرز ری سیٹ کریں' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-500">
                {lang === 'ur' ? 'فلٹرز لگانے کے لیے کینوس پر کسی عنصر پر کلک کریں۔' : 'Select any element on canvas to adjust its filters.'}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LAYERS & ORDER */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
              {lang === 'ur' ? 'لیئرز کا انتظام' : 'Layer Management'}
            </span>

            {/* Alignment Quick Tools */}
            {selectedElement && (
              <div className="grid grid-cols-2 gap-2 p-2 bg-stone-950/60 rounded-xl border border-stone-800">
                <button
                  onClick={() => onUpdateElement(selectedElement.id, {
                    x: Math.round(project.canvasWidth / 2 - selectedElement.width / 2)
                  })}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md text-xs transition-colors"
                  title="Center Horizontally"
                >
                  <AlignCenter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ur' ? 'درمیان (افقی)' : 'Center X'}</span>
                </button>

                <button
                  onClick={() => onUpdateElement(selectedElement.id, {
                    y: Math.round(project.canvasHeight / 2 - selectedElement.height / 2)
                  })}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md text-xs transition-colors"
                  title="Center Vertically"
                >
                  <AlignVerticalJustifyCenter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ur' ? 'درمیان (عمودی)' : 'Center Y'}</span>
                </button>
              </div>
            )}

            {/* Elements Layer Stack */}
            <div className="space-y-1.5">
              {[...project.elements]
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((el) => {
                  const isSelected = selectedElement?.id === el.id;

                  return (
                    <div
                      key={el.id}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-600/70 text-white'
                          : 'bg-stone-800/80 border-stone-700/50 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <button
                        onClick={() => onUpdateElement(el.id, {})}
                        className="flex-1 text-left text-xs font-medium truncate flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: el.fill }} />
                        <span className="truncate">{el.name || el.type}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Bring forward */}
                        <button
                          onClick={() => onBringForward(el.id)}
                          className="p-1 hover:text-white text-stone-400"
                          title="Bring Forward"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Send backward */}
                        <button
                          onClick={() => onSendBackward(el.id)}
                          className="p-1 hover:text-white text-stone-400"
                          title="Send Backward"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Lock / Unlock */}
                        <button
                          onClick={() => onUpdateElement(el.id, { locked: !el.locked })}
                          className="p-1 hover:text-white text-stone-400"
                          title={el.locked ? 'Unlock' : 'Lock'}
                        >
                          {el.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        {/* Visible / Hide */}
                        <button
                          onClick={() => onUpdateElement(el.id, { isVisible: !el.isVisible })}
                          className="p-1 hover:text-white text-stone-400"
                          title={el.isVisible ? 'Hide' : 'Show'}
                        >
                          {el.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-stone-600" />}
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => onDuplicateElement(el.id)}
                          className="p-1 hover:text-white text-stone-400"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteElement(el.id)}
                          className="p-1 hover:text-rose-400 text-stone-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
