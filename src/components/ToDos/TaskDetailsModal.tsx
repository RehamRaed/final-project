'use client';

import { useState, useEffect } from 'react';
import { createTaskAction, updateTaskAction } from '@/actions/tasks.actions';
import { Tables } from '@/types/database.types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Tables<'tasks'> | null;
  onTaskUpdated?: () => Promise<void>; // ✅ الخاصية الآن موجودة
}

export default function TaskModal({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
}: TaskModalProps) {
  const isEdit = Boolean(task);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title ?? '');
      setPriority((task.priority as 'low' | 'medium' | 'high') ?? 'low');
    } else {
      setTitle('');
      setPriority('low');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setLoading(true);
    const payload = { title, priority };

    const res = isEdit
      ? await updateTaskAction(task!.id, payload)
      : await createTaskAction(payload);

    setLoading(false);

    if (!res.success) {
   
      const errorMsg = 'error' in res ? res.error : 'Unknown error';
      alert(errorMsg);
      return;
    }

    if (onTaskUpdated) await onTaskUpdated(); 

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {isEdit ? 'Edit Task' : 'New Task'}
        </h2>

        <input
          className="mb-3 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="mb-5 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as 'low' | 'medium' | 'high')
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
