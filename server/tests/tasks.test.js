const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const { generateAccessToken } = require('../src/utils/generateToken');

// Test database connection
beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/taskmanager-test';
  await mongoose.connect(MONGO_URI);
});

// Clean up database after each test
afterEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task Routes', () => {
  let token;
  let userId;
  let adminToken;
  let adminId;

  beforeEach(async () => {
    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    userId = user._id;
    token = generateAccessToken(user._id, user.role);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminId = admin._id;
    adminToken = generateAccessToken(admin._id, admin.role);
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'high',
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe(taskData.title);
      expect(response.body.data.task.status).toBe('pending');
    });

    it('should not create task without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Test Task' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/v1/tasks', () => {
    beforeEach(async () => {
      // Create some test tasks
      await Task.create([
        {
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          priority: 'low',
          user: userId,
        },
        {
          title: 'Task 2',
          description: 'Description 2',
          status: 'completed',
          priority: 'high',
          user: userId,
        },
      ]);
    });

    it('should get all tasks for logged-in user', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=completed')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].status).toBe('completed');
    });

    it('should search tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?search=Task 1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
    });

    it('should paginate tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?page=1&limit=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Description',
        user: userId,
      });
      taskId = task._id;
    });

    it('should get task by id', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task._id).toBe(taskId.toString());
    });

    it('should not get task with invalid id', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/tasks/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Description',
        user: userId,
      });
      taskId = task._id;
    });

    it('should update task', async () => {
      const response = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          status: 'completed',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe('Updated Task');
      expect(response.body.data.task.status).toBe('completed');
    });

    it('should not update another user\'s task', async () => {
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
      });
      const anotherToken = generateAccessToken(anotherUser._id, anotherUser.role);

      const response = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Hacked' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Description',
        user: userId,
      });
      taskId = task._id;
    });

    it('should delete task', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify task is deleted
      const task = await Task.findById(taskId);
      expect(task).toBeNull();
    });

    it('should not delete another user\'s task', async () => {
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
      });
      const anotherToken = generateAccessToken(anotherUser._id, anotherUser.role);

      const response = await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/tasks/stats', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Task 1', status: 'pending', priority: 'low', user: userId },
        { title: 'Task 2', status: 'pending', priority: 'high', user: userId },
        { title: 'Task 3', status: 'completed', priority: 'medium', user: userId },
      ]);
    });

    it('should get task statistics', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.byStatus).toBeDefined();
      expect(response.body.data.byPriority).toBeDefined();
    });
  });

  describe('GET /api/v1/tasks/admin/all', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Task 1', user: userId },
        { title: 'Task 2', user: adminId },
      ]);
    });

    it('should allow admin to get all tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(2);
    });

    it('should not allow regular user to access admin route', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/admin/all')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
