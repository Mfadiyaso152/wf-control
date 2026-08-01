import React, { useState } from 'react';
import { 
  CarFront, 
  Key, 
  Gauge, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  FileDown,
  Palette,
  X,
  ShieldCheck,
  Loader2,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import logoImg from './assets/images/wesam_alshafa_logo_1785421210792.jpg';

export default function App() {
  // Form State
  const [company, setCompany] = useState('');
  const [carName, setCarName] = useState('');
  const [modelYear, setModelYear] = useState<number>(new Date().getFullYear());
  const [color, setColor] = useState<string>(''); // Empty default per user request
  const [price, setPrice] = useState<string>('');
  const [isSoom, setIsSoom] = useState<boolean>(false);
  const [mileage, setMileage] = useState<number>(0);
  const [typedMileage, setTypedMileage] = useState<string>('0');
  const [isEditingMileageInput, setIsEditingMileageInput] = useState(false);
  const [keyNumber, setKeyNumber] = useState('');

  // Save Toast, PDF Generating & PDF Modal State
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfData, setPdfData] = useState<{
    company: string;
    carName: string;
    modelYear: number;
    color: string;
    price: string;
    mileage: number;
    mileageCondition: string;
    keyNumber: string;
    createdAt: string;
  } | null>(null);

  // Model Years (Options: 2000 to 2026)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 27 }, (_, i) => (currentYear + 1) - i);

  // Max range for mileage line slider
  const maxSliderKm = 300000;

  // Mileage Condition Evaluator
  const getMileageCondition = (km: number) => {
    if (km === 0) {
      return { label: 'جديدة تماماً (أصفار 0 كم)', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (km <= 30000) {
      return { label: 'ممشى خفيف جداً (حالة الوكالة)', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    }
    if (km <= 80000) {
      return { label: 'ممشى قليل (استخدام حشمة ونظيف جداً)', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (km <= 150000) {
      return { label: 'ممشى متوسط (حالة ممتازة)', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    return { label: 'ممشى عالي (+150 ألف كم)', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  const currentCondition = getMileageCondition(mileage);

  // Handle line slider change (Right to Left track)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    setMileage(val);
    if (!isEditingMileageInput) {
      setTypedMileage(val.toString());
    }
  };

  // Handle direct typing of mileage
  const handleMileageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
    setTypedMileage(rawDigits);
    const num = parseInt(rawDigits, 10) || 0;
    setMileage(num);
  };

  // Calculate RTL slider track fill percentage
  const percentage = Math.min(100, Math.max(0, (mileage / maxSliderKm) * 100));

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim()) {
      alert('يرجى إدخال شركة السيارة');
      return;
    }
    if (!carName.trim()) {
      alert('يرجى إدخال اسم/نوع السيارة');
      return;
    }
    if (!keyNumber.trim()) {
      alert('يرجى إدخال رقم المفتاح');
      return;
    }

    const compiledData = {
      company: company.trim(),
      carName: carName.trim(),
      modelYear,
      color: color.trim() || 'غير محدد',
      price: isSoom ? 'سوم' : (price.trim() || 'غير محدد'),
      mileage,
      mileageCondition: currentCondition.label,
      keyNumber: keyNumber.trim().toUpperCase(),
      createdAt: new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setPdfData(compiledData);
    setShowPdfModal(true);
    setShowSavedToast(true);

    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const handleReset = () => {
    setCompany('');
    setCarName('');
    setModelYear(new Date().getFullYear());
    setColor('');
    setPrice('');
    setIsSoom(false);
    setMileage(0);
    setTypedMileage('0');
    setKeyNumber('');
  };

  // Direct 2D Canvas PDF Render Engine (Fast, Reliable, Zero CSS Parser Errors)
  const renderPdfDocument = async (data: NonNullable<typeof pdfData>): Promise<jsPDF> => {
    const width = 1000;
    const height = 1380;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D Context initialization failed');

    // Load Logo Image as Base64/Bitmap
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      logo.onload = resolve;
      logo.onerror = resolve;
      logo.src = logoImg;
    });

    // Background Canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Card Outer Frame
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(30, 30, width - 60, height - 60, 28);
    ctx.stroke();

    // Top Blue Accent Line
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(30, 30, width - 60, 18, [28, 28, 0, 0]);
    ctx.fill();

    // Draw Logo Image
    if (logo.complete && logo.naturalWidth > 0) {
      ctx.drawImage(logo, 60, 75, 120, 120);
    }

    // Title & Subtitle (RTL Direction)
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px Tajawal, sans-serif';
    ctx.fillText('معرض وسام الشفا للسيارات', width - 60, 120);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 20px Tajawal, sans-serif';
    ctx.fillText('بطاقة تسجيل معلومات السيارة والمفتاح الرسمية', width - 60, 160);

    // Date Text
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px monospace, sans-serif';
    ctx.fillText(`تاريخ الإدخال: ${data.createdAt}`, 60, 220);

    // Horizontal Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 235);
    ctx.lineTo(width - 60, 235);
    ctx.stroke();

    // Info Box Drawing Function
    const drawBox = (x: number, y: number, w: number, h: number, title: string, value: string) => {
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 18);
      ctx.fill();
      ctx.stroke();

      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 18px Tajawal, sans-serif';
      ctx.fillText(title, x + w - 24, y + 38);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 26px Tajawal, sans-serif';
      ctx.fillText(value, x + w - 24, y + 80);
    };

    const startY = 265;
    const boxW = 410;
    const boxH = 110;

    // Row 1: Company & Car Name
    drawBox(width - 60 - boxW, startY, boxW, boxH, 'شركة السيارة:', data.company);
    drawBox(60, startY, boxW, boxH, 'نوع / اسم السيارة:', data.carName);

    // Row 2: Model, Color & Price
    const row2Y = startY + boxH + 20;
    const row2BoxW = 280;

    // Box 1 (Right): Model
    drawBox(width - 60 - row2BoxW, row2Y, row2BoxW, boxH, 'الموديل:', `موديل ${data.modelYear}`);

    // Box 2 (Middle): Color
    drawBox(360, row2Y, row2BoxW, boxH, 'اللون:', data.color || 'غير محدد');

    // Box 3 (Left): Price
    if (data.price === 'سوم') {
      ctx.fillStyle = '#fffbeb';
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, row2Y, row2BoxW, boxH, 18);
      ctx.fill();
      ctx.stroke();

      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 18px Tajawal, sans-serif';
      ctx.fillText('السعر:', 60 + row2BoxW - 24, row2Y + 38);

      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 28px Tajawal, sans-serif';
      ctx.fillText('سوم', 60 + row2BoxW - 24, row2Y + 80);
    } else {
      drawBox(60, row2Y, row2BoxW, boxH, 'السعر:', data.price || 'غير محدد');
    }

    // Mileage Container Box
    const mileageY = row2Y + boxH + 30;
    const fullW = width - 120;
    const mileageH = 170;

    ctx.fillStyle = '#eff6ff';
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(60, mileageY, fullW, mileageH, 24);
    ctx.fill();
    ctx.stroke();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 22px Tajawal, sans-serif';
    ctx.fillText('الممشى الحالي وتقييم الحالة', width / 2, mileageY + 45);

    const formattedKm = new Intl.NumberFormat('ar-SA').format(data.mileage);
    ctx.fillStyle = '#1e3a8a';
    ctx.font = '900 46px monospace, Tajawal, sans-serif';
    ctx.fillText(`${formattedKm} كم`, width / 2, mileageY + 102);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 22px Tajawal, sans-serif';
    ctx.fillText(`التقييم: ${data.mileageCondition}`, width / 2, mileageY + 148);

    // Key Number Box
    const keyY = mileageY + mileageH + 30;
    const keyH = 190;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(60, keyY, fullW, keyH, 24);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px Tajawal, sans-serif';
    ctx.fillText('رقم المفتاح المعتمد بخزنة المعرض', width / 2, keyY + 60);

    ctx.fillStyle = '#60a5fa';
    ctx.font = '900 64px monospace, sans-serif';
    ctx.fillText(data.keyNumber, width / 2, keyY + 140);

    // Footer Divider & Seal
    const footerY = keyY + keyH + 50;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, footerY);
    ctx.lineTo(width - 60, footerY);
    ctx.stroke();

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 20px Tajawal, sans-serif';
    ctx.fillText('معرض وسام الشفا للسيارات', width - 60, footerY + 38);

    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '18px Tajawal, sans-serif';
    ctx.fillText('مستند رسمي - مفاتيح الخزنة', 60, footerY + 38);

    // Convert Canvas to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgW = pdfW - 20; // 10mm margins on left/right
    const imgH = (height * imgW) / width;
    const yPos = Math.max(10, (pdfH - imgH) / 2);

    pdf.addImage(imgData, 'JPEG', 10, yPos, imgW, imgH);
    return pdf;
  };

  // Save PDF Document handler
  const handleSavePdf = async () => {
    if (!pdfData) return;

    setIsGeneratingPdf(true);

    try {
      const pdf = await renderPdfDocument(pdfData);
      const filename = `وسام_الشفا_بطاقة_مفتاح_${pdfData.keyNumber || 'جديد'}.pdf`;

      // Trigger jsPDF file save
      pdf.save(filename);

      // Fallback anchor blob click for constrained iframe environments
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

    } catch (error) {
      console.error('PDF Generation error:', error);
      alert('حدث خطأ أثناء حفظ الملف، سيتم فتح نافذة الطباعة كبديل.');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Tajawal',sans-serif] selection:bg-blue-600 selection:text-white print:bg-white print:text-black">
      
      {/* Toast Notification on Save */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 max-w-md w-11/12 print:hidden"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="text-right">
              <div className="font-bold text-sm text-white">تم تجهيز بيانات بطاقة المفتاح!</div>
              <div className="text-xs text-slate-300">جاهز للتصدير والحفظ كـ PDF</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP CENTER OFFICIAL LOGO & SHOWROOM NAME */}
      <header className="w-full pt-8 pb-6 px-4 bg-white border-b border-slate-200 shadow-xs flex flex-col items-center justify-center text-center print:hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          {/* Official Showroom Logo Image */}
          <div className="relative mb-3">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white p-1 border border-slate-200 shadow-md overflow-hidden">
              <img 
                src={logoImg} 
                alt="شعار معرض وسام الشفا للسيارات" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-['Readex_Pro'] tracking-tight">
            معرض وسام الشفا للسيارات
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            نظام تسجيل السيارات وتتبع المفاتيح الموحد
          </p>
        </motion.div>
      </header>

      {/* Main Single-View Form Layout */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:py-12 print:hidden">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden"
        >
          {/* Top Blue Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />

          {/* Form Header */}
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-['Readex_Pro']">
              تسجيل بيانات السيارة والمفتاح
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              قم بتعبئة التفاصيل أدناه، ثم اضغط على زر التصدير للحفظ كـ PDF.
            </p>
          </div>

          {/* 2. COMPANY & CAR NAME */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Car Company Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>شركة السيارة</span>
                  <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="اكتب شركة السيارة (مثل: تويوتا، لكزس)..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Car Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CarFront className="w-4 h-4 text-blue-600" />
                  <span>نوع / اسم السيارة</span>
                  <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  placeholder="اكتب اسم السيارة (مثل: كامري، S500)..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>
          </div>

          {/* 3. MODEL SELECTION, COLOR & PRICE FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-slate-100">
            {/* Model Year Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>الموديل</span>
                <span className="text-blue-600">*</span>
              </label>
              <select
                value={modelYear}
                onChange={(e) => setModelYear(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl py-3 px-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition cursor-pointer font-mono"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y} className="font-sans">
                    موديل {y}
                  </option>
                ))}
              </select>
            </div>

            {/* COLOR FIELD */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>لون السيارة</span>
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="اكتب اللون هنا..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl py-3 px-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* PRICE FIELD WITH (سوم) CHECKBOX */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <span>السعر</span>
                </label>

                {/* Small option for (سوم) */}
                <label className="inline-flex items-center gap-1 cursor-pointer text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 transition select-none">
                  <input
                    type="checkbox"
                    checked={isSoom}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsSoom(checked);
                      if (checked) {
                        setPrice('سوم');
                      } else if (price === 'سوم') {
                        setPrice('');
                      }
                    }}
                    className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer accent-amber-600"
                  />
                  <span>(سوم)</span>
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  disabled={isSoom}
                  value={isSoom ? 'سوم' : price}
                  onChange={(e) => {
                    if (!isSoom) setPrice(e.target.value);
                  }}
                  placeholder={isSoom ? 'سوم' : 'اكتب السعر...'}
                  className={`w-full text-sm rounded-xl py-3 px-3 font-bold transition ${
                    isSoom 
                      ? 'bg-amber-100/90 border-2 border-amber-400 text-amber-950 font-black cursor-not-allowed text-center text-base' 
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 4. MILEAGE SELECTOR */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>الممشى (الكيلومترات)</span>
              </label>

              {/* Mileage Condition Badge */}
              <span className={`text-xs px-3 py-1 rounded-full border font-bold ${currentCondition.badgeClass}`}>
                {currentCondition.label}
              </span>
            </div>

            {/* Light Clean Mileage Display Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center shadow-xs relative overflow-hidden">
              <div className="text-[11px] text-blue-700 font-bold tracking-wide uppercase mb-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>قراءة العداد المباشرة</span>
              </div>

              {/* Animated Moving Number */}
              <div className="flex items-center justify-center gap-2 py-1">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={mileage}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="text-3xl md:text-4xl font-black font-mono tracking-wider text-slate-900"
                  >
                    {new Intl.NumberFormat('ar-SA').format(mileage)}
                  </motion.div>
                </AnimatePresence>
                <span className="text-sm font-bold text-slate-500">كم</span>
              </div>

              {/* Direct Typing Input */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-slate-600">أو اكتب الممشى هنا:</span>
                <div className="relative w-36">
                  <input
                    type="text"
                    value={typedMileage}
                    onFocus={() => setIsEditingMileageInput(true)}
                    onBlur={() => setIsEditingMileageInput(false)}
                    onChange={handleMileageInputChange}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-mono font-bold text-center text-sm rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-xs"
                  />
                  <span className="absolute left-2.5 top-1.5 text-[11px] font-mono text-slate-400">كم</span>
                </div>
              </div>
            </div>

            {/* Line Slider from Right to Left */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>0 كم (أصفار)</span>
                <span>150,000 كم</span>
                <span>+300,000 كم</span>
              </div>

              <input
                type="range"
                min={0}
                max={maxSliderKm}
                step={500}
                value={mileage}
                onChange={handleSliderChange}
                dir="rtl"
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none transition-all shadow-inner"
                style={{
                  background: `linear-gradient(to left, #2563eb 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
                }}
              />
            </div>
          </div>

          {/* 5. KEY NUMBER AT THE VERY BOTTOM */}
          <div className="pt-6 border-t border-slate-200 space-y-2">
            <label className="block text-sm font-black text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              <span>رقم المفتاح</span>
              <span className="text-blue-600">*</span>
            </label>

            <div className="relative">
              <input
                type="text"
                required
                value={keyNumber}
                onChange={(e) => setKeyNumber(e.target.value)}
                placeholder="اكتب رقم المفتاح هنا (مثال: K-104 أو 55)..."
                className="w-full bg-slate-50 border-2 border-blue-600 text-slate-900 font-mono font-black text-2xl md:text-3xl rounded-2xl py-3.5 px-5 text-center focus:bg-white focus:ring-4 focus:ring-blue-600/20 focus:border-blue-700 focus:outline-none transition shadow-xs placeholder:font-normal placeholder:text-base placeholder:text-slate-400"
              />
              <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600/30 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400">
              * أدخل رقم الكارت أو الميدالية المكتوب على المفتاح بخزنة معرض وسام الشفا.
            </p>
          </div>

          {/* Actions & Export PDF Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تفريغ</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base md:text-lg shadow-lg shadow-blue-600/25 flex items-center gap-2 transition transform active:scale-95 cursor-pointer border border-blue-500"
            >
              <FileDown className="w-5 h-5 text-white" />
              <span>حفظ وتصدير PDF</span>
            </button>
          </div>
        </form>
      </main>

      {/* 6. PDF EXPORT PREVIEW MODAL */}
      <AnimatePresence>
        {showPdfModal && pdfData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header Banner */}
              <div className="text-center border-b border-slate-100 pb-4">
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200 inline-block mb-2">
                  معاينة المستند قبل الحفظ
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-['Readex_Pro']">
                  بطاقة تسجيل المفتاح الرسمية
                </h3>
              </div>

              {/* PREVIEW CONTAINER */}
              <div 
                className="border-2 border-slate-300 rounded-2xl p-6 md:p-8 bg-white space-y-6 relative overflow-hidden shadow-xs"
              >
                {/* Header Logo & Showroom Title */}
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={logoImg} 
                      alt="شعار معرض وسام الشفا للسيارات" 
                      className="w-16 h-16 rounded-xl object-contain border border-slate-200 p-0.5"
                    />
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-slate-900 font-['Readex_Pro']">
                        معرض وسام الشفا للسيارات
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        بطاقة تسجيل معلومات السيارة والمفتاح
                      </p>
                    </div>
                  </div>

                  <div className="text-left font-mono text-[11px] text-slate-500">
                    <div>تاريخ الإدخال:</div>
                    <div className="font-bold text-slate-800">{pdfData.createdAt}</div>
                  </div>
                </div>

                {/* Car Details Table */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block">شركة السيارة:</span>
                      <span className="font-extrabold text-slate-900 text-base">{pdfData.company}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block">نوع / اسم السيارة:</span>
                      <span className="font-extrabold text-slate-900 text-base">{pdfData.carName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-sm">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">الموديل:</span>
                      <span className="font-extrabold text-slate-900 font-mono text-sm">موديل {pdfData.modelYear}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">اللون:</span>
                      <span className="font-extrabold text-slate-900 text-sm">{pdfData.color}</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border ${pdfData.price === 'سوم' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <span className="text-[11px] text-slate-500 block">السعر:</span>
                      <span className="font-extrabold text-sm">{pdfData.price}</span>
                    </div>
                  </div>

                  {/* Mileage & Condition Box */}
                  <div className="bg-blue-50/70 border border-blue-200 text-slate-900 p-4 rounded-2xl text-center space-y-1">
                    <div className="text-xs text-blue-800 font-bold">الممشى الحالي وتقييم الحالة:</div>
                    <div className="text-2xl font-black font-mono text-blue-900">
                      {new Intl.NumberFormat('ar-SA').format(pdfData.mileage)} كم
                    </div>
                    <div className="text-xs font-extrabold text-blue-700 pt-1">
                      التقييم: {pdfData.mileageCondition}
                    </div>
                  </div>

                  {/* Key Number Highlights */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl text-center shadow-md">
                    <div className="text-xs font-bold text-slate-300 uppercase">رقم المفتاح المعتمد بخزنة المعرض:</div>
                    <div className="text-3xl font-black font-mono tracking-widest mt-0.5 text-blue-400">
                      {pdfData.keyNumber}
                    </div>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 font-bold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>معرض وسام الشفا للسيارات</span>
                  </div>
                  <div>مستند رسمي - مفاتيح الخزنة</div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  onClick={handleSavePdf}
                  disabled={isGeneratingPdf}
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg flex items-center gap-2 cursor-pointer border border-blue-500 disabled:opacity-50 transition"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span>جاري تحميل المستند...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-5 h-5 text-white" />
                      <span>حفظ مستند PDF</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-400 print:hidden">
        معرض وسام الشفا للسيارات - نظام إدخال البيانات وتصدير PDF
      </footer>
    </div>
  );
}
