import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../services/projectsService';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../services/tasksService';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const fetchData = async () => {
        try {
            const projectData = await getProject(id);
            if (projectData.success) {
                setProject(projectData.project);
            }

            const tasksData = await getTasks(id);
            if (tasksData.success) {
                setTasks(tasksData.tasks);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setIsCreatingTask(true);
        try {
            const taskData = {
                projectId: id,
                title: newTaskTitle,
                assignedTo: newTaskAssignee,
                dueDate: newTaskDate,
                // UPDATED: Use 'Pending' which is a standard safe enum
                status: 'Pending'
            };
            const res = await createTask(taskData);
            if (res.success) {
                toast.success("Task added successfully");
                setNewTaskTitle('');
                setNewTaskAssignee('');
                setNewTaskDate('');
                const updatedTasks = await getTasks(id);
                if(updatedTasks.success) setTasks(updatedTasks.tasks);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Failed to add task";
            toast.error(errorMsg);
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if(!window.confirm("Delete this task?")) return;
        try {
            await deleteTask(taskId);
            setTasks(prev => prev.filter(t => t._id !== taskId));
            toast.success("Task deleted");
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const toggleTaskStatus = async (task, currentStatus) => {
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
        try {
            setTasks(prev => prev.map(t => t._id === task._id ? {...t, status: newStatus} : t));
            await updateTaskStatus(task._id, newStatus);
        } catch (error) {
            toast.error("Failed to update status");
            fetchData(); 
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h2 className='text-2xl font-bold text-slate-700'>Project not found</h2>
                <button onClick={() => navigate('/dashboard')} className='mt-4 text-indigo-600 hover:underline'>Back to Dashboard</button>
            </div>
        );
    }

    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

    return (
        <div className='min-h-screen bg-slate-50 p-6 pt-24 transition-all duration-500'>
            
            <button onClick={() => navigate('/dashboard')} className='flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Dashboard
            </button>

            <div className='bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                {project.status}
                            </span>
                            <span className='text-slate-400 text-sm'>Development</span>
                        </div>
                        <h1 className='text-4xl font-bold text-slate-800 mb-2'>{project.title}</h1>
                        <p className='text-slate-500 max-w-2xl'>{project.description}</p>
                        
                        <div className='flex items-center gap-6 mt-6'>
                            <div className='flex items-center gap-2 text-slate-500 text-sm'>
                                <img src={assets.clock_icon || ""} className='w-4 opacity-50' alt="" /> 
                                <span>Deadline: {project.endDate ? new Date(project.endDate).toDateString() : 'No Deadline'}</span>
                            </div>
                            <div className='flex items-center gap-2 text-slate-500 text-sm'>
                                <img src={assets.person_icon || ""} className='w-4 opacity-50' alt="" /> 
                                <span>Owner: You</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='text-right'>
                            <div className='text-4xl font-bold text-indigo-600'>{progress}%</div>
                            <div className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Progress</div>
                        </div>
                    </div>
                </div>

                <div className='w-full bg-slate-100 h-3 rounded-full mt-8 overflow-hidden'>
                    <div 
                        className='bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out' 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                
                <div className='lg:col-span-2'>
                    <div className='flex justify-between items-end mb-6'>
                        <h3 className='text-xl font-bold text-slate-800'>Tasks</h3>
                        <span className='text-sm font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100'>{tasks.length} Total</span>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {tasks.length === 0 ? (
                            <div className='text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200'>
                                <p className='text-slate-400'>No tasks yet. Add one to get started!</p>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div key={task._id} className={`group bg-white p-5 rounded-2xl border transition-all hover:shadow-md flex items-center gap-4 ${task.status === 'Completed' ? 'border-green-100 bg-green-50/30' : 'border-slate-100'}`}>
                                    <button 
                                        onClick={() => toggleTaskStatus(task, task.status)}
                                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-indigo-500'}`}
                                    >
                                        {task.status === 'Completed' && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                    
                                    <div className='flex-grow'>
                                        <h4 className={`font-semibold text-slate-800 ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
                                        <div className='flex gap-3 mt-1 text-xs text-slate-400'>
                                            <span>{task.assignedTo}</span>
                                            <span>•</span>
                                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        {task.status === 'Completed' && (
                                            <span className='px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg'>DONE</span>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteTask(task._id)}
                                            className='p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100'
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600'>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </div>
                            <div>
                                <h3 className='font-bold text-slate-800'>Add Task</h3>
                                <p className='text-xs text-slate-400'>Create new todo item</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTask} className='flex flex-col gap-4'>
                            <div>
                                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Design Homepage"
                                    required
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>Assign To</label>
                                <input 
                                    type="text" 
                                    placeholder="Name..."
                                    value={newTaskAssignee}
                                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                                    className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>Due Date</label>
                                <input 
                                    type="date" 
                                    value={newTaskDate}
                                    onChange={(e) => setNewTaskDate(e.target.value)}
                                    className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600'
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isCreatingTask}
                                className='w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all mt-2 disabled:opacity-70'
                            >
                                {isCreatingTask ? 'Adding...' : 'Create Task'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectPage;