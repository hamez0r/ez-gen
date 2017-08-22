'use strict';

/* 
            config:
{
  "name": "MdefDataModelTests",
  "type": "Static",
  "dependencies": ["MdefDataModel", "MdefXml"],
  "platform": "windows",
  "runAfterBuild": "true",
  "additionalCMakeCommands": [
    "add_custom_target(runTest ALL COMMAND MdefDataModelTests)",

  ]
}
*/

let externalProjects = new Set()
externalProjects.add('ExternalShared')
externalProjects.add('ExternalStatic')

let staticProjects = new Set()
staticProjects.add('Static')
staticProjects.add('ExternalStatic')

function Project(config, directory) {
  this.name = config.name
  this.type = config.type
  this.installDir = config.installDir ? config.installDir : ''
  this.dependencies = config.dependencies ? config.dependencies : []
  this.platform = config.platform ? config.platform : 'all'
  this.runAfterBuild = config.runAfterBuild ? config.runAfterBuild : false
  this.additionalCMakeCommands = config.additionalCMakeCommands ? 
    config.additionalCMakeCommands : []
  this.configDirectory = directory
}

Project.prototype = {
  isExternal: function() {
    return externalProjects.has(this.type)
  },

  isStatic: function() {
    return staticProjects.has(this.type)
  }
}

module.exports = {
  Project: Project
}