import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, inject,  } from '@angular/core';

import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '../../services/notes.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-create',
  standalone: true,
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
  templateUrl: './note-create.component.html',
  styleUrl: './note-create.component.css'
})
export class NoteCreateComponent implements OnInit,OnDestroy{

  private modalService = inject(NgbModal);
  
  private eventsSubscription!: Subscription;
  @ViewChild('createModel') createModel!: TemplateRef<any>;
  
  constructor(private notesService: NotesService, private toastService: ToastService, private router: Router) { 
    this.eventsSubscription = this.notesService.invokeCreateModelFunction.subscribe(() => {
      this.open(this.createModel);
    });
  }

  createNote!: FormGroup;

  ngOnInit(): void {
    this.createNote = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      tag: new FormControl('general', Validators.required),
    });
  }

	open(create: TemplateRef<any>) {
		this.modalService.open(create);
	}

  createNoteSubmit() {
    this.notesService.createNote(this.createNote.value).subscribe({
      next: data => {
        // console.log(data); // Handle JSON response
        if(data.status === 201 && data.success === true)
        {
          this.notesService.refreshNotesList.emit(); // Emit the event

          // After deleting the note, show the danger toast
          this.toastService.show({ template: this.toastService.getSuccessTemplateRef(), classname: 'bg-success text-dark', delay: 3000, message: 'Note created successfully!'});
        }
        else{
          console.log('Note not created! ', data.status, data.message, data.success);
        }
      },
      error: error => {
        if(error.status === 401 || error.status === 403 && error.error.success === false){
          // show the danger toast for error
          this.toastService.show({ template: this.toastService.getSuccessTemplateRef(), classname: 'bg-danger text-dark', delay: 3000, message: error.error.message});

          console.error(error.status, error.error.message);
          // clode model
          this.modalService.dismissAll();
          // Handle error, e.g., redirect to login page
          this.router.navigate(['/login']);
          localStorage.removeItem('user_id');
        }
        else{
          console.error('There was an error!', error);
        }
      }
    });
    
    this.createNote.reset({ title: '', description: '', tag: 'general'});
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}