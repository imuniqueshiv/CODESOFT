import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

  // Persisted progress so list endpoints don't need to recompute every time
  progress: { type: Number, default: 0, min: 0, max: 100 },

  // Keep your existing status enum, ensure 'Completed' included
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'On Hold'], 
    default: 'Active' 
  },

  // Helpful explicit boolean to simplify checks
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Project = mongoose.models.project || mongoose.model('project', projectSchema);

export default Project;
