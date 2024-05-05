import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
	template: TemplateRef<any>;
	classname?: string;
	delay?: number;
	message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  	constructor() { }

  	toasts: Toast[] = [];

	private successTemplateRef!: TemplateRef<any>;
	private editTemplateRef!: TemplateRef<any>;
	private dangerTemplateRef!: TemplateRef<any>;

	show(toast: Toast) {
		this.toasts.push(toast);
		console.log("show toast service called");
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}

	setSuccessTemplateRef(templateRef: TemplateRef<any>): void {
	  	this.successTemplateRef = templateRef;
	}

	setEditTemplateRef(templateRef: TemplateRef<any>): void {
		this.editTemplateRef = templateRef;
	}

	setDangerTemplateRef(templateRef: TemplateRef<any>): void {
	  this.dangerTemplateRef = templateRef;
	}
  
	getSuccessTemplateRef(): TemplateRef<any> {
	  return this.successTemplateRef;
	}

	getEditTemplateRef(): TemplateRef<any> {
	  return this.editTemplateRef;
	}

	getDangerTemplateRef(): TemplateRef<any> {
	  return this.dangerTemplateRef;
	}

}
