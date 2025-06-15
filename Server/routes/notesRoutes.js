import express from "express";
import { createNote, updateNote, deleteNote, getNotesByFolder, getNoteById, getAllNotes } from "../controllers/notesController.js";
import verifyToken from "../middlewares/verifyToken.js"

const router = express.Router();

// Jwt verification
router.use(verifyToken);

// POST /api/note/create
router.post("/create", createNote);

// PUT /api/note/update
router.put("/update", updateNote);

// DELETE /api/note/delete
router.delete("/delete", deleteNote);

// GET /api/note/folderId
router.get("/folder/:folderId", getNotesByFolder);

// GET /api/note/all
router.get("/all", getAllNotes);

// GET /api/note/getNote/:id
router.get("/:noteId", getNoteById);






export default router;
