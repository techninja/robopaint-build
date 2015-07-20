/*
 * @file Pre-build task
 */

module.exports = function(grunt) {
  var log = grunt.log.writeln;
  var conf = grunt.config;
  var fs = require('./task-helpers')(grunt);

  var branch = conf('rpbuild.branch');
  var ageIgnore = 1000 * 60 * 60; // 1000 milliseconds, 60 seconds, 60 minutes (one hour)
  var now = new Date;

  grunt.registerTask('pre-build', 'Fetch files for RP build.', function(){
    try {
      if (fs.stat('out/prebuild').ctime.getTime() >  now.getTime() - ageIgnore) {
        log('Pre-build looks less than an hour old, ignoring. Run pre-build-force to ignore.')
        return true;
      }
    } catch(e) {
      // We don't really care if this check fails, it'll be cleared out anyways.
    }

    grunt.task.run('pre-build-force');
  });

  grunt.registerTask('pre-build-force', 'Fetch files for RP build.', function(){
    log('Clearing destination: ./out/prebuild');
    fs.rm('out/prebuild');
    fs.mkdir('out/prebuild');

    log('Extracting and preparing latest RoboPaint from branch: ' + branch);
      log(fs.run('wget ' + conf('rpbuild.repo') + '/archive/' + branch + '.zip -qO out/prebuild/robopaint.zip'));
      log(fs.run('unzip -q out/prebuild/robopaint.zip -d out/prebuild'));
      fs.rm('out/prebuild/robopaint.zip');
      fs.mv('out/prebuild/robopaint-' + branch, 'out/prebuild/robopaint');
      log(fs.run('sed -i \'s/"stage": "development"/"stage": "release"/g\' out/prebuild/robopaint/package.json'));
    log('Installing RoboPaint dependencies...');
      log(fs.run('cd out/prebuild/robopaint/ && npm install --production --silent'));
    log("GO on a diet! Removing extra fat from build...");
      var path = 'out/prebuild/robopaint/';
      fs.rm(path + 'resources/modes/edit/method-editor/build/');
      fs.rm(path + 'resources/modes/edit/method-editor/docs/');
      fs.rm(path + 'resources/modes/edit/method-editor/method-draw/');
      fs.rm(path + 'resources/modes/edit/method-editor/test/');
      fs.rm(path + 'node_modules/cncserver/node_modules/serialport/build/Release');
      fs.rm(path + 'node_modules/cncserver/node_modules/serialport/build/serialport');
    log("Copying native build components for Windows, Linux & OSX...");
      fs.cp('native_builds/serialport/', 'out/prebuild/robopaint/node_modules/cncserver/node_modules/serialport/build/serialport/');
    log('Prebuild complete!');
  });
};
