// A simple Node.js, Express, Socket.IO example.
var express = require('express'),
        app = express.createServer(),
       path = require('path'),
        src = require('./src'),
         io = require('socket.io'),
     socket = io.listen(app)

app.use(express.logger())
app.set('view options', {layout: false})

// WebSocket example
socket.on('connection', function(client) {
  client.on('message', function(event) {
    console.log('Client message: ' + event)
  })
  client.on('disconnect', function() {
    console.log('Disconnect event')
  })
  setInterval(function() { client.send('Server says ' + (new Date())) }, 5000)
})

// Serve up the directory/file
app.get('/', function(req, res) {
  var p = req.query.path ? 
          req.query.path.replace(/[.][.]/, '') : 
          "/Users/sri/my/src"

  var mimetypes = {png:  'image/png',
                   jpg:  'image/jpeg',
                   jpeg: 'image/jpeg',
                   pdf:  'application/pdf'}
  
  var file = function(contents) { 
    var t = mimetypes[path.extname(p).substring(1)]
    if (t) {
      res.contentType(t)
      res.send(contents)
    } else {
      res.render('file.ejs', {locals: {contents: contents}})
    }
  }

  var dir = function(files, dirs) {
    res.render('dir.ejs', 
               {locals: {files: files, dirs: dirs, basename: path.basename}})
  }

  var error = function(err) {
    res.send('Unknown path: ' + req.query.path)
    res.send('Error: ' + err)
  }

  src.show(p, file, dir, error)
})

app.listen(3000)
console.log('Server listening to port 3000')
