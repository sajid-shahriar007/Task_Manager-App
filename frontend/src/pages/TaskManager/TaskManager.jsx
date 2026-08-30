import React, { useState, useEffect, useCallback } from "react";
import { MdAddCircle, MdNotifications } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SearchBar from "../../components/SearchBar/SearchBar";

const emptyTask = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  status: "pending",
  category: "",
};

const TaskManager = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const userEmail = user?.email;
  const userName = user?.displayName;

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState({ overdue: [], dueSoon: [], count: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentTask, setCurrentTask] = useState(emptyTask);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

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
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks!");
    }
  }, [userEmail, filter, searchQuery, axiosSecure]);

  const fetchCategories = useCallback(async () => {
    if (!userEmail) return;
    try {
      const { data } = await axiosSecure.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [userEmail, axiosSecure]);

  const fetchNotifications = useCallback(async () => {
    if (!userEmail) return;
    try {
      const { data } = await axiosSecure.get("/tasks/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userEmail, axiosSecure]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchNotifications();
    // Re-check for overdue/due-soon tasks every 5 minutes while the tab is open.
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTasks, fetchCategories, fetchNotifications]);

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
    if (!userEmail) {
      toast.error("Please log in to create tasks!");
      return;
    }

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
        toast.success("Task updated successfully!");
      } else {
        const { data } = await axiosSecure.post("/tasks", payload);
        setTasks((prev) => [data, ...prev]);
        toast.success("Task added successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.error || "Failed to save task!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted successfully!");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task!");
    }
  };

  const handleToggleCompletion = async (id) => {
    try {
      const { data } = await axiosSecure.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      toast.success("Task status updated!");
      fetchNotifications();
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Failed to update task!");
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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const { data } = await axiosSecure.post("/categories", {
        name: newCategoryName.trim(),
        userEmail,
      });
      setCategories((prev) => [...prev, data]);
      setNewCategoryName("");
      toast.success("Category created!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create category");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString() : "No due date");

  const isOverdue = (task) => task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />

      {userEmail && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            Welcome, <span className="font-semibold">{userName || userEmail}</span>
          </p>
          <p className="text-sm text-blue-600">
            You have {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">✅ Task Manager</h1>

        <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
          <SearchBar onSearch={setSearchQuery} />
          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              aria-label="Notifications"
            >
              <MdNotifications className="text-xl text-gray-700" />
              {notifications.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.count}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-3 text-sm">
                {notifications.count === 0 ? (
                  <p className="text-gray-500">You're all caught up 🎉</p>
                ) : (
                  <>
                    {notifications.overdue.length > 0 && (
                      <div className="mb-2">
                        <p className="font-semibold text-red-600 mb-1">Overdue</p>
                        {notifications.overdue.map((t) => (
                          <p key={t._id} className="truncate text-gray-700">• {t.title}</p>
                        ))}
                      </div>
                    )}
                    {notifications.dueSoon.length > 0 && (
                      <div>
                        <p className="font-semibold text-yellow-600 mb-1">Due within 24h</p>
                        {notifications.dueSoon.map((t) => (
                          <p key={t._id} className="truncate text-gray-700">• {t.title}</p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Categories
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MdAddCircle className="text-xl" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {tasks.length === 0 ? "No tasks yet. Add your first task!" : "No tasks match your filters."}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                task.completed ? "border-green-200 opacity-75" : "border-gray-200"
              } ${isOverdue(task) ? "border-red-200 bg-red-50" : ""}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {task.completed && "✅ "}
                    {task.title?.trim() || "Untitled Task"}
                  </h2>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {task.category?.name && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full mb-2 text-white"
                    style={{ backgroundColor: task.category.color || "#6366f1" }}
                  >
                    {task.category.name}
                  </span>
                )}

                <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                <div className="space-y-2 mb-4">
                  <p className={`text-sm ${isOverdue(task) ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                    📅 {formatDate(task.dueDate)}
                    {isOverdue(task) && " - Overdue!"}
                  </p>
                  <p className="text-sm text-gray-500">📝 Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleToggleCompletion(task._id)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      task.completed ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {task.completed ? "Mark Pending" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-3 py-1 border border-blue-600 text-blue-600 rounded-md text-sm hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">{isEditing ? "Edit Task" : "Add New Task"}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={currentTask.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={currentTask.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={currentTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={currentTask.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <ul className="mb-4 space-y-1 max-h-48 overflow-y-auto">
              {categories.map((c) => (
                <li key={c._id} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </li>
              ))}
              {categories.length === 0 && <p className="text-gray-500 text-sm">No categories yet.</p>}
            </ul>

            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
