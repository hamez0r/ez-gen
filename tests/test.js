'use strict';

let expect = require('chai').expect
let Project = require('../app/project').Project
let Sanitizer = require('../app/input-sanitizer').Sanitizer

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

describe('Sanitizer', function() {
  it('checkDuplicateNames() should not throw error, because names are different', function() {
    let namesToProjectDirs = new Map()
    namesToProjectDirs.set('MdefToolkit', ['F:/A/'])
    namesToProjectDirs.set('MdefApplication', ['F:/B/'])

    let sanitizer = new Sanitizer()
    expect(sanitizer.checkDuplicateNames.bind(sanitizer, namesToProjectDirs))
      .to.not.throw()
  })

  it('checkDuplicateNames() should check duplicate names and throw', function() {
    let namesToProjectDirs = new Map()
    namesToProjectDirs.set('MdefToolkit', ['F:/A/', 'F:/B/'])

    let sanitizer = new Sanitizer()
    expect(sanitizer.checkDuplicateNames.bind(sanitizer, namesToProjectDirs))
      .to.throw()
  })

  it('checkNonEmptyNames() should not throw, because names are not empty', function() {
    let projects = createProjectsWithDifferentNames()
    let sanitizer = new Sanitizer()

    expect(sanitizer.checkNonEmptyNames.bind(sanitizer, projects))
      .to.not.throw()
  })

  it('checkNonEmptyNames() should throw, because some names are empty', function() {
    let projects = createProjectsWithEmptyNames()
    let sanitizer = new Sanitizer()

    expect(sanitizer.checkNonEmptyNames.bind(sanitizer, projects))
      .to.throw()
  })

  it('mapNamesToProjectDirs() should map 1 to 1', function() {
    let projects = createProjectsWithDifferentNames()
    let sanitizer = new Sanitizer()
    let nameToProjectDirs = sanitizer.mapNamesToProjectDirs(projects)

    let reference = new Map()
    reference.set('MdefDataModel', ['F:/A/'])
    reference.set('MdefDataModelTests', ['F:/B/'])

    expect(nameToProjectDirs).to.deep.equal(reference)
  })

  it('mapNamesToProjectDirs() should map 1 to 1 with duplicate names', function() {
    let projects = createProjectsWithSameNames()
    let sanitizer = new Sanitizer()
    let nameToProjectDirs = sanitizer.mapNamesToProjectDirs(projects)

    let reference = new Map()
    reference.set('MdefDataModel', ['F:/A/', 'F:/B/'])

    expect(nameToProjectDirs).to.deep.equal(reference)
  })
})