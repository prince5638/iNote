import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent {

  // Variable to store the note id
	note_id!: string;

  // Variable to store the form data
  editNote!: FormGroup;

  private modalService = inject(NgbModal);
  
  private eventsSubscription!: Subscription;
  @ViewChild('editModel') editModel!: TemplateRef<any>;

  constructor(private notesService: NotesService, private toastService: ToastService, private router: Router) { }

  ngOnInit(): void { 
    this.eventsSubscription = this.notesService.invokeEditModelFunction.subscribe((id: string) => {
      this.note_id = id;
      console.log(id);
      this.open(this.editModel);
    });

    this.editNote = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      tag: new FormControl('', Validators.required),
    });
    
  }

	open(editModel: TemplateRef<any>) {
		this.modalService.open(editModel);
    this.notesService.getNoteDetails(this.note_id).subscribe({
      next: res => {
        if(res.status === 200 && res.success === true)
        {
          this.editNote.setValue({
            title: res.data.title,
            description: res.data.description,
            tag: res.data.tag
          });
          console.info(res.message);
        }
        else{
          console.log("Form not updated with the old values: ",res);
        }
      },
      error: error => {
        if(error.status === 401 && error.error.success === false){
          console.error(error.status, error.error.message);
          // clode model
          this.modalService.dismissAll();
          // Handle error, e.g., redirect to login page
          this.router.navigate(['/login']);
          localStorage.removeItem('user_id');
        }
        else{
          console.error('There was an error!', error.error.message);
        }
      }
    });
	}

  editNoteSubmit() {
    this.notesService.editNoteDetails(this.editNote.value, this.note_id).subscribe({
      next: data => {
        // console.log(data);
        if(data.status === 200 && data.success === true)
        {
          console.info(data.message);
          this.notesService.refreshNotesList.emit(); // Emit the event

          // After editing the note, show the edit toast
          this.toastService.show({ template: this.toastService.getEditTemplateRef(), classname: 'bg-info text-dark', delay: 3000, message: 'Note Updated Successfully!'});
          
          this.editNote.reset();
        }
        else{
          console.log("Note not Updated! ", data.status, data.message, data.success);
        }
      },
      error: error => {
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

  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}