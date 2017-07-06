'use strict'

let chai = require('chai')
let expect = chai.expect
let IncludeDirectories = require('../app/include-directories').IncludeDirectories
let ProjectsFactory = require('./projects-factory').ProjectsFactory

describe('IncludeDirectories', function() {
  it('getDependencyIncludeDirectories(dependency)', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let reference = ["F:/B/Public"]

    let mockFs = {
      listAllSubDirs: function(dir) {
        if (dir === 'F:/A') {
          return ['F:/A/Public', 'F:/A/Private']
        } else if (dir === 'F:/B/Public') {
          return []
        } else {
          console.log(dir)
          throw 'wtf'
        }
      }
    }

    let includes = new IncludeDirectories(mockFs)
    let result = includes.getDependencyIncludeDirectories(projects[1])

    expect(result).to.deep.equal(reference)
  })

  it('getProjectIncludeDirectories(project)', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let reference = ["F:/A/Public", "F:/A/Private"]

    let mockFs = {
      listAllSubDirs: function(dir) {
        if (dir === 'F:/A') {
          return ['F:/A/Public', 'F:/A/Private']
        } else if (dir === 'F:/B/Public') {
          return []
        } else {
          console.log(dir)
          throw 'wtf'
        }
      }
    }

    let includes = new IncludeDirectories(mockFs)
    let result = includes.getProjectIncludeDirectories(projects[0])

    expect(result).to.deep.equal(reference)
    
  })
})