import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './student-edit-dialog.component.html',
  styleUrls: ['./student-edit-dialog.component.scss']
})
export class StudentEditDialogComponent {
  form = this.fb.group({
    fullName: [this.data?.fullName ?? '', [Validators.required, Validators.minLength(3)]],
    phone:    [this.data?.phone ?? '', [Validators.required]],
    email:    [this.data?.email ?? '', [Validators.email]],
    courseId: [this.data?.courseId ?? '', [Validators.required]],
    paidDeposit: [!!this.data?.paidDeposit]
  });
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<StudentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  guardar(){ if (this.form.valid) this.ref.close({ ...this.data, ...this.form.value }); }
}
