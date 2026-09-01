import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_STYLES } from './constants';

const TASK_STATUSES = [
    { id: 'pending', label: 'To Do', accent: 'bg-gray-400' },
    { id: 'in-progress', label: 'In Progress', accent: 'bg-amber-400' },
    { id: 'completed', label: 'Done', accent: 'bg-green-400' },
];

const SortableTaskCard = ({ task, onToggle, onEdit, onDelete, categoryName }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
    const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
    const overdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`bg-white dark:bg-[#1a1a1a] rounded-2xl border p-4 shadow-sm cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? 'opacity-40' : ''} ${overdue ? 'border-red-200 dark:border-red-500/30' : 'border-gray-100 dark:border-gray-800'}`}
        >
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    {categoryName && (
                        <span className="text-[10px] bg-[#eef0ff] dark:bg-[#3d38ff]/20 text-[#3d38ff] dark:text-[#8b98f2] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap truncate max-w-[100px]">
                            {categoryName}
                        </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${ps.badge}`}>{task.priority}</span>
                </div>
                {overdue && <span className="text-[10px] font-semibold text-red-500 whitespace-nowrap">Overdue</span>}
            </div>
            <h4 className={`font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
            </h4>
            {task.description && <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-2">{task.description}</p>}
            {task.dueDate && (
                <p className={`text-[10px] font-medium mb-2 ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800/50">
                <button onClick={() => onToggle(task)} className="text-[10px] font-semibold text-[#3d38ff] dark:text-[#8b98f2] hover:underline">
                    {task.completed ? 'Reopen' : 'Done'}
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(task)} className="text-[10px] font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">Edit</button>
                    <button onClick={() => onDelete(task._id)} className="text-[10px] font-medium text-red-400 hover:text-red-500 transition">Delete</button>
                </div>
            </div>
        </div>
    );
};

const KanbanColumn = ({ status, label, accent, tasks, categories, onToggle, onEdit, onDelete }) => {
    const { setNodeRef } = useSortable({ id: status });
    const visibleTasks = tasks.filter((t) => t.status === status);
    const categoryName = (categoryId) => categories.find((c) => c._id === categoryId)?.name;

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[260px] bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col max-h-full">
            <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2 h-2 rounded-full ${accent}`} />
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</h3>
                <span className="text-xs text-gray-400 font-medium ml-auto">{visibleTasks.length}</span>
            </div>
            <SortableContext items={visibleTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 flex-1 overflow-y-auto min-h-[120px]">
                    {visibleTasks.length === 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-600 text-center py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            Drop tasks here
                        </div>
                    )}
                    {visibleTasks.map((task) => (
                        <SortableTaskCard
                            key={task._id}
                            task={task}
                            categoryName={categoryName(task.category)}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

const KanbanBoard = ({ tasks, categories, onToggle, onEdit, onDelete, onStatusChange }) => {
    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const handleDragStart = ({ active }) => setActiveId(active.id);
    const handleDragCancel = () => setActiveId(null);

    const handleDragEnd = ({ active, over }) => {
        setActiveId(null);
        if (!over) return;
        const taskId = active.id;
        let newStatus;
        if (over.id === 'pending' || over.id === 'in-progress' || over.id === 'completed') {
            newStatus = over.id;
        } else {
            const overTask = tasks.find((t) => t._id === over.id);
            newStatus = overTask?.status;
        }
        if (!newStatus) return;
        const task = tasks.find((t) => t._id === taskId);
        if (task && task.status !== newStatus) {
            onStatusChange(taskId, newStatus);
        }
    };

    const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;
    const activeCategory = activeTask ? categories.find((c) => c._id === activeTask.category)?.name : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {TASK_STATUSES.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        status={col.id}
                        label={col.label}
                        accent={col.accent}
                        tasks={tasks}
                        categories={categories}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeTask && (
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#3d38ff]/30 p-4 shadow-lg cursor-grabbing">
                        <span className="text-[10px] font-semibold bg-[#eef0ff] dark:bg-[#3d38ff]/20 text-[#3d38ff] px-2 py-0.5 rounded-full">
                            {activeTask.priority}
                        </span>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-2 text-sm">{activeTask.title}</h4>
                        {activeCategory && <p className="text-xs text-gray-400 mt-1">{activeCategory}</p>}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;