# Blog Backend

A Node.js and Express-based backend for a blogging platform with features like user authentication, blog creation, publishing, and comments.

## 🌐 Related Repository

**Frontend Repository:** [blogs-frontend](https://github.com/MohdShayan/blogs-frontend)

## 📋 Features

- **User Authentication**: JWT-based authentication with session management
- **Blog Management**: Create, read, update, and delete blog posts
- **Publishing**: Schedule blog posts for automatic publishing using cron jobs
- **Image Upload**: Integration with Cloudinary for image hosting
- **Comments**: Allow users to comment on blog posts
- **CORS**: Cross-origin resource sharing for frontend integration
- **Database**: MongoDB with Mongoose ORM

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - JSON Web Token for authentication
- **Cloudinary** - Image hosting service
- **Multer** - File upload middleware
- **Node-Cron** - Job scheduler
- **Groq SDK** - AI integration

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

## 📁 Project Structure

```
├── ConnectDB.js              # Database connection setup
├── index.js                  # Main application entry point
├── package.json              # Project dependencies
├── services.js               # Business logic services
├── controllers/              # Request handlers
│   ├── blog.js              # Blog controllers
│   └── publish-blog.js       # Blog publishing and scheduling
├── middlewares/              # Express middlewares
│   └── authentication.js      # JWT authentication middleware
├── models/                   # Mongoose schemas
│   ├── blogs.js              # Blog schema
│   ├── comments.js           # Comments schema
│   └── user.js               # User schema
├── public/                   # Static files
├── routes/                   # API routes
│   ├── blog.js               # Blog routes
│   └── user.js               # User routes
├── uploads/                  # Uploaded files directory
└── utils/                    # Utility functions
    ├── cloudinary.js         # Cloudinary configuration
    └── multer.js             # Multer configuration
```

## 🔌 API Endpoints

### User Routes (`/user`)
- User authentication and management endpoints

### Blog Routes (`/blog`)
- Blog CRUD operations
- Blog publishing and scheduling
- Comments management

## 🔐 Authentication

The application uses JWT-based authentication. The auth token is stored in cookies and validated on protected routes using the `checkForAuthCookie` middleware.

## 📸 File Upload

Images are uploaded to Cloudinary through the Multer middleware. Configuration is in `utils/multer.js`.

## 🗓️ Blog Scheduling

Blog posts can be scheduled for automatic publishing using Node-Cron. The scheduler is initialized in `publish-blog.js` controller.

## ⚙️ Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `CLOUDINARY_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## 📝 License

This project is licensed under the ISC License.

---

For frontend repository, visit: [blogs-frontend](https://github.com/MohdShayan/blogs-frontend)
