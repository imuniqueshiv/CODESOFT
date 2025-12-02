import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../services/projectsService';
import { getTasksByProject, createTask, updateTaskStatus } from '../services/tasksService';
import { toast } from 'react-toastify';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Task Form State
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await getProject(id);
        const tasksRes = await getTasksByProject(id);
        // Handle response structure variations (res.project vs res.data)
        setProject(projRes.project || projRes);
        setTasks(tasksRes.tasks || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await createTask({ ...newTask, project: id });
      // Append new task (handle structure: res.task or res)
      setTasks([...tasks, res.task || res]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      toast.success("Task assigned successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign task");
    }
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await updateTaskStatus(task._id, newStatus);
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  // Calculate Progress
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  if (loading) return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center'>
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-400 animate-pulse">Loading project details...</p>
        </div>
    </div>
  );
  
  if (!project) return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center text-slate-500'>
        Project not found
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6 pt-24 sm:px-12 lg:px-20 transition-all duration-500'>
      
      {/* Back Link */}
      <Link to="/dashboard" className="group inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </Link>
      
      {/* Project Header & Progress */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 mb-8 animate-fadeIn relative overflow-hidden">
        {/* Decorative bg element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start relative z-10 gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {project.status || 'Active'}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">{project.category || 'Development'}</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-3">{project.title}</h1>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">{project.description}</p>
                
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
                    <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Deadline: <span className="text-slate-700 ml-1">{project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'No Date'}</span>
                    </div>
                    <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Owner: <span className="text-slate-700 ml-1">{project.owner?.name || 'Me'}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end min-w-[150px]">
                <div className="text-5xl font-bold text-indigo-600 mb-1">{progress}%</div>
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">Progress</div>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 mt-8 overflow-hidden shadow-inner">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`} 
                style={{ width: `${progress}%` }}
            >
                {/* Shine animation */}
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse"></div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Task List */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end px-1">
                <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">{tasks.length} Total</span>
            </div>
            
            {tasks.length === 0 && (
                <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center group hover:border-indigo-200 transition-colors">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-600">No tasks yet</h3>
                    <p className="text-slate-400 mt-1">Add your first task to start tracking progress.</p>
                </div>
            )}
            
            <div className="space-y-4">
                {tasks.map(task => (
                    <div 
                        key={task._id} 
                        className={`group p-5 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
                            task.status === 'Completed' 
                                ? 'border-green-100 bg-green-50/30' 
                                : 'border-indigo-50 hover:border-indigo-200'
                        }`}
                    >
                        <div className="flex items-start gap-4 flex-1">
                            <button 
                                onClick={() => toggleTask(task)}
                                className={`mt-1 min-w-[1.5rem] h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                                    task.status === 'Completed' 
                                        ? 'bg-green-500 border-green-500 text-white shadow-sm' 
                                        : 'border-slate-300 text-transparent hover:border-indigo-400 bg-white'
                                }`}
                                aria-label={task.status === 'Completed' ? "Mark as pending" : "Mark as complete"}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                            <div className="flex-1">
                                <h4 className={`text-lg font-semibold transition-all ${task.status === 'Completed' ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>
                                    {task.title}
                                </h4>
                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        <span className="font-medium">{task.assignedTo || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No date'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {task.status === 'Completed' ? 'Done' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Assign New Task Form */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50 sticky top-28">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Add Task</h3>
                        <p className="text-xs text-slate-500 font-medium">Create new todo item</p>
                    </div>
                </div>
                
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Title</label>
                        <input 
                            type="text" required 
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder-slate-400"
                            placeholder="e.g. Design Homepage"
                            value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Assign To</label>
                        <input 
                            type="text" 
                            placeholder="Name..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder-slate-400"
                            value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Due Date</label>
                        <input 
                            type="date" required 
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm"
                            value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 font-bold mt-2"
                    >
                        Create Task
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}