'use strict'

let chai = require('chai')
let expect = chai.expect
let PathRepository = require('../app/path-repository').PathRepository

describe('PathRepository', function() {
  it('getBuildBinDirectory(workDirectory)', function() {
    let workDirectory = 'C:\\Workdir\\toolkitwbs'
    let targetPlatform = 'win32'
    let reference = 'C:/Workdir/toolkitwbs/build_win32/bin'

    let pathRepository = new PathRepository(targetPlatform)
    let result = pathRepository.getBuildBinDirectory(workDirectory)

    expect(result).to.deep.equal(reference)
  })

  it('getProjectCMakeDestination(projectName, workDirectory)', function() {
    let projectName = 'MdefXml'
    let workDirectory = 'C:\\Workdir\\toolkitwbs'

    let reference =  'C:/Workdir/toolkitwbs/build/MdefXml/CMakeLists.txt'

    let pathRepository = new PathRepository('win32')
    let result = pathRepository.getProjectCMakeDestination(projectName, workDirectory)

    expect(result).to.deep.equal(reference)
  })

  it('getAppDestinationDir(workDir)', function() {
    let workDir = 'C:\\Workdir\\App'

    let reference = 'C:/Workdir/App/build'

    let pathRepository = new PathRepository('win32')
    let result = pathRepository.getAppDestinationDir(workDir)

    expect(result).to.deep.equal(reference)
  })

  it('getAppCMakeDestination(workDir)', function() {
    let workDir = 'C:\\Workdir\\App'

    let reference = 'C:/Workdir/App/build/CMakeLists.txt'

    let pathRepository = new PathRepository('win32')
    let result = pathRepository.getAppCMakeDestination(workDir)

    expect(result).to.deep.equal(reference)
  })
})
