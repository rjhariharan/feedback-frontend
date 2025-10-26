# React Authentication App

A modern React authentication application with signup, login, and dashboard functionality using real API integration.

## Features

- ✅ **Registration**: Create new user accounts
- ✅ **Login**: Authenticate with username and password
- ✅ **Feedback Board**: Submit, view, upvote, and manage feedback
- ✅ **Status Management**: Track feedback status (Open, In Progress, Resolved, Closed)
- ✅ **Role-based Access**: Admin/Developer can manage feedback status
- ✅ **Real-time Updates**: Live upvote counts and status changes
- ✅ **Persistent Sessions**: Stay logged in between browser sessions
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Loading States**: Visual feedback during API operations
- ✅ **Error Handling**: Comprehensive error messages

## API Integration

The app integrates with a backend API using the following endpoints:

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

#### Logout User
```
POST /auth/logout
Authorization: Bearer <token>
```

### Feedback Endpoints

#### Get All Feedbacks
```
GET /feedback
Authorization: Bearer <token>
```

#### Create Feedback
```
POST /feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Bug Report",
  "description": "Description of the issue",
  "status": "open"
}
```

#### Upvote Feedback
```
PUT /feedback/:id/upvote
Authorization: Bearer <token>
```

#### Delete Feedback
```
DELETE /feedback/:id
Authorization: Bearer <token>
```

#### Update Feedback Status
```
PUT /feedback/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved"
}
```

## Backend Setup

### Option 1: Express.js Backend Example

Create a simple Express backend:

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

// Mock user storage (replace with database)
let users = [];
let refreshTokens = [];

// Register endpoint
app.post('/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = { id: users.length + 1, name, email, phone, password };
  users.push(user);

  // Generate token
  const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });

  res.json({ token, name, email, phone });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
  res.json({ token, name: user.name, email: user.email, phone: user.phone });
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
  // In a real app, you'd invalidate the token on the server
  res.json({ message: 'Logged out successfully' });
});

// Feedback endpoints
let feedbacks = [];

// Get all feedbacks
app.get('/feedback', (req, res) => {
  res.json({ feedbacks });
});

// Create feedback
app.post('/feedback', (req, res) => {
  const { title, description, status } = req.body;
  const user = users.find(u => u.id === req.user.userId); // Get user from token

  const feedback = {
    _id: feedbacks.length + 1,
    title,
    description,
    status: status || 'open',
    upvotes: 0,
    user: { _id: user.id, username: user.name },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  feedbacks.push(feedback);
  res.json(feedback);
});

// Upvote feedback
app.put('/feedback/:id/upvote', (req, res) => {
  const feedback = feedbacks.find(f => f._id === parseInt(req.params.id));
  if (feedback) {
    feedback.upvotes += 1;
    res.json(feedback);
  } else {
    res.status(404).json({ message: 'Feedback not found' });
  }
});

// Delete feedback
app.delete('/feedback/:id', (req, res) => {
  const index = feedbacks.findIndex(f => f._id === parseInt(req.params.id));
  if (index !== -1) {
    feedbacks.splice(index, 1);
    res.json({ message: 'Feedback deleted' });
  } else {
    res.status(404).json({ message: 'Feedback not found' });
  }
});

// Update feedback status
app.put('/feedback/:id/status', (req, res) => {
  const { status } = req.body;
  const feedback = feedbacks.find(f => f._id === parseInt(req.params.id));

  if (feedback) {
    feedback.status = status;
    feedback.updatedAt = new Date();
    res.json(feedback);
  } else {
    res.status(404).json({ message: 'Feedback not found' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
```

### Option 2: Alternative Backend URLs

Update the API base URL in `src/api.js`:

```javascript
// For production
const API_BASE_URL = 'https://your-api-domain.com/api';

// For different port
const API_BASE_URL = 'http://localhost:5000/api';
```

## Quick Start

### 1. Backend Setup (Node.js/Express)

```bash
# Navigate to backend directory
cd C:\Users\harih\express\server

# Install dependencies
npm install

# Start the backend server
npm start
```

**Backend will run on: http://localhost:5000**

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd c:\Users\harih\OneDrive\Desktop\react\signup

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will run on: http://localhost:5173**

### 3. Database Setup (MongoDB)

The backend uses MongoDB Atlas (cloud database). Make sure your `.env` file has the correct connection string:

```env
MONGO_URI=mongodb+srv://rjhari:mangodb20@cluster0.xsltpfe.mongodb.net/?appName=Cluster0
JWT_SECRET=mangodb20
```

## Troubleshooting

### Backend Issues

#### "MongoDB Connection Error"
- ✅ Check if MongoDB Atlas is accessible
- ✅ Verify the `MONGO_URI` in `.env` file
- ✅ Check internet connection
- ✅ Look at server console logs for detailed error messages

#### "Server not starting"
- ✅ Run `npm install` in backend directory
- ✅ Check if port 5000 is available
- ✅ Verify all dependencies are installed

### Frontend Issues

#### "Backend server not responding"
- ✅ Start the backend server first: `cd C:\Users\harih\express\server && npm start`
- ✅ Check if backend is running on port 5000
- ✅ Use the "Test Connection" button in the app

#### "Authentication failed"
- ✅ Clear localStorage and login again
- ✅ Check if user credentials are correct
- ✅ Verify JWT token is valid

#### "Failed to upvote/delete"
- ✅ Promote yourself to admin using the "Promote to Admin" button
- ✅ Check if you're logged in
- ✅ Verify backend is connected

### Common Fixes

1. **Clear everything and restart:**
   ```bash
   # Stop all servers
   # Clear localStorage in browser
   # Restart backend: cd C:\Users\harih\express\server && npm start
   # Restart frontend: cd c:\Users\harih\OneDrive\Desktop\react\signup && npm run dev
   ```

2. **If database issues persist:**
   - Check MongoDB Atlas dashboard
   - Verify database user permissions
   - Test connection using MongoDB Compass

3. **If authentication issues:**
   - Register a new account
   - Use the "Promote to Admin" button for testing
   - Check browser console for detailed errors

## Project Structure

```
src/
├── api.js              # API configuration and functions
├── app.jsx             # Main app component with routing
├── index.css           # Global styles
├── components/
│   ├── signup.jsx      # Registration form
│   ├── login.jsx       # Login form
│   └── dashboard.jsx   # User dashboard
└── main.jsx           # React entry point
```

## Key Features Explained

### Authentication Flow
1. **Signup**: User creates account → API stores user → Token saved → Redirect to login
2. **Login**: User authenticates → Token validated → User data saved → Redirect to dashboard
3. **Dashboard**: Protected route requiring authentication → Logout clears data

### State Management
- **Local Storage**: Persists authentication state
- **React State**: Manages UI state and loading indicators
- **API Integration**: Handles server communication

### Security Features
- **JWT Tokens**: Secure authentication
- **Input Validation**: Client-side form validation
- **Error Handling**: Comprehensive error management
- **Loading States**: Prevents multiple submissions

## API Configuration

The API module (`src/api.js`) includes:
- **Native Fetch**: Uses browser's built-in fetch API
- **Request Interceptors**: Add auth tokens to requests
- **Response Interceptors**: Handle token expiration
- **Error Handling**: Automatic token cleanup on 401 errors
- **Retry Logic**: Graceful error handling for network issues

## Customization

### Styling
- Colors and gradients defined in `index.css`
- Responsive breakpoints for mobile optimization
- Loading animations and hover effects

### API Endpoints
- Update `API_BASE_URL` for different environments
- Modify request/response handling in `api.js`
- Add new endpoints as needed

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features used
- Responsive design for mobile devices
