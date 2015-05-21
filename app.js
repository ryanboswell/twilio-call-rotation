var express = require('express');
var app = express();

// Custom Routes
var index = require('./routes');
app.use('/', index);


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log("call rotation is now running.");
});
