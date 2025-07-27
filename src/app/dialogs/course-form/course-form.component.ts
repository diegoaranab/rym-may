import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {
  form = this.fb.group({
    nombre:      [this.data?.nombre ?? '', [Validators.required, Validators.minLength(3)]],
    descripcion: [this.data?.descripcion ?? '', [Validators.required, Validators.minLength(10)]],
    duracion:    [this.data?.duracion ?? '', [Validators.required]],
    precio:      [this.data?.precio ?? '', [Validators.required]],
    imagen:      [this.data?.imagen ?? '']  // URL o dataURL local
  });

  preview: string | null = this.data?.imagen || null;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(input: HTMLInputElement) {
    const f = input.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.form.patchValue({ imagen: this.preview });
    };
    reader.readAsDataURL(f);
  }

  save() {
    if (this.form.invalid) return;
    this.ref.close({ ...this.data, ...this.form.value });
  }
}
