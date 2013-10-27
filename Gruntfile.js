module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlSnapshot: {
      options: {
      snapshotPath: 'snapshots/',
      sitePath: 'http://127.0.0.1:3000/',
      msWaitForPages: 1000,
      urls: [
        '/',
        '/search/adele',
        '/search/rihana'
      ]
     }
    },
      prod: {
        options: {}
      }
  }
  });


  grunt.loadNpmTasks('grunt-html-snapshot');




};