/*
 * @file Pre-build task
 */

module.exports = function(grunt) {
  var log = grunt.log.writeln;
  var conf = grunt.config;
  var fs = require('./task-helpers')(grunt);
  var unzip = require('unzip2');
  var request = require('request');
  var fsp = require('fs-plus');
  var jsonfile = require('jsonfile');

  var branch = conf('rpbuild.branch');
  var ageIgnore = 1000 * 60 * 60; // 1000 milliseconds, 60 seconds, 60 minutes (one hour)
  var now = new Date();

  grunt.registerTask('pre-build', 'Fetch files for RP build.', function(){
    try {
      if (fs.stat('out/prebuild').ctime.getTime() >  now.getTime() - ageIgnore) {
        log('Pre-build looks less than an hour old, ignoring. Run pre-build-force to ignore.');
        return true;
      }
    } catch(e) {
      // We don't really care if this check fails, it'll be cleared out anyways.
    }

    grunt.task.run('pre-build-force');
  });

  grunt.registerTask('pre-build-force', 'Fetch files for RP build.', function(){
    var flatten = require('flatten-packages');
    var done = this.async();

    log('Clearing destination: ./out/prebuild');
    fs.rm('out/prebuild');
    fs.mkdir('out/prebuild');

    log('Extracting and preparing latest RoboPaint from branch: ' + branch);
    var zipSrc = conf('rpbuild.repo').replace('github', 'codeload.github') + '/zip/' + branch;
    var zipDest = 'out/prebuild/robopaint.zip';

    request(zipSrc)
      .pipe(fsp.createWriteStream(zipDest))
      .on('close', function() {
        fsp.createReadStream(zipDest)
          .pipe(unzip.Extract({path: 'out/prebuild'})).on('close', function(){
            fs.rm(zipDest);
            fs.mv('out/prebuild/robopaint-' + branch, 'out/prebuild/robopaint');

            // Change out the package stage environment to release
            var file = 'out/prebuild/robopaint/package.json';
            jsonfile.writeFileSync(file, jsonfile.readFileSync(file, {
              reviver: function(k, v) {
                if (k === 'stage' && v === 'development') {return 'release';}
                return v;
              }
            }), {spaces: 2});

            log('Installing RoboPaint dependencies...');
              log(fs.run('cd out/prebuild/robopaint/ && npm install --production --silent --force'));
            log("GO on a diet! Removing extra fat from build...");
              var path = 'out/prebuild/robopaint/';
              fs.rm(path + 'resources/modes/edit/method-editor/build/');
              fs.rm(path + 'resources/modes/edit/method-editor/docs/');
              fs.rm(path + 'resources/modes/edit/method-editor/method-draw/');
              fs.rm(path + 'resources/modes/edit/method-editor/test/');
            log("Copying native build components for Windows, Linux & OSX...");
            fs.cp('native_builds/', 'out/prebuild/robopaint/node_modules/cncserver/node_modules/serialport/build/Release/');
        });
      });
  });
};
