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
    return result.replace('EXECUTABLE', '')
  },

  getSubProject: function(projectName, cmakeListsDir) {
    let dir = cmakeListsDir.replace(/\\/g, '/')
    dir = `add_subdirectory("${dir}/${projectName}")\n`
    return dir.replace(/\/\//g, '/')
  },

  getLinkDirectory: function(projectDir) {
    let dir = projectDir.replace(/\\/g, '/')
    dir = `link_directories("${dir}/Lib")\n`
    return dir.replace(/\/\//g, '/')
  },

  getExternalProjectCustomTarget: function(projectName, projectDir, destinationDir) {
    let projectPath = projectDir.replace(/\\/g, '/')
    let destinationPath = destinationDir.replace(/\\/g, '/')

    return `add_custom_target(${projectName} ALL
    COMMAND cmake -E make_directory "${destinationPath}"
    COMMAND cmake -E copy_directory "${projectPath}/Lib" "${destinationPath}")\n`
  },

  getSuppressRegeneration: function() {
    return 'set(CMAKE_SUPPRESS_REGENERATION ON)\n'
  },

  getRuntimeOutputDirectory: function(outDir) {
    let dir = outDir.replace(/\\/g, '/')
    return `set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${dir}")\n`
  },

  getLibraryOutputDirectory: function(outDir) {
    let dir = outDir.replace(/\\/g, '/')
    return `set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${dir}")\n`
  },

  getArchiveOutputDirectory: function(outDir) {
    let dir = outDir.replace(/\\/g, '/')
    return `set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${dir}")\n`
  },

  getConfigurations: function(configs) {
    let cmakeConfigurations = configs.join(';')
    return `set(CMAKE_CONFIGURATION_TYPES "${cmakeConfigurations}" CACHE STRING "Configurations" FORCE)\n`
  },

  getOutputForConfigurations: function(runtimeDir, libraryDir, archiveDir) {
    let runtimeOutDir = runtimeDir.replace(/\\/g, '/')
    let libraryOutDir = libraryDir.replace(/\\/g, '/')
    let archiveOutDir = archiveDir.replace(/\\/g, '/')

    let content = `foreach(OUTPUTCONFIG \${CMAKE_CONFIGURATION_TYPES})
  string(TOUPPER \${OUTPUTCONFIG} OUTPUTCONFIG)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "${runtimeOutDir}")
  set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "${libraryOutDir}")
  set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "${archiveOutDir}")
endforeach()\n`

    return content
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