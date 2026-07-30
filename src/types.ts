export type CarStatus = 'available' | 'reserved' | 'sold';

export interface CarItem {
  id: string;
  company: string; // شركة السيارة (مثال: تويوتا، لكزس، مرسيدس)
  modelName: string; // نوع/اسم السيارة (مثال: كامري، S500، لاندكروزر)
  year: number; // الموديل / سنة الصنع (مثال: 2024)
  mileage: number; // الممشى بالكيلومتر
  keyNumber: string; // رقم المفتاح (مثال: K-104، 55)
  cabinetLocation?: string; // موقع المفتاح في الخزنة (مثال: دولاب أ - رف 2)
  color?: string; // لون السيارة
  price?: number; // السعر المطلوب (اختياري)
  status: CarStatus; // حالة السيارة: متاح، محجوز، مباع
  notes?: string; // ملاحظات الموظف
  createdAt: string; // تاريخ وساعة الإدخال
  registeredBy?: string; // اسم الموظف
}

export interface BrandOption {
  id: string;
  nameAr: string;
  nameEn: string;
  popularModels: string[];
  iconName?: string;
  colorBg?: string;
}

export interface ShowroomStats {
  totalCars: number;
  availableKeys: number;
  reservedCars: number;
  soldCars: number;
  todayCount: number;
}
