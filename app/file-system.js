'use strict'

let fs = require('fs')
let path = require('path')

function FileSystem() {

}

FileSystem.prototype = {

  listAllSubDirs: function(startDir) {
    let subDirs = []

    let files = fs.readdirSync(startDir)
    for (let file of files) {
      let fullFilePath = path.join(startDir, file)
      if (fs.statSync(fullFilePath).isDirectory()) {
        subDirs.push(fullFilePath)
        subDirs = subDirs.concat(listAllSubDirs(fullFilePath))
      }
    }

    return subDirs
  },

  getCurrentDirectory: function() {
    return process.cwd()
  },

  getAppsDirectories: function(startDir) {
    return getPathsContaining('app.json', startDir)
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

  createDirectory: function(dirName, parentDir) {},

  createFile: function(content, fileName, parentDir) {},
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

  return paths
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

  return files
}

module.exports = {
  FileSystem: FileSystem
}