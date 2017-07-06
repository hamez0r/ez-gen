'use strict'

function AppValidator(app) {
  this.app = app;
}

AppValidator.prototype = {
  validate: function() {
  }
}

function Validator(app) = {
  this.app = app
}

Validator.prototype = {
  validate: function() {
    this.checkEmptyNames()
    this.checkDuplicateNames()
  }
}