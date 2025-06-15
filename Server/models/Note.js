import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },

  title:          { type: String, default: '' },
  content:        { type: String, default: '' },

  pinned:         { type: Boolean, default: false },
  favorite:       { type: Boolean, default: false },

  createdAt:      { type: Date, default: Date.now },
  lastModified:   { type: Date, default: Date.now }
});

export default mongoose.model('Note', noteSchema);