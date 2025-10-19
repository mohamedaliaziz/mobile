// أنواع نقل الملكية
export type TransferType = 'individual' | 'business' | 'mixed';
export type PartyType = 'person' | 'company';

export type TransferStatus = 
  | 'created'
  | 'under_review'
  | 'waiting_user_action'
  | 'awaiting_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'awaiting_codes'
  | 'codes_submitted'
  | 'codes_verified'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface Document {
  url: string;
  filename?: string;
  mime?: string;
  size?: number;
  uploadedAt?: string;
  category?: 'istimara' | 'inspection' | 'insurance' | 'final' | 'other';
}

export interface TransferParty {
  type: PartyType;
  name?: string;
  phone?: string;
  email?: string;
  idNumber?: string;
  documents?: Document[];
}

export interface VehicleInfo {
  plateNumber?: string;
  chassisNumber?: string;
  model?: string;
  year?: number;
  color?: string;
  manufacturer?: string;
}

export interface PaymentInfo {
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  method?: string;
  reference?: string;
  proof?: Document;
}

export interface TamCodes {
  buyerCode?: string;
  sellerCode?: string;
  submittedAt?: string;
  verifiedAt?: string;
  status: 'pending' | 'verified' | 'rejected';
}

// النوع الرئيسي لاستجابة الاستعلام
export interface TransferLookupResponse {
  // المعلومات الأساسية
  id: string;
  clientRef: string;
  type: TransferType;
  status: TransferStatus;
  
  // الأطراف
  seller: TransferParty;
  buyer: TransferParty;
  
  // معلومات المركبة
  vehicle: VehicleInfo;
  
  // المعلومات المالية
  amount?: number;
  payment?: PaymentInfo;
  
  // المستندات
  documents: Document[];
  istimara?: Document;           // استمارة السيارة
  finalDoc?: Document;           // الاستمارة النهائية
  inspectionDoc?: Document;      // شهادة الفحص
  insuranceDoc?: Document;       // وثيقة التأمين
  additionalDocs?: Document[];   // مستندات إضافية
  
  // أكواد تم
  tamCodes?: TamCodes;
  
  // التواريخ
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  completedAt?: string;
  
  // معلومات إضافية
  notes?: string;                // ملاحظات من الموظف
  rejectionReason?: string;      // سبب الرفض إن وجد
  assignedTo?: string;           // الموظف المسؤول
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // التقدم
  progress?: number;             // نسبة الإنجاز (0-100)
  currentStep?: string;          // الخطوة الحالية
  nextStep?: string;             // الخطوة التالية
  estimatedCompletion?: string;  // الوقت المتوقع للإنجاز
}

// نوع مبسط للاستخدام في القوائم
export interface TransferSummary {
  id: string;
  clientRef: string;
  type: TransferType;
  status: TransferStatus;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  vehicleModel?: string;
  plateNumber?: string;
}

// نوع لطلب إنشاء نقل ملكية
export interface CreateTransferRequest {
  type: TransferType;
  seller: Omit<TransferParty, 'documents'>;
  buyer: Omit<TransferParty, 'documents'>;
  vehicle: VehicleInfo;
  documents: FileUpload[];
  additionalInfo?: {
    hasInsurance?: boolean;
    hasInspection?: boolean;
    istimaraValid?: boolean;
    noFines?: boolean;
  };
}

// أنواع للاستجابة من API
export interface ApiLookupResponse {
  success: boolean;
  data: TransferLookupResponse;
  message?: string;
}

export interface TransfersListResponse {
  success: boolean;
  data: {
    transfers: TransferSummary[];
    total: number;
    page: number;
    limit: number;
  };
}

// أنواع للتحديثات
export interface TransferUpdateRequest {
  status?: TransferStatus;
  notes?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    document: Document;
    transfer: TransferLookupResponse;
  };
  message?: string;
}