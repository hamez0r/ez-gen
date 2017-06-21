'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let ProjectsSanitizer = require('../app/projects-sanitizer').Sanitizer
let NamesValidator = require('../app/names-validator').Validator

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
    "dependencies": ["MdefDataModel", "MdefXml"],
    "platform": "win32",
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
    reference.set('MdefDataModelTests', ['F:/B/'])

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

describe('AppsValidator', function() {

})
