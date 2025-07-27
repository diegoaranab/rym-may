import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    MatIconModule, MatDialogModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent {

  displayedColumnsHandset = ['fullName','courseId','factura','acciones'] as const;
  displayedColumnsDesktop = ['fullName','phone','email','courseId','paidDeposit','factura','acciones'] as const;
  displayedColumns = this.bp.isMatched(Breakpoints.Handset)
    ? this.displayedColumnsHandset : this.displayedColumnsDesktop;


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
    this.sb.open('¡Alumna registrada!', '', { duration: 2000, panelClass: 'snack-fixed' });
    this.form.reset();
  }

  editar(row: Student) {
    this.dialog.open(StudentEditDialogComponent, {
      data: { ...row },
      width: '720px',
      maxWidth: '92vw',
      autoFocus: true
    }).afterClosed().subscribe(result => {
      if (result) this.studentSvc.edit(result as Student);
    });
  }

  eliminar(row: Student) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { mensaje: '¿Eliminar este registro?' }
    }).afterClosed().subscribe(ok => {
      if (ok) this.studentSvc.remove(row.id);
    });
  }
}
