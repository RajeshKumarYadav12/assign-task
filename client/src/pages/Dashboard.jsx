import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    tags: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchTasks();
    fetchStats();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await axiosInstance.get(`/tasks?${params.toString()}`);
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/tasks/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        tags: newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      const response = await axiosInstance.post('/tasks', taskData);
      if (response.data.success) {
        setTasks([response.data.data.task, ...tasks]);
        setNewTask({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          tags: '',
        });
        setShowCreateForm(false);
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    fetchStats();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatCount = (statArray, key) => {
    const stat = statArray?.find(s => s._id === key);
    return stat ? stat.count : 0;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Task Manager</h1>
          <div style={styles.headerRight}>
            <span style={styles.userName}>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Stats */}
        {stats && (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <h3 style={styles.statNumber}>{stats.total}</h3>
              <p style={styles.statLabel}>Total Tasks</p>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #6b7280' }}>
              <h3 style={styles.statNumber}>{getStatCount(stats.byStatus, 'pending')}</h3>
              <p style={styles.statLabel}>Pending</p>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={styles.statNumber}>{getStatCount(stats.byStatus, 'in-progress')}</h3>
              <p style={styles.statLabel}>In Progress</p>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
              <h3 style={styles.statNumber}>{getStatCount(stats.byStatus, 'completed')}</h3>
              <p style={styles.statLabel}>Completed</p>
            </div>
          </div>
        )}

        {/* Filters and Create Button */}
        <div style={styles.controls}>
          <div style={styles.filters}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={styles.searchInput}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              style={styles.filterSelect}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={styles.createButton}
          >
            {showCreateForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div style={styles.createForm}>
            <h3 style={styles.formTitle}>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task title *"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                style={styles.input}
              />
              <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                style={{ ...styles.input, minHeight: '100px' }}
              />
              <div style={styles.row}>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  style={styles.select}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  style={styles.select}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newTask.tags}
                onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div style={styles.tasksContainer}>
          {loading ? (
            <p style={styles.loadingText}>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={styles.emptyText}>No tasks found. Create your first task!</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    fontSize: '14px',
    color: '#6b7280',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #3b82f6',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    flex: 1,
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1 1 200px',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minWidth: '140px',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  createForm: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
    marginTop: 0,
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    flex: 1,
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tasksContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '16px',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '16px',
    padding: '40px',
  },
};

export default Dashboard;
