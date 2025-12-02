'use client';
import React, { useState } from 'react';
import { ToDoItem } from '@/types/todo';
import ToDoPageTop from '@/components/ToDos/ToDoPageTop';
import AddTask from '@/components/ToDos/AddTask';
import TaskInProgress from '@/components/ToDos/TaskInProgress';
import TaskDone from '@/components/ToDos/TaskDone';

const initialMockTasks: ToDoItem[] = [
  { id: 101, task: "Complete Next.js Setup Module", status: 'In Progress' },
  { id: 102, task: "Read Tailwind CSS Documentation", status: 'In Progress' },
  { id: 103, task: "Watch Redux Toolkit Lecture", status: 'In Progress' },
  { id: 105, task: "Design Database Schema ", status: 'In Progress' },
  { id: 106, task: "Setup Database Connection ", status: 'In Progress' },
  { id: 107, task: "Implement Authentication Logic", status: 'In Progress' },
  { id: 104, task: "Practice TypeScript Interfaces", status: 'Done' },
  { id: 108, task: "Finalize Component Styling", status: 'Done' },
];

export default function ToDoListPage() {
  const [tasks, setTasks] = useState<ToDoItem[]>(initialMockTasks);

  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const done = tasks.filter(t => t.status === 'Done');

  const handleAddTask = (task: string) => {
    const newItem: ToDoItem = { id: Date.now(), task, status: 'In Progress' };
    setTasks(prev => [...prev, newItem]);
  };

  const handleMarkDone = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Done' } : t));
  };

  return (
    <div className="mx-auto px-4 space-y-5">
      <ToDoPageTop remainingTasks={inProgress.length} />
      <AddTask onAdd={handleAddTask} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <TaskInProgress tasks={inProgress} onMarkDone={handleMarkDone} />
        <TaskDone tasks={done} />
      </div>
    </div>
  );
}
