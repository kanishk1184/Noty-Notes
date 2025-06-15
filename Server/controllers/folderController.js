import Folder from "../models/Folder.js";
import Note from "../models/Note.js";

export const createOrUpdateFolder = async (req, res) =>{
    try{
        const userId = req.user;
        const { _id, newName } = req.body;

        // console.log(`Folder creation/updation request with id:${_id}, folderName:${newName} for userId:${userId}`);
        
        // Check if already folder exists i.e. we need to rename it
        if (_id){
            const folder = await Folder.findOne({ userId, _id});
            if (!folder) return res.status(404).json({ message: "Folder not found"});

            folder.name = newName;
            await folder.save();
            
            return res.status(200).json({message: "Folder renamed successfully"});
        } else {
            // Create a new Folder
            const existing = await Folder.findOne({ userId, name: newName});
            if (existing) return res.status(400).json({ message: "Folder already exists"});

            const newFolder = new Folder({name: newName, userId});
            await newFolder.save();

            return res.status(201).json({ message: "Folder created successfully", _id: newFolder._id});
        }
    }
    catch (err){
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteFolder = async (req, res) => {
  try {
    const userId = req.user;
    const { _id, folderName } = req.body;

    const deleted = await Folder.findOneAndDelete({ _id, userId });

    
    // console.log(`Folder deletion request with folderName:${folderName} and id:${_id}`);

    if (!deleted) {
      return res.status(404).json({ message: "Folder not found" });
    }
    
    await Note.deleteMany({folderId: _id, userId});
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error while deleting folder" });
  }
};

export const getAllFolders = async (req, res) => {
  try {
    const userId = req.user; 
    const folders = await Folder.find({ userId }).select("_id name"); 
    // Send all the folders toh client

    // console.log(`Request for all the folders for the userId:${userId}`);
    
    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const userId = req.user;
    const { folderId } = req.params;
    
    
    // console.log(`Request for folder with folderId:${folderId}`);
    const folder = await Folder.findOne({ userId, _id:folderId }).select("_id name"); 

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    
    res.status(200).json({ folder });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
