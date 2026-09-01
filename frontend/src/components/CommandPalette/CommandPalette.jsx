import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose, tasks, categories, onNewTask, onFilter }) => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        const root = document.documentElement;
        const isDark = root.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) setSearch('');
    }, [isOpen]);

    if (!isOpen) return null;

    const run = (fn) => {
        onClose();
        fn();
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <Command label="Command Menu" shouldFilter={false}>
                    <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <Command.Input
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Type a command or search..."
                            className="w-full py-4 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
                        />
                        <kbd className="text-[10px] text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">ESC</kbd>
                    </div>

                    <Command.List className="max-h-[60vh] overflow-y-auto py-2">
                        <Command.Empty className="py-10 text-center text-sm text-gray-400">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Actions" className="px-2">
                            <Command.Item
                                onSelect={() => run(toggleDarkMode)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">🌙</span> Toggle Dark Mode
                            </Command.Item>
                            <Command.Item
                                onSelect={() => run(onNewTask)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">➕</span> New Task
                            </Command.Item>
                            <Command.Item
                                onSelect={() => run(() => onFilter('all'))}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">📋</span> Show All Tasks
                            </Command.Item>
                            <Command.Item
                                onSelect={() => run(() => onFilter('pending'))}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">🕐</span> Show Pending
                            </Command.Item>
                            <Command.Item
                                onSelect={() => run(() => onFilter('completed'))}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">✅</span> Show Completed
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Tasks" className="px-2">
                            {tasks
                                .filter((t) =>
                                    search
                                        ? t.title.toLowerCase().includes(search.toLowerCase())
                                        : true
                                )
                                .slice(0, 20)
                                .map((task) => (
                                    <Command.Item
                                        key={task._id}
                                        onSelect={() => run(() => onFilter('all'))}
                                        className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                                    >
                                        <span className="truncate">{task.title}</span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${task.priority === 'high'
                                            ? 'bg-red-100 text-red-600'
                                            : task.priority === 'medium'
                                                ? 'bg-amber-100 text-amber-600'
                                                : 'bg-green-100 text-green-600'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </Command.Item>
                                ))}
                        </Command.Group>

                        <Command.Group heading="Categories" className="px-2">
                            {categories.slice(0, 10).map((cat) => (
                                <Command.Item
                                    key={cat._id}
                                    onSelect={() => run(() => onFilter('all'))}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                                >
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#3d38ff' }} />
                                    {cat.name}
                                </Command.Item>
                            ))}
                        </Command.Group>

                        <Command.Group heading="Navigate" className="px-2">
                            <Command.Item
                                onSelect={() => run(() => navigate('/'))}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">🏠</span> Home
                            </Command.Item>
                            <Command.Item
                                onSelect={() => run(() => navigate('/about'))}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-lg data-[selected=true]:bg-[#eef0ff] dark:data-[selected=true]:bg-[#3d38ff]/20 data-[selected=true]:text-[#3d38ff] dark:data-[selected=true]:text-[#8b98f2] cursor-pointer"
                            >
                                <span className="text-base">ℹ️</span> About
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
};

export default CommandPalette;