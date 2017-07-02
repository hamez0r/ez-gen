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

    let appTranslator = new AppTranslator(fs, cmakeFormatter)
    cmakeLists.push(appTranslator.translate(app, platform))

    let projectTranslator = new ProjectTranslator(app, fs, cmakeFormatter)
    for (let project of appProjects) {
      cmakeLists.push(projectTranslator.translate(project, platform))
    }

    for (let cmake of cmakeLists) {
      fs.createFile(cmake.path, cmake.cmakeContents)
    } 

    // process.chdir(cmakeFormatter.getAppDestinationDir(currentDir))
    fs.createDirectory(currentDir + '/build_win32')
    process.chdir(currentDir + '/build_win32')
    let child = exec('cmake ../build', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout)
      console.log('stderr: ' + stderr)
      if (error !== null) {
        console.log('exec error: ' + error)
      }
    })
  }
}

let ezGen = new EzGen()
ezGen.run()
