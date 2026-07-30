import React, { useState } from 'react';
import { KeyRound, Search, X, MapPin, Gauge, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CarItem } from '../types';

interface KeyLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: CarItem[];
}

export const KeyLocatorModal: React.FC<KeyLocatorModalProps> = ({
  isOpen,
  onClose,
  cars,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedCars = cars.filter(
    (c) =>
      c.keyNumber.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase()) ||
      c.modelName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-b from-[#151c2d] via-[#101625] to-[#0a0d16] border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-100 font-['Readex_Pro']">
                محدد موقع المفتاح السريع
              </h3>
              <p className="text-xs text-slate-400">
                اكتب رقم المفتاح للوصول الفوري لموقع المفتاح بخزنة المعرض وتفاصيل السيارة.
              </p>
            </div>
          </div>

          {/* Keypad Search Input */}
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب رقم المفتاح هنا (مثال: K-01 أو 02)..."
              className="w-full bg-[#0a0e17] border-2 border-amber-400 text-amber-300 font-mono font-bold text-xl md:text-2xl rounded-2xl py-3.5 pr-12 pl-4 focus:ring-4 focus:ring-amber-400/30 focus:outline-none transition shadow-2xl text-center"
            />
            <Search className="w-6 h-6 text-amber-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Search Results */}
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {query.trim() === '' ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                اكتب رقم المفتاح بالخزنة أعلاه لعرض موقع السيارة والمفتاح تلقائياً.
              </div>
            ) : matchedCars.length === 0 ? (
              <div className="text-center py-6 text-rose-400 text-sm font-bold bg-rose-950/30 border border-rose-500/20 rounded-xl">
                لا يوجد مفتاح مسجل بهذا الرقم ({query})
              </div>
            ) : (
              matchedCars.map((car) => (
                <div
                  key={car.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#182030] to-[#121824] border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-200 text-base font-['Readex_Pro']">
                        {car.company} - {car.modelName}
                      </span>
                      <span className="text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">
                        {car.year}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-300 pt-1">
                      <span className="flex items-center gap-1 text-cyan-300 font-mono">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{new Intl.NumberFormat('ar-SA').format(car.mileage)} كم</span>
                      </span>

                      {car.cabinetLocation && (
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{car.cabinetLocation}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* KEY NUMBER HIGHLIGHT BADGE */}
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-4 py-2 rounded-xl font-mono font-black text-lg border border-yellow-200 shadow-md">
                    مفتاح: {car.keyNumber}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 border border-slate-700 px-4 py-1.5 rounded-xl font-bold"
            >
              إغلاق النافذة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
