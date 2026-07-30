import React, { useState, useEffect } from 'react';
import { Gauge, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MileageSliderProps {
  value: number;
  onChange: (val: number) => void;
  maxMileage?: number;
}

export const MileageSlider: React.FC<MileageSliderProps> = ({
  value,
  onChange,
  maxMileage = 350000,
}) => {
  const [typedValue, setTypedValue] = useState<string>(value.toString());
  const [isEditingInput, setIsEditingInput] = useState(false);

  // Keep typed input in sync with external state when not focused
  useEffect(() => {
    if (!isEditingInput) {
      setTypedValue(value.toString());
    }
  }, [value, isEditingInput]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10) || 0;
    onChange(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setTypedValue(raw);
    const num = parseInt(raw, 10) || 0;
    onChange(num);
  };

  const PRESETS = [
    { label: 'أصفار (0 كم)', km: 0 },
    { label: '10,000 كم', km: 10000 },
    { label: '30,000 كم', km: 30000 },
    { label: '50,000 كم', km: 50000 },
    { label: '100,000 كم', km: 100000 },
    { label: '150,000 كم', km: 150000 },
    { label: '200,000 كم', km: 200000 },
  ];

  // Format with Arabic comma separators
  const formattedKm = new Intl.NumberFormat('ar-SA').format(value);

  // Mileage condition badge text
  const getConditionText = (km: number) => {
    if (km === 0) return { label: 'جديدة تماماً بكارتها (0 كم)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (km < 30000) return { label: 'ممشى خفيف جداً (ممتاز)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (km < 80000) return { label: 'ممشى قليل (استخدام حشمة)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (km < 150000) return { label: 'ممشى متوسط (حالة جيدة)', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
    return { label: 'ممشى عالي (+150 ألف كم)', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
  };

  const conditionInfo = getConditionText(value);

  // Calculate percentage position for slider thumb animation
  const percentage = Math.min(100, Math.max(0, (value / maxMileage) * 100));

  return (
    <div className="w-full bg-[#121824]/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Top Header Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <label className="flex items-center gap-2 text-sm font-bold text-amber-200">
          <Gauge className="w-5 h-5 text-amber-400" />
          <span>قراءة الممشى (الكيلومترات / كم)</span>
        </label>
        
        <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${conditionInfo.color}`}>
          {conditionInfo.label}
        </span>
      </div>

      {/* DYNAMIC MOVING NUMBERS DISPLAY (أرقام تتحرك في المركز) */}
      <div className="relative my-4 p-4 rounded-xl bg-gradient-to-r from-[#0a0d14] via-[#111827] to-[#0a0d14] border border-amber-500/30 text-center shadow-inner group">
        <div className="text-[10px] text-amber-400/70 font-mono tracking-widest uppercase mb-1 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>عداد الممشى الرقمي المباشر</span>
        </div>

        {/* Animated Odometer Number display */}
        <div className="flex items-center justify-center gap-2">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-3xl md:text-4xl font-black font-mono tracking-wider text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            >
              {formattedKm}
            </motion.div>
          </AnimatePresence>
          <span className="text-sm font-bold text-slate-400 font-['Tajawal']">كم</span>
        </div>

        {/* Manual Direct Typing Input field */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400">أو اكتب الرقم مباشرة:</span>
          <div className="relative inline-block w-40">
            <input
              type="text"
              value={typedValue}
              onFocus={() => setIsEditingInput(true)}
              onBlur={() => setIsEditingInput(false)}
              onChange={handleInputChange}
              placeholder="مثال: 45000"
              className="w-full bg-[#1e2738] border border-amber-500/40 text-center text-amber-200 font-mono font-bold text-sm rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
            />
            <span className="absolute left-2.5 top-1.2 font-mono text-xs text-slate-500">كم</span>
          </div>
        </div>
      </div>

      {/* RTL SLIDER TRACK (خط من اليمين لليسار عشان تحدد الممشى) */}
      <div className="relative py-3">
        {/* Visual Track Labels */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 px-1">
          <span>0 كم (جديد)</span>
          <span>150,000 كم</span>
          <span>+350,000 كم</span>
        </div>

        {/* Slider Input with Custom Styling */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={maxMileage}
            step={500}
            value={value}
            onChange={handleSliderChange}
            dir="rtl"
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-inner"
            style={{
              background: `linear-gradient(to left, #f59e0b 0%, #d97706 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
            }}
          />
        </div>

        {/* Moving position percentage marker */}
        <div 
          className="text-[10px] font-mono text-amber-300/80 text-center mt-1 transition-all duration-150"
        >
          مستوى الممشى على الخط: {Math.round(percentage)}%
        </div>
      </div>

      {/* Quick Mileage Presets Buttons */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 mb-2 block font-medium">خيارات ممشى سريعة بنقرة واحدة:</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.km}
              type="button"
              onClick={() => {
                onChange(p.km);
                setTypedValue(p.km.toString());
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer active:scale-95 ${
                value === p.km
                  ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/50 hover:text-amber-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
