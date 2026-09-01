import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
    useCategoriesQuery,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '../../hooks/useCategoriesQuery';

const PRESET_COLORS = [
    '#6366f1', // indigo (default)
    '#3d38ff', // brand blue
    '#8b98f2', // soft indigo
    '#ec4899', // pink
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#a855f7', // purple
];

const ColorSwatch = ({ color, selected, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(color)}
        className={`w-6 h-6 rounded-full flex-shrink-0 transition-transform hover:scale-110 ${selected ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[#252525] scale-110' : ''
            }`}
        style={{ backgroundColor: color }}
        aria-label={`Select color ${color}`}
    />
);

const CategoryModal = ({ isOpen, onClose, tasks = [], onCategoriesChanged }) => {
    const { user } = useAuth();
    const userEmail = user?.email;

    const { data: categories = [], isLoading: loading } = useCategoriesQuery();
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    // Create form state
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState(PRESET_COLORS[0]);
    const [editError, setEditError] = useState('');

    // Delete state
    const [deletingId, setDeletingId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            // Reset create form on open
            setNewName('');
            setNewColor(PRESET_COLORS[0]);
            setCreateError('');
            setEditingId(null);
            setDeleteConfirmId(null);
            setEditError('');
        }
    }, [isOpen]);

    // Compute task count per category from the tasks array passed by parent
    const taskCountMap = tasks.reduce((acc, t) => {
        const catId = t.category?._id || t.category;
        if (catId) acc[catId] = (acc[catId] || 0) + 1;
        return acc;
    }, {});

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) {
            setCreateError('Name is required.');
            return;
        }
        setCreating(true);
        setCreateError('');
        try {
            await createCategory.mutateAsync({
                name: newName.trim(),
                color: newColor,
                userEmail,
            });
            setNewName('');
            setNewColor(PRESET_COLORS[0]);
            onCategoriesChanged?.();
        } catch (err) {
            setCreateError(err.response?.data?.error || 'Failed to create category.');
        } finally {
            setCreating(false);
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat._id);
        setEditName(cat.name);
        setEditColor(cat.color || PRESET_COLORS[0]);
        setEditError('');
        setDeleteConfirmId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditError('');
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) {
            setEditError('Name is required.');
            return;
        }
        try {
            await updateCategory.mutateAsync({
                id,
                name: editName.trim(),
                color: editColor,
            });
            setEditingId(null);
            onCategoriesChanged?.();
        } catch (err) {
            setEditError(err.response?.data?.error || 'Failed to update category.');
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteCategory.mutateAsync(id);
            setDeleteConfirmId(null);
            onCategoriesChanged?.();
        } catch (err) {
            console.error('Error deleting category:', err);
        } finally {
            setDeletingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-md p-7 max-h-[85vh] flex flex-col transition-colors duration-300">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Manage Categories</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Organize your tasks into categories</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333]"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Category List */}
                <div className="flex-1 overflow-y-auto min-h-0 mb-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="w-6 h-6 border-2 border-[#3d38ff] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                            <p className="text-3xl mb-2">🏷️</p>
                            <p className="text-sm font-medium">No categories yet</p>
                            <p className="text-xs mt-1">Add one below to get started</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {categories.map((cat) => {
                                const taskCount = taskCountMap[cat._id] || 0;
                                const isEditing = editingId === cat._id;
                                const isConfirmingDelete = deleteConfirmId === cat._id;

                                return (
                                    <li key={cat._id} className="bg-gray-50 dark:bg-[#252525] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        {isEditing ? (
                                            /* Edit row */
                                            <div className="p-3 space-y-3">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
                                                    placeholder="Category name..."
                                                    autoFocus
                                                    maxLength={50}
                                                />
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {PRESET_COLORS.map((c) => (
                                                        <ColorSwatch key={c} color={c} selected={editColor === c} onClick={setEditColor} />
                                                    ))}
                                                </div>
                                                {editError && <p className="text-xs text-red-500">{editError}</p>}
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdate(cat._id)}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-[#3d38ff] hover:bg-[#5a56ff] text-white rounded-lg transition shadow-sm"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : isConfirmingDelete ? (
                                            /* Delete confirmation row */
                                            <div className="p-3">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Delete "{cat.name}"?</p>
                                                {taskCount > 0 && (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                                                        ⚠️ {taskCount} task{taskCount > 1 ? 's' : ''} will be uncategorized.
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(cat._id)}
                                                        disabled={deletingId === cat._id}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-60"
                                                    >
                                                        {deletingId === cat._id ? 'Deleting…' : 'Delete'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Normal row */
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <span
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: cat.color || '#6366f1' }}
                                                />
                                                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                    {cat.name}
                                                </span>
                                                {taskCount > 0 && (
                                                    <span className="text-[10px] font-semibold bg-[#eef0ff] dark:bg-[#3d38ff]/20 text-[#3d38ff] dark:text-[#8b98f2] px-2 py-0.5 rounded-full flex-shrink-0">
                                                        {taskCount} task{taskCount > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {/* Edit button */}
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(cat)}
                                                    className="text-gray-300 dark:text-gray-600 hover:text-[#3d38ff] dark:hover:text-[#8b98f2] transition p-1 rounded-lg hover:bg-[#eef0ff] dark:hover:bg-[#3d38ff]/20 flex-shrink-0"
                                                    aria-label={`Edit ${cat.name}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                {/* Delete button */}
                                                <button
                                                    type="button"
                                                    onClick={() => { setDeleteConfirmId(cat._id); setEditingId(null); }}
                                                    className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 flex-shrink-0"
                                                    aria-label={`Delete ${cat.name}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Create new category form */}
                <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 pt-5">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">New Category</p>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => { setNewName(e.target.value); setCreateError(''); }}
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
                            placeholder="Category name..."
                            maxLength={50}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                            {PRESET_COLORS.map((c) => (
                                <ColorSwatch key={c} color={c} selected={newColor === c} onClick={setNewColor} />
                            ))}
                        </div>
                        {createError && <p className="text-xs text-red-500">{createError}</p>}
                        <button
                            type="submit"
                            disabled={creating || !newName.trim()}
                            className="w-full py-2.5 bg-[#3d38ff] hover:bg-[#5a56ff] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-300/30 dark:shadow-none transition"
                        >
                            {creating ? 'Creating…' : '+ Add Category'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default CategoryModal;