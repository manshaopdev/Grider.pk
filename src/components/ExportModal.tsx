import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Code, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Crown
} from 'lucide-react';
import { LogoProject, User } from '../types';
import { exportLogoAsImage, generateSvgString, downloadFile } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: LogoProject;
  currentUser: User | null;
  onOpenPricing: () => void;
  lang: 'en' | 'ur';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onOpenPricing,
  lang
}) => {
  const [format, setFormat] = useState<'png' | 'svg' | 'jpeg'>('png');
  const [resolutionMultiplier, setResolutionMultiplier] = useState<number>(2); // 1 = 800px, 2 = 1600px, 4 = 3200px
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const isVip = currentUser?.plan === 'lifetime' || currentUser?.plan === 'monthly';

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const safeTitle = (project.title || 'pakistan_logo').toLowerCase().replace(/\s+/g, '_');

      if (format === 'svg') {
        const svgCode = generateSvgString(project);
        downloadFile(svgCode, `${safeTitle}.svg`, true);
      } else {
        const dataUrl = await exportLogoAsImage(
          project, 
          format, 
          resolutionMultiplier, 
          0.96
        );
        downloadFile(dataUrl, `${safeTitle}_${resolutionMultiplier}x.${format}`);
      }
    } catch (e) {
      console.error('Export error', e);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await exportLogoAsImage(project, 'png', 1, 0.95);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy to clipboard failed', e);
    } finally {
      setIsExporting(false);
    }
  };

  const pixelDimensions = {
    w: project.canvasWidth * resolutionMultiplier,
    h: project.canvasHeight * resolutionMultiplier
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit">
                {lang === 'ur' ? 'ہائی ریزولوشن ایکسپورٹ' : 'High Resolution Export'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' ? 'پروفیشنل پرنٹ اور ڈیجیٹل کوالٹی میں لوگو ڈاؤنلوڈ کریں' : 'Export print-ready 300 DPI vector and HD assets'}
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
              {lang === 'ur' ? 'فائل فارمیٹ کا انتخاب' : 'Select Format'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'png' as const, label: 'PNG (Transparent)', desc: 'Best for web & logos', icon: ImageIcon },
                { id: 'svg' as const, label: 'SVG (Vector)', desc: 'Infinite scale & print', icon: Code },
                { id: 'jpeg' as const, label: 'JPEG (Solid)', desc: 'Fast sharing & cards', icon: Layers }
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">{fmt.label}</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resolution Multiplier (Only for PNG / JPEG) */}
          {format !== 'svg' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  {lang === 'ur' ? 'ریزولوشن کوالٹی' : 'Resolution Quality'}
                </label>
                <span className="text-xs font-mono text-emerald-400">
                  {pixelDimensions.w} × {pixelDimensions.h} px
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { mult: 1, label: '1x Standard', desc: '800 × 800 px (Social)', locked: false },
                  { mult: 2, label: '2x HD Ready', desc: '1600 × 1600 px (Crisp)', locked: false },
                  { mult: 4, label: '4x Ultra 4K', desc: '3200 × 3200 px (Print 300 DPI)', locked: false }
                ].map((res) => {
                  const isSelected = resolutionMultiplier === res.mult;
                  return (
                    <button
                      key={res.mult}
                      onClick={() => setResolutionMultiplier(res.mult)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                          : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-xs font-bold">{res.label}</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">{res.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transparent Checkbox Info */}
          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs text-stone-400 flex items-center justify-between">
            <span>{lang === 'ur' ? 'کینوس کا بیک گراؤنڈ:' : 'Current Background:'}</span>
            <span className="font-semibold text-stone-200">
              {project.background.type === 'transparent' ? 'Transparent (شفاف)' : project.background.color}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyToClipboard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (lang === 'ur' ? 'کاپی ہو گیا!' : 'Copied!') : (lang === 'ur' ? 'کلپ بورڈ پر کاپی' : 'Copy Image')}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950/50 transform hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting 
                ? (lang === 'ur' ? 'ایکسپورٹ ہو رہا ہے...' : 'Generating...') 
                : (lang === 'ur' ? `ڈاؤنلوڈ کریں (${format.toUpperCase()})` : `Download ${format.toUpperCase()}`)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
