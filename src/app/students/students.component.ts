import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { v4 as uuid } from 'uuid';

import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course.service';
import { Student } from '../models/student.model';
import { map } from 'rxjs';

/* Material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { StudentEditDialogComponent } from '../dialogs/student-edit-dialog/student-edit-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    ReactiveFormsModule, AsyncPipe,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatButtonModule,
    MatTableModule, MatSnackBarModule,
    MatIconModule, MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent {

  displayedColumnsHandset = ['fullName','courses','factura','acciones'] as const;
  displayedColumnsDesktop = ['fullName','phone','email','courses','paidDeposit','factura','acciones'] as const;
  displayedColumns = this.bp.isMatched(Breakpoints.Handset)
    ? this.displayedColumnsHandset : this.displayedColumnsDesktop;


  students$ = this.studentSvc.students$;
  courses$  = this.courseSvc.courses$;

  coursesMap = this.courseSvc.courses$.pipe(
    map(list => {
      const map = new Map(list.map(c => [c.id, c.nombre]));
      return {
        map,
        mapIds: (ids: string[]) => ids.map(id => map.get(id) ?? id)
      };
    })
  );

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone:    ['', Validators.required],
    email:    ['', [Validators.email]],
    courseIds: [[], Validators.required],
    paidDeposit: [false]
  });

  get selectedCourseCount(): number {
    const val = this.form.get('courseIds')?.value;
    return Array.isArray(val) ? (val as any[]).length : 0;
  }

  constructor(
    private fb: FormBuilder,
    private studentSvc: StudentService,
    private courseSvc: CourseService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private bp: BreakpointObserver
  ) {}

  abrirFactura(alumna: Student) {
    this.dialog.open(InvoiceDialogComponent, {
      autoFocus: false,
      panelClass: 'pdf-dialog'
    });
  }

  save() {
    if (this.form.invalid) return;
    const student: Student = {
      id: uuid(),
      ...this.form.value as any,
      createdAt: Date.now()
    };
    this.studentSvc.add(student);
    this.snack.open('¡Alumna registrada!', '', { duration: 2000, panelClass: 'snack-fixed' });
    this.form.reset({ courseIds: [] as any });
  }

  editar(row: Student) {
    this.dialog.open(StudentEditDialogComponent, {
      data: { ...row },
      panelClass: 'rm-dialog',
      backdropClass: 'rm-backdrop-blur',
      width: 'min(720px, 95vw)',   // cap width to viewport
      maxWidth: '95vw',
      maxHeight: '88vh',           // let content scroll inside
      autoFocus: true
    }).afterClosed().subscribe(result => {
      if (result) this.studentSvc.edit(result as Student);
    });
  }

  eliminar(row: Student) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { titulo: 'Confirmar', mensaje: '¿Eliminar este registro?' },
      panelClass: 'rm-dialog',
      backdropClass: 'rm-backdrop-blur',
      width: 'min(720px, 95vw)',
      maxWidth: '95vw',
      maxHeight: '88vh',
      autoFocus: true
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.studentSvc.remove(row.id);
        this.snack.open('Alumna eliminada', '', {
          duration: 1800,
          panelClass: 'snack-warn',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
