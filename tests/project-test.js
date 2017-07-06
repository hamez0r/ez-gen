'use strict'

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let ProjectsFactory = require('./projects-factory').ProjectsFactory

describe('Project', function() {
  it('isExternal()', function() {
    let project = ProjectsFactory.createExternalSharedProject()

    let result = project.isExternal()

    expect(result).to.be.true
  })
})