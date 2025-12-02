import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onRequestDelete }) => {
  const isCompleted = project.status === 'Completed';

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Stop navigation to project page
    e.stopPropagation(); 
    // Trigger the parent's custom modal
    if (onRequestDelete) {
      onRequestDelete(project);
    }
  };

  return (
    <Link to={`/project/${project._id}`} className="block group h-full">
      <div className={`bg-white h-full rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${isCompleted ? 'border-green-100' : 'border-indigo-50 hover:border-indigo-200'}`}>
        
        {/* Decoration */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${isCompleted ? 'bg-green-400' : 'bg-indigo-400'}`}></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`p-2.5 rounded-xl transition-colors ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
            {isCompleted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            )}
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {project.status || 'Active'}
          </span>
        </div>

        {/* Content */}
        <div className="mb-6 relative z-10">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{project.title}</h3>
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100 relative z-10">
          <div className="flex items-center text-slate-400 font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Delete Button (Only visible if completed) */}
            {isCompleted && (
              <button 
                onClick={handleDeleteClick}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all z-20"
                title="Delete Project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${project.progress || 0}%` }}></div>
              </div>
              <span className="text-xs font-bold text-slate-600">{project.progress || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;