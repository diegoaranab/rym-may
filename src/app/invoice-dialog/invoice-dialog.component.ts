import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invoice-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Factura</h2>
    <section class="viewer">
      <iframe [src]="url" title="PDF"
              referrerpolicy="no-referrer"
              sandbox="allow-same-origin allow-scripts"></iframe>
    </section>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </div>
  `,
  styleUrls: ['./invoice-dialog.component.scss']
})
export class InvoiceDialogComponent {
  url: string;

  constructor() {
    const pdfUrl =
      'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
    this.url = `/assets/pdfjs/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
  }
}
