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

  translateCompilingProject: function(project) {
    let cmakeContents = ''
    cmakeContents += this.formatter.getCMakeVersion(3.8)
    cmakeContents += this.formatter.getProjectDefinition(project.name)
    
    let projectIncludeDirs = this.getIncludeDirectories(project)
    for (let dir of projectIncludeDirs) {
      cmakeContents += this.formatter.getIncludeDirectory(dir)
    }

    let projectDirs = this.getProjectOwnIncludeDirectories(project)
    for (let dir of projectDirs) {
      cmakeContents += this.formatter.getProjectFiles(dir)
    }

    for (let dir of projectDirs) {
      cmakeContents += this.formatter.getSourceGroup(dir)
    }

    cmakeContents += this.formatter
      .getLinkLibraries(project.name, project.dependencies)

    cmakeContents += this.formatter
      .getBinary(project.name, project.type, projectDirs)

    return cmakeContents
  },

  getProjectOwnIncludeDirectories: function(project) {
    let projectRoot = project.configDirectory
    return this.fileSystem.listAllSubDirs(projectRoot)
  },

  getDependencyIncludeDirectories: function(dependency) {
      let dependencyRootDir = dependency.configDirectory
      let depenencyPublicDir = dependencyRootDir + '/Public'
      return [depenencyPublicDir]
        .concat(this.fileSystem.listAllSubDirs(depenencyPublicDir))
  },

  getIncludeDirectories: function(project) {
    let projectSubdirs = this.getProjectOwnIncludeDirectories(project)

    let dependenciesDirs = []
    for (let dependency of this.app.getProjectDependencies(project)) {
      dependenciesDirs = dependenciesDirs
        .concat(this.getDependencyIncludeDirectories(dependency))
    }

    return projectSubdirs.concat(dependenciesDirs)

    // return allIncludeDirs.map(function(includeDir) {
    //   return this.formatter.getIncludeDirectory(includeDir)
    // }.bind(this))
  }
}

module.exports = {
  AppTranslator: AppTranslator,
  Translator: Translator
}