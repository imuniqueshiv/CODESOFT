import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../services/projectsService';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); 
  
  // State for Delete Confirmation Modal
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.projects || []); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
        await deleteProject(projectToDelete._id);
        // Optimistic UI update: Remove from list immediately
        setProjects(prev => prev.filter(p => p._id !== projectToDelete._id));
        toast.success("Project deleted successfully");
    } catch (err) {
        console.error(err);
        toast.error("Failed to delete project");
    } finally {
        setProjectToDelete(null); // Close modal
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Completed' 
        ? p.status === 'Completed' 
        : p.status !== 'Completed';
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status !== 'Completed').length,
    completed: projects.filter(p => p.status === 'Completed').length
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6 pt-24 sm:px-12 transition-all duration-500'>
      
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 animate-fadeIn'>
        <div>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent'>
            Dashboard
          </h1>
          <p className='text-slate-500 mt-2 font-medium'>Overview of your projects and performance.</p>
        </div>
        <button 
          onClick={() => setShowNew(true)} 
          className='group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1'
        >
          <span className="text-2xl font-light leading-none mb-1 group-hover:rotate-90 transition-transform duration-300">+</span> 
          <span className="font-semibold">New Project</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md hover:border-indigo-100 transition-all duration-300 group'>
          <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1'>Total Projects</p>
          <h3 className='text-4xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors'>{stats.total}</h3>
        </div>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md hover:border-blue-200 transition-all duration-300 group'>
          <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1'>Active</p>
          <h3 className='text-4xl font-bold text-blue-600'>{stats.active}</h3>
        </div>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md hover:border-green-200 transition-all duration-300 group'>
          <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1'>Completed</p>
          <h3 className='text-4xl font-bold text-green-500'>{stats.completed}</h3>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className='flex flex-col sm:flex-row justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-indigo-50 mb-8 gap-4'>
        <div className='flex gap-1 bg-slate-100/50 p-1.5 rounded-xl w-full sm:w-auto'>
          {['All', 'Active', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === f 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className='relative w-full sm:w-80 group'>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none placeholder-slate-400 text-slate-700'
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className='flex flex-col items-center justify-center py-24'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-400 animate-pulse">Loading workspace...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10'>
          {filteredProjects.map((p) => (
            <div key={p._id} className="transform hover:-translate-y-1 transition-transform duration-300 h-full">
                {/* Passed onDelete prop to trigger modal */}
                <ProjectCard 
                    project={p} 
                    onRequestDelete={setProjectToDelete}
                />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-indigo-100 backdrop-blur-sm'>
          <h3 className='text-xl font-bold text-slate-800 mb-2'>No projects found</h3>
          <p className='text-slate-500 mb-8 max-w-sm mx-auto'>
            {searchTerm || filter !== 'All' 
                ? "Try adjusting your filters or search terms." 
                : "Your workspace is empty. Create your first project to get started."}
          </p>
          <button onClick={() => setShowNew(true)} className='text-indigo-600 font-semibold hover:underline flex items-center justify-center gap-2 mx-auto'>
            <span>Create New Project</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showNew && (
        <NewProjectModal onClose={() => setShowNew(false)} onCreated={fetchProjects} />
      )}

      {/* Custom Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 transform scale-100 transition-all border border-white/20">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 border border-red-100">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Project?</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Are you sure you want to delete <strong>"{projectToDelete.title}"</strong>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setProjectToDelete(null)}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg hover:shadow-red-500/30 transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}