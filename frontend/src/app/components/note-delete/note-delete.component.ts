import { AfterContentChecked, AfterContentInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject,  } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '../../services/notes.service';
import { Subscription } from 'rxjs';
import { ToastGlobalComponent } from '../toast/toast-global/toast-global.component';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-delete',
  standalone: true,
  imports: [ToastGlobalComponent],
  templateUrl: './note-delete.component.html',
  styleUrl: './note-delete.component.css'
})
export class NoteDeleteComponent implements OnDestroy, OnInit{
	
	// Variable to store the note id
	note_id!: string;
	note_title!: string;

	private modalService = inject(NgbModal);
	
	private eventsSubscription!: Subscription;
	@ViewChild('deleteModel') deleteModel!: TemplateRef<any>;

	constructor(private notesService: NotesService, private toastService: ToastService, private router: Router) { }

	ngOnInit(): void { 
		this.eventsSubscription = this.notesService.invokeDeleteModelFunction.subscribe((note: any) => {
			console.log('Note:', note);
			this.note_id = note._id;
			this.note_title = note.title;
			console.log('Note ID:', this.note_id);
			this.open(this.deleteModel);
		});
	}

	// Opening the delete model
	open(modelDelete: TemplateRef<any>) {
		this.modalService.open(modelDelete);
	}

	// delete method
	deleteSelectedNote(){
		this.notesService.deleteNote(this.note_id).subscribe({
			next: (data) => {
				if(data.status === 200 && data.success === true)
				{
					this.notesService.refreshNotesList.emit();
					this.modalService.dismissAll();
					
					// After deleting the note, show the danger toast
					this.toastService.show({ template: this.toastService.getDangerTemplateRef(), classname: 'bg-danger text-dark', delay: 3000, message: 'Note Deleted Successfully!'});
				}
				else{
					console.log('Note not deleted! ', data.status, data.message, data.success);
				}
			},
			error: (error: any) => {
				if(error.status === 401 || error.status === 403 && error.error.success === false){
					console.error(error.status, error.error.message);
					// clode model
					this.modalService.dismissAll();
					// Handle error, e.g., redirect to login page
					this.router.navigate(['/login']);
					localStorage.removeItem('user_id');
				}
				else{
					console.error('Something Went Wrong: ', error);
				}
			}
		});
		this.modalService.dismissAll();
	}

	ngOnDestroy(): void {
		this.eventsSubscription.unsubscribe();
	}

}