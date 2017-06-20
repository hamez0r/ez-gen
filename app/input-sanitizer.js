'use strict';

function InputSanitizer(projects) {
  this.sanitizer = new Sanitizer(projects)
}

InputSanitizer.prototype = {
  sanitize: function() {
    this.sanitizer.sanitize()
  }
}

/* Internal */

function Sanitizer(projects) {
  this.projects = projects
}

Sanitizer.prototype = {
  sanitize: function() {
    
  },

  removeOtherPlatforms: function(projects) {
    return projects.filter(function(project) {
      return platforms.has(project.platform)
    })
  },

  checkNonEmptyNames: function(projects) {
    for (let project of projects) {
      if (!project.name) {
        let error = 'Project found in ' + project.configDirectory
          + ' is missing the \"name\" field'

        throw error
      }
    }
  },

  checkDuplicateNames: function(namesToProjectDirs) {
    for (let [projectName, projectDirs] of namesToProjectDirs.entries()) {
      if (projectDirs.length > 1) {
        let error = 'Project name \"' + projectName + '\" has been found \
          in multiple config files: ' + projectDirs.toString()

        throw error
      }
    }
  },

  // pre-condition:
  // all projects have name
  //
  // returns:
  // Map (name - [projectDirs]) 
  mapNamesToProjectDirs: function(projects) {
    let nameToProjectDirs = new Map()

    for (let project of projects) {
      let projectName = project.name
      let mappedProjects = nameToProjectDirs.get(projectName)
      
      if (!mappedProjects)
        nameToProjectDirs.set(projectName, [project.configDirectory])
      else
        mappedProjects.push(project.configDirectory)
    }

    return nameToProjectDirs
  }
}

module.exports = {
  InputSanitizer: InputSanitizer,
  Sanitizer: Sanitizer
}