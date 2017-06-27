'use strict'

function CMakeFormatter() {
  this.identifierCreator = new CMakeIdentifierCreator()
}

CMakeFormatter.prototype = {
  getCMakeVersion: function(version) {
    return `cmake_minimum_required(VERSION ${version})\n`
  },

  getProjectDefinition: function(projectName) {
    return `project(${projectName})\n`
  },

  getIncludeDirectory: function(includeDir) {
    let formattedDir = includeDir.replace(/\\/g, '/')
    return `include_directories("${formattedDir}")\n`
  },

  getProjectFiles: function(fullPath) {
    let formattedPath = fullPath.replace(/\\/g, '/')
    let globBaseIdentifier = this.identifierCreator
      .getGlob(formattedPath)

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
  },

  getSourceGroup: function(fullPath) {
    let formattedPath = fullPath.replace(/\\/g, '/')
    let sourceGroupIdentifier = this.identifierCreator
      .getSourceGroup(formattedPath)
    let globIdentifier = this.identifierCreator
      .getGlob(formattedPath)
    return `source_group("${sourceGroupIdentifier}" FILES \
\${${globIdentifier}_H} \${${globIdentifier}_HH} \${${globIdentifier}_HPP} \
\${${globIdentifier}_HXX} \${${globIdentifier}_C} \${${globIdentifier}_CC} \
\${${globIdentifier}_CPP} \${${globIdentifier}_CXX})\n`
  },

  getLinkLibraries: function(project, dependencies) {
    if (dependencies.length == 0) return ''
    let result = `target_link_libraries(${project}`
    for (let dependency of dependencies) {
      result += ` ${dependency}`
    }
    result += ')\n'
    return result
  }
}

function CMakeIdentifierCreator() {

}

CMakeIdentifierCreator.prototype = {
  getGlob: function(directoryPath) {
    let directories = directoryPath.split('/')

    if (directories.length > 1) {
      let startWord = directories.find(function(word) {
        return word === 'Public' || word === 'Private'
      })

      let startWordPosition = directories.indexOf(startWord)
      let varName = startWord
      for (let i = startWordPosition + 1; i < directories.length; i++) 
        varName += directories[i]

      return varName
    }
     
    return directoryPath
  },

  getSourceGroup: function(directoryPath) {
    let directories = directoryPath.split('/')

    if (directories.length > 1) {
      let startWord = directories.find(function(word) {
        return word === 'Public' || word === 'Private'
      })

      let startWordPosition = directories.indexOf(startWord)
      let varName = startWord
      for (let i = startWordPosition + 1; i < directories.length; i++) 
        varName += ('\\\\' + directories[i])

      return varName
    }

    return directoryPath
  }
}

let foo = function(directoryPath, cb) {
  let directories = directoryPath.split('/')

  if (directories.length > 1) {
    let startWord = directories.find(function(word) {
      return word === 'Public' || word === 'Private'
    })

    let startWordPosition = directories.indexOf(startWord)
    let varName = startWord
    for (let i = startWordPosition + 1; i < directories.length; i++) 
      cb(directories[i])
  }
}

module.exports = {
  CMakeFormatter: CMakeFormatter,
  CMakeIdentifierCreator: CMakeIdentifierCreator
}