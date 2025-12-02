import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Active', 'Completed', 'Pending'], 
        default: 'Active' 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);

export default projectModel;