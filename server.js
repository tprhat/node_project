//modules import
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();


//routes
const homeRouter = require('./routes/home.routes');
const loginRouter = require('./routes/login.routes');
const logoutRouter = require('./routes/logout.routes');
const signupRouter = require('./routes/signup.routes');
const signupKartografRouter = require('./routes/signupKartograf.routes');
const igracRouter = require('./routes/igrac.routes');
const kartografRouter = require('./routes/kartograf.routes');
const adminRouter = require('./routes/admin.routes');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));

//middleware - views(ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: "Tajna tajna tajna",
  saveUninitialized: false,
  resave: false
}));

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/signupKartograf', signupKartografRouter);
app.use('/igrac', igracRouter);
app.use('/kartograf', kartografRouter);
app.use('/admin', adminRouter);


//server start
const port = process.env.PORT || 8080;

app.listen(port, (err) => {
    if (!err) {
       console.log(`App started on port ${port}`);
    } else {
      console.log(err);
    }
  });
  
  module.exports = app;
