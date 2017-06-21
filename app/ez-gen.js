'use strict'

let App = require('app').App
let Project = require('project').Project
let ProjectsSanitizer = require('projects-sanitizer').ProjectsSanitizer
let ProjectsValidator = require('projects-validator').ProjectsValidator

function EzGen(fileSystem) {
  this.fileSystem = fileSystem
}

EzGen.prototype = {
  run: function() {
    let fs = this.fileSystem
    
    let currentDir = fs.getCurrentDirectories()
    let appDirs = fs.getAppsDirectories(currentDir)

    let apps = []
    for (let appDir of appDirs) {
      let projectDirs = fs.getProjectsDirectories(appDir)

      let appProjects = []
      for (let projectDir of projectDirs) {
        let projectConfig = JSON.parse(fs.readProjectFile(projectDir))
        appProjects.push(new Project(projectConfig, projectDir))
      }

      let platform = process.platform

      let projectsSanitizer = new ProjectsSanitizer(appProjects, platform)
      projectsSanitizer.sanitize()

      let projectsValidator = new ProjectsValidator(appProjects)
      projectsValidator.validate()

      let appConfig = JSON.parse(fs.readAppFile(appDir))
      let app = new App(appConfig, appProjects, appDir)

      apps.push(app)
    }
  }
}
