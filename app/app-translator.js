'use strict'

function AppTranslator(app, fileSystem, cmakeFormatter) {
  this.translator = new Translator(app, fileSystem, cmakeFormatter)
}

AppTranslator.prototype = {
  translate: function(app) {
    return this.translator.translateApp(app)
  }
}

function Translator(app, fileSystem, cmakeFormatter) {
  this.app = app
  this.fileSystem = fileSystem
  this.formatter = cmakeFormatter
}

Translator.prototype = {
  translateApp: function(app) {
    return new Map()
  },

  translateProject: function(project) {
    return ''
  }
}

module.exports = {
  AppTranslator: AppTranslator,
  Translator: Translator
}