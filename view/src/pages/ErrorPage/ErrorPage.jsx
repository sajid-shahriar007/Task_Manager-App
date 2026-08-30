import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTools, FaHome, FaEnvelope } from 'react-icons/fa';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaTools className="text-white text-5xl animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white">Under Construction</h1>
          <p className="text-indigo-100 mt-2">We're working on something awesome!</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <p className="text-gray-600 mb-6">
              This page is currently being developed. Please check back later or explore other parts of our site.
            </p>
            
            <div className="animate-bounce mb-6">
              <div className="inline-block bg-indigo-100 rounded-full p-4">
                <FaTools className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <FaHome />
              <span>Return Home</span>
            </button>
            
            <a
              href="mailto:support@taskmanager.com"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <FaEnvelope />
              <span>Contact Support</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;