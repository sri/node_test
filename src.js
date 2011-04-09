var fs = require('fs'),
    path_join = require('path').join

// If path is a directory, 
function show(path, onFile, onDir, onError) {
  fs.stat(path, function(err, stat) {
    if (err) {
      onError(err.message)
    } else if (stat.isFile()) {
      fs.readFile(path, function(err, data) { onFile(data) })
    } else if (stat.isDirectory()) {
      fs.readdir(path, function(err, files) {
        var d = [], f = [], cnt = files.length
        files.forEach(function(name) {
          var full = path_join(path, name)
          fs.stat(full, function(err, stat) {
            if (err) {
              cnt -= 1
              console.log("Error w/ " + full + "\n" + err)
            } else if (stat.isDirectory())
              d.push(full)
            else if (stat.isFile())
              f.push(full)
            if (cnt == d.length + f.length) {
              onDir(f.sort(), d.sort())
            }
          })
        })
      })
    }
  })
}

exports.show = show
