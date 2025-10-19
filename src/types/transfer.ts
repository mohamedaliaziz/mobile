export interface TransferLookupResponse {
  id: string;
  clientRef: string;
  status: TransferStatus;
  amount?: number;
  istimara?: Document;
  finalDoc?: Document; // الاستمارة النهائية
  inspectionDoc?: Document; // استمارة الفحص
  insuranceDoc?: Document; // وثيقة التأمين
  additionalDocs?: Document[]; // مستندات إضافية
  updatedAt: string;
  completedAt?: string;
  notes?: string; // ملاحظات من الموظف
}

export interface Document {
  url: string;
  filename?: string;
  mime?: string;
  size?: number;
  uploadedAt?: string;
  category?: 'istimara' | 'inspection' | 'insurance' | 'final' | 'other';
}