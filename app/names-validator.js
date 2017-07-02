'use strict';

function NamesValidator(entities, entitiesType) {
  this.validator = new Validator(entities)
}

NamesValidator.prototype = {
  validate: function() {
    this.validator.validate()
  }
}

/* Internal */

function Validator(entities, entitiesType) {
  this.entities = entities
  this.entitiesType = entitiesType
}

Validator.prototype = {
  validate: function() {
    this.checkNonEmptyNames(this.entities)

    let namesToPaths = this.mapNamesToPaths(this.entities)
    this.checkDuplicateNames(namesToPaths)
  },

  checkNonEmptyNames: function(entities) {
    for (let entity of entities) {
      if (!entity.name) {
        let error = this.entitiesType + 'found in ' + entity.configDirectory
          + ' is missing the \"name\" field'

        throw error
      }
    }
  },

  checkDuplicateNames: function(namesToPaths) {
    for (let [entityName, paths] of namesToPaths.entries()) {
      if (paths.length > 1) {
        let error = this.entitiesType + ' ' + entityName
          + ' has been found in multiple config files: '
          + paths.toString()

        throw error
      }
    }
  },

  // pre-condition:
  // all entities have name
  //
  // returns:
  // Map (name - [paths]) 
  mapNamesToPaths: function(entities) {
    let nameToPaths = new Map()

    for (let entity of entities) {
      let entityName = entity.name
      let mappedProjects = nameToPaths.get(entityName)
      
      if (!mappedProjects)
        nameToPaths.set(entityName, [entity.configDirectory])
      else
        mappedProjects.push(entity.configDirectory)
    }

    return nameToPaths
  }
}

module.exports = {
  NamesValidator: NamesValidator,
  Validator: Validator // for testing purposes
}