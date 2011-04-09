var fs = require('fs'),
    path_join = require('path').join

function show(path, cb) {
  fs.stat(path, function(err, stat) {
    if (err) {
      cb(false, false, err.message)
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
              cb(false, true, f.sort(), d.sort())
            }
          })
        })
      })
    } else if (stat.isFile()) {
      fs.readFile(path, function(err, data) {
        cb(true, false, data)
      })
    } else {
      cb(false, false, null)
    }
  })
}

exports.show = show
