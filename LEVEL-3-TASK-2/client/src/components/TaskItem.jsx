import React from 'react';
import { updateTask } from '../services/tasksService';

export default function TaskItem({ task, onUpdated }) {
  const change = async (e) => {
    await updateTask(task._id, { status: e.target.value });
    onUpdated();
  };

  return (
    <div className='border p-3 rounded mb-2'>
      <div className='flex justify-between'>
        <div>
          <div className='font-semibold'>{task.title}</div>
          <div className='text-xs'>{task.description}</div>
        </div>

        <select value={task.status} onChange={change} className='border rounded px-2 py-1'>
          <option value='todo'>Todo</option>
          <option value='in-progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>
      </div>
    </div>
  );
}
