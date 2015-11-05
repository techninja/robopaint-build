module.exports = function(grunt) {
  var electronVer = '0.34.2'; // Electron build version

  // App tags & description for Linux release packages.
  var appDesc = "Software for drawing robots, and your friendly painting robot kit, the WaterColorBot!\n\
\n\
See more about the WaterColorBot @ http://watercolorbot.com or\n\
Fork & improve the project @ https://github.com/evil-mad/robopaint";
  var appTags = 'GNOME;GTK;Arts;SVG';
  var version = '0.9.6'; // TODO: Load this from the package file

   // Project configuration.
  grunt.initConfig({
    name: 'robopaint',
    pkg: grunt.file.readJSON('package.json'),
    rpbuild: {
      repo: 'https://github.com/evil-mad/robopaint',
      branch: 'paperjs'
    },
    robopaint: {
      buildDir: 'out',
      appDir: 'robopaint-linux-x64/resources/app',
      shellAppDir: 'robopaint-linux-x64',
      version: version
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
          arch: 'x64',
          'app-version': version,
          overwrite: true,
          prune: true,
          'app-bundle-id': 'robopaint-main',
          'helper-bundle-id': 'robopaint-helper'
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
          arch: 'x64,ia32',
          'app-version': version,
          overwrite: true,
          prune: true,
          'version-string': {
            CompanyName: 'Evil Mad Scientist Laboratories',
            LegalCopyright: 'Copyright (C) Evil Mad Science LLC. All rights reserved. Code under MIT free and open source license.',
            FileDescription: 'RoboPaint',
            OriginalFilename: 'RoboPaint.exe',
            FileVersion: electronVer,
            ProductVersion: version,
            ProductName: 'RoboPaint',
            InternalName: 'RoboPaint'
          }
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
          arch: 'x64',
          'app-version': version,
          overwrite: true,
          prune: true
        }
      }
    },
    appdmg: {
      options: {
        basepath: 'out/RoboPaint-darwin-x64',
        title: 'Install RoboPaint',
        icon: '../../resources/mac/app.icns',
        background: '../../resources/mac/dmg_back.png',
        'icon-size': 80,
        contents: [
          {x: 448, y: 344, type: 'link', path: '/Applications'},
          {x: 192, y: 344, type: 'file', path: 'RoboPaint.app'}
        ]
      },
      target: {
        dest: 'out/RoboPaintMac_v'+version+'.dmg'
      }
    },
    'create-windows-installer': {
      64: {
        iconUrl: "http://robopaint.tn42.com/app.ico",
        appDirectory: 'out/Robopaint-win32-x64',
        outputDirectory: 'out/winstall/',
        loadingGif: 'resources/win/install_anim.gif',
        authors: 'Evil Mad Scientist Labs Inc.'
      },
      32: {
        iconUrl: "http://robopaint.tn42.com/app.ico",
        appDirectory: 'out/Robopaint-win32-ia32',
        outputDirectory: 'out/winstall32/',
        loadingGif: 'resources/win/install_anim.gif',
        authors: 'Evil Mad Scientist Labs Inc.'
      }
    },
    mkdeb: {
      section: 'graphics',
      categories: appTags,
      genericName: 'RoboPaint',
      description: appDesc
    },
    mkrpm: {
      categories: appTags,
      genericName: 'RoboPaint',
      description: appDesc
    }
  });

  // Load the plugins...
  grunt.loadNpmTasks('grunt-electron-installer');
  grunt.loadNpmTasks('grunt-electron');
  if (process.platform === 'darwin') grunt.loadNpmTasks('grunt-appdmg');

  // Load the tasks in '/tasks'
  grunt.loadTasks('tasks');

  // Default task(s).
  grunt.registerTask('default', ['pre-build']);
};
