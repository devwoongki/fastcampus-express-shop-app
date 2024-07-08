const express = require('express');
const path = require('path');
const {default : mongoose} = require('mongoose');
const User = require('./models/users.model');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');

const config = require('config');
const mainRouter = require('./routers/main.router');
const usersRouter = require('./routers/users.router');
const productsRouter = require('./routers/products.router');
const cartRouter = require('./routers/cart.router');
const adminCategoriesRouter = require('./routers/admin-categories.router');
const adminProductsRouter = require('./routers/admin-products.router');
const {checkAdmin} = require('./middleware/auth');
const methodOverride = require('method-override');

const serverConfig = config.get('server');
const passport = require('passport');

const port = serverConfig.port;

require('dotenv').config();


const app = express();

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY]
}));


// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(flash());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//view engine config

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');



mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.log(err);
});

app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    next();
})

app.use('/', mainRouter);
app.use('/auth',usersRouter);
app.use('/admin/categories',adminCategoriesRouter);
app.use('/admin/products',adminProductsRouter);
app.use('/products',productsRouter);
app.use('/cart',cartRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || '에러가 났습니다.');
})

app.listen(port, () => { 
    console.log(`Server running on port ${port}`);
});

