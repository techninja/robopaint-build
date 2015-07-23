/*
 * @file Build task wrapper and cleanup code.
 * (electron-packager does most of the work)
 */

module.exports = function(grunt) {
  var log = grunt.log.writeln;
  var conf = grunt.config;
  var fs = require('./task-helpers')(grunt);

  grunt.registerTask('build-win', 'Build the release application for windows.', function(){
    log('Running electon-packager for win build...');
    grunt.task.run('electron:winbuild', 'build-win-icon');
  });

  grunt.registerTask('build-win-icon', 'Change out the icon on the built windows exe.', function(){
    log('Changing windows executable icon...');
    var changeIcon = 'wine ~/.wine/drive_c/utils/ResHacker/ResourceHacker.exe';
    changeIcon+= ' -addoverwrite "RoboPaint.exe,robopaint.exe,..\..\resources\win\app.ico,ICONGROUP,MAINICON,0"';
    log(fs.run('cd out/RoboPaint-win32-x64 && ' + changeIcon));
  });

  grunt.registerTask('build-mac', 'Build the release application for OS X.', function(){
    grunt.task.run('electron:macbuild');

    // If we're on Mac, go ahead and run appdmg
    if (process.platform === 'darwin') {
      if (fs.existsSync(conf('appdmg.target.dest'))) {
        fs.rm(conf('appdmg.target.dest'));
      }
      grunt.task.run('appdmg');
    }
  });

  grunt.registerTask('build-lin', 'Build the release application for Linux', function(){
    grunt.task.run('electron:linbuild');
  });

  grunt.registerTask('build-all', 'Build the release application for all platforms.', function(){
    grunt.task.run('build-win', 'build-lin', 'build-mac');
  });
};


