import { Component, computed, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course.service';
import { precioToNumber, startOfWeek, weeksBack } from '../utils/metrics';

// ngx-echarts standalone directive
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    AsyncPipe, NgFor, NgIf,
    MatCardModule, MatIconModule, MatDividerModule,
    NgxEchartsDirective
  ]
})
export class DashboardComponent {
  private studentsSvc = inject(StudentService);
  private coursesSvc  = inject(CourseService);

  // Snapshot data (services expose BehaviorSubjects)
  students = this.studentsSvc.students$;
  courses  = this.coursesSvc.courses$;

  // Derived KPIs (computed inside template with | async in a minimal way)
  // We’ll also compute chart options when async data arrives (in template via (echartsInit)? not required; we use getters)

  // Build chart options from arrays
  buildCharts(students: any[], courses: any[]): {bar:EChartsOption, line:EChartsOption, pie:EChartsOption} {
    // 1) Alumnas por curso (bar)
    const byCourseMap = new Map<string, number>();
    courses.forEach(c => byCourseMap.set(c.id, 0));
    students.forEach(s => byCourseMap.set(s.courseId, (byCourseMap.get(s.courseId) || 0) + 1));
    const barCats = courses.map(c => c.nombre);
    const barData = courses.map(c => byCourseMap.get(c.id) || 0);

    const brandBlue = '#1D1E5B', accent = '#C54573', gold = '#F0C94A', grey = '#DCDDE0';

    const bar: EChartsOption = {
      grid: { left: 40, right: 16, top: 24, bottom: 40 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: barCats, axisLabel: { rotate: 15 } },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: barData, itemStyle: { color: brandBlue }, barWidth: '50%' }]
    };

    // 2) Inscripciones por semana (últimas 8)
    const weeks = weeksBack(8);
    const countByWeek = weeks.map(w => 0);
    students.forEach(s => {
      const w = startOfWeek(s.createdAt);
      const idx = weeks.indexOf(w);
      if (idx >= 0) countByWeek[idx]++;
    });
    const weekLabels = weeks.map(w => {
      const d = new Date(w);
      return `${d.getDate()}/${d.getMonth()+1}`;
    });
    const line: EChartsOption = {
      grid: { left: 40, right: 16, top: 24, bottom: 40 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: weekLabels },
      yAxis: { type: 'value' },
      series: [{ type: 'line', smooth: true, data: countByWeek, areaStyle: { opacity: 0.1 }, lineStyle: { color: accent }, itemStyle: { color: accent } }]
    };

    // 3) Depósitos (pie)
    const paid = students.filter(s => s.paidDeposit).length;
    const unpaid = students.length - paid;
    const pie: EChartsOption = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['45%','70%'],
        avoidLabelOverlap: true,
        label: { formatter: '{b}: {c}', color: brandBlue },
        data: [
          { name: 'Pagado', value: paid, itemStyle: { color: accent }},
          { name: 'Pendiente', value: unpaid, itemStyle: { color: grey } }
        ]
      }]
    };

    return { bar, line, pie };
  }
}
