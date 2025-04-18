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

// ✅ 1. CORS Setup - Allow both localhost and deployed frontend
const corsOptions = {
  origin: (origin, callback) => {
    console.log('Origin:', origin); // Log for debug
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ 2. Session Setup - Allow secure cookies for cross-origin if needed
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECT,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // should be true ONLY on HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Optional: Ensure session is set up correctly
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('Session is not initialized properly'));
  }
  next();
});

app.use(flash());

// ✅ 3. Root Route
app.get('/', (req, res) => {
  const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(redirectUrl);
});

// ✅ 4. Routes
app.use('/', Routes);

module.exports = app;
