import express from "express";
import { createOrUpdateFolder, deleteFolder, getAllFolders, getFolderById } from "../controllers/folderController.js";
import verifyToken from "../middlewares/verifyToken.js"

const router = express.Router();

// Verifying the jwt token
router.use(verifyToken);

// POST /api/folder/create-or-update
router.post("/create-or-update", createOrUpdateFolder);

// POST /api/folder/delete
router.delete("/delete", deleteFolder);

// POST /api/folder/all
router.get("/all", getAllFolders);

// Get /api/:folderId
router.get("/:folderId", getFolderById);

export default router;
