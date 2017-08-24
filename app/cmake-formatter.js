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
    return `include_directories("${includeDir}")\n`
  },

  getProjectFiles: function(fullPath) {
    let globBaseIdentifier = this.identifierCreator
      .getGlob(fullPath)

    let files = ''
    files += `file(GLOB ${globBaseIdentifier}_H "${fullPath}/*.h")\n`
    files += `file(GLOB ${globBaseIdentifier}_HH "${fullPath}/*.hh")\n`
    files += `file(GLOB ${globBaseIdentifier}_HPP "${fullPath}/*.hpp")\n`
    files += `file(GLOB ${globBaseIdentifier}_HXX "${fullPath}/*.hxx")\n`
    files += `file(GLOB ${globBaseIdentifier}_C "${fullPath}/*.c")\n`
    files += `file(GLOB ${globBaseIdentifier}_CC "${fullPath}/*.cc")\n`
    files += `file(GLOB ${globBaseIdentifier}_CPP "${fullPath}/*.cpp")\n`
    files += `file(GLOB ${globBaseIdentifier}_CXX "${fullPath}/*.cxx")\n`

    return files
  },

  getSourceGroup: function(fullPath) {
    let sourceGroupIdentifier = this.identifierCreator
      .getSourceGroup(fullPath)
    let globIdentifier = this.identifierCreator
      .getGlob(fullPath)
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

    result += `add_dependencies(${projectName}`
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
    return result.replace(' EXECUTABLE', '')
  },

  getSubProject: function(projectName, cmakeListsDir) {
    return `add_subdirectory("${cmakeListsDir}/${projectName}")\n`
  },

  getLinkDirectory: function(projectDir) {
    return `link_directories("${projectDir}/Lib")\n`
  },

  getExternalProjectCustomTarget: function(projectName, projectDir, destinationDir) {
    return `add_custom_target(${projectName} ALL
    COMMAND cmake -E make_directory "${destinationDir}"
    COMMAND cmake -E copy_directory "${projectDir}/Lib" "${destinationDir}")\n`
  },

  getSuppressRegeneration: function() {
    return 'set(CMAKE_SUPPRESS_REGENERATION ON)\n'
  },

  getRuntimeOutputDirectory: function(outDir) {
    return `set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${outDir}")\n`
  },

  getLibraryOutputDirectory: function(outDir) {
    return `set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${outDir}")\n`
  },

  getArchiveOutputDirectory: function(outDir) {
    return `set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${outDir}")\n`
  },

  getConfigurations: function(configs) {
    let cmakeConfigurations = configs.join(';')
    return `set(CMAKE_CONFIGURATION_TYPES "${cmakeConfigurations}" CACHE STRING "Configurations" FORCE)\n`
  },

  getOutputForConfigurations: function(runtimeDir, libraryDir, archiveDir) {
    let content = `foreach(OUTPUTCONFIG \${CMAKE_CONFIGURATION_TYPES})
  string(TOUPPER \${OUTPUTCONFIG} OUTPUTCONFIG)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "${runtimeDir}")
  set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "${libraryDir}")
  set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "${archiveDir}")
endforeach()\n`

    return content
  },

  getRunAfterBuild: function(projectName) {
    return `add_custom_target(run${projectName} ALL COMMAND ${projectName})\n`
  },

  getCompilingProjectInstall: function(projectName, installDir) {
    return `install(TARGETS ${projectName} RUNTIME DESTINATION "${installDir}")\n`
  },

  getExternalProjectInstall: function(libsDir, installDir) {
    let installCommand = '';
    installCommand += `FILE(GLOB LIBRARIES "${libsDir}/*.*")\n`
    installCommand += `INSTALL(FILES \${LIBRARIES} DESTINATION "${installDir}")\n`

    return installCommand
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