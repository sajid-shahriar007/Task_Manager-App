import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaCheckCircle, FaUsers, FaRocket } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <FaTasks className="text-indigo-600 text-5xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Organize Your Work, <span className="text-indigo-600">Simplify Your Life</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            TaskFlow helps you manage projects and get more done with less stress.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center"
            >
              <FaRocket className="mr-2" />
              Get Started
            </Link>
            <Link 
              to="/features" 
              className="px-8 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Simple, powerful task management</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 mb-4">
              <FaTasks className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">Create and organize tasks with our intuitive interface.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 mb-4">
              <FaCheckCircle className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">Never miss important deadlines.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 mb-4">
              <FaUsers className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-600">Work together with your team.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get organized?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Start managing your tasks effectively today.
          </p>
          <Link 
            to="/login" 
            className="inline-block px-8 py-3 bg-white text-indigo-600 hover:bg-gray-100 font-bold rounded-lg shadow-lg transition-colors"
          >
            Start Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;