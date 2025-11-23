const Task = require('../models/Task');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      user: req.user.id,
    });

    return successResponse(res, 'Task created successfully', { task }, 201);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks for the logged-in user
 * @route   GET /api/v1/tasks
 * @access  Private
 */
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy, order, page, limit, search } = req.query;

    // Build query
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Task.countDocuments(query);

    return successResponse(res, 'Tasks fetched successfully', {
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Check if task belongs to user (unless admin)
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to access this task', 403);
    }

    return successResponse(res, 'Task fetched successfully', { task });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Check if task belongs to user (unless admin)
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update this task', 403);
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags !== undefined) task.tags = tags;

    await task.save();

    return successResponse(res, 'Task updated successfully', { task });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Check if task belongs to user (unless admin)
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to delete this task', 403);
    }

    await task.deleteOne();

    return successResponse(res, 'Task deleted successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics for the logged-in user
 * @route   GET /api/v1/tasks/stats
 * @access  Private
 */
exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Task.countDocuments({ user: req.user.id });

    return successResponse(res, 'Task statistics fetched successfully', {
      total,
      byStatus: stats,
      byPriority: priorityStats,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks (Admin only)
 * @route   GET /api/v1/tasks/admin/all
 * @access  Private/Admin
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Task.countDocuments();

    return successResponse(res, 'All tasks fetched successfully', {
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });

  } catch (error) {
    next(error);
  }
};
