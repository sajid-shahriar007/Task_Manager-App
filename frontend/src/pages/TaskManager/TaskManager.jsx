import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Topbar from "../../components/Dashboard/Topbar";
import RightPanel from "../../components/Dashboard/RightPanel";

const emptyTask = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  status: "pending",
  category: "",
};

const PRIORITY_STYLES = {
  high: { dot: "bg-red-400", badge: "bg-red-100 text-red-600" },
  medium: { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-600" },
  low: { dot: "bg-green-400", badge: "bg-green-100 text-green-600" },
};

const TaskManager = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const userEmail = user?.email;
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(emptyTask);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const searchQuery = searchParams.get("search") || "";

  const fetchTasks = useCallback(async () => {
    if (!userEmail) return;
    try {
      const params = {};
      if (filter === "completed") params.status = "completed";
      else if (filter === "pending") params.status = "pending";
      else if (["high", "medium", "low"].includes(filter)) params.priority = filter;
      if (searchQuery) params.search = searchQuery;
      const { data } = await axiosSecure.get("/tasks", { params });
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [userEmail, filter, searchQuery, axiosSecure]);

  const fetchCategories = useCallback(async () => {
    if (!userEmail) return;
    try {
      const { data } = await axiosSecure.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, [userEmail, axiosSecure]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return;
    const payload = {
      title: currentTask.title.trim() || "Untitled Task",
      description: currentTask.description,
      priority: currentTask.priority,
      category: currentTask.category || null,
      dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString() : null,
      userEmail,
    };
    try {
      if (isEditing) {
        const { data } = await axiosSecure.put(`/tasks/${currentTask._id}`, payload);
        setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
        toast.success("Task updated!");
      } else {
        const { data } = await axiosSecure.post("/tasks", payload);
        setTasks((prev) => [data, ...prev]);
        toast.success("Task added!");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save task!");
    }
  };

  const handleToggleCompletion = async (id) => {
    try {
      const { data } = await axiosSecure.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task!");
    }
  };

  const handleEdit = (task) => {
    setCurrentTask({
      ...task,
      category: task.category?._id || task.category || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentTask(emptyTask);
    setIsEditing(false);
  };

  const isOverdue = (task) =>
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const pendingTasks = sortedTasks.filter((t) => !t.completed);
  const completedTasks = sortedTasks.filter((t) => t.completed);
  const overdueTasks = sortedTasks.filter((t) => isOverdue(t));

  const total = tasks.length;
  const completedPercent = total ? Math.round((completedTasks.length / total) * 100) : 0;

  const statCards = [
    {
      label: "Total Tasks",
      value: total,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-[#eef0ff] text-[#3d38ff]",
      sub: `${completedPercent}% done`,
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      sub: "Well done!",
    },
    {
      label: "Pending",
      value: pendingTasks.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
      sub: "Keep going!",
    },
    {
      label: "Overdue",
      value: overdueTasks.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "bg-red-50 text-red-500",
      sub: overdueTasks.length > 0 ? "Needs attention!" : "All good!",
    },
  ];

  // TaskCard component
  const TaskCard = ({ task, isCompleted }) => {
    const overdue = isOverdue(task);
    const [showMenu, setShowMenu] = useState(false);
    const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
    const categoryName = task.category?.name || (categories.find((c) => c._id === task.category)?.name) || null;

    return (
      <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl border ${overdue ? "border-red-200 dark:border-red-500/30" : "border-gray-100 dark:border-gray-800"} p-5 shadow-sm hover:shadow-md transition-all duration-200 relative group`}>
        {overdue && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow z-10">
            Overdue
          </span>
        )}

        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {categoryName && (
              <span className="text-[10px] bg-[#eef0ff] dark:bg-[#3d38ff]/20 text-[#3d38ff] dark:text-[#8b98f2] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                {categoryName}
              </span>
            )}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${ps.badge}`}>
              {task.priority}
            </span>
          </div>

          {/* Kebab menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-[#252525] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20 text-sm overflow-hidden">
                <button onClick={() => { handleEdit(task); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#333] transition">Edit</button>
                <button onClick={() => { handleDelete(task._id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className={`font-semibold text-gray-800 dark:text-gray-200 mb-1 leading-snug ${isCompleted ? "line-through text-gray-400 dark:text-gray-500" : ""}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-3">{task.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800/50">
          <span className={`text-[10px] font-medium ${overdue ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}>
            {task.dueDate
              ? `Due: ${new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
              : `Added: ${new Date(task.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
          </span>
          <button
            onClick={() => handleToggleCompletion(task._id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition ${
              isCompleted
                ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-[#eef0ff] dark:hover:bg-[#3d38ff]/20 hover:text-[#3d38ff] dark:hover:text-[#8b98f2]"
            }`}
          >
            {isCompleted ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Done
              </>
            ) : (
              "Mark Done"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer position="bottom-right" autoClose={2500} />

      {/* Topbar */}
      <Topbar onNewTask={() => { resetForm(); setShowModal(true); }} />

      {/* Content + Right Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main scroll area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Filter & Sort Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {["all", "pending", "completed", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-all ${
                  filter === f
                    ? "bg-[#3d38ff] text-white shadow"
                    : "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#8b98f2] dark:hover:border-[#5a56ff] hover:text-[#3d38ff] dark:hover:text-[#8b98f2]"
                }`}
              >
                {f === "all" ? "All Tasks" : f === "high" ? "🔴 High" : f === "medium" ? "🟡 Medium" : f === "low" ? "🟢 Low" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <div className="ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate">By Due Date</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
            {searchQuery && (
              <span className="text-xs text-[#3d38ff] bg-[#eef0ff] px-3 py-1.5 rounded-full font-medium">
                🔍 "{searchQuery}"
              </span>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center gap-4 transition-colors">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 leading-none">{s.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Ongoing Tasks</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{pendingTasks.length} tasks</span>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-gray-400 dark:text-gray-500 transition-colors">
                <p className="text-4xl mb-2">🎉</p>
                <p className="font-medium">No pending tasks! You're all caught up.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pendingTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isCompleted={false} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Completed Tasks</h2>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{completedTasks.length} tasks</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {completedTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isCompleted={true} />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Panel */}
        <div className="hidden xl:block w-64 border-l border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-[#121212]/50 overflow-y-auto transition-colors duration-300">
          <RightPanel tasks={tasks} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-md p-7 max-h-[90vh] overflow-y-auto transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{isEditing ? "Edit Task" : "Add New Task"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={currentTask.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
                  placeholder="Task title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition resize-none"
                  placeholder="Optional description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                  <select
                    name="priority"
                    value={currentTask.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={currentTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select
                  name="category"
                  value={currentTask.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b98f2]/50 focus:border-[#8b98f2] transition"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-xl transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3d38ff] hover:bg-[#5a56ff] text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-300/30 dark:shadow-none transition"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
