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


function Project(config, directory) {
  this.name = config.name
  this.type = config.type
  this.dependencies = config.dependencies ? config.dependencies : []
  this.platform = config.platform ? config.platform : 'all'
  this.runAfterBuild = config.runAfterBuild ? config.runAfterBuild : false
  this.additionalCMakeCommands = config.additionalCMakeCommands ? config.additionalCMakeCommands : []
  this.configDirectory = directory
}

module.exports = {
  Project: Project
}