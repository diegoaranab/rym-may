export interface Student {
  id: string;              // uuid
  fullName: string;
  phone: string;
  email: string;
  courseId: string;
  paidDeposit: boolean;
  createdAt: number;       // epoch
}
