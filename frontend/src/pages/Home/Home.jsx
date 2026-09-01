import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthContext';

const stats = [
  { value: '10K+', label: 'Tasks Completed' },
  { value: '3K+', label: 'Active Users' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Always Available' },
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Smart Task Management',
    description: 'Create, organize, and prioritize tasks with ease. Set due dates, labels, and never lose track of what matters.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Deadline Tracking',
    description: 'Stay on top of deadlines with smart reminders and an intuitive calendar view that keeps you in control.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: 'Category & Labels',
    description: 'Group tasks with custom categories and color-coded labels to find everything instantly.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Progress Dashboard',
    description: 'Get a clear overview of your completed, ongoing, and pending tasks at a glance with beautiful visual stats.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure & Private',
    description: 'Your data is protected with JWT authentication. Only you have access to your personal workspace.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Built with modern technologies for a snappy, responsive experience on any device, any screen size.',
  },
];

const steps = [
  { number: '01', title: 'Create an Account', description: 'Sign up for free in seconds. No credit card required.' },
  { number: '02', title: 'Add Your Tasks', description: 'Create tasks, set priorities, and organize them by category.' },
  { number: '03', title: 'Stay on Track', description: 'Track your progress and complete tasks one by one.' },
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#eef0ff] via-white to-[#f3f0ff] pt-20 pb-28">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#8b98f2] opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400 opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#8b98f2]/15 text-[#5a63d4] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#8b98f2] animate-pulse" />
            Productivity Reimagined
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Manage Tasks the{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#3d38ff]">Smart Way</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#8b98f2]/30 rounded-full -z-0" />
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Tactiq helps you organize your work, beat deadlines, and focus on what truly matters — all in one clean, powerful workspace.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? '/taskmanager' : '/signup'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3d38ff] hover:bg-[#5a56ff] text-white font-semibold rounded-2xl shadow-lg shadow-indigo-300/40 transition-all duration-200 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#8b98f2] text-[#3d38ff] hover:bg-[#eef0ff] font-semibold rounded-2xl transition-all duration-200 text-lg"
            >
              Sign In
            </Link>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-16 relative mx-auto max-w-4xl">
            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 border border-gray-100 p-6 text-left">
              {/* Fake topbar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Good morning 👋</p>
                  <h2 className="text-2xl font-bold text-gray-800">Hello, <span className="text-[#3d38ff]">Tactiq User</span></h2>
                </div>
                <span className="inline-flex items-center gap-2 bg-[#3d38ff] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </span>
              </div>
              {/* Fake stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Total Tasks', value: '24', color: 'bg-violet-50', text: 'text-violet-600' },
                  { label: 'In Progress', value: '8', color: 'bg-amber-50', text: 'text-amber-600' },
                  { label: 'Completed', value: '14', color: 'bg-green-50', text: 'text-green-600' },
                  { label: 'Overdue', value: '2', color: 'bg-red-50', text: 'text-red-500' },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                    <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              {/* Fake task list */}
              <div className="space-y-3">
                {[
                  { title: 'Design new dashboard layout', tag: 'Design', done: true },
                  { title: 'Implement Google OAuth login', tag: 'Development', done: true },
                  { title: 'Write unit tests for API routes', tag: 'Testing', done: false },
                  { title: 'Deploy to production server', tag: 'DevOps', done: false },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-[#3d38ff] border-[#3d38ff]' : 'border-gray-300'}`}>
                      {task.done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                    <span className="text-xs bg-[#8b98f2]/15 text-[#5a63d4] px-2 py-0.5 rounded-full font-medium">{task.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#3d38ff] py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-indigo-200 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-[#3d38ff] text-sm font-semibold bg-[#8b98f2]/15 px-4 py-1 rounded-full mb-4">Features</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to stay productive</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tactiq is packed with powerful features designed to help you work smarter, not harder.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((f, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#8b98f2]/15 text-[#3d38ff] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#3d38ff] group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-[#eef0ff] to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-[#3d38ff] text-sm font-semibold bg-[#8b98f2]/15 px-4 py-1 rounded-full mb-4">How It Works</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Up and running in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-extrabold text-[#8b98f2]/30 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#3d38ff] to-[#8b98f2] rounded-3xl p-14 shadow-2xl shadow-indigo-300/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
            <h2 className="text-4xl font-extrabold text-white mb-4 relative z-10">Ready to get organized?</h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of users who manage their tasks more efficiently with Tactiq. It's free to start.
            </p>
            <Link
              to={user ? '/taskmanager' : '/signup'}
              className="relative z-10 inline-flex items-center gap-2 px-10 py-4 bg-white text-[#3d38ff] hover:bg-gray-50 font-bold rounded-2xl shadow-lg transition-all text-lg"
            >
              {user ? 'Open Dashboard' : 'Start For Free'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#3d38ff] font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tactiq
          </div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Tactiq. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/login" className="hover:text-[#3d38ff] transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-[#3d38ff] transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;