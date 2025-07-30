import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf, NgFor } from '@angular/common';
import { Student } from '../models/student.model';
import { Course } from '../models/course.model';
import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course.service';

// ECharts
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf, NgFor, NgxEchartsDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private studentsSvc = inject(StudentService);
  private coursesSvc  = inject(CourseService);

  students$ = this.studentsSvc.students$;
  courses$  = this.coursesSvc.courses$;

  vm$ = combineLatest([this.students$, this.courses$]).pipe(
    map(([students, courses]) => ({ students, courses }))
  );

  /** KPI helpers (course-level counts) */
  totalEnrollments(students: Student[]): number {
    return students.reduce((sum, s) => sum + (s.courseIds?.length ?? 0), 0);
  }

  depositsPaid(students: Student[]): number {
    return students.reduce(
      (sum, s) => sum + (s.paidDeposit ? (s.courseIds?.length ?? 0) : 0),
      0
    );
  }

  enrollmentsLast30Days(students: Student[]): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return students.reduce((sum, s) => {
      const inWindow = s.createdAt ? new Date(s.createdAt) >= cutoff : false;
      return sum + (inWindow ? (s.courseIds?.length ?? 0) : 0);
    }, 0);
  }

  /** Charts built from course-level counts */
  buildCharts(students: Student[], courses: Course[]): { bar: EChartsOption; line: EChartsOption; pie: EChartsOption } {
    const brandBlue = '#1D1E5B';
    const brandPink = '#C54573';
    const gray      = '#E6E6E9';

    // -- Alumnas por curso (bar) --
    const byCourse: Record<string, number> = {};
    for (const c of courses) byCourse[c.id] = 0;
    for (const s of students) {
      for (const cid of s.courseIds ?? []) {
        if (byCourse[cid] != null) byCourse[cid] += 1;
      }
    }
    const courseNames = courses.map(c => c.nombre);
    const courseCounts = courses.map(c => byCourse[c.id] ?? 0);

    // -- Inscripciones por semana (line) --
    // MVP: attribute all of a student's selected courses to the student's createdAt week.
    const weeks: string[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      weeks.push(`${d.getDate()}/${d.getMonth() + 1}`);
    }
    const perWeek = new Array(weeks.length).fill(0);
    for (const s of students) {
      const d = new Date(s.createdAt ?? Date.now());
      // find nearest week bucket
      let bucket = weeks.length - 1;
      for (let i = 0; i < weeks.length; i++) {
        const w = new Date(now);
        w.setDate(now.getDate() - (weeks.length - 1 - i) * 7);
        if (d <= w) { bucket = i; break; }
      }
      perWeek[bucket] += (s.courseIds?.length ?? 0);
    }

    // -- Depósitos (pie) --
    const totalEnrollments = this.totalEnrollments(students);
    const paid             = this.depositsPaid(students);
    const pending          = Math.max(totalEnrollments - paid, 0);

    return {
      bar: {
        tooltip: { trigger: 'axis' },
        xAxis:   { type: 'category', data: courseNames, axisLabel: { rotate: 25 } },
        yAxis:   { type: 'value' },
        series:  [{ type: 'bar', data: courseCounts, itemStyle: { color: brandBlue }}],
        grid:    { left: 36, right: 16, bottom: 40, top: 24 },
      },
      line: {
        tooltip: { trigger: 'axis' },
        xAxis:   { type: 'category', data: weeks },
        yAxis:   { type: 'value' },
        series:  [{ type: 'line', smooth: true, data: perWeek, symbolSize: 6, lineStyle: { width: 3, color: brandPink } }],
        grid:    { left: 40, right: 16, bottom: 24, top: 24 },
      },
      pie: {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['55%','80%'],
          avoidLabelOverlap: true,
          label: { show: true, formatter: '{b}: {c}' },
          data: [
            { name: 'Pagado',   value: paid,    itemStyle: { color: brandPink } },
            { name: 'Pendiente',value: pending, itemStyle: { color: gray } },
          ],
        }],
      },
    };
  }
}
