import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Editar alumna</h2>
    <form [formGroup]="form" class="student-form" (ngSubmit)="save()">
      <mat-form-field appearance="outline">
        <mat-label>Nombre completo</mat-label>
        <input matInput formControlName="fullName" required />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="phone" required />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Correo electrónico</mat-label>
        <input matInput formControlName="email" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>ID del curso</mat-label>
        <input matInput formControlName="courseId" />
      </mat-form-field>
      <mat-checkbox formControlName="paidDeposit">Depósito pagado</mat-checkbox>

      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`.student-form{display:grid;gap:.5rem;width:300px}`]
})
export class StudentEditDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public form: FormGroup,
    private dialogRef: MatDialogRef<StudentEditDialogComponent>
  ) {}

  save(){
    this.dialogRef.close(this.form.value);
  }
}
