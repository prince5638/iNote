import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild, inject } from '@angular/core';

import { ToastContainerComponent } from '../toast-container/toast-container.component';
import { ToastService } from '../../../services/toast.service';

// font awesome module for icons in the application
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExplosion, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast-global',
  standalone: true,
  imports: [ToastContainerComponent, FontAwesomeModule],
  templateUrl: './toast-global.component.html',
  styleUrl: './toast-global.component.css'
})
export class ToastGlobalComponent implements OnDestroy, AfterViewInit{

	// Icons declaration
	dangerIcon = faExplosion;
	successIcon = faCheck;

	@ViewChild('successTpl') successTpl!: TemplateRef<any>;
	@ViewChild('editTpl') editTpl!: TemplateRef<any>;
	@ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;

	constructor(private toastService: ToastService) { }

	ngAfterViewInit(): void {
		this.toastService.setSuccessTemplateRef(this.successTpl);
		this.toastService.setEditTemplateRef(this.editTpl);
		this.toastService.setDangerTemplateRef(this.dangerTpl);
	}

	ngOnDestroy(): void {
		this.toastService.clear();
	}
}
