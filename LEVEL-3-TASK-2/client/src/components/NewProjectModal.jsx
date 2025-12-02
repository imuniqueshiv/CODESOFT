import React, { useState } from 'react';
import { createProject } from '../services/projectsService';
import { toast } from 'react-toastify';

const NewProjectModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endDate: '', 
    category: 'Development'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(formData);
      toast.success("Project created successfully!");
      if(onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn transition-opacity'>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100'>
        
        {/* Header with Gradient */}
        <div className='bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 flex justify-between items-center'>
          <div>
              <h2 className='text-white text-2xl font-bold'>New Project</h2>
              <p className='text-indigo-100 text-sm mt-1'>Let's build something amazing.</p>
          </div>
          <button 
            onClick={onClose} 
            className='bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors'
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-8'>
          <div className='mb-5'>
            <label htmlFor="proj-title" className='block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide'>Project Title</label>
            <div className="relative">
                <input 
                id="proj-title"
                type="text" 
                required
                className='w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-800'
                placeholder="e.g. Website Redesign"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
          </div>

          <div className='mb-5'>
            <label htmlFor="proj-desc" className='block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide'>Description</label>
            <textarea 
              id="proj-desc"
              rows="3"
              required
              className='w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-800 resize-none'
              placeholder="What are the goals and details?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className='mb-8'>
            <label htmlFor="proj-date" className='block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide'>Target Deadline</label>
            <input 
              id="proj-date"
              type="date" 
              required
              className='w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-800'
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>

          <div className='flex gap-4 justify-end pt-4 border-t border-slate-100'>
            <button 
              type="button" 
              onClick={onClose} 
              className='px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors'
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                  <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating...
                  </span>
              ) : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;