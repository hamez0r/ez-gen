'use strict'

let chai = require('chai')
let expect = chai.expect
let App = require('../app/app').App
let AppTranslator = require('../app/app-translator').Translator
let ProjectsFactory = require('./projects-factory').ProjectsFactory
let CMakeFormatter = require('../app/cmake-formatter').CMakeFormatter

describe('AppTranslator', function() {
  it('translate(app, targetPlatform) should return the contents for the app CMakeLists.txt', function() {
    let projects = ProjectsFactory.createProjectsForApp()
    let app = new App({name: 'TheApp'}, projects, 'F:\\')

    let mockFileSystem = {
      getCurrentDirectory: function() {
        return 'F:\\'
      }
    }

    let cmakeContents = `cmake_minimum_required(VERSION 3.8)
set(CMAKE_SUPPRESS_REGENERATION ON)
project(TheApp)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "F:/build_win32/bin")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "F:/build_win32/bin")
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "Lib")
set(CMAKE_CONFIGURATION_TYPES "Debug;Release" CACHE STRING "Configurations" FORCE)
foreach(OUTPUTCONFIG \${CMAKE_CONFIGURATION_TYPES})
  string(TOUPPER \${OUTPUTCONFIG} OUTPUTCONFIG)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "F:/build_win32/bin")
  set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "F:/build_win32/bin")
  set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_\${OUTPUTCONFIG} "Lib")
endforeach()
link_directories("F:/ExternalProject/Lib")
add_subdirectory("F:/build/MdefDataModel")
add_subdirectory("F:/build/MdefXml")
add_subdirectory("F:/build/ExternalProject")
`

    let reference = {
      path: 'F:/build/CMakeLists.txt',
      cmakeContents: cmakeContents
    }

    let appTranslator = new AppTranslator(mockFileSystem, new CMakeFormatter())
    let result = appTranslator.translate(app, 'win32')

    expect(result).to.deep.equal(reference) 
  }) 

})
