'use strict'

function PathRepository(targetPlatform) {
  this.targetPlatform = targetPlatform
}

PathRepository.prototype = {
  getBuildBinDirectory: function(workDirectory) {
    let workDirPath = workDirectory.replace(/\\/g, '/')
    workDirPath = `${workDirPath}/build_${this.targetPlatform}/bin`
    return workDirPath.replace(/\/\//g, '/')
  },

  getProjectCMakeDestination: function(projectName, workDirectory) {
    let destinationPath = workDirectory.replace(/\\/g, '/')
    destinationPath = `${destinationPath}/build/${projectName}/CMakeLists.txt`
    return destinationPath.replace(/\/\//g, '/')
  },

  getAppCMakeDestination: function(workDir) {
    let destinationPath = workDir.replace(/\\/g, '/')
    destinationPath = `${destinationPath}/build/CMakeLists.txt`
    return destinationPath.replace(/\/\//g, '/')
  },

  getAppDestinationDir: function(workDir) {
    let destinationPath = workDir.replace(/\\/g, '/')
    destinationPath = `${destinationPath}/build`
    return destinationPath.replace(/\/\//g, '/')
  },

  getBuildDir: function(currentDir) {
    let current = currentDir.replace(/\\/g, '/')
    let build = `${current}/build_${this.targetPlatform}`
    return build.replace(/\/\//g, '/')
  },

  getInstallDir: function(currentDir) {
    let current = currentDir.replace(/\\/g, '/')
    let installDir = `${current}/build_view`
    return installDir.replace(/\/\//g, '/')
  }
}

module.exports = {
  PathRepository: PathRepository
}
