/*
 * @file Build task wrapper and cleanup code.
 * (electron-packager does most of the work)
 */

module.exports = function(grunt) {
  var log = grunt.log.writeln;
  var conf = grunt.config;
  var fs = require('./task-helpers')(grunt);
  var fsp = require('fs-plus');
  var path = require('path');

  grunt.registerTask('build-win', 'Build the release application for windows.', function(){
    log('Running electon-packager for win build...');
    grunt.task.run('pre-build', 'electron:winbuild', 'build-win-icon');
  });

  grunt.registerTask('build-win-icon', 'Change out the icon on the built windows exe.', function(){
    log('Changing windows executable icon...');

    var done = this.async();
    var shellExePath = path.join('out', 'RoboPaint-win32-x64', 'RoboPaint.exe');
    var iconPath = path.resolve('resources', 'win', 'app.ico');
    var rcedit = require('rcedit');

    return rcedit(shellExePath, {icon: iconPath}, done);
  });

  grunt.registerTask('build-mac', 'Build the release application for OS X.', function(){
    grunt.task.run('pre-build', 'electron:macbuild');

    // If we're on Mac, go ahead and run appdmg
    if (process.platform === 'darwin') {
      if (fsp.existsSync(conf('appdmg.target.dest'))) {
        fs.rm(conf('appdmg.target.dest'));
      }

      grunt.task.run('appdmg');
    }
  });

  grunt.registerTask('build-lin', 'Build the release application for Linux', function(){
    grunt.task.run('pre-build', 'electron:linbuild');
  });

  grunt.registerTask('build-all', 'Build the release application for all platforms.', function(){
    grunt.task.run('build-win', 'build-lin', 'build-mac');
  });
};


