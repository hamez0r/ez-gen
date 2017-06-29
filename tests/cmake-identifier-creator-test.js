'use strict';

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let CMakeIdentifierCreator = require('../app/cmake-formatter').CMakeIdentifierCreator

describe('CMakeIdentifierCreator', function() {
  it('getGlob()', function() {
    let directory = 'F:/B/Public/LibName'
    let reference = 'PublicLibName'
    let creator = new CMakeIdentifierCreator()
    let result = creator.getGlob(directory)

    expect(result).to.deep.equal(reference)
  })

  it('getSourceGroup()', function() {
    let directory = 'F:/B/Public/Api'
    let reference = 'Public\\\\Api'
    let creator = new CMakeIdentifierCreator()
    let result = creator.getSourceGroup(directory)

    expect(result).to.deep.equal(reference)
  })
})
