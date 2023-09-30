const port = process.env.PORT || 3030;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const collectionController = require('./controllers/collection');

app.get('/api/collections', collectionController.getCollections);
app.get('/api/collection/:name', collectionController.getCollection);
app.delete('/api/collection/:name', collectionController.deleteCollection);
app.post('/api/collection', collectionController.createCollection);

const nodeController = require('./controllers/node');

app.get('/api/collection/:name/node/:id', nodeController.getNode);
app.post('/api/collection/:name/node', nodeController.createNode);
app.put('/api/collection/:name/node/:id', nodeController.updateNode);
app.delete('/api/collection/:name/node/:id', nodeController.deleteNode);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
