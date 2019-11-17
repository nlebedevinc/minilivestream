// entry point
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const middleware = require('connect-ensure-login');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// should be singleton and extended
const config = require('./config/default');

const app = express();

// database connect
mongoose.connect('mongodb://127.0.0.1/nodeStream', {
    useNewUrlParser: true,
});

// set server side rendering
app.set('view enfgine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
// set session parsers middlewares
app.use(flash());
app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json({ extended: true }));

// session
app.use(session({
    store: new FileStore({
        path: './server/sessions',
    }),
    secret: config.server.secret,
    maxAge: Date().now + (60 * 1000 * 30),
}));

app.get('*', middleware.ensureLoggedIn(), (req, res) => {
    res.render('index');
});

app.listen(config.server.port, () => console.log(`Application ready on port ${config.server.port}`));
