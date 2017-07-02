'use strict'

function CompilingProjectTranslator(translator) {
  this.translator = translator
}

CompilingProjectTranslator.prototype = {
  translate: function(project, targetPlatform) {
    return this.translator.translateCompilingProject(project, targetPlatform)
  }
}

function ExternalProjectTranslator(translator) {
  this.translator = translator
}

ExternalProjectTranslator.prototype = {
  translate: function(project, targetPlatform) {
    return this.translator.translateExternalProject(project, targetPlatform)
  }
}

function ProjectTranslator(app, fileSystem, cmakeFormatter) {
  let translator = new Translator(app, fileSystem, cmakeFormatter)

  let compilingProjectTranslator = new CompilingProjectTranslator(translator)
  let externalProjectTranslator = new ExternalProjectTranslator(translator)

  let translators = new Map()

  translators.set('Executable', compilingProjectTranslator)
  translators.set('Static', compilingProjectTranslator)
  translators.set('Shared', compilingProjectTranslator)

  translators.set('ExternalShared', externalProjectTranslator)
  translators.set('ExternalStatic', externalProjectTranslator)

  this.translators = translators
}

ProjectTranslator.prototype = {
  translate(project, targetPlatform) {
    return this.translators.get(project.type).translate(project, targetPlatform)
  }
}

function Translator(app, fileSystem, cmakeFormatter) {
  this.app = app
  this.fileSystem = fileSystem
  this.formatter = cmakeFormatter
}

Translator.prototype = {
  translateExternalProject: function(project, targetPlatform) {
    let cmakeContents = ''
    cmakeContents += this.formatter.getCMakeVersion(3.8)

    let workDir = this.fileSystem.getCurrentDirectory()
    let projectName = project.name
    let projectDir = project.configDirectory
    let destinationDir = this.formatter
      .getBuildBinDirectory(workDir, targetPlatform)

    cmakeContents += this.formatter
      .getExternalProjectCustomTarget(projectName, projectDir, destinationDir)

    return {
      path: this.formatter.getProjectCMakeDestination(project.name, workDir),
      cmakeContents: cmakeContents
    }
  },

  translateCompilingProject: function(project, targetPlatform) {
    let cmakeContents = ''
    cmakeContents += this.formatter.getCMakeVersion(3.8)
    
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
      .getBinary(project.name, project.type, projectDirs)

    cmakeContents += this.formatter
      .getLinkLibraries(project.name, project.dependencies)

    let workDir = this.fileSystem.getCurrentDirectory()

    return {
      path: this.formatter.getProjectCMakeDestination(project.name, workDir),
      cmakeContents: cmakeContents
    }
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
  }
}

module.exports = {
  ProjectTranslator: ProjectTranslator,
  Translator: Translator // for testing purposes only
}