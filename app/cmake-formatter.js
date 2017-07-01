'use strict'

function CMakeFormatter() {
  this.identifierCreator = new CMakeIdentifierCreator()
  this.binaryCommand = new Map()
  this.binaryCommand.set('Static', 'add_library')
  this.binaryCommand.set('Shared', 'add_library')
  this.binaryCommand.set('Executable', 'add_executable')
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

  getLinkLibraries: function(projectName, dependencies) {
    if (dependencies.length == 0) return ''
    let result = `target_link_libraries(${projectName}`
    for (let dependency of dependencies) {
      result += ` ${dependency}`
    }
    result += ')\n'
    return result
  },

  getBinary: function(name, type, subDirs) {
    let command = this.binaryCommand.get(type)
    let binaryType = type.toUpperCase()

    let result = `${command}(${name} ${binaryType}\n`
    for (let subDir of subDirs) {
      subDir = subDir.replace(/\\/g, '/')
      let identifier = this.identifierCreator.getGlob(subDir)
      result += `    \$\{${identifier}_H}\n`
      result += `    \$\{${identifier}_HH}\n`
      result += `    \$\{${identifier}_HPP}\n`
      result += `    \$\{${identifier}_HXX}\n`
      result += `    \$\{${identifier}_C}\n`
      result += `    \$\{${identifier}_CC}\n`
      result += `    \$\{${identifier}_CPP}\n`
      result += `    \$\{${identifier}_CXX}\n`
    }

    result += ')\n'
    return result
  },

  getSubProject: function(appName, projectName, cmakeListsDir) {
    let dir = cmakeListsDir.replace(/\\/g, '/')
    return `add_subdirectory("${dir}/${appName}/${projectName}")`
  },

  getLinkDirectory: function(projectDir) {
    let dir = projectDir.replace(/\\/g, '/')
    return `link_directories("${dir}/Lib")`
  },

  getExternalProjectCustomTarget: function(projectName, projectDir, destinationDir) {
    let projectPath = projectDir.replace(/\\/g, '/')
    let destinationPath = destinationDir.replace(/\\/g, '/')

    return `add_custom_target(${projectName} ALL
    COMMAND cmake -E make_directory "${destinationPath}"
    COMMAND cmake -E copy_directory "${projectPath}/Lib" "${destinationPath}")\n`
  },

  getBuildBinDirectory: function(workDirectory, targetPlatform) {
    let workDirPath = workDirectory.replace(/\\/g, '/')
    workDirPath = `${workDirPath}/build_${targetPlatform}/bin`
    return workDirPath.replace(/\/\//g, '/')
  },

  getProjectCMakeDestination: function(projectName, workDirectory) {
    let destinationPath = workDirectory.replace(/\\/g, '/')
    destinationPath = `${destinationPath}/build/${projectName}/CMakeLists.txt`
    return destinationPath.replace(/\/\//g, '/')
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