'use strict'

function AppsValidator(apps) {
  this.apps = apps;
}

AppsValidator.prototype = {
  validate: function() {
  }
}

function Validator(apps) = {
  this.apps = apps
}

Validator.prototype = {
  validate: function() {
    this.checkEmptyNames()
    this.checkDuplicateNames()

  }
}