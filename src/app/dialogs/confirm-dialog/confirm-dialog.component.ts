import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
  <h2 mat-dialog-title class="dialog-title">{{ data.titulo || 'Confirmar' }}</h2>
  <mat-dialog-content class="dialog-content">{{ data.mensaje }}</mat-dialog-content>
  <mat-dialog-actions align="end" class="dialog-actions">
    <button mat-button mat-dialog-close>Cancelar</button>
    <button mat-raised-button color="warn" [mat-dialog-close]="true">Eliminar</button>
  </mat-dialog-actions>
  `,
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { mensaje: string; titulo?: string }) {}
}
