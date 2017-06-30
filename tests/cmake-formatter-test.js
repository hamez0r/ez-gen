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

  it('getSubProject(appName, projectName, cmakeListsDir)', function() {
    let appName = 'MdefToolkit'
    let projectName = 'MdefXml'
    let cmakeListsDir = 'C:\\Workdir\\SCMotionTextFiles\\build'
    let reference = 'add_subdirectory("C:/Workdir/SCMotionTextFiles/build/MdefToolkit/MdefXml")'
    
    let formatter = new CMakeFormatter()
    let result = formatter.getSubProject(appName, projectName, cmakeListsDir)

    expect(result).to.deep.equal(reference)
  })

  it('getExternalLinkDirectory()', function() {
    
  })
})
