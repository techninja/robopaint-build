var slice = [].slice;
var fs = require('fs-plus');
var path = require('path');
var sync = require('child_process').execSync;

module.exports = function(grunt) {
  return {
    mv: function(source, destination) {
      fs.renameSync(source, destination);
    },
    stat: function(path) {
      return fs.statSync(path);
    },
    cp: function(source, destination, arg) {
      var copyFile, error, filter, onDirectory, onFile;
      filter = (arg != null ? arg : {}).filter;
      if (!grunt.file.exists(source)) {
        grunt.fatal("Cannot copy non-existent " + source.cyan + " to " + destination.cyan);
      }
      copyFile = function(sourcePath, destinationPath) {
        var stats;
        if ((typeof filter === "function" ? filter(sourcePath) : void 0) || (filter != null ? typeof filter.test === "function" ? filter.test(sourcePath) : void 0 : void 0)) {
          return;
        }
        stats = fs.lstatSync(sourcePath);
        if (stats.isSymbolicLink()) {
          grunt.file.mkdir(path.dirname(destinationPath));
          fs.symlinkSync(fs.readlinkSync(sourcePath), destinationPath);
        } else if (stats.isFile()) {
          grunt.file.copy(sourcePath, destinationPath);
        }
        if (grunt.file.exists(destinationPath)) {
          return fs.chmodSync(destinationPath, fs.statSync(sourcePath).mode);
        }
      };
      if (grunt.file.isFile(source)) {
        copyFile(source, destination);
      } else {
        try {
          onFile = function(sourcePath) {
            var destinationPath;
            destinationPath = path.join(destination, path.relative(source, sourcePath));
            return copyFile(sourcePath, destinationPath);
          };
          onDirectory = function(sourcePath) {
            var destinationPath;
            if (fs.isSymbolicLinkSync(sourcePath)) {
              destinationPath = path.join(destination, path.relative(source, sourcePath));
              copyFile(sourcePath, destinationPath);
              return false;
            } else {
              return true;
            }
          };
          fs.traverseTreeSync(source, onFile, onDirectory);
        } catch (_error) {
          error = _error;
          grunt.fatal(error);
        }
      }
      return grunt.verbose.writeln("Copied " + source.cyan + " to " + destination.cyan + ".");
    },
    mkdir: function() {
      var args, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = grunt.file).mkdir.apply(ref, args);
    },
    rm: function() {
      var args, ref, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if ((ref = grunt.file).exists.apply(ref, args)) {
        return (ref1 = grunt.file)["delete"].apply(ref1, slice.call(args).concat([{
          force: true
        }]));
      }
    },
    run: function(cmd, options) {
      return sync(cmd, options);
    }
  };
};