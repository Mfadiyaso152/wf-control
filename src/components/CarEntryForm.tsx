import React, { useState } from 'react';
import { 
  Car, 
  Building, 
  Calendar, 
  Key, 
  Save, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Archive,
  Check,
  PlusCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CarItem, CarStatus } from '../types';
import { POPULAR_BRANDS, CAR_COLORS } from '../data/brandsData';
import { MileageSlider } from './MileageSlider';

interface CarEntryFormProps {
  onAddCar: (car: Omit<CarItem, 'id' | 'createdAt'>) => void;
  existingKeys: string[];
}

export const CarEntryForm: React.FC<CarEntryFormProps> = ({
  onAddCar,
  existingKeys,
}) => {
  // Form State
  const [company, setCompany] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [mileage, setMileage] = useState<number>(0);
  const [keyNumber, setKeyNumber] = useState<string>('');
  const [cabinetLocation, setCabinetLocation] = useState<string>('دولاب A - الرف 1');
  const [selectedColor, setSelectedColor] = useState<string>('أبيض لؤلؤي');
  const [price, setPrice] = useState<string>('');
  const [status, setStatus] = useState<CarStatus>('available');
  const [notes, setNotes] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string>('موظف المعرض');

  // UI Feedback states
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [keyWarning, setKeyWarning] = useState<string | null>(null);

  // Year options list from 2000 to 2026
  const CURRENT_YEAR = new Date().getFullYear();
  const YEAR_OPTIONS = Array.from({ length: 27 }, (_, i) => (CURRENT_YEAR + 1) - i);

  // Suggested popular models based on selected brand
  const selectedBrandObj = POPULAR_BRANDS.find(
    (b) => b.nameAr === company || b.nameEn.toLowerCase() === company.toLowerCase()
  );

  // Key number duplicate check
  const handleKeyNumberChange = (val: string) => {
    setKeyNumber(val);
    if (val.trim() && existingKeys.includes(val.trim())) {
      setKeyWarning(`تنبيه: رقم المفتاح "${val}" مسجل لسيارة أخرى بالفعل!`);
    } else {
      setKeyWarning(null);
    }
  };

  const handleBrandSelect = (brandName: string) => {
    setCompany(brandName);
  };

  const handleModelSelect = (mName: string) => {
    setModelName(mName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim()) {
      alert('يرجى كتابة أو اختيار شركة السيارة (مثل: تويوتا، لكزس، مرسيدس)');
      return;
    }
    if (!modelName.trim()) {
      alert('يرجى كتابة اسم/نوع السيارة (مثل: كامري، S500، لاندكروزر)');
      return;
    }
    if (!keyNumber.trim()) {
      alert('يرجى كتابة رقم المفتاح في أسفل النموذج');
      return;
    }

    const newCarData = {
      company: company.trim(),
      modelName: modelName.trim(),
      year,
      mileage,
      keyNumber: keyNumber.trim().toUpperCase(),
      cabinetLocation: cabinetLocation.trim(),
      color: selectedColor,
      price: price ? parseFloat(price) : undefined,
      status,
      notes: notes.trim(),
      registeredBy: employeeName.trim(),
    };

    onAddCar(newCarData);

    // Show luxury success animation
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3500);

    // Reset Form
    handleReset();
  };

  const handleReset = () => {
    setCompany('');
    setModelName('');
    setYear(new Date().getFullYear());
    setMileage(0);
    setKeyNumber('');
    setNotes('');
    setPrice('');
    setKeyWarning(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-300/40 flex items-center gap-3"
          >
            <CheckCircle2 className="w-7 h-7 text-emerald-200 animate-bounce" />
            <div>
              <div className="font-bold text-base">تم إدخال السيارة والمفتاح بنجاح!</div>
              <div className="text-xs text-emerald-100">تم حفظ البيانات في كشوفات وسجلات المعرض.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-[#131a29] via-[#0f1522] to-[#0c101a] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/80 relative overflow-hidden space-y-8"
      >
        {/* Subtle Ambient Gold Accent Bar at top of card */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

        {/* Form Card Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-500/30 text-amber-400 shadow-inner">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-amber-100 font-['Readex_Pro']">
                تسجيل بيانات السيارة والمفتاح
              </h2>
              <p className="text-xs text-slate-400">
                أدخل شركة السيارة والاسم، حدد الموديل، اضبط المنشى، واكتب رقم المفتاح في الأسفل.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>تسجيل سريع موحد</span>
          </span>
        </div>

        {/* STEP 1: COMPANY & CAR NAME (مكان نوع السيارة و الشركة) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-r-4 border-amber-500 pr-3">
            <Building className="w-4 h-4 text-amber-400" />
            <span>1. شركة السيارة ونوع اسمها</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field: Car Company (شركة السيارة) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                شركة السيارة (الماركة) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="مثال: تويوتا، لكزس، مرسيدس..."
                  className="w-full bg-[#1a2333] border border-amber-500/30 text-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition shadow-inner font-medium placeholder:text-slate-500"
                />
              </div>

              {/* Popular Brand Fast Buttons */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block mb-1">اختيار سريع للشركات الشائعة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_BRANDS.slice(0, 8).map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => handleBrandSelect(b.nameAr)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition active:scale-95 cursor-pointer ${
                        company === b.nameAr
                          ? 'bg-amber-500 text-black border-amber-400 font-bold'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/40 hover:text-amber-200'
                      }`}
                    >
                      {b.nameAr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field: Car Name / Type (نوع/اسم السيارة) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                اسم السيارة / نوع الفئة <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="مثال: كامري، S 500، LX 600..."
                  className="w-full bg-[#1a2333] border border-amber-500/30 text-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition shadow-inner font-medium placeholder:text-slate-500"
                />
              </div>

              {/* Suggested Models for Selected Brand */}
              {selectedBrandObj && selectedBrandObj.popularModels.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1">موديلات شائعة لـ ({company}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBrandObj.popularModels.slice(0, 6).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => handleModelSelect(m)}
                        className={`text-xs px-2 py-0.5 rounded-md border transition cursor-pointer active:scale-95 ${
                          modelName === m
                            ? 'bg-amber-400 text-black border-amber-300 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/40'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 2: MODEL YEAR SELECTION (مكان للموديل اختيار) */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-r-4 border-amber-500 pr-3">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>2. موديل السيارة (سنة الصنع)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                اختر الموديل من القائمة:
              </label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full bg-[#1a2333] border border-amber-500/30 text-amber-200 font-bold text-base rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-amber-400 focus:outline-none transition shadow-inner font-mono cursor-pointer"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y} className="bg-[#131a29] text-amber-100">
                    موديل {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Year Badges */}
            <div className="md:col-span-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">الموديلات الحديثة الأكثر طلباً:</span>
              <div className="flex flex-wrap gap-2">
                {[CURRENT_YEAR + 1, CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3, CURRENT_YEAR - 4].map((yr) => (
                  <button
                    type="button"
                    key={yr}
                    onClick={() => setYear(yr)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition active:scale-95 cursor-pointer ${
                      year === yr
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-amber-300 shadow-md shadow-amber-950/40'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-amber-500/40 hover:text-amber-200'
                    }`}
                  >
                    موديل {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: MILEAGE SELECTOR (الممشى - خط وسلايدر وأرقام متحركة وكتابة) */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-r-4 border-amber-500 pr-3 mb-3">
            <Car className="w-4 h-4 text-amber-400" />
            <span>3. ممشى السيارة (الكيلومترات)</span>
          </div>

          <MileageSlider
            value={mileage}
            onChange={(val) => setMileage(val)}
          />
        </div>

        {/* ADDITIONAL CAR SPECS (COLOR, PRICE, STATUS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">لون السيارة</label>
            <div className="flex flex-wrap gap-1.5">
              {CAR_COLORS.map((col) => (
                <button
                  type="button"
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  title={col.name}
                  className={`w-7 h-7 rounded-full border-2 transition-transform active:scale-90 flex items-center justify-center cursor-pointer ${
                    selectedColor === col.name ? 'scale-110 border-amber-400 shadow-lg' : 'border-slate-700 opacity-80'
                  }`}
                  style={{ backgroundColor: col.hex }}
                >
                  {selectedColor === col.name && (
                    <Check className={`w-3.5 h-3.5 ${col.hex === '#f9fafb' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-amber-300/80 font-medium mt-1 block">
              اللون المختار: {selectedColor}
            </span>
          </div>

          {/* Price (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>السعر المطلوب (اختياري)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثال: 280000"
                className="w-full bg-[#1a2333] border border-amber-500/30 text-slate-100 rounded-xl py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="absolute left-2.5 top-2 text-[11px] text-slate-400 font-bold">ريال</span>
            </div>
          </div>

          {/* Status (متاح / محجوز / مباع) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">حالة السيارة بالمقرض</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CarStatus)}
              className="w-full bg-[#1a2333] border border-amber-500/30 text-slate-100 text-xs font-bold rounded-xl py-2 px-3 focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="available" className="bg-[#131a29]">متاحة للبيع (بالعرض)</option>
              <option value="reserved" className="bg-[#131a29]">محجوزة (عربون)</option>
              <option value="sold" className="bg-[#131a29]">مباعة</option>
            </select>
          </div>
        </div>

        {/* STEP 4 / FINAL STEP: KEY NUMBER AT BOTTOM (تحت آخر شيء يكتب رقم المفتاح) */}
        <div className="pt-4 border-t-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 -mx-6 md:-mx-8 p-6 md:p-8 rounded-b-3xl">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-base mb-3">
            <Key className="w-6 h-6 text-amber-400 animate-bounce" />
            <span className="font-['Readex_Pro'] text-lg">4. الخطوة الأخيرة: إدخال رقم المفتاح الخزنة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Field: KEY NUMBER (رقم المفتاح) */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-amber-200">
                رقم المفتاح المكتوب على الكارت / الميدالية <span className="text-amber-400">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={keyNumber}
                  onChange={(e) => handleKeyNumberChange(e.target.value)}
                  placeholder="مثال: K-105 أو رقم 42"
                  className="w-full bg-[#0a0e17] border-2 border-amber-400/80 text-amber-300 font-mono font-black text-2xl md:text-3xl rounded-2xl py-3 px-5 focus:ring-4 focus:ring-amber-400/40 focus:border-amber-300 focus:outline-none transition shadow-2xl tracking-wider text-center"
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-500/60 pointer-events-none" />
              </div>

              {keyWarning && (
                <p className="text-xs text-rose-400 font-bold bg-rose-950/60 border border-rose-500/40 p-2 rounded-xl">
                  {keyWarning}
                </p>
              )}

              <p className="text-[11px] text-slate-400 font-medium">
                * يُستخدم رقم المفتاح للتعرف السريع على موقع المفتاح وتسليمه عند تجربة أو بيع السيارة.
              </p>
            </div>

            {/* Cabinet Location Shelf (موقع المفتاح في الخزنة) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Archive className="w-4 h-4 text-amber-400" />
                <span>موقع وتعليقة المفتاح بخزنة المعرض:</span>
              </label>

              <input
                type="text"
                value={cabinetLocation}
                onChange={(e) => setCabinetLocation(e.target.value)}
                placeholder="مثال: دولاب A - رف 2 - حلاقة #15"
                className="w-full bg-[#161e2e] border border-amber-500/30 text-slate-100 rounded-xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />

              {/* Quick Cabinet Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['دولاب A - رف 1', 'دولاب A - رف 2', 'دولاب B - رف 1', 'دولاب C - رف VIP'].map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setCabinetLocation(loc)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-amber-200 border border-slate-700"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Employee Name & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">اسم الموظف المسجل:</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full bg-[#131a29] border border-slate-700 text-slate-200 rounded-lg py-1.5 px-3 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>ملاحظات السيارة (إن وجدت):</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: مواصفات خليجية، فتحة سقف، مفتاحين صيانة..."
                className="w-full bg-[#131a29] border border-slate-700 text-slate-200 rounded-lg py-1.5 px-3 text-xs"
              />
            </div>
          </div>

          {/* ACTION BUTTONS (حفظ البيانات) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-amber-500/20">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تفريغ الحقول</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-base md:text-lg shadow-xl shadow-amber-500/20 flex items-center gap-2 transition transform active:scale-95 cursor-pointer border border-yellow-200"
            >
              <Save className="w-5 h-5 text-black" />
              <span>حفظ بيانات السيارة والمفتاح</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
