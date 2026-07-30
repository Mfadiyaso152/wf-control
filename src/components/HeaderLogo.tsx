import React from 'react';
import { ShieldCheck, KeyRound, Sparkles, Building2, CarFront } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderLogoProps {
  onQuickKeySearchClick?: () => void;
  activeKeyCount: number;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  onQuickKeySearchClick,
  activeKeyCount,
}) => {
  return (
    <header className="w-full pt-6 pb-4 px-4 flex flex-col items-center justify-center relative border-b border-amber-500/15 bg-gradient-to-b from-[#111622] via-[#0e131d] to-[#0b0f17]">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-2 right-6 hidden md:flex items-center gap-2 text-xs text-amber-300/60 font-mono border border-amber-500/20 bg-amber-500/5 px-3 py-1 rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>نظام إدارة المفاتيح والمعرض v2.5</span>
      </div>

      {/* TOP CENTER LOGO (شعار فوق بالوسط) */}
      <motion.div
        initial={{ opacity: 0, y: -15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center cursor-pointer group"
      >
        {/* Luxury Shield/Crown Crest Emblem */}
        <div className="relative mb-3">
          {/* Glowing Ring */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-300/60 to-amber-600/40 opacity-75 blur-sm group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
          
          {/* Main Logo Badge */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-[#1e2638] via-[#121824] to-[#090c12] border-2 border-amber-400/60 flex items-center justify-center shadow-2xl shadow-amber-950/40 p-2 overflow-hidden">
            {/* Subtle Metallic Grid Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:8px_8px]" />

            {/* Emblem Car Shield Icon */}
            <div className="relative flex flex-col items-center justify-center text-amber-400">
              <div className="flex items-center justify-center gap-1">
                <CarFront className="w-8 h-8 md:w-10 md:h-10 text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] transform -scale-x-100" />
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-300/90 font-mono">
                  ELITE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Showroom Title & Subtitle */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 drop-shadow-sm font-['Readex_Pro']">
          معرض النخبة للسيارات
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium mt-1 flex items-center justify-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-amber-400/80 inline" />
          <span>المنظومة الرقمية لتسجيل المركبات وحفظ المفاتيح</span>
        </p>
      </motion.div>

      {/* Quick Access Bar for Employee */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
        <button
          onClick={onQuickKeySearchClick}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-200 px-4 py-2 rounded-xl transition shadow-lg shadow-amber-950/20 active:scale-95 group cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-bold">البحث السريع برقم المفتاح</span>
          <span className="bg-amber-400 text-black font-extrabold text-[11px] px-2 py-0.5 rounded-md font-mono mr-1">
            {activeKeyCount} مفتاح
          </span>
        </button>
      </div>
    </header>
  );
};
