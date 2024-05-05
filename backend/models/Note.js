import mongoose from "mongoose";

const { Schema } = mongoose;

const NotesSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            default: "General",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }, 
    {
        timestamps: true,
    }
);

const Note = mongoose.model("note", NotesSchema);
export default Note;