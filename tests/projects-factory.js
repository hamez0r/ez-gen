'use strict'

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project

function ProjectsFactory() {
}

ProjectsFactory = {
  createProjectsWithEmptyNames: function() {
    let projects = []
    projects.push(new Project({
      "name": "",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'somePath'))
    projects.push(new Project({
      "name": "MdefDataModelTests",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'somePath'))

    return projects 
  },

  createProjectsWithDifferentNames: function() {
    let projects = []
    projects.push(new Project({
      "name": "MdefDataModel",
      "type": "Static",
      "dependencies": ["MdefXml"],
      "platform": "win32",
    }, 'F:/A'))
    projects.push(new Project({
      "name": "MdefXml",
      "type": "Static",
      "platform": "win32",
    }, 'F:/B'))

    return projects 
  },

  createProjectsWithSameNames: function() {
    let projects = []
    projects.push(new Project({
      "name": "MdefDataModel",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/A/'))
    projects.push(new Project({
      "name": "MdefDataModel",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/B/'))

    return projects 
  },

  createProjectsWithDifferentPlatforms: function() {
    let projects = []
    projects.push(new Project({
      "name": "MdefDataModel",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "linux",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

      ]
    }, 'F:/A/'))
    projects.push(new Project({
      "name": "MdefDataModelTests",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/B/'))
    projects.push(new Project({
      "name": "MdefSerializer",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "all",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/C/'))

    return projects 
  },

  createProjectsWithCorrectDependencies: function() {
    let projects = []
    projects.push(new Project({
      "name": "MdefDataModel",
      "type": "Static",
      "dependencies": ["MdefXml"],
      "platform": "linux",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

      ]
    }, 'F:/A/'))
    projects.push(new Project({
      "name": "MdefSerializer",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/B/'))
    projects.push(new Project({
      "name": "MdefXml",
      "type": "Static",
      "platform": "all",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/C/'))

    return projects 
  },

  createProjectsWithIncorrectDependencies: function() {
    let projects = []
    projects.push(new Project({
      "name": "MdefDataModel",
      "type": "Static",
      "dependencies": ["MdefXml"],
      "platform": "linux",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

      ]
    }, 'F:/A/'))
    projects.push(new Project({
      "name": "MdefSerializer",
      "type": "Static",
      "dependencies": ["MdefDataModel", "MdefXml"],
      "platform": "win32",
      "runAfterBuild": "true",
      "additionalCMakeCommands": [
        "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",
      ]
    }, 'F:/B/'))

    return projects 
  },

  createExternalSharedProject: function() {
    return new Project({
      "name": "Xerces",
      "type": "ExternalShared",
      "platform": "win32"
    }, 'F:/A')
  }
}

module.exports = {
  ProjectsFactory: ProjectsFactory
}
