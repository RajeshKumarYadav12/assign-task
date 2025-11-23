import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/tasks/${task._id}`, editedTask);
      if (response.data.success) {
        onUpdate(response.data.data.task);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/tasks/${task._id}`);
      if (response.data.success) {
        onDelete(task._id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  if (isEditing) {
    return (
      <div style={styles.card}>
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          style={styles.input}
          placeholder="Task title"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          style={{ ...styles.input, minHeight: '80px' }}
          placeholder="Task description"
        />
        <div style={styles.row}>
          <select
            value={editedTask.status}
            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
            style={styles.select}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            style={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={handleUpdate} disabled={loading} style={styles.saveButton}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setIsEditing(false)} disabled={loading} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>{task.title}</h3>
        <div style={styles.badges}>
          <span style={{ ...styles.badge, backgroundColor: getStatusColor(task.status) }}>
            {task.status}
          </span>
          <span style={{ ...styles.badge, backgroundColor: getPriorityColor(task.priority) }}>
            {task.priority}
          </span>
        </div>
      </div>
      {task.description && <p style={styles.description}>{task.description}</p>}
      {task.tags && task.tags.length > 0 && (
        <div style={styles.tags}>
          {task.tags.map((tag, index) => (
            <span key={index} style={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div style={styles.footer}>
        <small style={styles.date}>
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </small>
        <div style={styles.actions}>
          <button onClick={() => setIsEditing(true)} style={styles.editButton} disabled={loading}>
            Edit
          </button>
          <button onClick={handleDelete} style={styles.deleteButton} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  badges: {
    display: 'flex',
    gap: '8px',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  description: {
    margin: '0 0 12px 0',
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  tag: {
    padding: '4px 10px',
    backgroundColor: '#e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#4b5563',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  date: {
    color: '#9ca3af',
    fontSize: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '6px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteButton: {
    padding: '6px 16px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
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
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  saveButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#6b7280',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default TaskCard;
