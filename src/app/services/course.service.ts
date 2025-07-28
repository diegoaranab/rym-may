import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../models/course.model';

const LS_KEY = 'rm_courses';
const PLACEHOLDER = 'assets/placeholder-course.svg';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private store$ = new BehaviorSubject<Course[]>(this.loadLS());
  /** Public stream for components that use | async */
  courses$ = this.store$.asObservable();

  findAll(): Course[] { return this.store$.value; }

  /** Create a new course (assigns placeholder image if empty) */
  create(course: Course) {
    const next = [...this.store$.value];
    const exists = next.some(c => c.id === course.id);
    const nuevo: Course = {
      ...course,
      imagen: (course.imagen && course.imagen.trim()) ? course.imagen : PLACEHOLDER
    };
    if (exists) {
      // If the id already exists, treat as update to avoid duplicates.
      const idx = next.findIndex(c => c.id === course.id);
      next[idx] = { ...next[idx], ...nuevo };
    } else {
      next.unshift(nuevo);
    }
    this.persist(next);
  }

  /** Update by id */
  update(course: Course) {
    const next = [...this.store$.value];
    const idx = next.findIndex(c => c.id === course.id);
    if (idx >= 0) {
      next[idx] = {
        ...next[idx],
        ...course,
        imagen: (course.imagen && course.imagen.trim()) ? course.imagen : next[idx].imagen || PLACEHOLDER
      };
      this.persist(next);
    }
  }

  /** Remove by id */
  remove(id: string) {
    const next = this.store$.value.filter(c => c.id !== id);
    this.persist(next);
  }

  // ---------- private ----------
  private persist(list: Course[]) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
    this.store$.next(list);
  }
  private loadLS(): Course[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
  }
}
