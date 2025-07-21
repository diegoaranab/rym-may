import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {
  preview: string | null = null;
  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    duracion: ['', Validators.required],
    precio: ['', Validators.required],
    imagen: ['']
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course | null,
  ) {
    if (data) {
      this.form.patchValue(data);
      this.preview = data.imagen;
    }
  }

  fileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.form.patchValue({ imagen: this.preview });
    };
    reader.readAsDataURL(file);
  }

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close({ ...this.data, ...this.form.value } as Course);
  }
}
