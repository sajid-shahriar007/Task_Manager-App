import React, { useState } from 'react';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MiniCalendar = () => {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });

  const firstDay = new Date(current.year, current.month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  // Convert Sun=0 to Mon=0
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const prev = () => {
    setCurrent((c) => c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year });
  };
  const next = () => {
    setCurrent((c) => c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{MONTHS[current.month]}, {current.year}</p>
        <div className="flex gap-1">
          <button onClick={prev} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>
      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => (
          <div key={i} className={`text-center text-xs py-1 rounded-lg font-medium transition-colors ${d === null ? '' :
              isToday(d)
                ? 'bg-[#3d38ff] text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#eef0ff] dark:hover:bg-[#3d38ff]/20 hover:text-[#3d38ff] dark:hover:text-[#8b98f2] cursor-pointer'
            }`}>
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

const RightPanel = ({ tasks = [] }) => {
  const pending = tasks.filter((t) => !t.completed).slice(0, 4);
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length || 1;
  const completedPercent = Math.round((completed / total) * 100);

  // Tasks with a due date that is today or in the future (upcoming)
  const upcoming = tasks
    .filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const priorityDot = (p) => {
    if (p === 'high') return 'bg-red-400';
    if (p === 'medium') return 'bg-amber-400';
    return 'bg-green-400';
  };

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-4 py-6 px-4 overflow-y-auto bg-white/50 dark:bg-[#121212]/50 transition-colors duration-300">

      {/* Calendar */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 transition-colors">
        <MiniCalendar />
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 transition-colors">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Tasks</p>
        {pending.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">No pending tasks</p>
        ) : (
          <div className="space-y-2.5">
            {pending.map((t) => (
              <div key={t._id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot(t.priority)}`} />
                <p className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">{t.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Due */}
      {upcoming.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 transition-colors">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Upcoming Due</p>
          <div className="space-y-2.5">
            {upcoming.map((t) => (
              <div key={t._id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot(t.priority)}`} />
                <p className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">{t.title}</p>
                <span className="text-[10px] font-medium text-[#3d38ff] dark:text-[#8b98f2] flex-shrink-0">
                  {new Date(t.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 transition-colors">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Progress</p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Completed</span>
              <span className="text-[#3d38ff] dark:text-[#8b98f2] font-bold">{completedPercent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8b98f2] to-[#3d38ff] rounded-full transition-all duration-500"
                style={{ width: `${completedPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Pending</span>
              <span className="text-amber-500 dark:text-amber-400 font-bold">{100 - completedPercent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${100 - completedPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-[#eef0ff] dark:bg-[#3d38ff]/20 rounded-xl p-2">
            <p className="text-[#3d38ff] dark:text-[#8b98f2] font-bold text-lg">{completed}</p>
            <p className="text-[10px] text-gray-500">Done</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-2">
            <p className="text-amber-500 dark:text-amber-400 font-bold text-lg">{tasks.length - completed}</p>
            <p className="text-[10px] text-gray-500">Pending</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightPanel;
