import Note from '../models/Note.js';

import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';

// Create a new note
export const createNote = async (req, res, next) => {
    const userId = req.userId;
    const { title, description, tag } = req.body;
    try{
        const note = new Note({
            user: userId,
            title,
            description,
            tag,
        });
        
        const saveNote = await note.save();
        // return res.status(201).send({message: "Notes created successfully"});
        return next(CreateSuccess(201, "Note created successfully", note));
    }
    catch(error){
        // return res.status(500).send({ error: "Internal server error" });
        return next(CreateError(500, "Internal Server Error"));
    }
}

// Retrieve all notes
export const getNotes = async (req, res, next) => {
    try{
        console.log("Get Notes with User id", req.userId);
        // find the notes based on the id
        const notes = await Note.find({user: req.userId});
        // const notes = await Note.find({});
        // return res.status(200).send(notes);
        if(notes.length === 0){
            return next(CreateError(404, "No Notes found"));
        }
        return next(CreateSuccess(200, "Notes fetched successfully", notes));
    }
    catch(error)
    {
        // return res.status(500).send({ error: "Internal server error" });
        return next(CreateError(500, "Internal Server Error"));
    }
}

// Update a note
export const updateNote = async (req, res, next) => {
    const { title, description, tag } = req.body;
    try{
        let newNote = await Note.findById(req.params.id);
        if(!newNote){
            return res.status(404).send({ error: "Note not found" });
        }
        newNote = await Note.findByIdAndUpdate(req.params.id, {title, description, tag}, {
            new: true,
        });
        // return res.status(200).send(newNote);
        return next(CreateSuccess(200, "Note updated successfully", newNote));
    }
    catch(error){
        // return res.status(500).send({ error: "Internal server error" });
        return next(CreateError(500, "Internal Server Error"));
    }
}

// Get the Selected Note Details for Update
export const getSelectedNoteDetail = async (req, res, next) => {
    try{
        let newNote = await Note.findById(req.params.id);
        if(!newNote){
            return res.status(404).send({ error: "Note not found" });
        }
        // return res.status(200).send(newNote);
        return next(CreateSuccess(200, "Selected Note fetched successfully", newNote));
    }
    catch(error){
        // return res.status(500).send({ error: "Internal server error" });
        return next(CreateError(500, "Internal Server Error"));
    }
}

// Delete a note
export const deleteNote = async (req, res, next) => {
    try{
        let newNote = await Note.findById(req.params.id);
        if(!newNote){
            return res.status(404).send({ error: "Note not found" });
        }
        newNote = await Note.findByIdAndDelete(req.params.id);
        // return res.status(200).send({ message: "Note deleted successfully" });
        return next(CreateSuccess(200, "Note deleted successfully", newNote));
    }
    catch(error){
        // return res.status(500).send({ error: "Internal server error" });
        return next(CreateError(500, "Internal Server Error"));
    }
}