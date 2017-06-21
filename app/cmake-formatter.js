'use strict'

function CMakeFormatter() {}

CMakeFormatter.prototype = {
  formatIncludeDirectory: function(includeDir) {
    return `include_directories("${includeDir}")\n`
  }
}

module.exports = {
  CMakeFormatter: CMakeFormatter
}