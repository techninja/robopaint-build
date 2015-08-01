var path = require('path');
var fs = require('fs-plus');
var runas = null;

module.exports = function(grunt) {
  var cp, mkdir, ref, rm;
  ref = require('./task-helpers')(grunt), cp = ref.cp, mkdir = ref.mkdir, rm = ref.rm;
  return grunt.registerTask('install', 'Install the built application', function() {
    var binDir, iconName, installDir, pkgName, shareDir, shellAppDir;
    pkgName = grunt.config.get('name');
    installDir = grunt.config.get(pkgName + ".installDir");
    shellAppDir = grunt.config.get(pkgName + ".shellAppDir");

    if (process.platform === 'win32') {
      throw new Error("Install is only for Linux");
    } else if (process.platform === 'darwin') {
      throw new Error("Install is only for Linux");
    } else {
      binDir = path.join(installDir, 'bin');
      shareDir = path.join(installDir, 'share', pkgName);
      iconName = path.join(shareDir, 'resources', 'app', 'resources', 'app.png');
      mkdir(binDir);
      rm(shareDir);
      mkdir(path.dirname(shareDir));
      cp(shellAppDir, shareDir);
      rm(path.join(shareDir, 'obj'));
      rm(path.join(shareDir, 'gen'));
      return fs.chmodSync(path.join(shareDir, pkgName), "755");
    }
  });
};