'use strict'

function ProjectsSanitizer(projects, platform) {
  this.projects = projects
  this.platform = platform
  this.sanitizer = new Sanitizer()
}

ProjectsSanitizer.prototype = {
  sanitize: function() {
    return this.sanitizer.keepProjectsTargetingPlatform(this.projects, this.platform)
  }
}

/* Internal */

function Sanitizer(projects, platform) {

}

Sanitizer.prototype = {
  keepProjectsTargetingPlatform: function(projects, platform) {
    return projects.filter(function(project) {
      return project.platform === platform || project.platform === 'all'
    })
  },
}

module.exports = {
  ProjectsSanitizer: ProjectsSanitizer,
  Sanitizer: Sanitizer // for testing purposes
}