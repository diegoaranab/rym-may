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

  edit(student: Student) {
    const next = this.store$.value.map(s => s.id === student.id ? student : s);
    this.persist(next);
  }

  remove(id: string) {
    const next = this.store$.value.filter(s => s.id !== id);
    this.persist(next);
  }


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
