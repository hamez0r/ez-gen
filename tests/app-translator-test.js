'use strict'

let chai = require('chai')
let expect = chai.expect
let Project = require('../app/project').Project
let AppTranslator = require('../app/app-translator').Translator
let CMakeFormatter = require('../app/cmake-formatter').CMakeFormatter
let App = require('../app/app').App
let ProjectsFactory = require('./projects-factory').ProjectsFactory

describe('AppTranslator', function() {
  it('getIncludeDirectories() should return a list representing the include directories for CMakeLists.txt', function() {
    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let reference = ["F:/A/Public", "F:/A/Private", "F:/B/Public"]
    let app = new App({name: 'foo'}, projects, null)

    let mockFs = {
      listAllSubDirs: function(dir) {
        if (dir === 'F:/A') {
          return ['F:/A/Public', 'F:/A/Private']
        } else if (dir === 'F:/B/Public') {
          return []
        } else {
          console.log(dir)
          throw 'wtf'
        }
      }
    }

    let appTranslator = new AppTranslator(app, mockFs, new CMakeFormatter())
    let result = appTranslator.getIncludeDirectories(projects[0])

    expect(result).to.deep.equal(reference)
  })

  it('translateCompilingProject() should return the contents of a CMakeLists.txt for a given project', function() {
    let fileSystemMock = {
      listAllSubDirs: function(startDir) {
        if (startDir === 'F:/B/Public')
          return ['F:/B/Public/Xerces', 'F:/B/Public/Tokens']
        else if (startDir === 'F:/A')
          return ['F:/A/Public', 'F:/A/Public/Api', 'F:/A/Public/Local', 'F:/A/Private']
        else throw 'Not properly used mock'
      },
    }

    let projects = ProjectsFactory.createProjectsWithDifferentNames()
    let app = new App({name: 'foo'}, projects, null)
    let translator = new AppTranslator(app, fileSystemMock, new CMakeFormatter())
    let contents = translator.translateCompilingProject(projects[0])

    let reference = `cmake_minimum_required(VERSION 3.8)
project(MdefDataModel)
include_directories("F:/A/Public")
include_directories("F:/A/Public/Api")
include_directories("F:/A/Public/Local")
include_directories("F:/A/Private")
include_directories("F:/B/Public")
include_directories("F:/B/Public/Xerces")
include_directories("F:/B/Public/Tokens")
file(GLOB Public_H "F:/A/Public/*.h")
file(GLOB Public_HH "F:/A/Public/*.hh")
file(GLOB Public_HPP "F:/A/Public/*.hpp")
file(GLOB Public_HXX "F:/A/Public/*.hxx")
file(GLOB Public_C "F:/A/Public/*.c")
file(GLOB Public_CC "F:/A/Public/*.cc")
file(GLOB Public_CPP "F:/A/Public/*.cpp")
file(GLOB Public_CXX "F:/A/Public/*.cxx")
file(GLOB PublicApi_H "F:/A/Public/Api/*.h")
file(GLOB PublicApi_HH "F:/A/Public/Api/*.hh")
file(GLOB PublicApi_HPP "F:/A/Public/Api/*.hpp")
file(GLOB PublicApi_HXX "F:/A/Public/Api/*.hxx")
file(GLOB PublicApi_C "F:/A/Public/Api/*.c")
file(GLOB PublicApi_CC "F:/A/Public/Api/*.cc")
file(GLOB PublicApi_CPP "F:/A/Public/Api/*.cpp")
file(GLOB PublicApi_CXX "F:/A/Public/Api/*.cxx")
file(GLOB PublicLocal_H "F:/A/Public/Local/*.h")
file(GLOB PublicLocal_HH "F:/A/Public/Local/*.hh")
file(GLOB PublicLocal_HPP "F:/A/Public/Local/*.hpp")
file(GLOB PublicLocal_HXX "F:/A/Public/Local/*.hxx")
file(GLOB PublicLocal_C "F:/A/Public/Local/*.c")
file(GLOB PublicLocal_CC "F:/A/Public/Local/*.cc")
file(GLOB PublicLocal_CPP "F:/A/Public/Local/*.cpp")
file(GLOB PublicLocal_CXX "F:/A/Public/Local/*.cxx")
file(GLOB Private_H "F:/A/Private/*.h")
file(GLOB Private_HH "F:/A/Private/*.hh")
file(GLOB Private_HPP "F:/A/Private/*.hpp")
file(GLOB Private_HXX "F:/A/Private/*.hxx")
file(GLOB Private_C "F:/A/Private/*.c")
file(GLOB Private_CC "F:/A/Private/*.cc")
file(GLOB Private_CPP "F:/A/Private/*.cpp")
file(GLOB Private_CXX "F:/A/Private/*.cxx")
source_group("Public" FILES \${Public_H} \${Public_HH} \${Public_HPP} \${Public_HXX} \${Public_C} \${Public_CC} \${Public_CPP} \${Public_CXX})
source_group("Public\\\\Api" FILES \${PublicApi_H} \${PublicApi_HH} \${PublicApi_HPP} \${PublicApi_HXX} \${PublicApi_C} \${PublicApi_CC} \${PublicApi_CPP} \${PublicApi_CXX})
source_group("Public\\\\Local" FILES \${PublicLocal_H} \${PublicLocal_HH} \${PublicLocal_HPP} \${PublicLocal_HXX} \${PublicLocal_C} \${PublicLocal_CC} \${PublicLocal_CPP} \${PublicLocal_CXX})
source_group("Private" FILES \${Private_H} \${Private_HH} \${Private_HPP} \${Private_HXX} \${Private_C} \${Private_CC} \${Private_CPP} \${Private_CXX})
target_link_libraries(MdefDataModel MdefXml)
add_library(MdefDataModel STATIC
    \${Public_H}
    \${Public_HH}
    \${Public_HPP}
    \${Public_HXX}
    \${Public_C}
    \${Public_CC}
    \${Public_CPP}
    \${Public_CXX}
    \${PublicApi_H}
    \${PublicApi_HH}
    \${PublicApi_HPP}
    \${PublicApi_HXX}
    \${PublicApi_C}
    \${PublicApi_CC}
    \${PublicApi_CPP}
    \${PublicApi_CXX}
    \${PublicLocal_H}
    \${PublicLocal_HH}
    \${PublicLocal_HPP}
    \${PublicLocal_HXX}
    \${PublicLocal_C}
    \${PublicLocal_CC}
    \${PublicLocal_CPP}
    \${PublicLocal_CXX}
    \${Private_H}
    \${Private_HH}
    \${Private_HPP}
    \${Private_HXX}
    \${Private_C}
    \${Private_CC}
    \${Private_CPP}
    \${Private_CXX}
)
`

  expect(contents).to.deep.equal(reference)
  })

})
