import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'project', // Must match your Project model name
    required: true 
  },
  assignedTo: { type: String, default: 'Unassigned' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  dueDate: { type: Date }
}, { timestamps: true });

const Task = mongoose.models.task || mongoose.model('task', taskSchema);

export default Task;