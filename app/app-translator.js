'use strict'

function AppTranslator(app, fileSystem, cmakeFormatter) {
  this.translator = new Translator(app, fileSystem, cmakeFormatter)
}

AppTranslator.prototype = {
  translate: function(app) {
    return this.translator.translateApp(app)
  }
}


module.exports = {
  AppTranslator: AppTranslator,
  Translator: Translator
}