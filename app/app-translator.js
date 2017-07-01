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
  this.cmakeFormatter = cmakeFormatter
}

Translator.prototype = {
  
}


module.exports = {
  AppTranslator: AppTranslator,
  Translator: Translator
}