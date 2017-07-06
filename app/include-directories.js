'use strict'

function IncludeDirectories(fileSystem) {
  this.fileSystem = fileSystem
}

IncludeDirectories.prototype = {
 getDependencyIncludeDirectories: function(dependency) {
    let dependencyRootDir = dependency.configDirectory
    let depenencyPublicDir = dependencyRootDir + '/Public'
    return [depenencyPublicDir]
      .concat(this.fileSystem.listAllSubDirs(depenencyPublicDir))
 },

  getProjectIncludeDirectories: function(project) {
    let projectRoot = project.configDirectory
    return this.fileSystem.listAllSubDirs(projectRoot)
  }
}

module.exports = {
  IncludeDirectories: IncludeDirectories
}