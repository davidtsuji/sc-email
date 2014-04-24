module.exports = function ( grunt ) {

  var pkg = grunt.file.readJSON( "package.json" ),
    config = require( "./src/config.json" );

  grunt.initConfig( {

    "html_minify": {
      all: {
        files: {
          "dist/email.html": "dist/email.html"
        }
      }
    },

    "inlinecss": {
      all: {
        options: {
          removeStyleTags: false
        },
        files: {
          "dist/email.html": "src/markup/email.html"
        }
      }
    },

    "less": {
      all: {
        files: {
          ".tmp/email.css": "src/styles/main.less"
        }
      }
    },

    "nodemailer": {
      options: {
        transport: {
          type: "SES",
          options: {
            AWSAccessKeyID: config.test.AWS.AWSAccessKeyID,
            AWSSecretKey: config.test.AWS.AWSSecretKey
          }
        },
        recipients: config.test.recipients,
        message: {
          from: config.test.sender,
          subject: pkg.name + " test (" + new Date() + ")"
        }
      },
      test: {
        src: [ "dist/email.html" ]
      }
    },

    "watch": {
      options: {
        livereload: true
      },
      gruntfile: {
        files: [ "GruntFile.js" ],
        tasks: [ "build" ]
      },
      markup: {
        files: [ "src/markup/*.html" ],
        tasks: [ "build" ]
      },
      styles: {
        files: [ "src/styles/**/*.less" ],
        tasks: [ "build" ],
      },
      test: {
        files: [ "test/email.js" ],
        tasks: [ "email" ],
      }
    }

  } );

  grunt.loadNpmTasks( "grunt-contrib-less" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-html-minify" );
  grunt.loadNpmTasks( "grunt-inline-css" );
  grunt.loadNpmTasks( "grunt-nodemailer" );

  grunt.registerTask( "default", [ "build" ] );
  grunt.registerTask( "build", [ "styles", "markup" ] );

  grunt.registerTask( "styles", [ "less" ] );
  grunt.registerTask( "markup", [ "inlinecss", "fixDoctype" ] );
  grunt.registerTask( "email", [ "nodemailer" ] );

  /*
   * There is known bug with one of the depencies where the DOCTYPE is stripped out. We need this
   * declaration in otherwise markup is rendered with a level of unpredictability.
   *
   * https://github.com/nodejitsu/docs/issues/49
   */
  grunt.registerTask( "fixDoctype", function () {

    var fs = require( "fs" );
    fs.writeFileSync( "./dist/email.html", "<!doctype html>\n" + fs.readFileSync( "./dist/email.html" ) );

  } );

};