const express = require("express");
const path = require("path");
var crypo = require("crypto");
const bodyParser = require("body-parser");

var session = require("express-session");

//инключдим оасновные роуты
var routes = require('./routes/index');
var api = require('./routes/api');

const mongoose = require("mongoose");
var mongooStore = require("connect-mongo");
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/maze', {
    useMongoClient: true
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Mongo DB coneetion error:"));


///////////////////////
var app = express();

app.use(bodyParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(__dirname+'/uploads'));
//app.use(bodyParser({keepExtentions:true, uploadDir:path.join(__dirname,'/files')}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//app.use(cookieParser());
app.use(session({ secret: 'LIJKUJKGYUTKYFUJTKFCTf6t78t7867',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        path: '/',
        maxAge: 60000 * 1000
    },
    name: 'SID'}));

// статик папка views
app.set('views', path.join(__dirname + '/views'));
// шаблонизатор jade
app.set('view engine', 'jade');
app.locals.pretty = true;

// подключаем роуты
app.use('/', routes);
app.use('/api', api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404);
    if(req.accepts('html')) {
        res.render('404', {url: req.url});
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// Запускаем сервер
app.listen(8001, function() {
    console.log("Стартуем проект");
})