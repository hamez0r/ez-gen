'use strict';

const fs = require('fs')

let PLATFORM_WINDOWS = 'win32'
let PLATFORM_LINUX = 'linux'
let PLATFORM_DARWIN = 'darwin'

let platforms = new Set()
platforms.add(PLATFORM_WINDOWS)
platforms.add(PLATFORM_LINUX)
platforms.add(PLATFORM_DARWIN)



function InputSource() { }

InputSource.prototype = {
  readConfig: function(source) {
    return fs.readFileSync(source)
  }
}



function readProjectSettings(file) {
  let projectSettings = JSON.parse(fs.readFileSync(file))
  return projectSettings
}

console.log(readProjectSettings('project.json'))



