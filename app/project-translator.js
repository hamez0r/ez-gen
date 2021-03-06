'use strict'

let IncludeDirectories = require ('../app/include-directories').IncludeDirectories

function CompilingProjectTranslator(translator) {
  this.translator = translator
}

CompilingProjectTranslator.prototype = {
  translate: function(project, using, dependencies) {
    return this.translator.translateCompilingProject(project, using, dependencies)
  }
}

function ExternalProjectTranslator(translator) {
  this.translator = translator
}

ExternalProjectTranslator.prototype = {
  translate: function(project, using, dependencies) {
    return this.translator.translateExternalProject(project, dependencies)
  }
}

function ProjectTranslator(fileSystem, cmakeFormatter, pathRepository) {
  let translator = new Translator(fileSystem, cmakeFormatter, pathRepository)

  let compilingProjectTranslator = new CompilingProjectTranslator(translator)
  let externalProjectTranslator = new ExternalProjectTranslator(translator)

  let translators = new Map()

  translators.set('Executable', compilingProjectTranslator)
  translators.set('Static', compilingProjectTranslator)
  translators.set('Shared', compilingProjectTranslator)

  translators.set('ExternalShared', externalProjectTranslator)

  this.translators = translators
}

ProjectTranslator.prototype = {
  translate(project, using, dependencies) {
    return this.translators.get(project.type).translate(project, using, dependencies)
  }
}

function Translator(fileSystem, cmakeFormatter, pathRepository) {
  this.fileSystem = fileSystem
  this.formatter = cmakeFormatter
  this.pathRepository = pathRepository
  this.includes = new IncludeDirectories(fileSystem)
}

Translator.prototype = {
  translateExternalProject: function(project, using, dependencies) {
    let cmakeContents = ''
    cmakeContents += this.formatter.getCMakeVersion(2.8)

    let workDir = this.fileSystem.getCurrentDirectory()
    let projectName = project.name
    let projectDir = project.configDirectory

    let destinationDir = this.pathRepository.getBuildBinDirectory(workDir)
    if (project.installDir)
      destinationDir = destinationDir.append(`/${project.installDir}`)

    cmakeContents += this.formatter
      .getExternalProjectCustomTarget(projectName, projectDir, destinationDir)

    let installDir = this.pathRepository.getInstallDir(workDir)
    if (project.installDir)
      installDir = installDir.append(`/${project.installDir}`)

    let projectLibsDir = project.configDirectory + `/Lib`

    cmakeContents += this.formatter
      .getExternalProjectInstall(projectLibsDir, installDir)

    return {
      path: this.pathRepository.getProjectCMakeDestination(project.name, workDir),
      cmakeContents: cmakeContents
    }
  },

  translateCompilingProject: function(project, using, dependencies) {
    let cmakeContents = ''
    cmakeContents += this.formatter.getCMakeVersion(2.8)
    // cmakeContents += `add_compile_options(-std=c++11)\n`

    if (process.platform !== 'win32') {
      //cmakeContents += `SET(CMAKE_SKIP_BUILD_RPATH TRUE)\n`
      //cmakeContents += `SET(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)\n`
      cmakeContents += `SET(CMAKE_INSTALL_RPATH_USE_LINK_PATH FALSE)\n`
      cmakeContents += `SET(CMAKE_INSTALL_RPATH "$ORIGIN")\n`
      cmakeContents += 'SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC -m64 -ldl")\n'
      cmakeContents += 'SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -m64 -ldl -std=c++11")\n'
    }
    
    let projectDirs = this.includes.getProjectIncludeDirectories(project)
    for (let dir of projectDirs) {
      cmakeContents += this.formatter.getIncludeDirectory(dir)
    }

    for (let dependency of dependencies) {
      let dependencyIncludes = this.includes
        .getDependencyIncludeDirectories(dependency)

      for (let dir of dependencyIncludes)
        cmakeContents += this.formatter.getIncludeDirectory(dir)
    }

    for (let dependency of using) {
      let dependencyIncludes = this.includes
        .getDependencyIncludeDirectories(dependency)

      for (let dir of dependencyIncludes)
        cmakeContents += this.formatter.getIncludeDirectory(dir)
    }

    for (let dir of projectDirs) {
      cmakeContents += this.formatter.getProjectFiles(dir)
    }

    for (let dir of projectDirs) {
      cmakeContents += this.formatter.getSourceGroup(dir)
    }

    cmakeContents += this.formatter
      .getBinary(project.name, project.type, projectDirs)

    let addDependencies = []
    for (let proj of dependencies) {
      if (!(proj.type === 'ExternalStatic')) addDependencies.push(proj.name)
    }

    let targetLinkLibs = []
    let targetLinkExternalLibs = [] 
    for (let proj of dependencies) {
      if (!proj.isExternal()) targetLinkLibs.push(proj.name)
      else targetLinkExternalLibs.push(proj.name)
    }

    cmakeContents += this.formatter
      .getLinkTargets(project.name, targetLinkLibs)

    cmakeContents += this.formatter
      .getExternalLinkTargets(project.name, targetLinkExternalLibs)

    cmakeContents += this.formatter
      .getLinkDependencies(project.name, addDependencies)

    if (project.runAfterBuild) {
      cmakeContents += this.formatter.getRunAfterBuild(project.name)
    }

    cmakeContents += this.formatter.getAdditionalCmake(project.additionalCMakeCommands)

    let workDir = this.fileSystem.getCurrentDirectory()

    if (!project.isStatic()) {
      let installDir = this.pathRepository.getInstallDir(workDir)
      if (project.installDir)
        installDir = installDir.append(`/${project.installDir}`)

      cmakeContents += 
        this.formatter.getCompilingProjectInstall(project.name, installDir)
    }

    return {
      path: this.pathRepository.getProjectCMakeDestination(project.name, workDir),
      cmakeContents: cmakeContents
    }
  }
}

module.exports = {
  ProjectTranslator: ProjectTranslator,
  Translator: Translator // for testing purposes only
}
