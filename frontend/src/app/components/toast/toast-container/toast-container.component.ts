import { Component, inject } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  templateUrl: './toast-container.component.html',
  host: { class: 'toast-container position-fixed top-1 end-0 p-5', style: 'z-index: 1200' },
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
