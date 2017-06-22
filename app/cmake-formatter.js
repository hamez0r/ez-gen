'use strict'

function CMakeFormatter() {}

CMakeFormatter.prototype = {
  getCMakeVersion(version) {
    return `cmake_minimum_required(VERSION ${version})\n`
  },

  getProjectDefinition(projectName) {
    return `project(${projectName})\n`
  },

  getIncludeDirectory: function(includeDir) {
    return `include_directories("${includeDir}")\n`
  },

  
}

module.exports = {
  CMakeFormatter: CMakeFormatter
}