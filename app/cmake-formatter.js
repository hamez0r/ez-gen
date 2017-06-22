'use strict'

function CMakeFormatter() {
  this.identifierCreator = new CMakeIdentifierCreator()
}

CMakeFormatter.prototype = {
  getCMakeVersion(version) {
    return `cmake_minimum_required(VERSION ${version})\n`
  },

  getProjectDefinition(projectName) {
    return `project(${projectName})\n`
  },

  getIncludeDirectory: function(includeDir) {
    let formattedDir = includeDir.replace(/\\/g, '/')
    return `include_directories("${formattedDir}")\n`
  },

  getProjectFiles(fullPath) {
    let formattedPath = fullPath.replace(/\\/g, '/')
    let globBaseIdentifier = this.identifierCreator.getGlobIdentifierName(fullPath)

    let files = ''
    files += `file(GLOB ${globBaseIdentifier}_H "${formattedPath}/*.h")\n`
    files += `file(GLOB ${globBaseIdentifier}_HH "${formattedPath}/*.hh")\n`
    files += `file(GLOB ${globBaseIdentifier}_HPP "${formattedPath}/*.hpp")\n`
    files += `file(GLOB ${globBaseIdentifier}_HXX "${formattedPath}/*.hxx")\n`
    files += `file(GLOB ${globBaseIdentifier}_C "${formattedPath}/*.c")\n`
    files += `file(GLOB ${globBaseIdentifier}_CC "${formattedPath}/*.cc")\n`
    files += `file(GLOB ${globBaseIdentifier}_CPP "${formattedPath}/*.cpp")\n`
    files += `file(GLOB ${globBaseIdentifier}_CXX "${formattedPath}/*.cxx")\n`

    return files
  }
}

function CMakeIdentifierCreator() {

}

CMakeIdentifierCreator.prototype = {
  getGlobIdentifierName(directoryPath) {
    let directories = directoryPath.split('\\')

    // linux doesn't have this problem
    if (directories.length > 1) {
      let startWord = directories.find(function(word) {
        return word === 'Public' || word === 'Private'
      })

      let startWordPosition = directories.indexOf(startWord)
      let varName = ''
      for (let i = startWordPosition; i < directories.length; i++) 
        varName += directories[i]

      return varName
    }
     
    return directoryPath
  }
}

module.exports = {
  CMakeFormatter: CMakeFormatter,
  CMakeIdentifierCreator: CMakeIdentifierCreator
}