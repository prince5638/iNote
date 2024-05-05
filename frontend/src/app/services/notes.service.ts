import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  // Event Emitter for Create, Edit, Delete Model and Refresh Notes List
  invokeCreateModelFunction = new EventEmitter();
  invokeEditModelFunction: EventEmitter<string> = new EventEmitter<string>();
  invokeDeleteModelFunction: EventEmitter<any> = new EventEmitter<any>();
  refreshNotesList = new EventEmitter<void>();

  // ----------------- [START] Create, Edit and Delete Model Methods -----------------
  // Create Model Methods
  openCreateModelMethod(){
    this.invokeCreateModelFunction.emit();
  }
  
  // Edit Model Methods
  openEditModelMethod(id: string){
    this.invokeEditModelFunction.emit(id);
  }
  
  // Delete Model Methods
  openDeleteModelMethod(note: any){
    console.log('Service Note:', note);
    this.invokeDeleteModelFunction.emit(note);
  }
  // ----------------- [END] Create, Edit and Delete Model Methods -----------------
  
  // ----------------- [START] CRUD Operations -----------------
  // Fetch all notes Method
  getAllNotes(): Observable<any>{
    return this.http.get('http://localhost:4500/api/notes/getNotes', { withCredentials: true});
  }

  // Create method
  createNote(note: object): Observable<any>{
    return this.http.post('http://localhost:4500/api/notes/create', note, httpOptions)
  }

  // Get Selected Note details for editing
  getNoteDetails(id: string): Observable<any>{
    return this.http.get(`http://localhost:4500/api/notes/getSelectdNote/${id}`, { withCredentials: true});
  }

  // edit method
  editNoteDetails(note: object, id: string): Observable<any>{

    return this.http.put(`http://localhost:4500/api/notes/update/${id}`, note, httpOptions);
  }

  // delete method
  deleteNote(id: string): Observable<any>{
    return this.http.delete(`http://localhost:4500/api/notes/delete/${id}`, { withCredentials: true});
  }
  // ----------------- [END] CRUD Operations -----------------
}
