'use strict'

function App(config, projects, directory) {
  this.name = config.name
  this.projects = projects
  this.configDirectory = directory

  this.compileFlags = new Map()

  let flags = config.compileFlags
  if (flags) {
    if (flags.win32) 
      this.compileFlags.set('win32', flags.win32)
    
    if (flags.linux)
      this.compileFlags.set('linux', flags.linux)

    if (flags.darwin)
      this.compileFlags.set('darwin', flags.darwin)

    //...
  }
}

App.prototype = {
  getProjectDependencies(project) {
    let dependencies = []

    for (let dependency of project.dependencies)
      dependencies.push(this.projects.find(function(dependencyProject) {
        return dependency === dependencyProject.name
      }))

    return dependencies
  },

  getProjectUsing(project) {
    let dependencies = []

    for (let dependency of project.using)
      dependencies.push(this.projects.find(function(dependencyProject) {
        return dependency === dependencyProject.name
      }))

    return dependencies
  }
}

module.exports = {
  App: App
}