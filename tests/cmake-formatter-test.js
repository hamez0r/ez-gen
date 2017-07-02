'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let CMakeFormatter = require('../app/cmake-formatter').CMakeFormatter

describe('CMakeFormatter', function() {
  it('getIncludeDirectory()', function() {
    let directory = 'F:\\B\\Public'
    let reference = 'include_directories("F:/B/Public")\n'
    let formatter = new CMakeFormatter()
    let result = formatter.getIncludeDirectory(directory)
    
    expect(result).to.deep.equal(reference)
  })

  it('getCMakeVersion(version)', function() {
    let version = 3.8
    let reference = 'cmake_minimum_required(VERSION 3.8)\n'
    let formatter = new CMakeFormatter()
    let result = formatter.getCMakeVersion(3.8)

    expect(result).to.equal(reference)
  })

  it('getProjectDefinition(projectName)', function() {
    let project = 'MdefDataModel'
    let reference = `project(MdefDataModel)\n`
    let formatter = new CMakeFormatter()
    let result = formatter.getProjectDefinition(project)

    expect(result).to.deep.equal(reference)
  })

  it('getProjectFiles(fullPath)', function() {
    let fullPath = 'F:\\A\\Public'
    let reference = `file(GLOB Public_H "F:/A/Public/*.h")
file(GLOB Public_HH "F:/A/Public/*.hh")
file(GLOB Public_HPP "F:/A/Public/*.hpp")
file(GLOB Public_HXX "F:/A/Public/*.hxx")
file(GLOB Public_C "F:/A/Public/*.c")
file(GLOB Public_CC "F:/A/Public/*.cc")
file(GLOB Public_CPP "F:/A/Public/*.cpp")
file(GLOB Public_CXX "F:/A/Public/*.cxx")
`
    let formatter = new CMakeFormatter()
    let result = formatter.getProjectFiles(fullPath)

    expect(result).to.deep.equal(reference)
  })

  it('getSourceGroup(fullPath)', function() {
    let fullPath = 'F:\\A\\Public\\Api'
    let reference = 'source_group("Public\\\\Api" FILES \${PublicApi_H} \${PublicApi_HH} \${PublicApi_HPP} \${PublicApi_HXX} \${PublicApi_C} \${PublicApi_CC} \${PublicApi_CPP} \${PublicApi_CXX})\n'
    let formatter = new CMakeFormatter()
    let result = formatter.getSourceGroup(fullPath)

    expect(result).to.deep.equal(reference)
  })

  it('getLinkLibraries(projectName, projectDependencies)', function() {
    let projectName = 'MdefSerializer'
    let projectDependencies = ['MdefXml']
    let reference = 'target_link_libraries(MdefSerializer MdefXml)\n'
    let formatter = new CMakeFormatter()
    let result = formatter.getLinkLibraries(projectName, projectDependencies)

    expect(result).to.deep.equal(reference)
  })

  it('getBinary(projectName, projectType, subDirs)', function() {
    let projectName = 'MdefDataModel'
    let projectType = 'Static'
    let subDirs = ['Public', 'Public\\Api']
    let reference = `add_library(MdefDataModel STATIC
    \${Public_H}
    \${Public_HH}
    \${Public_HPP}
    \${Public_HXX}
    \${Public_C}
    \${Public_CC}
    \${Public_CPP}
    \${Public_CXX}
    \${PublicApi_H}
    \${PublicApi_HH}
    \${PublicApi_HPP}
    \${PublicApi_HXX}
    \${PublicApi_C}
    \${PublicApi_CC}
    \${PublicApi_CPP}
    \${PublicApi_CXX}
)\n`

    let formatter = new CMakeFormatter()
    let result = formatter.getBinary(projectName, projectType, subDirs)

    expect(result).to.deep.equal(reference)
  })

  it('getSubProject(projectName, cmakeListsDir)', function() {
    let appName = 'MdefToolkit'
    let projectName = 'MdefXml'
    let cmakeListsDir = 'C:\\Workdir\\SCMotionTextFiles\\build'
    let reference = 'add_subdirectory("C:/Workdir/SCMotionTextFiles/build/MdefXml")\n'
    
    let formatter = new CMakeFormatter()
    let result = formatter.getSubProject(projectName, cmakeListsDir)

    expect(result).to.deep.equal(reference)
  })

  it('getLinkDirectory(projectDir)', function() {
    let projectDir = 'C:\\Workdir\\toolkitwbs\\zExternals\\log4cxx'
    let reference = 'link_directories("C:/Workdir/toolkitwbs/zExternals/log4cxx/Lib")\n'
    let formatter = new CMakeFormatter()

    let result = formatter.getLinkDirectory(projectDir)
    expect(result).to.deep.equal(reference)
  })

  it('getExternalProjectCustomTarget(projectName, projectPath, destinationPath)', function() {
    let projectName = 'log4cxx'
    let projectPath = 'C:\\Workdir\\toolkitwbs\\zExternals\\log4cxx'
    let destinationPath = 'C:\\Workdir\\toolkitwbs\\build_win32\\bin'

    let reference = `add_custom_target(log4cxx ALL
    COMMAND cmake -E make_directory "C:/Workdir/toolkitwbs/build_win32/bin"
    COMMAND cmake -E copy_directory "C:/Workdir/toolkitwbs/zExternals/log4cxx/Lib" "C:/Workdir/toolkitwbs/build_win32/bin")\n`

    let formatter = new CMakeFormatter()
    let result = formatter
      .getExternalProjectCustomTarget(projectName, projectPath, destinationPath)

    expect(result).to.deep.equal(reference)
  })

  it('getBuildBinDirectory(workDirectory, targetPlatform)', function() {
    let workDirectory = 'C:\\Workdir\\toolkitwbs'
    let targetPlatform = 'win32'
    let reference = 'C:/Workdir/toolkitwbs/build_win32/bin'

    let formatter = new CMakeFormatter()
    let result = formatter.getBuildBinDirectory(workDirectory, targetPlatform)

    expect(result).to.deep.equal(reference)
  })

  it('getProjectCMakeDestination(projectName, workDirectory)', function() {
    let projectName = 'MdefXml'
    let workDirectory = 'C:\\Workdir\\toolkitwbs'

    let reference =  'C:/Workdir/toolkitwbs/build/MdefXml/CMakeLists.txt'

    let formatter = new CMakeFormatter()
    let result = formatter.getProjectCMakeDestination(projectName, workDirectory)

    expect(result).to.deep.equal(reference)
  })

  it('getSuppressRegeneration()', function() {
    let reference = 'set(CMAKE_SUPPRESS_REGENERATION ON)\n'

    let formatter = new CMakeFormatter()
    let result = formatter.getSuppressRegeneration()

    expect(result).to.deep.equal(reference)
  })

  it('getConfigurations([configurations])', function() {
    let configs = ['Debug', 'Release']
    
    let reference = `set(CMAKE_CONFIGURATION_TYPES "Debug;Release" CACHE STRING "Configurations" FORCE)\n`

    let formatter = new CMakeFormatter()
    let result = formatter.getConfigurations(configs)

    expect(result).to.deep.equal(reference)
  })

  it('getRuntimeOutputDirectory(outDir)', function() {
    let outDir = 'C:\\Workdir\\App\\build_win32\\bin'

    let reference = `set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "C:/Workdir/App/build_win32/bin")\n`
    
    let formatter = new CMakeFormatter()
    let result = formatter.getRuntimeOutputDirectory(outDir)

    expect(result).to.deep.equal(reference)    
  })

  it('getLibraryOutputDirectory(outDir)', function() {
    let outDir = 'C:\\Workdir\\App\\build_win32\\bin'

    let reference = `set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "C:/Workdir/App/build_win32/bin")\n`
    
    let formatter = new CMakeFormatter()
    let result = formatter.getLibraryOutputDirectory(outDir)

    expect(result).to.deep.equal(reference)    
  })

  it('getArchiveOutputDirectory(outDir)', function() {
    let outDir = 'Lib'

    let reference = `set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "Lib")\n`
    
    let formatter = new CMakeFormatter()
    let result = formatter.getArchiveOutputDirectory(outDir)

    expect(result).to.deep.equal(reference)    
  })

  it('getOutputForConfigurations(runtimeOutDir, libraryOutDir, archiveOutDir', function() {
    let runtimeOutDir = `C:\\Workdir\\App\\build_win32\\bin`
    let libraryOutDir = `C:\\Workdir\\App\\build_win32\\bin`
    let archiveOutDir = `Lib`

    let reference = `foreach(OUTPUTCONFIG \${CMAKE_CONFIGURATION_TYPES})
  string(TOUPPER \${OUTPUTCONFIG} OUTPUTCONFIG)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "C:/Workdir/App/build_win32/bin")
  set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "C:/Workdir/App/build_win32/bin")
  set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "Lib")
endforeach()\n`

    let formatter = new CMakeFormatter()
    let result = formatter
      .getOutputForConfigurations(runtimeOutDir, libraryOutDir, archiveOutDir)
    
    expect(result).to.deep.equal(reference)      
  })

  it('getAppDestinationDir(workDir)', function() {
    let workDir = 'C:\\Workdir\\App'

    let reference = 'C:/Workdir/App/build'

    let formatter = new CMakeFormatter()
    let result = formatter.getAppDestinationDir(workDir)

    expect(result).to.deep.equal(reference)
  })

  it('getAppCMakeDestination(workDir)', function() {
    let workDir = 'C:\\Workdir\\App'

    let reference = 'C:/Workdir/App/build/CMakeLists.txt'

    let formatter = new CMakeFormatter()
    let result = formatter.getAppCMakeDestination(workDir)

    expect(result).to.deep.equal(reference)
  })
})
