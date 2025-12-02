import React, { useState } from 'react';

export default function TaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const submit = () => onSave({ title, description, dueDate });

  return (
    <div className='fixed inset-0 bg-black/30 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-96'>
        <h3 className='font-bold mb-2'>New Task</h3>
        <input className='w-full border p-2 mb-2' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className='w-full border p-2 mb-2' placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
        <input className='w-full border p-2 mb-2' type='date' value={dueDate} onChange={e => setDueDate(e.target.value)} />

        <div className='flex justify-end gap-2'>
          <button className='btn' onClick={onClose}>Cancel</button>
          <button className='btn-primary' onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  );
}
