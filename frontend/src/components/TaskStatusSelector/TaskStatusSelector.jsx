import React from 'react';
import { TaskStatus } from '../../../shared/types'; // Assuming types are accessible here


const statusConfig = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    dotColor: 'bg-yellow-500',
  },
  'in-progress': {
    label: 'In Progress',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    dotColor: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    dotColor: 'bg-green-500',
  }
};

export const TaskStatusSelector = ({ status, onChange }) => {
  return (
    <div className="relative inline-block text-left group">
      <button 
        type="button" 
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-transparent shadow-sm hover:shadow transition-shadow ${statusConfig[status].bgColor} ${statusConfig[status].textColor}`}
        id="status-menu-button" 
        aria-expanded="true" 
        aria-haspopup="true"
      >
        <span className={`mr-1.5 h-2 w-2 rounded-full ${statusConfig[status].dotColor}`}></span>
        {statusConfig[status].label}
        <svg className="-mr-1 ml-2 h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block transition-all opacity-0 group-hover:opacity-100" role="menu" aria-orientation="vertical" aria-labelledby="status-menu-button" tabIndex={-1}>
        <div className="py-1" role="none">
          {(Object.keys(statusConfig) as TaskStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={`${
                status === s ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
              } group flex w-full items-center px-4 py-2 text-sm text-left transition-colors`}
              role="menuitem"
              tabIndex={-1}
            >
              <span className={`mr-2 h-2 w-2 rounded-full ${statusConfig[s].dotColor}`}></span>
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusSelector;
