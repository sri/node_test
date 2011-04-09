var express = require('express'),
        app = express.createServer(),
       path = require('path'),
        src = require('./src'),
         io = require('socket.io'),
     socket = io.listen(app)

app.use(express.logger())
app.set('view options', {layout: false})

socket.on('connection', function(client) {
  client.on('message', function(event) {
    console.log('Client message: ' + event)
  })
  client.on('disconnect', function() {
    console.log('Disconnect event')
  })
  setInterval(function() { client.send('Server says ' + (new Date())) }, 5000)
})

app.get('/', function(req, res) {
  var p = req.query.path || "/Users/sri/my/src"
  src.show(p, function(isFile, isDir, x, y) {
    if (isFile) {
      var mimetypes = {png: 'image/png',
                       jpg: 'image/jpeg',
                       jpeg: 'image/jpeg',
                       pdf: 'application/pdf'}
      var t = mimetypes[path.extname(p).substring(1)]
      if (t) {
        res.contentType(t)
        res.send(x)
      } else {
        res.render('file.ejs', {locals: {contents: x}})
      }
    } else if (isDir) {
      res.render('dir.ejs', {locals: {files: x,
                                      dirs: y, 
                                      basename: path.basename}})
    } else {
      res.send('Unknown path: ' + req.query.path)
      res.send('Error: ' + x)
    }
  })
})

app.listen(3000)
console.log('Server listening to port 3000')
