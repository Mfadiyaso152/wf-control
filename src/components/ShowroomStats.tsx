import React from 'react';
import { CarItem } from '../types';
import { Car, Key, ShieldCheck, Clock, Layers } from 'lucide-react';

interface ShowroomStatsProps {
  cars: CarItem[];
}

export const ShowroomStats: React.FC<ShowroomStatsProps> = ({ cars }) => {
  const totalCars = cars.length;
  const availableCount = cars.filter((c) => c.status === 'available').length;
  const reservedCount = cars.filter((c) => c.status === 'reserved').length;
  const soldCount = cars.filter((c) => c.status === 'sold').length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Stat 1: Total Showroom Vehicles */}
        <div className="bg-gradient-to-br from-[#151c2c] to-[#0e131f] border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black font-mono text-amber-100">
              {totalCars}
            </div>
            <div className="text-[11px] text-slate-400 font-bold">إجمالي السيارات</div>
          </div>
        </div>

        {/* Stat 2: Available Keys */}
        <div className="bg-gradient-to-br from-[#151c2c] to-[#0e131f] border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black font-mono text-emerald-300">
              {availableCount}
            </div>
            <div className="text-[11px] text-slate-400 font-bold">مفاتيح السيارات المتاحة</div>
          </div>
        </div>

        {/* Stat 3: Reserved Vehicles */}
        <div className="bg-gradient-to-br from-[#151c2c] to-[#0e131f] border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black font-mono text-amber-300">
              {reservedCount}
            </div>
            <div className="text-[11px] text-slate-400 font-bold">سيارات محجوزة (عربون)</div>
          </div>
        </div>

        {/* Stat 4: Sold Vehicles */}
        <div className="bg-gradient-to-br from-[#151c2c] to-[#0e131f] border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black font-mono text-slate-200">
              {soldCount}
            </div>
            <div className="text-[11px] text-slate-400 font-bold">مباعة (مسلمة)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
