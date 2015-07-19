module.exports = function(grunt) {
  // Electron build version
  var electronVer = '0.29.2';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    rpbuild: {
      repo: 'https://github.com/evil-mad/robopaint',
      branch: 'electron'
    },
    electron: {
      macbuild: {
        options: {
          name: 'RoboPaint',
          dir: 'out/prebuild/robopaint',
          out: 'out',
          icon: 'resources/mac/app.icns',
          version: electronVer,
          platform: 'darwin',
          arch: 'x64'
        }
      },
      winbuild: {
        options: {
          name: 'RoboPaint',
          dir: 'out/prebuild/robopaint',
          out: 'out',
          icon: 'resources/win/app.ico',
          version: electronVer,
          platform: 'win32',
          arch: 'x64'
        }
      },
      linbuild: {
        options: {
          name: 'robopaint',
          dir: 'out/prebuild/robopaint',
          out: 'out',
          icon: 'resources/app.png',
          version: electronVer,
          platform: 'linux',
          arch: 'x64'
        }
      }
    },
    'create-windows-installer': {
      appDirectory: 'out/Robopaint-win32-x64',
      outputDirectory: 'out/winstall/',
      loadingGif: 'resources/win/install_anim.gif',
      authors: 'Evil Mad Scientist Labs Inc.'
    }
  });

  // Load the plugins...
  grunt.loadNpmTasks('grunt-electron-installer');
  grunt.loadNpmTasks('grunt-electron');

  // Load the tasks in '/tasks'
  grunt.loadTasks('tasks');

  // Default task(s).
  grunt.registerTask('default', ['pre-build']);
};