'use strict'

function App(config, projects, directory) {
  this.name = config.name
  this.projects = projects
  this.configDirectory = directory

  this.compileFlags = new Map()

  flags = config.compileFlags
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

module.exports = {
  App: App
}