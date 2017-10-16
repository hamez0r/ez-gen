'use strict'

function AppTranslator(fileSystem, cmakeFormatter, pathRepository) {
  this.translator = new Translator(fileSystem, cmakeFormatter, pathRepository)
}

AppTranslator.prototype = {
  translate: function(app) {
    return this.translator.translate(app)
  }
}

function Translator(fileSystem, cmakeFormatter, pathRepository) {
  this.fileSystem = fileSystem
  this.formatter = cmakeFormatter
  this.pathRepository = pathRepository
}

Translator.prototype = {
  translate: function(app) {
    let cmakeContents = ''

    cmakeContents += this.formatter.getCMakeVersion(2.8)
    cmakeContents += this.formatter.getSuppressRegeneration()
    cmakeContents += this.formatter.getProjectDefinition(app.name)

    let workDir = this.fileSystem.getCurrentDirectory()
    let binDir = this.pathRepository.getBuildBinDirectory(workDir)

    cmakeContents += this.formatter.getRuntimeOutputDirectory(binDir)
    cmakeContents += this.formatter.getLibraryOutputDirectory(binDir)
    cmakeContents += this.formatter.getArchiveOutputDirectory('Lib')

    cmakeContents += this.formatter.getConfigurations(['Debug', 'Release'])
    cmakeContents += this.formatter.getOutputForConfigurations(binDir, binDir, 'Lib')

    let externalProjects = app.projects.filter(function(project) {
      return project.isExternal()
    })

    for (let project of externalProjects) {
      cmakeContents += this.formatter.getLinkDirectory(project.configDirectory)
    }

    let appDestinationDir = this.pathRepository.getAppDestinationDir(workDir)
    for (let project of app.projects) {
      if (project.type === 'ExternalStatic') continue
      cmakeContents += this
        .formatter.getSubProject(project.name, appDestinationDir)
    }

    let appDestination = this.pathRepository.getAppCMakeDestination(workDir)

    return {
      path: appDestination,
      cmakeContents: cmakeContents
    }
  }
}


module.exports = {
  AppTranslator: AppTranslator,
  Translator: Translator
}