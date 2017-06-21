'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let ProjectsSanitizer = require('../app/projects-sanitizer').Sanitizer
let NamesValidator = require('../app/names-validator').Validator
let ProjectsValidator = require('../app/projects-validator').Validator
let AppTranslator = require('../app/app-translator').Translator
let CMakeFormatter = require('../app/cmake-formatter').CMakeFormatter

function createProjectsWithEmptyNames() {
  let projects = []
  projects.push(new Project({
    "name": "",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'somePath'))
  projects.push(new Project({
    "name": "MdefDataModelTests",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'somePath'))

  return projects 
}

function createProjectsWithDifferentNames() {
  let projects = []
  projects.push(new Project({
    "name": "MdefDataModel",
    "type": "Static",
    "dependencies": ["MdefXml"],
    "platform": "win32",
  }, 'F:/A/'))
  projects.push(new Project({
    "name": "MdefXml",
    "type": "Static",
    "platform": "win32",
  }, 'F:/B/'))

  return projects 
}

function createProjectsWithSameNames() {
  let projects = []
  projects.push(new Project({
    "name": "MdefDataModel",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/A/'))
  projects.push(new Project({
    "name": "MdefDataModel",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/B/'))

  return projects 
}

function createProjectsWithDifferentPlatforms() {
  let projects = []
  projects.push(new Project({
    "name": "MdefDataModel",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "linux",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

    ]
  }, 'F:/A/'))
  projects.push(new Project({
    "name": "MdefDataModelTests",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/B/'))
  projects.push(new Project({
    "name": "MdefSerializer",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "all",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/C/'))

  return projects 
}

function createProjectsWithCorrectDependencies() {
  let projects = []
  projects.push(new Project({
    "name": "MdefDataModel",
    "type": "Static",
    "dependencies": ["MdefXml"],
    "platform": "linux",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

    ]
  }, 'F:/A/'))
  projects.push(new Project({
    "name": "MdefSerializer",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/B/'))
  projects.push(new Project({
    "name": "MdefXml",
    "type": "Static",
    "platform": "all",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/C/'))

  return projects 
}

function createProjectsWithIncorrectDependencies() {
  let projects = []
  projects.push(new Project({
    "name": "MdefDataModel",
    "type": "Static",
    "dependencies": ["MdefXml"],
    "platform": "linux",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

    ]
  }, 'F:/A/'))
  projects.push(new Project({
    "name": "MdefSerializer",
    "type": "Static",
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
    "runAfterBuild": "true",
    "additionalCMakeCommands": [
      "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
    ]
  }, 'F:/B/'))

  return projects 
}

describe('NamesValidator', function() {
  it('checkDuplicateNames() should not throw error, because names are different', function() {
    let namesToProjectDirs = new Map()
    namesToProjectDirs.set('MdefToolkit', ['F:/A/'])
    namesToProjectDirs.set('MdefApplication', ['F:/B/'])

    let validator = new NamesValidator()
    expect(validator.checkDuplicateNames.bind(validator, namesToProjectDirs))
      .to.not.throw()
  })

  it('checkDuplicateNames() should check duplicate names and throw', function() {
    let namesToProjectDirs = new Map()
    namesToProjectDirs.set('MdefToolkit', ['F:/A/', 'F:/B/'])

    let validator = new NamesValidator()
    expect(validator.checkDuplicateNames.bind(validator, namesToProjectDirs))
      .to.throw()
  })

  it('checkNonEmptyNames() should not throw, because names are not empty', function() {
    let projects = createProjectsWithDifferentNames()
    let validator = new NamesValidator()

    expect(validator.checkNonEmptyNames.bind(validator, projects))
      .to.not.throw()
  })

  it('checkNonEmptyNames() should throw, because some names are empty', function() {
    let projects = createProjectsWithEmptyNames()
    let validator = new NamesValidator()

    expect(validator.checkNonEmptyNames.bind(validator, projects))
      .to.throw()
  })

  it('mapNamesToPaths() should map 1 to 1', function() {
    let projects = createProjectsWithDifferentNames()
    let validator = new NamesValidator()
    let nameToProjectDirs = validator.mapNamesToPaths(projects)

    let reference = new Map()
    reference.set('MdefDataModel', ['F:/A/'])
    reference.set('MdefXml', ['F:/B/'])

    expect(nameToProjectDirs).to.deep.equal(reference)
  })

  it('mapNamesToPaths() should map 1 to 1 with duplicate names', function() {
    let projects = createProjectsWithSameNames()
    let validator = new NamesValidator()
    let nameToProjectDirs = validator.mapNamesToPaths(projects)

    let reference = new Map()
    reference.set('MdefDataModel', ['F:/A/', 'F:/B/'])

    expect(nameToProjectDirs).to.deep.equal(reference)
  })
})

describe('ProjectsSanitizer', function() {  
  it('keepProjectsTargetingPlatform() should get rid of projects that shouldn\'t be included on the specified platform', function() {
    let projects = createProjectsWithDifferentPlatforms()
    let sanitizer = new ProjectsSanitizer()
    projects = sanitizer.keepProjectsTargetingPlatform(projects, 'linux')

    let reference = [
      new Project({
        "name": "MdefDataModel",
        "type": "Static",
        "dependencies": ["MdefDataModel", "MdefXml"],
        "platform": "linux",
        "runAfterBuild": "true",
        "additionalCMakeCommands": [
          "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
        ]
      }, 'F:/A/'),
      new Project({
        "name": "MdefSerializer",
        "type": "Static",
        "dependencies": ["MdefDataModel", "MdefXml"],
        "platform": "all",
        "runAfterBuild": "true",
        "additionalCMakeCommands": [
          "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
        ]
      }, 'F:/C/')
    ]

    expect(projects).to.deep.equal(reference)
  })
})

describe('ProjectsValidator', function() {
  it('checkDependencies() should not throw becase the dependency exists', function() {
    let projects = createProjectsWithCorrectDependencies()
    let validator = new ProjectsValidator()

    expect(validator.checkDependencies.bind(validator, projects[1], projects)).to.not.throw()
  })

  it('checkDependencies() should throw because a dependency is missing', function() {
    let projects = createProjectsWithIncorrectDependencies()
    let validator = new ProjectsValidator()

    expect(validator.checkDependencies.bind(validator, projects[0], projects)).to.throw()
  })

  it('hasProject() should return false because it didn\'t find the specified project', function() {
    let projects = createProjectsWithDifferentNames()
    let validator = new ProjectsValidator()
    let found = validator.hasProject('MdefSolve', projects)

    expect(found).to.be.false
  })

  it('hasProject() should return true because it found the specified project', function() {
    let projects = createProjectsWithDifferentNames()
    let validator = new ProjectsValidator()
    let found = validator.hasProject('MdefDataModel', projects)

    expect(found).to.be.true
  })
})

describe('CMakeFormatter', function() {
  it('formatIncludeDirectory()', function() {
    let directory = 'F:/B/Public'
    let reference = 'include_directories("F:/B/Public")\n'
    let formatter = new CMakeFormatter()
    let result = formatter.formatIncludeDirectory(directory)
    expect(result).to.deep.equal(reference)
  })
})

describe('AppTranslator', function() {
  it('GetIncludeDirectories() should return a string representing the include directories for CMakeLists.txt', function() {

  })

  it('translateProject() should return the contents of a CMakeLists.txt for a given project', function() {
    let fileSystemMock = {
      listAllSubdirs: function(startDir) {
        if (startDir === 'F:/B/Public')
          return ['F:/B/Public/Xerces', 'F:/B/Public/Tokens']
        else if (startDir === 'F:/A/')
          return ['F:/A/Public/', 'F:/A/Private/', 'F:/A/Public/Api', 'F:/A/Public/Local']
        else throw 'Not properly used mock'
      },
    }

    let projects = createProjectsWithDifferentNames()
    let translator = new AppTranslator(null, fileSystemMock, new CMakeFormatter())
    let contents = translator.translateProject(projects[0])

    let reference = `cmake_minimum_required(VERSION 2.8)
project(MdefDataModel)
include_directories("F:/B/Public")
include_directories("F:/B/Public/Xerces")
include_directories("F:/B/Public/Tokens")
include_directories("F:/A/Public/")
include_directories("F:/A/Public/Api")
include_directories("F:/A/Public/Local")
include_directories("F:/A/Private/")
file(GLOB Public_H "F:/A/Public/*.h")
file(GLOB Public_HH "F:/A/Public/*.hh")
file(GLOB Public_HPP "F:/A/Public/*.hpp")
file(GLOB Public_HXX "F:/A/Public/*.hxx")
file(GLOB Public_C "F:/A/Public/*.c")
file(GLOB Public_CC "F:/A/Public/*.cc")
file(GLOB Public_CPP "F:/A/Public/*.cpp")
file(GLOB Public_CXX "F:/A/Public/*.cxx")
file(GLOB Private_H "F:/A/Private/*.h")
file(GLOB Private_HH "F:/A/Private/*.hh")
file(GLOB Private_HPP "F:/A/Private/*.hpp")
file(GLOB Private_HXX "F:/A/Private/*.hxx")
file(GLOB Private_C "F:/A/Private/*.c")
file(GLOB Private_CC "F:/A/Private/*.cc")
file(GLOB Private_CPP "F:/A/Private/*.cpp")
file(GLOB Private_CXX "F:/A/Private/*.cxx")
file(GLOB PublicApi_H "F:/A/Public/Api/*.h")
file(GLOB PublicApi_HH "F:/A/Public/Api/*.hh")
file(GLOB PublicApi_HPP "F:/A/Public/Api/*.hpp")
file(GLOB PublicApi_HXX "F:/A/Public/Api/*.hxx")
file(GLOB PublicApi_C "F:/A/Public/Api/*.c")
file(GLOB PublicApi_CC "F:/A/Public/Api/*.cc")
file(GLOB PublicApi_CPP "F:/A/Public/Api/*.cpp")
file(GLOB PublicApi_CXX "F:/A/Public/Api/*.cxx")
file(GLOB PublicLocal_H "F:/A/Public/Local/*.h")
file(GLOB PublicLocal_HH "F:/A/Public/Local/*.hh")
file(GLOB PublicLocal_HPP "F:/A/Public/Local/*.hpp")
file(GLOB PublicLocal_HXX "F:/A/Public/Local/*.hxx")
file(GLOB PublicLocal_C "F:/A/Public/Local/*.c")
file(GLOB PublicLocal_CC "F:/A/Public/Local/*.cc")
file(GLOB PublicLocal_CPP "F:/A/Public/Local/*.cpp")
file(GLOB PublicLocal_CXX "F:/A/Public/Local/*.cxx")
source_group("Public" FILES \${Public_H} \${Public_HH} \${Public_HPP} \${Public_HXX} \${Public_C} \${Public_CC} \${Public_CPP} \${Public_CXX})
source_group("Private" FILES \${Private_H} \${Private_HH} \${Private_HPP} \${Private_HXX} \${Private_C} \${Private_CC} \${Private_CPP} \${Private_CXX})
source_group("Public\\\\Local" FILES \${PublicLocal_H} \${PublicLocal_HH} \${PublicLocal_HPP} \${PublicLocal_HXX} \${PublicLocal_C} \${PublicLocal_CC} \${PublicLocal_CPP} \${PublicLocal_CXX})
source_group("Public\\\\Api" FILES \${PublicApi_H} \${PublicApi_HH} \${PublicApi_HPP} \${PublicApi_HXX} \${PublicApi_C} \${PublicApi_CC} \${PublicApi_CPP} \${PublicApi_CXX})
target_link_libraries(MdefDataModel MdefXml)
add_library(MdefDataModel STATIC
    \${PUBLIC_H}
    \${Public_HH}
    \${Public_HPP}
    \${Public_HXX}
    \${Public_C}
    \${Public_CC}
    \${Public_CPP}
    \${Public_CXX}
    \${Private_H}
    \${Private_HH}
    \${Private_HPP}
    \${Private_HXX}
    \${PublicApi_H}
    \${PublicApi_HH}
    \${PublicApi_HPP}
    \${PublicApi_HXX}
    \${PublicApi_C}
    \${PublicApi_CC}
    \${PublicApi_CPP}
    \${PublicApi_CXX}
    \${PublicLocal_H}
    \${PublicLocal_HH}
    \${PublicLocal_HPP}
    \${PublicLocal_HXX}
    \${PublicLocal_C}
    \${PublicLocal_CC}
    \${PublicLocal_CPP}
    \${PublicLocal_CXX})`

  expect(contents).to.deep.equal(reference)
  })

})
