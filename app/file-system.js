'use strict'

let fs = require('fs')
let path = require('path')

function FileSystem() {
  this.separator = '/'
}

FileSystem.prototype = {

  listAllSubDirs: function(startDir) {
    let subDirs = []

    let files = fs.readdirSync(startDir)
    for (let file of files) {
      let fullFilePath = path.join(startDir, file)
      if (fs.statSync(fullFilePath).isDirectory()) {
        subDirs.push(fullFilePath)
        subDirs = subDirs.concat(this.listAllSubDirs(fullFilePath))
      }
    }

    return subDirs.map(function(dir) {
      return dir.replace(/\\/g, '/')
    })
  },

  listAllSubDirsAsRelativePaths: function(startDir) {
    let subDirs = this.listAllSubDirs(startDir)

    return subDirs.map(function(absolutePath) {
      return absolutePath.replace(startDir + this.separator, '')
    }.bind(this))
  },


  getCurrentDirectory: function() {
    return process.cwd().replace(/\\/g, '/')
  },

  getAppDirectory: function(startDir) {
    return getPathsContaining('app.json', startDir)[0]
  },

  getProjectsDirectories: function(appDir) {
    return getPathsContaining('project.json', appDir)
  },

  readAppFile: function(dir) {
    let filePath = path.join(dir, 'app.json')
    return readFile(filePath)
  },

  readProjectFile: function(dir) {
    let filePath = path.join(dir, 'project.json')
    return readFile(filePath)
  },

  createDirectory: function(dirPath) {
    if (!fs.existsSync(dirPath))
      fs.mkdirSync(dirPath)
  },

  createFile: function(filePath, content) {
    let parentDir = filePath.substring(0, filePath.lastIndexOf('/'))
    this.createDirectory(parentDir)
    fs.writeFileSync(filePath, content)
  },
}

function readFile(filePath) {
  if (!fs.statSync(filePath).isFile()) throw 'Not a file: ' + fileName
  return fs.readFileSync(filePath)
}

function getPathsContaining(fileName, startDir) {
  if (dirContainsFile(startDir, fileName)) return [startDir]

  let paths = []
  let files = fs.readdirSync(startDir)
  for (let file of files) {
    if (fs.statSync(path.join(startDir, file)).isDirectory())
      paths = paths
        .concat(getPathsContaining(fileName, path.join(startDir, file)))
  }

  return paths.map(function(dir) {
    return dir.replace(/\\/g, '/')
  })
}

function dirContainsFile(dir, fileName) {
  let files = fs.readdirSync(dir)

  if (files.find(function(file) {
    return file === fileName
  })) return true 
  else return false
}

function readDirRecursive(startDir) {
  let files = fs.readdirSync(startDir)

  for (let file of files) {
    let descriptor = fs.statSync(path.join(startDir, file))
    if (descriptor.isDirectory()) {
      files = files.concat(readDirRecursive(path.join(startDir,file)))
    }
  }

  return files.map(function(file) {
    return file.replace(/\\/g, '/')
  })
}

//console.log(new FileSystem().listAllSubDirs('C:/Workdir/ez-gen'))
//console.log(new FileSystem().listAllSubDirs('C:/Workdir/ez-gen'))
// let output = 'add_library(MdefDataModel STATIC ${PUBLIC_H} ${Public_HH}'
// let output = `add_library(MdefDataModel STATIC
//     \${PUBLIC_H}
//     \${Public_HH}`
// console.log(output)

// console.log(new FileSystem().listAllSubDirsAsRelativePaths('C:\\Workdir\\ez-gen\\app\\dir2'))

module.exports = {
  FileSystem: FileSystem
}