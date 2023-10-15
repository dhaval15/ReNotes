require('./file-watcher');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('/static'))

var port = process.env.PORT || '3030';

const authenticationController = require('./controllers/authentication');

app.use((req, res, next) => {
	if (req.path === '/api/login') {
    return next(); 
  }
	return authenticationController.authenticationMiddleware(req, res, next);
});

app.post('/api/login', authenticationController.login);

const collectionController = require('./controllers/collection');

app.get('/api/collections', collectionController.getCollections);
app.get('/api/collection/:name', collectionController.getCollection);
app.delete('/api/collection/:name', collectionController.deleteCollection);
app.post('/api/collection', collectionController.createCollection);
app.put('/api/collection/:name', collectionController.updateCollection);
app.get('/api/regenerate/:name', collectionController.regenerateIndex);

const nodeController = require('./controllers/node');

app.get('/api/collection/:name/node/:id', nodeController.getNode);
app.post('/api/collection/:name/node', nodeController.createNode);
app.put('/api/collection/:name/node/:id', nodeController.updateNode);
app.delete('/api/collection/:name/node/:id', nodeController.deleteNode);

const contentController = require('./controllers/content');

app.get('/api/content/:collection/:node', contentController.getContent);
app.post('/api/content/:collection/:node', contentController.postContent);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
