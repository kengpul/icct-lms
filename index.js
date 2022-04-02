if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profile');
const classRoutes = require('./routes/class');
const groupRoutes = require('./routes/group');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/authentication'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: 'secretKey',
    touchAfter: 24 * 60 * 60
})

const sessionConfig = {
    name: 'session',
    store,
    secret: 'thisisasecretkey',
    resave: false,
    saveUninitialized: true,
    secure: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render('home');
    }
    return res.redirect('/post')
})


app.use('/', userRoutes);
app.use('/post', postRoutes);
app.use('/profile', profileRoutes);
app.use('/class', classRoutes);
app.use('/group', groupRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found'), 404);
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err });
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`ON PORT ${PORT}`);
})