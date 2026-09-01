import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Topbar = ({ onNewTask }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [notifications, setNotifications] = useState({ overdue: [], dueSoon: [], count: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const firstName = (user?.name || user?.displayName || 'User').split(' ')[0];

  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    try {
      const { data } = await axiosSecure.get('/tasks/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user?.email, axiosSecure]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      searchParams.set('search', searchValue.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 px-8 py-4 flex items-center gap-6 transition-colors duration-300">

      {/* Greeting */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hello, <span className="text-[#3d38ff] dark:text-[#8b98f2]">{firstName}</span>
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Let's get things done!</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative w-64">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-4 pr-10 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#3d38ff] dark:hover:text-[#8b98f2] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#8b98f2] hover:text-[#3d38ff] dark:hover:text-[#8b98f2] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.count > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-4 text-sm">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">Notifications</h4>
              {notifications.count === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 py-2 text-center">You're all caught up! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {notifications.overdue.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-500 dark:text-red-400 mb-1 text-xs uppercase tracking-wide">Overdue</p>
                      <ul className="space-y-1">
                        {notifications.overdue.map((t) => (
                          <li key={t._id} className="truncate text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                            {t.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {notifications.dueSoon.length > 0 && (
                    <div>
                      <p className="font-semibold text-amber-500 dark:text-amber-400 mb-1 text-xs uppercase tracking-wide">Due within 24h</p>
                      <ul className="space-y-1">
                        {notifications.dueSoon.map((t) => (
                          <li key={t._id} className="truncate text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            {t.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* New Task Button */}
        <button
          onClick={onNewTask}
          className="flex items-center gap-2 bg-[#3d38ff] hover:bg-[#5a56ff] text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md shadow-indigo-300/30 dark:shadow-none transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>
    </div>
  );
};

export default Topbar;
