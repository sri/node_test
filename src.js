var fs = require('fs'),
    path_join = require('path').join

function withFileContents(path, errCallback, callback) {
  fs.readFile(path, function(err, data) { 
    if (err) errCallback(err.message)
    else     callback(data)
  })
}

function withDirElts(path, errCallback, callback) {
  fs.readdir(path, function(err, all) {
    if (err) { errCallback(err.message); return; }
    
    var dirs  = [],
        files = [],
        count = all.length
    
    all.forEach(function(name) {
      var full = path_join(path, name)

      fs.stat(full, function(ferr, stat) {
        if (ferr)                    count -= 1
        else if (stat.isDirectory()) dirs.push(full)
        else if (stat.isFile())      files.push(full)
        else                         count -= 1

        if (dirs.length + files.length == count)
          callback(files.sort(), dirs.sort())
      })
    })
  })
}

// If path is a file, call onFile on the file contents.
// If path is a directory, collect all its files
// & directories and call onDir(files, dirs).
// (Both files & dirs will be sorted).
// If unable to stat path, call onError
function show(path, onFile, onDir, onError) {
  fs.stat(path, function(err, stat) {
    if (err)                     onError(err.message)
    else if (stat.isFile())      withFileContents(path, onError, onFile)
    else if (stat.isDirectory()) withDirElts(path, onError, onDir)
  })
}

exports.show = show
