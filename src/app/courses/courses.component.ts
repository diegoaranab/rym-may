import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { v4 as uuid } from 'uuid';
import { CourseFormComponent } from '../dialogs/course-form/course-form.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  cursos$ = this.courseSvc.courses$;
  isHandset = this.bp.isMatched(Breakpoints.Handset);

  constructor(
    private bp: BreakpointObserver,
    private courseSvc: CourseService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  nuevo() {
    this.dialog.open(CourseFormComponent, {
      data: null,
      panelClass: 'rm-dialog',      // ← apply brand dialog spacing
      width: '720px',
      maxWidth: '95vw',
      autoFocus: true
    })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.courseSvc.create({ ...res, id: uuid() });
          this.snack.open('Curso creado', '', { duration: 1800 });
        }
      });
  }

  editar(c: Course) {
    this.dialog.open(CourseFormComponent, {
      data: c,
      panelClass: 'rm-dialog',      // ← apply brand dialog spacing
      width: '720px',
      maxWidth: '95vw',
      autoFocus: true
    })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.courseSvc.update(res);
          this.snack.open('Curso actualizado', '', { duration: 1800 });
        }
      });
  }

  eliminar(id: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { titulo: 'Confirmar', mensaje: '¿Eliminar este curso?' },
      panelClass: 'rm-dialog',
      backdropClass: 'rm-backdrop-blur',
      width: '480px',
      maxWidth: '95vw',
      autoFocus: true
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.courseSvc.remove(id);
        this.snack.open('Curso eliminado', '', {
          duration: 1800,
          panelClass: 'snack-warn',
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
