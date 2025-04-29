# Vehicle Management System

A full-stack web application for managing vehicles with user authentication.

## Features

- User authentication (register, login, logout)
- CRUD operations for vehicles
- Client-side form validation
- Image upload for vehicles
- Responsive design with Bootstrap
- Session-based authentication with Passport.js

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/vehicle_db
   SESSION_SECRET=your-secret-key
   ```
4. Make sure MongoDB is running on your system

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
├── app.js              # Main application file
├── config/             # Configuration files
│   └── passport.js     # Passport configuration
├── models/             # Database models
│   ├── User.js         # User model
│   └── Vehicle.js      # Vehicle model
├── public/             # Static files
│   ├── css/            # CSS files
│   └── uploads/        # Uploaded images
├── routes/             # Route handlers
│   ├── auth.js         # Authentication routes
│   └── vehicles.js     # Vehicle routes
└── views/              # EJS templates
    ├── layouts/        # Layout templates
    ├── auth/           # Authentication views
    └── vehicles/       # Vehicle views
```

## API Endpoints

### Authentication
- GET /register - Registration form
- POST /register - Create new user
- GET /login - Login form
- POST /login - Authenticate user
- GET /logout - Logout user

### Vehicles
- GET /vehicles - List all vehicles
- GET /vehicles/new - Show new vehicle form
- POST /vehicles - Create new vehicle
- GET /vehicles/:id - Show single vehicle
- GET /vehicles/:id/edit - Show edit form
- PUT /vehicles/:id - Update vehicle
- DELETE /vehicles/:id - Delete vehicle

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation
- Secure file uploads

## License

MIT 