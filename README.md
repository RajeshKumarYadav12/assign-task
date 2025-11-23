# Task Manager - Full Stack Application

A production-ready task management application with authentication, role-based access control, and comprehensive CRUD operations.

## 🚀 Features

### Backend
- ✅ **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (User & Admin)
  - Secure password hashing with bcrypt
  - Token refresh mechanism

- ✅ **Task Management**
  - Complete CRUD operations
  - Advanced filtering (status, priority, search)
  - Pagination support
  - Task statistics
  - User-specific task isolation

- ✅ **Security**
  - Helmet.js for HTTP headers
  - Rate limiting
  - MongoDB sanitization
  - CORS configuration
  - Input validation with Joi

- ✅ **API Features**
  - RESTful API design
  - API versioning (/api/v1)
  - Comprehensive error handling
  - Request logging with Morgan
  - Winston logger for production

- ✅ **Documentation**
  - Swagger/OpenAPI specification
  - Postman collection
  - Complete API documentation

- ✅ **Testing & DevOps**
  - Jest + Supertest for testing
  - Docker support
  - Docker Compose for multi-container setup
  - Health check endpoints

### Frontend
- ✅ **User Interface**
  - React 18 with Vite
  - Login & Registration pages
  - Protected dashboard
  - Task CRUD operations
  - Real-time filtering and search

- ✅ **Features**
  - JWT token management
  - Automatic token refresh
  - Error handling with user feedback
  - Responsive design
  - Clean, minimal UI

## 📁 Project Structure

```
root/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── keys.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   ├── response.js
│   │   │   └── logger.js
│   │   ├── validations/
│   │   │   ├── authValidation.js
│   │   │   └── taskValidation.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── tasks.test.js
│   ├── swagger/
│   │   └── swagger.json
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── postman_collection.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env.example
├── docker-compose.yml
├── README.md
└── SCALABILITY.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize
- **Logging:** Winston, Morgan
- **Testing:** Jest, Supertest
- **Containerization:** Docker

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Inline CSS (easily replaceable with Tailwind/MUI)

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB 5.0+ (local or Atlas)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Assign3
```

#### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Update .env with your configuration
# Required: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file from example (optional)
copy .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services:
- **MongoDB:** `localhost:27017`
- **Backend API:** `localhost:5000`

### Manual Docker Build

```bash
# Build backend image
cd server
docker build -t taskmanager-api .

# Run backend container
docker run -d -p 5000:5000 --env-file .env taskmanager-api
```

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- Authentication endpoints
- Task CRUD operations
- Authorization checks
- Validation logic
- Error handling

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager",
  "status": "pending",
  "priority": "high",
  "tags": ["work", "urgent"]
}
```

#### Get All Tasks (with filters)
```http
GET /tasks?status=pending&priority=high&search=project&page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <access_token>
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <access_token>
```

#### Get Task Statistics
```http
GET /tasks/stats
Authorization: Bearer <access_token>
```

#### Get All Tasks (Admin Only)
```http
GET /tasks/admin/all
Authorization: Bearer <admin_access_token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error info"]
}
```

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Minimum 6 characters
   - Never returned in API responses

2. **JWT Security**
   - Short-lived access tokens (7 days)
   - Long-lived refresh tokens (30 days)
   - Secure token storage

3. **API Security**
   - Rate limiting (100 requests per 15 minutes)
   - Helmet.js security headers
   - MongoDB injection prevention
   - CORS configuration
   - Input validation

4. **Role-Based Access**
   - User role: Own tasks only
   - Admin role: All tasks access

## 📊 Swagger Documentation

Access Swagger UI (manual setup required):
```
http://localhost:5000/api-docs
```

Import `swagger/swagger.json` into Swagger Editor or use the provided Postman collection.

## 📮 Postman Collection

Import `server/postman_collection.json` into Postman:
1. Open Postman
2. Click Import
3. Select the `postman_collection.json` file
4. Set `BASE_URL` variable to `http://localhost:5000`

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd client
npm run dev  # Runs with Vite HMR
```

### Production Build

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

## 📝 Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Verify network access for MongoDB Atlas

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### JWT Token Errors
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Clear localStorage in browser

### CORS Issues
- Verify CLIENT_URL in backend .env
- Check VITE_API_URL in frontend .env

## 🚀 Deployment

### Backend Deployment (Example: Heroku/Railway)
1. Set environment variables
2. Ensure MongoDB connection string is production-ready
3. Change JWT secrets to strong production values
4. Set NODE_ENV=production

### Frontend Deployment (Example: Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set VITE_API_URL to production API URL

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built as part of Backend Developer Internship assignment
- Demonstrates production-ready full-stack development skills
- Implements industry best practices for Node.js and React

## 📞 Support

For issues and questions:
1. Check the documentation above
2. Review existing issues on GitHub
3. Create a new issue with detailed description

---

**Note:** This is a complete, production-ready application demonstrating enterprise-level development practices. All code is modular, scalable, and follows industry standards.
#   a s s i g n - t a s k  
 