import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../models/course.model';

const LS_KEY = 'rm_courses';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private store$ = new BehaviorSubject<Course[]>(this.loadLS());
  courses$ = this.store$.asObservable();

  findAll(): Course[] {
    return this.store$.value;
  }

  create(course: Course) {
    const next = [...this.store$.value, course];
    this.persist(next);
  }

  update(course: Course) {
    const next = this.store$.value.map(c => c.id === course.id ? course : c);
    this.persist(next);
  }

  remove(id: string) {
    const next = this.store$.value.filter(c => c.id !== id);
    this.persist(next);
  }

  // ---------- private ----------
  private persist(list: Course[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    this.store$.next(list);
  }

  private loadLS(): Course[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
  }
}
