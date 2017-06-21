'use strict'

function ProjectsValidator(projects) {
	this.validator = new Validator(projects)
}

ProjectsValidator.prototype = {
	validate: function() {
		this.validator.validate()
	}
}

function Validator(projects) {
	this.projects = projects
}

Validator.prototype = {
	validate: function() {
		for (let project of this.projects)
			this.checkDependencies(project)
	},

	checkDependencies: function(project, projects) {
		let dependencies = project.dependencies

		for (let dependency of dependencies) {
			if (!this.hasProject(dependency, projects))
				throw project.name + ' is missing dependency ' + dependency
		}
	},

	hasProject: function(projectName, projects) {
		console.log(projectName)
		let found = projects.find(function(project) {
			return project.name === projectName
		})
		
		return found !== undefined
	}
}

module.exports = {
	ProjectsValidator: ProjectsValidator,
	Validator: Validator // for testing purposes
}