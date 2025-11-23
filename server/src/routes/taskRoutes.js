const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getAllTasks,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { validateCreateTask, validateUpdateTask } = require('../validations/taskValidation');

/**
 * @route   GET /api/v1/tasks/stats
 * @desc    Get task statistics
 * @access  Private
 */
router.get('/stats', protect, getTaskStats);

/**
 * @route   GET /api/v1/tasks/admin/all
 * @desc    Get all tasks (Admin only)
 * @access  Private/Admin
 */
router.get('/admin/all', protect, authorizeRoles('admin'), getAllTasks);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', protect, validateCreateTask, createTask);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private
 */
router.get('/', protect, getTasks);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get('/:id', protect, getTaskById);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', protect, validateUpdateTask, updateTask);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', protect, deleteTask);

module.exports = router;
