'use strict'

function AppTranslator(fileSystem, cmakeFormatter) {
  this.translator = new Translator(fileSystem, cmakeFormatter)
}

AppTranslator.prototype = {
  translate: function(app, targetPlatform) {
    return this.translator.translate(app, targetPlatform)
  }
}

function Translator(fileSystem, cmakeFormatter) {
  this.fileSystem = fileSystem
  this.formatter = cmakeFormatter
}

Translator.prototype = {
  translate: function(app, targetPlatform) {
    let cmakeContents = ''

    cmakeContents += this.formatter.getCMakeVersion(3.8)
    cmakeContents += this.formatter.getSuppressRegeneration()
    cmakeContents += this.formatter.getProjectDefinition(app.name)

    let workDir = this.fileSystem.getCurrentDirectory()
    let binDir = this.formatter.getBuildBinDirectory(workDir, targetPlatform)

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

    let appDestinationDir = this.formatter.getAppDestinationDir(workDir)
    for (let project of app.projects) {
      cmakeContents += this
        .formatter.getSubProject(project.name, appDestinationDir)
    }

    let appDestination = this.formatter.getAppCMakeDestination(workDir)

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