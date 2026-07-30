import React from 'react';
import { X, Printer, Key, QrCode, ShieldCheck, CarFront } from 'lucide-react';
import { CarItem } from '../types';

interface PrintKeyTagModalProps {
  car: CarItem | null;
  onClose: () => void;
}

export const PrintKeyTagModal: React.FC<PrintKeyTagModalProps> = ({
  car,
  onClose,
}) => {
  if (!car) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#121826] border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-amber-100 font-['Readex_Pro']">
            معاينة بطاقة المفتاح المعلقة (Key Tag)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            بطاقة المعرض المخصصة للطباعة والتثبيت على حلقة المفاتيح في الخزنة.
          </p>
        </div>

        {/* PRINTABLE KEY TAG CARD BOX */}
        <div 
          id="printable-key-tag" 
          className="bg-gradient-to-b from-amber-50 via-amber-100/90 to-amber-200 text-slate-900 border-4 border-amber-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b-2 border-amber-600/30 pb-3">
            <div className="flex items-center gap-2">
              <CarFront className="w-6 h-6 text-amber-800" />
              <span className="font-black text-amber-950 text-base font-['Readex_Pro']">
                معرض النخبة للسيارات
              </span>
            </div>

            <div className="bg-amber-950 text-amber-100 font-mono font-black text-base px-3 py-1 rounded-xl shadow-inner border border-amber-700">
              {car.keyNumber}
            </div>
          </div>

          {/* Car Specifications */}
          <div className="space-y-2 text-center py-2">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-widest font-mono">
              {car.company}
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Readex_Pro']">
              {car.modelName}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-800 font-mono">
              <span className="bg-amber-300/80 px-2.5 py-0.5 rounded-lg border border-amber-400">
                موديل {car.year}
              </span>
              <span className="bg-amber-300/80 px-2.5 py-0.5 rounded-lg border border-amber-400">
                {new Intl.NumberFormat('ar-SA').format(car.mileage)} كم
              </span>
            </div>
          </div>

          {/* Cabinet location & Code */}
          <div className="bg-amber-950/10 border border-amber-600/30 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] text-amber-800 font-bold">موقع الخزنة:</div>
              <div className="font-extrabold text-amber-950">{car.cabinetLocation || 'خزنة A'}</div>
            </div>

            {/* Simulating QR/Barcode */}
            <div className="flex flex-col items-center">
              <QrCode className="w-9 h-9 text-amber-950" />
              <span className="text-[9px] font-mono text-amber-900 font-bold">{car.id}</span>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="text-[10px] text-center text-amber-900/80 font-bold pt-1 border-t border-amber-600/20 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-800" />
            <span>نظام تسجيل المفاتيح المعتمد - معرض النخبة</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
          >
            إغلاق
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>طباعة بطاقة المفتاح الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
