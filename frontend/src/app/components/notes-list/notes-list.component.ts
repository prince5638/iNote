import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { NoteCreateComponent } from '../note-create/note-create.component';
import { Router } from '@angular/router';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { NoteDeleteComponent } from '../note-delete/note-delete.component';
import { Note } from '../../models/note.model';

// font awesome module for icons in the application
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, NoteCreateComponent, NoteEditorComponent, NoteDeleteComponent, FontAwesomeModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent implements OnInit{

  // Variable to store the notes
  notes: Note[] = [];

  // Icons declaration
  editNoteIcon = faPenToSquare;
  deleteNoteIcon = faTrashCan;

  constructor(private router: Router ,private notesService: NotesService) {}

  ngOnInit(): void {
    this.refreshNotes();
    this.notesService.refreshNotesList.subscribe(() => {
      this.refreshNotes();
    });
  }

  // Refresh the notes list
  refreshNotes(): void {
    this.notesService.getAllNotes().subscribe({
      next: (response: any) => {

        console.log(response);
        this.notes = response.data.map((note: Note[]) => ({
          ...note,
          color: this.getRandomLightColor()
        }));
      },
      error: (error: any) => {
        if(error.status === 401 || error.status === 403 && error.error.success === false){
          console.error(error.status, error.error.message);
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

  // Create a new note
  createNote() {
    console.log('Opening Create Note Model');
    this.notesService.openCreateModelMethod();
  }

  // Edit an existing note
  editNote(id: string) {
    console.log('Openinig Editing Note Model', id);
    this.notesService.openEditModelMethod(id);
  }

  // Delete an existing note
  deleteNote(note: any) {
    console.log('Opening Deleting Note Mode', note);
    this.notesService.openDeleteModelMethod(note);
  }

  // Giving the random color to the note
  getRandomLightColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 85%)`;
  }
}