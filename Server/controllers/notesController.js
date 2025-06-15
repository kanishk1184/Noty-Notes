import Note from "../models/Note.js";
import Folder from "../models/Folder.js";

export const createNote = async (req, res) => {
  try {
    const userId = req.user;
    const { folderId, title, content } = req.body;

    // console.log(`Request for creating a new note with title:${title} inside folderId:${folderId} and content is:\n${content}`);

    // Check if the folderId requested actually exists for the said user
    const checkFolder = await Folder.findOne({_id: folderId, userId});
    if (!checkFolder) return res.status(404).json({message: "Folder not found"});
    
    const newNote = new Note({
      userId,
      folderId,
      title,
      content,
      lastModified: Date.now()
    });
    
    await newNote.save();
    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Server error while creating note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.user;
    const { _id, title, content, pinned, favorite } = req.body;

    
    // console.log(`Request for update the note with noteId:${_id} to change it to title:${title} and content:${content}`);

    const note = await Note.findOne({ _id: _id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (pinned !== undefined) note.pinned = pinned;
    if (favorite !== undefined) note.favorite = favorite;
    note.lastModified = Date.now();

    await note.save();
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user;
    const { noteId } = req.body;

    // console.log(`Deletion request of noteId:${noteId}`);

    const deleted = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!deleted) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting note" });
  }
};

export const getNotesByFolder = async (req, res) => {
  try {
    const userId = req.user;
    const { folderId } = req.params;

    // console.log(`Request to get all the notes inside the folderId:${folderId}`);

    // Check if the folderId requested actually exists for the said user
    const checkFolder = await Folder.findOne({_id: folderId, userId});
    if (!checkFolder) return res.status(404).json({message: "Folder not found"});

    const notes = await Note.find({ userId, folderId }).select("_id folderId title content pinned favorite lastModified createdAt");
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching notes" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const userId = req.user;
    const { noteId } = req.params;

    // console.log(`Request to get the note with NoteId:${noteId}`);

    // Find the note
    const note = await Note.findOne({ userId, _id: noteId }).select("_id folderId title content pinned favorite lastModified createdAt");
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching the note" });
  }
};

export const getAllNotes = async (req, res) =>{
  try{
    const userId = req.user;

    // console.log(`Request to get all the notes for the userID: ${userId}`);

    const notes = await Note.find({userId}).select("_id folderId title content pinned favorite lastModified createdAt");
    res.status(200).json({ notes });
    
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching all the notes" });
  }
}
