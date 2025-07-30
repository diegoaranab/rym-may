export interface Student {
  id: string;              // uuid
  fullName: string;
  phone: string;
  email: string;
  courseIds: string[];
  paidDeposit: boolean; // TODO: refactor to paidCourseIds: string[] for course-level deposit tracking
  createdAt: number;       // epoch
}
