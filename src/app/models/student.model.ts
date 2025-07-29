export interface Student {
  id: string;              // uuid
  fullName: string;
  phone: string;
  email: string;
  courseIds: string[];
  paidDeposit: boolean;
  createdAt: number;       // epoch
}
