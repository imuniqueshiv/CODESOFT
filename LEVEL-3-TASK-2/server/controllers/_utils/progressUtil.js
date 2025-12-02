// Utility to calculate project progress based on tasks
const calcProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const completed = tasks.filter(task => task.status === 'Completed' || task.isCompleted).length;
  return Math.round((completed / tasks.length) * 100);
};

export default calcProgress;