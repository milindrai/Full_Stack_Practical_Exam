const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Initialize app
const app = express();

// Passport config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vehicle_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/vehicle_db',
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// View engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Root route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/vehicles');
    } else {
        res.redirect('/login');
    }
});

// Routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');

app.use('/', authRoutes);
app.use('/vehicles', vehicleRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('error', { 
        error: { 
            message: 'Page not found',
            status: 404
        } 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).render('error', { 
        error: { 
            message: err.message || 'An unexpected error occurred',
            status: statusCode
        } 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 