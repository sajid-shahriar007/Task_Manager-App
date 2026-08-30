import React, { useState, useEffect } from "react";
import { MdAddCircle, MdFilterList, MdSort } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

const TaskManager = () => {
  const { user } = useAuth();
  const userEmail = user?.email;
  const userName = user?.displayName;

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "pending"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch tasks for the current user
  const fetchTasks = async () => {
    if (!userEmail) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/user/${userEmail}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
      applyFiltersAndSort(data, filter, sortBy);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks!");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userEmail]);

  // Apply filters and sorting
  const applyFiltersAndSort = (tasksList, currentFilter, currentSort) => {
    let filtered = tasksList;

    // Apply filter
    if (currentFilter === "completed") {
      filtered = tasksList.filter(task => task.completed);
    } else if (currentFilter === "pending") {
      filtered = tasksList.filter(task => !task.completed);
    } else if (currentFilter === "high") {
      filtered = tasksList.filter(task => task.priority === "high");
    } else if (currentFilter === "medium") {
      filtered = tasksList.filter(task => task.priority === "medium");
    } else if (currentFilter === "low") {
      filtered = tasksList.filter(task => task.priority === "low");
    }

    // Apply sorting
    let sorted = [...filtered];
    if (currentSort === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (currentSort === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (currentSort === "dueDate") {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (currentSort === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    setFilteredTasks(sorted);
  };

  useEffect(() => {
    applyFiltersAndSort(tasks, filter, sortBy);
  }, [tasks, filter, sortBy]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({
      ...currentTask,
      [name]: value,
    });
  };

  // Add / Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userEmail) {
      toast.error("Please log in to create tasks!");
      return;
    }

    const taskToSave = {
      ...currentTask,
      userEmail,
      title: currentTask.title.trim() || "Untitled Task",
    };

    const url = isEditing
      ? `http://localhost:5000/api/tasks/${currentTask._id}`
      : "http://localhost:5000/api/tasks";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToSave),
      });
      
      if (!response.ok) throw new Error("Failed to save task");
      
      const data = await response.json();

      if (isEditing) {
        setTasks(tasks.map((task) => (task._id === currentTask._id ? data : task)));
        toast.success("Task updated successfully!");
      } else {
        setTasks([data, ...tasks]);
        toast.success("Task added successfully!");
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task!");
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete task");
      
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task!");
    }
  };

  // Toggle Task Completion
  const handleToggleCompletion = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/toggle`, {
        method: "PATCH",
      });
      
      if (!response.ok) throw new Error("Failed to toggle task");
      
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Failed to update task!");
    }
  };

  // Edit Task
  const handleEdit = (task) => {
    setCurrentTask({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setCurrentTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "pending"
    });
    setIsEditing(false);
  };

  // Priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !currentTask.completed;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome message */}
      {userEmail && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            Welcome, <span className="font-semibold">{userName || userEmail}</span>
          </p>
          <p className="text-sm text-blue-600">
            You have {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      <ToastContainer />
      
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">✅ Task Manager</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Filter dropdown */}
          <div className="relative">
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
          </div>

          {/* Sort dropdown */}
          <div className="relative">
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
          </div>

          {/* Add task button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MdAddCircle className="text-xl" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {tasks.length === 0 ? "No tasks yet. Add your first task!" : "No tasks match your filters."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                task.completed ? "border-green-200 opacity-75" : "border-gray-200"
              } ${isOverdue(task.dueDate) ? "border-red-200 bg-red-50" : ""}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {task.completed && "✅ "}
                    {task.title?.trim() || "Untitled Task"}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className={`text-sm ${
                    isOverdue(task.dueDate) ? "text-red-600 font-semibold" : "text-gray-500"
                  }`}>
                    📅 {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && " - Overdue!"}
                  </p>
                  <p className="text-sm text-gray-500">
                    📝 Created: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleToggleCompletion(task._id)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      task.completed
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-green-500 text-white hover:bg-green-600"
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
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={currentTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? "Update" : "Create"}
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