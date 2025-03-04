import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema); 