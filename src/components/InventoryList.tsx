import React, { useState } from 'react';
import { 
  CarItem, 
  CarStatus 
} from '../types';
import { 
  Search, 
  Key, 
  Gauge, 
  Calendar, 
  Building2, 
  Printer, 
  Trash2, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Sparkles,
  Tag,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryListProps {
  cars: CarItem[];
  onDeleteCar: (id: string) => void;
  onStatusChange: (id: string, newStatus: CarStatus) => void;
  onPrintKeyTag: (car: CarItem) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  cars,
  onDeleteCar,
  onStatusChange,
  onPrintKeyTag,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Filter cars logic
  const filteredCars = cars.filter((c) => {
    const matchesSearch =
      c.keyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.cabinetLocation && c.cabinetLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.year.toString().includes(searchTerm);

    const matchesBrand =
      selectedBrandFilter === 'all' || c.company === selectedBrandFilter;

    const matchesStatus =
      selectedStatusFilter === 'all' || c.status === selectedStatusFilter;

    return matchesSearch && matchesBrand && matchesStatus;
  });

  // Extract unique brands for filter dropdown
  const uniqueBrands = Array.from(new Set(cars.map((c) => c.company)));

  const getStatusBadge = (status: CarStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>متاحة للبيع</span>
          </span>
        );
      case 'reserved':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>محجوزة بعربون</span>
          </span>
        );
      case 'sold':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>مباعة</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4 space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-[#111827]/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-100 font-['Readex_Pro']">
                سجل السيارات ومفاتيح المعرض المسجلة
              </h3>
              <p className="text-xs text-slate-400">
                إجمالي المعروض: ({cars.length}) سيارات ومفاتيح
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم المفتاح، الشركة، الموديل..."
              className="w-full bg-[#1a2333] border border-amber-500/30 text-slate-100 rounded-xl py-2 pr-9 pl-4 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-bold">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>التصفية:</span>
          </div>

          {/* Brand Filter */}
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="bg-[#1e2738] border border-slate-700 text-slate-200 rounded-lg py-1 px-3 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">كل الشركات ({cars.length})</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>
                {b} ({cars.filter((c) => c.company === b).length})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#1e2738] border border-slate-700 text-slate-200 rounded-lg py-1 px-3 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">جميع الحالات</option>
            <option value="available">المتاحة فقط</option>
            <option value="reserved">المحجوزة</option>
            <option value="sold">المباعة</option>
          </select>

          {(searchTerm || selectedBrandFilter !== 'all' || selectedStatusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBrandFilter('all');
                setSelectedStatusFilter('all');
              }}
              className="text-[11px] text-amber-400 hover:underline mr-auto font-bold"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* CAR CARDS GRID */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#111827]/60 border border-slate-800 rounded-2xl">
          <Key className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-slate-300">لم يتم العثور على نتائج</h4>
          <p className="text-xs text-slate-500 mt-1">
            جرب البحث برقم مفتاح آخر أو إضافة سيارة جديدة من النموذج أعلاه.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-b from-[#141b2b] via-[#101624] to-[#0c101a] border border-amber-500/25 hover:border-amber-400/60 rounded-2xl p-5 shadow-xl transition-all duration-300 relative group overflow-hidden flex flex-col justify-between space-y-4"
              >
                {/* KEY NUMBER BADGE OVERLAY (HIGHLIGHT) */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-200 text-sm">{car.company}</span>
                  </div>

                  {/* PROMINENT GOLD KEY TAG */}
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-3 py-1 rounded-xl shadow-lg font-mono font-black text-sm border border-yellow-200 tracking-wider">
                    <Key className="w-3.5 h-3.5 text-black" />
                    <span>مفتاح {car.keyNumber}</span>
                  </div>
                </div>

                {/* CAR DETAILS */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white font-['Readex_Pro'] group-hover:text-amber-200 transition">
                    {car.modelName}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                    <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>موديل {car.year}</span>
                    </span>

                    <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono">{new Intl.NumberFormat('ar-SA').format(car.mileage)} كم</span>
                    </span>
                  </div>

                  {/* Cabinet Shelf Location & Color */}
                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    {car.cabinetLocation && (
                      <div className="flex items-center gap-1 text-amber-300/90 font-medium">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>موقع المفتاح: {car.cabinetLocation}</span>
                      </div>
                    )}

                    {car.color && (
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>اللون: {car.color}</span>
                        {car.price && (
                          <span className="mr-auto font-mono text-emerald-400 font-bold">
                            {new Intl.NumberFormat('ar-SA').format(car.price)} ريال
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {car.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800 line-clamp-2">
                      "{car.notes}"
                    </p>
                  )}
                </div>

                {/* STATUS & ACTIONS FOOTER */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div>{getStatusBadge(car.status)}</div>

                  <div className="flex items-center gap-1.5">
                    {/* Status Toggle menu */}
                    <select
                      value={car.status}
                      onChange={(e) => onStatusChange(car.id, e.target.value as CarStatus)}
                      className="bg-slate-900 border border-slate-700 text-[11px] text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="available">متاحة</option>
                      <option value="reserved">محجوزة</option>
                      <option value="sold">مباعة</option>
                    </select>

                    {/* Print Key Tag Button */}
                    <button
                      type="button"
                      onClick={() => onPrintKeyTag(car)}
                      title="طباعة بطاقة المفتاح"
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت أسرّ على حذف سجل السيارة ومفتاح ${car.keyNumber}؟`)) {
                          onDeleteCar(car.id);
                        }
                      }}
                      title="حذف السجل"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
