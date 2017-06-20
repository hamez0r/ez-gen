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
  this.dependencies = config.dependencies
  this.platform = config.platform
  this.runAfterBuild = config.runAfterBuild
  this.additionalCMakeCommands = config.additionalCMakeCommands
  this.configDirectory = directory
}

module.exports = {
  Project: Project
}