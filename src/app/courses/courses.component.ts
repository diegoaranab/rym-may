import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Course } from '../models/course.model';
import { MOCK_COURSES } from '../models/mock-courses';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  cursos: Course[] = MOCK_COURSES;
  isHandset = this.bp.isMatched(Breakpoints.Handset);
  constructor(private bp: BreakpointObserver) {}
}
