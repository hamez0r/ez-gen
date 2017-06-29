'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let ProjectsSanitizer = require('../app/projects-sanitizer').Sanitizer
let ProjectsFactory = require('./projects-factory').ProjectsFactory

describe('ProjectsSanitizer', function() {  
  it('keepProjectsTargetingPlatform() should get rid of projects that shouldn\'t be included on the specified platform', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentPlatforms()
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
