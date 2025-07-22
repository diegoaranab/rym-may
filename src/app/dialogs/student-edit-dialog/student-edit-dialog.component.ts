import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './student-edit-dialog.component.html',
})
export class StudentEditDialogComponent {
  form = this.fb.group({ ...this.data });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ref: MatDialogRef<StudentEditDialogComponent>
  ) {}
  guardar() { this.ref.close(this.form.value); }
}
