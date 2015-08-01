var fs = require('fs');
var path = require('path');
var _ = require('underscore-plus');

module.exports = function(grunt) {
  var cp, fillTemplate, getInstalledSize, ref, rm, spawn;
  ref = require('./task-helpers')(grunt), spawn = ref.spawn, cp = ref.cp, rm = ref.rm;
  fillTemplate = function(filePath, data) {
    var filled, outputPath, pkgName, template;
    pkgName = grunt.config.get('name');
    template = _.template(String(fs.readFileSync(filePath + ".in")));
    filled = template(data);
    outputPath = path.join(grunt.config.get(pkgName + ".buildDir"), path.basename(filePath));
    grunt.file.write(outputPath, filled);
    return outputPath;
  };

  getInstalledSize = function(appDir, callback) {
    var args, cmd;
    cmd = 'du';
    args = ['-sk', appDir];
    return spawn({
      cmd: cmd,
      args: args
    }, function(error, arg) {
      var installedSize, ref1, stdout;
      stdout = arg.stdout;
      installedSize = ((ref1 = stdout.split(/\s+/)) != null ? ref1[0] : void 0) || '200000';
      return callback(null, installedSize);
    });
  };

  return grunt.registerTask('mkdeb', 'Create debian package', function() {
    var appDir, arch, author, buildDir, data, done, pkgName, version;
    done = this.async();
    this.requiresConfig(this.name + ".section");
    this.requiresConfig(this.name + ".categories");
    this.requiresConfig(this.name + ".genericName");
    pkgName = grunt.config.get('name');
    buildDir = grunt.config.get(pkgName + ".buildDir");
    appDir = grunt.config.get(pkgName + ".appDir");
    if (process.arch === 'ia32') {
      arch = 'i386';
    } else if (process.arch === 'x64') {
      arch = 'amd64';
    } else {
      return done("Unsupported arch " + process.arch);
    }

    data = _.extend({}, grunt.config.get('pkg'), {
      section: grunt.config.get(this.name + ".section"),
      genericName: grunt.config.get(this.name + ".genericName"),
      categories: grunt.config.get(this.name + ".categories"),
      description: grunt.config.get(this.name + ".description"),
      productName: 'RoboPaint',
      installDir: '/usr',
      iconName: 'app',
      arch: arch
    });

    data.maintainer = data.author;
    version = data.version, author = data.author;

    return getInstalledSize(buildDir, function(error, installedSize) {
      var args, cmd, controlFilePath, desktopFilePath, icon, realDesktopFilePath;
      data.installedSize = installedSize;
      controlFilePath = fillTemplate(path.join('resources', 'linux', 'debian', 'control'), data);
      desktopFilePath = fillTemplate(path.join('resources', 'linux', 'app.desktop'), data);
      realDesktopFilePath = path.join(path.dirname(desktopFilePath), pkgName + ".desktop");
      cp(desktopFilePath, realDesktopFilePath);
      rm(desktopFilePath);
      icon = path.join('resources', 'app.png');
      cmd = path.join('resources', 'linux', 'debian', 'mkdeb');
      args = [version, arch, controlFilePath, realDesktopFilePath, icon, buildDir, data.name];
      grunt.verbose.ok("About to invoke " + cmd + " " + (args.join(' ')));
      return spawn({
        cmd: cmd,
        args: args
      }, function(error) {
        if (error != null) {
          return done(error);
        } else {
          grunt.log.ok("Created " + buildDir + "/" + pkgName + "-" + version + "-" + arch + ".deb");
          return done();
        }
      });
    });
  });
};