import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, startWith } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { StudentService } from '../services/student.service';
import { Student } from '../models/student.model';

/* Material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    ReactiveFormsModule, AsyncPipe,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatButtonModule,
    MatTableModule, MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent {

  private readonly handsetCols = ['fullName', 'courseId', 'paidDeposit'] as const;
  private readonly desktopCols = [
    'fullName',
    'phone',
    'email',
    'courseId',
    'paidDeposit',
  ] as const;

  displayedColumns$ = this.bp
    .observe(Breakpoints.Handset)
    .pipe(
      map((r) => (r.matches ? this.handsetCols : this.desktopCols)),
      startWith(this.desktopCols)
    );

  students$ = this.studentSvc.students$;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone:    ['', Validators.required],
    email:    ['', [Validators.email]],
    courseId: ['', Validators.required],
    paidDeposit: [false]
  });

  constructor(
    private fb: FormBuilder,
    private studentSvc: StudentService,
    private sb: MatSnackBar,
    private bp: BreakpointObserver
  ) {}

  save() {
    if (this.form.invalid) return;
    const student: Student = {
      id: uuid(),
      ...this.form.value as any,
      createdAt: Date.now()
    };
    this.studentSvc.add(student);
    this.sb.open('¡Alumna registrada!', '', { duration: 2000, panelClass: 'snack-fixed' });
    this.form.reset();
  }
}
