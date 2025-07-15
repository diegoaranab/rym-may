import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../models/student.model';

const LS_KEY = 'rym_students';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private store$ = new BehaviorSubject<Student[]>(this.loadLS());

  /** current state as observable */
  students$: Observable<Student[]> = this.store$.asObservable();

  add(student: Student) {
    const next = [...this.store$.value, student];
    this.persist(next);
  }

  /** util for demo edit/remove if needed later */
  update(list: Student[]) { this.persist(list); }

  // ---------- private ----------
  private persist(list: Student[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    this.store$.next(list);
  }

  private loadLS(): Student[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
  }
}
