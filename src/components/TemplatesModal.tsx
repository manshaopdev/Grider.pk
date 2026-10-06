import React, { useState } from 'react';
import { X, FolderOpen, Sparkles, Check } from 'lucide-react';
import { PAKISTANI_TEMPLATES, LogoTemplate } from '../data/templates';
import { LogoProject } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (project: LogoProject) => void;
  lang: 'en' | 'ur';
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  lang
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(PAKISTANI_TEMPLATES.map(t => t.category)))];

  const filtered = selectedCategory === 'all'
    ? PAKISTANI_TEMPLATES
    : PAKISTANI_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-outfit">
                {lang === 'ur' ? 'پاکستانی ریڈی میڈ لوگو ٹیمپلیٹس' : 'Pakistani Logo Templates'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ur' ? 'پروفیشنل ٹیمپلیٹ منتخب کریں اور اپنی مرضی کے مطابق تبدیل کریں' : 'Choose a professionally crafted Pakistani brand template'}
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

        {/* Category Filters */}
        <div className="px-6 py-3 border-b border-stone-800 bg-stone-950/40 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat === 'all' ? (lang === 'ur' ? 'تمام ٹیمپلیٹس' : 'All Templates') : cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((tpl) => {
            const primarySymbol = tpl.project.elements.find(e => e.type === 'symbol');
            const primaryText = tpl.project.elements.find(e => e.type === 'text');

            return (
              <div
                key={tpl.id}
                className="bg-stone-800/80 border border-stone-700/60 rounded-xl overflow-hidden hover:border-emerald-500/60 transition-all hover:shadow-xl group flex flex-col"
              >
                {/* Visual Preview */}
                <div
                  style={{ backgroundColor: tpl.project.background.color }}
                  className="h-44 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform"
                >
                  {primarySymbol?.svgPath && (
                    <div className="w-20 h-20 mb-2 flex items-center justify-center">
                      <svg viewBox={primarySymbol.viewBox || '0 0 100 100'} className="w-16 h-16">
                        <path d={primarySymbol.svgPath} fill={primarySymbol.fill} />
                      </svg>
                    </div>
                  )}

                  {primaryText && (
                    <span
                      style={{ color: primaryText.fill }}
                      className={`text-center font-bold text-lg line-clamp-1 ${primaryText.fontFamily || 'font-nastaliq'}`}
                    >
                      {primaryText.text}
                    </span>
                  )}
                </div>

                {/* Info & Select Button */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-stone-900 border-t border-stone-800">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">
                      {lang === 'ur' ? tpl.categoryUrdu : tpl.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-100 line-clamp-1">
                      {lang === 'ur' ? tpl.titleUrdu : tpl.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                      {tpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTemplate(tpl.project);
                      onClose();
                    }}
                    className="mt-4 w-full py-2 px-3 bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-stone-700 hover:border-emerald-500"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'ur' ? 'یہ ٹیمپلیٹ استعمال کریں' : 'Use Template'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
