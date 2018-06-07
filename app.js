var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path')

//app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect('mongodb://localhost/wikiarticles');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("db connected");
  // we're connected!
});

app.use(session({
    secret: 'comp5347',
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge: 1000*60*3
    },
    store: new MongoStore({
        mongooseConnection:db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :false}));

//app.use(express.static(__dirname+'/app/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname,'app','views'));


var routes = require('./app/routes/login.routers');
var authRoutes = require('./app/routes/author.router');
var overallRoutes = require('./app/routes/overall.routes');
var individualRoutes = require('./app/routes/individual.routes');

app.use('/',routes);
app.use('/author',authRoutes);
app.use('/overall',overallRoutes);
app.use('/individual',individualRoutes);

app.listen(3000,function(){
    console.log('Listening on port 3000');
});
