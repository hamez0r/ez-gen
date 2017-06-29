'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let NamesValidator = require('../app/names-validator').Validator
let ProjectsFactory = require('./projects-factory').ProjectsFactory

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
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let validator = new NamesValidator()

    expect(validator.checkNonEmptyNames.bind(validator, projects))
      .to.not.throw()
  })

  it('checkNonEmptyNames() should throw, because some names are empty', function() {
    let projects = ProjectsFactory.createProjectsWithEmptyNames()
    let validator = new NamesValidator()

    expect(validator.checkNonEmptyNames.bind(validator, projects))
      .to.throw()
  })

  it('mapNamesToPaths() should map 1 to 1', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let validator = new NamesValidator()
    let nameToProjectDirs = validator.mapNamesToPaths(projects)

    let reference = new Map()
    reference.set('MdefDataModel', ['F:/A'])
    reference.set('MdefXml', ['F:/B'])

    expect(nameToProjectDirs).to.deep.equal(reference)
  })

  it('mapNamesToPaths() should map 1 to 1 with duplicate names', function() {
    let projects = ProjectsFactory.createProjectsWithSameNames()
    let validator = new NamesValidator()
    let nameToProjectDirs = validator.mapNamesToPaths(projects)

    let reference = new Map()
    reference.set('MdefDataModel', ['F:/A/', 'F:/B/'])

    expect(nameToProjectDirs).to.deep.equal(reference)
  })
})
