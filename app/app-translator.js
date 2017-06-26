'use strict'

function AppTranslator(app, fileSystem, cmakeFormatter) {
  this.translator = new Translator(app, fileSystem, cmakeFormatter)
}

AppTranslator.prototype = {
  translate: function(app) {
    return this.translator.translateApp(app)
  }
}

function Translator(app, fileSystem, cmakeFormatter) {
  this.app = app
  this.fileSystem = fileSystem
  this.formatter = cmakeFormatter
}

Translator.prototype = {
  translateApp: function(app) {
    return new Map()
  },

  translateProject: function(project) {
    let cmakeContents = ''
    cmakeContents += cmakeFormatter.getCMakeVersion(3.8)
    cmakeContents += cmakeFormatter.getProjectDefinition(project.name)


  },

  getProjectIncludeDirectories(project) {
    let projectRoot = project.configDirectory
    return fileSystem.listAllSubDirs(projectRoot)
  },

  getDependencyIncludeDirectories(dependency) {

  }

  getIncludeDirectories(project) {
    let projectSubdirs
    let dependenciesDirs = []

    let dependencies = app.getProjectDependencies(project)
    for (let dependency of dependencies) {
      let dependencyRootDir = dependency.configDirectory
      let depenencyPublicDir = dependencyRootDir + '/Public'
      let depenencyPublicSubdirs = this.fileSystem.listAllSubDirs(depenencyPublicDir)

      dependenciesDirs.push(depenencyPublicDir)
      dependenciesDirs = dependenciesDirs.concat(depenencyPublicSubdirs)
    }

    let allIncludeDirs = projectSubdirs.concat(dependenciesDirs)
    return allIncludeDirs.map(function(includeDir) {
      return this.cmakeFormatter.getIncludeDirectory(includeDir)
    }.bind(this))
  }
}

module.exports = {
  AppTranslator: AppTranslator,
  Translator: Translator
}