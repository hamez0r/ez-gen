'use strict'

let exec = require('child_process').exec
let App = require('./app').App
let Project = require('./project').Project
let ProjectsSanitizer = require('./projects-sanitizer').ProjectsSanitizer
let ProjectsValidator = require('./projects-validator').ProjectsValidator
let NamesValidator = require('./names-validator').NamesValidator
let AppTranslator = require('./app-translator').AppTranslator
let ProjectTranslator = require('./project-translator').ProjectTranslator
let CMakeFormatter = require('./cmake-formatter').CMakeFormatter
let PathRepository = require('../app/path-repository').PathRepository
let FileSystem = require('./file-system').FileSystem

function EzGen() {
}

EzGen.prototype = {
  run: function() {
    let fs = new FileSystem() 
    
    let currentDir = fs.getCurrentDirectory()
    let appDir = fs.getAppDirectory(currentDir)
    let projectDirs = fs.getProjectsDirectories(appDir)

    let appProjects = []
    for (let projectDir of projectDirs) {
      let projectConfig = JSON.parse(fs.readProjectFile(projectDir))
      appProjects.push(new Project(projectConfig, projectDir))
    }

    let platform = process.platform

    let projectsSanitizer = new ProjectsSanitizer(appProjects, platform)
    projectsSanitizer.sanitize()

    let projectsNamesValidator = new NamesValidator(appProjects, 'Project')
    projectsNamesValidator.validate()

    let projectsValidator = new ProjectsValidator(appProjects)
    projectsValidator.validate()

    let appConfig = JSON.parse(fs.readAppFile(appDir))
    let app = new App(appConfig, appProjects, appDir)

    let appNameValidator = new NamesValidator([app], 'App')
    appNameValidator.validate()

    let cmakeLists = []
    let cmakeFormatter = new CMakeFormatter()
    let pathRepository = new PathRepository(platform)

    let appTranslator = new AppTranslator(fs, cmakeFormatter, pathRepository)
    cmakeLists.push(appTranslator.translate(app))

    let projectTranslator = new ProjectTranslator(fs, cmakeFormatter, pathRepository)
    for (let project of appProjects) {
      // Since there's nothing to do for ExternalStatic, we're not
      // sending it to the translator
      if (project.type === 'ExternalStatic') continue

      let using = app.getProjectUsing(project)
      let dependecies = app.getProjectDependencies(project)
      cmakeLists.push(projectTranslator.translate(project, using, dependecies))
    }

    for (let cmake of cmakeLists) {
      fs.createFile(cmake.path, cmake.cmakeContents)
    } 

    let buildDir = pathRepository.getBuildDir(currentDir)
    fs.createDirectory(buildDir)

    process.chdir(buildDir)
    let child = exec('cmake ../build -G"Visual Studio 14 Win64', function (error, stdout, stderr) {
      if (error !== null) {
        console.log('Could not properly run CMake: ' + error)
      }
    })
  }
}

module.exports = {
  EzGen: EzGen
}