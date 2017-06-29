'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let App = require('../app/app').App
let ProjectsFactory = require('./projects-factory').ProjectsFactory

describe('App', function() {
  it('getProjectDependencies() returns the project(objects) dependencies', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let reference = [projects[1]]
    let app = new App({name: 'foo'}, projects, null)
    let result = app.getProjectDependencies(projects[0])

    expect(result).to.deep.equal(reference)
  })
})
