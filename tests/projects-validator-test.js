'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let ProjectsValidator = require('../app/projects-validator').Validator
let ProjectsFactory = require('./projects-factory').ProjectsFactory

describe('ProjectsValidator', function() {
  it('checkDependencies() should not throw becase the dependency exists', function() {
    let projects = ProjectsFactory.createProjectsWithCorrectDependencies()
    let validator = new ProjectsValidator()

    expect(validator.checkDependencies.bind(validator, projects[1], projects)).to.not.throw()
  })

  it('checkDependencies() should throw because a dependency is missing', function() {
    let projects = ProjectsFactory.createProjectsWithIncorrectDependencies()
    let validator = new ProjectsValidator()

    expect(validator.checkDependencies.bind(validator, projects[0], projects)).to.throw()
  })

  it('hasProject() should return false because it didn\'t find the specified project', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let validator = new ProjectsValidator()
    let found = validator.hasProject('MdefSolve', projects)

    expect(found).to.be.false
  })

  it('hasProject() should return true because it found the specified project', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let validator = new ProjectsValidator()
    let found = validator.hasProject('MdefDataModel', projects)

    expect(found).to.be.true
  })
})
