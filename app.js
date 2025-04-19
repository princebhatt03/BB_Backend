require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const connectToDb = require('./db/db');
const Routes = require('./routes/index');

connectToDb();

const app = express();

// ✅ 1. CORS Setup (Allow frontend from env OR localhost:5173)
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ 2. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ 3. Session Setup with MongoDB Store (for production safety)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECT, 
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60, 
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

// Optional: Debug - Log session existence
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('Session not initialized!'));
  }
  next();
});

// ✅ 4. Flash Messages Middleware
app.use(flash());

// ✅ 5. Root Route - Redirect to frontend
app.get('/', (req, res) => {
  const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(redirectUrl);
});

// ✅ 6. All Routes
app.use('/', Routes);

module.exports = app;
